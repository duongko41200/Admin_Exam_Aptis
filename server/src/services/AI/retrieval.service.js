import { Document } from "@langchain/core/documents";
import { logger } from "../config/logger.js";
import { addDocumentToChroma } from "../repo/chroma.js";
import * as vectorStore from "./vectorStore.js";
import { calculateAndLogSimilarity } from "./writing.service.js";

/**
 * Find similar writings for a user using RAG
 * Implements Flow B from API_FLOW_GUIDE.md
 */

export const findSimilarWritings = async (validatedData) => {
  try {
    // Step 1: Create LangChain Document
    const document = new Document({
      pageContent: validatedData.content,
      metadata: {
        id: validatedData.writingId,
        userId: validatedData.userId,
        type: validatedData.type,
        prompt: validatedData.prompt,
        submittedAt: validatedData.metadata?.submittedAt,
        taskId: validatedData.metadata?.taskId,
      },
    });

    // Step 2: Calculate similarity with existing documents
    const dataSimilar = await calculateAndLogSimilarity(
      document,
      validatedData.embedding,
      validatedData.writingId
    );

    // Step 3: Store document in ChromaDB
    await addDocumentToChroma(
      document,
      validatedData.embedding,
      validatedData.writingId
    );

    // Step 4: Return success response
    return dataSimilar;
  } catch (error) {
    logger.error("Error finding similar writings", error);
    throw new Error(`Failed to find similar writings: ${error.message}`);
  }
};

/**
 * Search similar writings with advanced filtering
 */
export const searchSimilarWritings = async (searchParams) => {
  const {
    userId,
    type,
    query,
    limit = 5,
    similarityThreshold = 0.7,
  } = searchParams;

  try {
    // Build search query
    let searchQuery = query || "";
    if (type) {
      searchQuery = `Type: ${type}\n${searchQuery}`;
    }

    // Search in vector store
    const similarDocs = await vectorStore.searchSimilarDocuments(
      searchQuery,
      limit * 3
    );

    // Filter and rank results
    let results = similarDocs
      .filter((doc) => {
        // Basic filters
        if (userId && doc.metadata.userId !== userId) return false;
        if (type && doc.metadata.type !== type) return false;

        return true;
      })
      .map((doc) => {
        const similarity = query
          ? calculateSimilarityScore(doc.pageContent, query)
          : 0.8; // Default similarity for type-only searches

        return {
          id: doc.metadata.id,
          similarity,
          type: doc.metadata.type,
          prompt: doc.metadata.prompt,
          content: doc.pageContent,
          scores: doc.metadata.scores,
          submittedAt: doc.metadata.submittedAt,
          metadata: doc.metadata,
        };
      })
      .filter((result) => result.similarity >= similarityThreshold)
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit);

    return results;
  } catch (error) {
    logger.error("Error in searchSimilarWritings", error);
    throw new Error(`Failed to search similar writings: ${error.message}`);
  }
};

/**
 * Get writings similar to a given writing for RAG context
 */
export const getSimilarWritingsForRAG = async (writing, limit = 3) => {
  try {
    const searchQuery = `
      Type: ${writing.type}
      Prompt: ${writing.prompt}
      Content: ${writing.content.substring(0, 500)}
    `;

    const similarDocs = await vectorStore.searchSimilarDocuments(
      searchQuery,
      limit * 2
    );

    // Process and filter results
    const results = similarDocs
      .filter((doc) => {
        // Same user, different writing
        return (
          doc.metadata.userId === writing.userId &&
          doc.metadata.id !== writing.id
        );
      })
      .slice(0, limit)
      .map((doc) => ({
        id: doc.metadata.id,
        type: doc.metadata.type,
        content: doc.pageContent,
        scores: doc.metadata.scores,
        successPatterns: extractSuccessPatterns(doc),
      }));

    return results;
  } catch (error) {
    logger.warn("Failed to get similar writings for RAG", error);
    return []; // Return empty array if RAG context fails
  }
};

/**
 * Extract success patterns from a high-scoring writing
 */
const extractSuccessPatterns = (document) => {
  const patterns = [];
  const scores = document.metadata.scores;

  if (!scores) return patterns;

  // Identify patterns based on high scores
  if (scores.grammar >= 7) {
    patterns.push("strong_grammar");
  }

  if (scores.vocabulary >= 7) {
    patterns.push("rich_vocabulary");
  }

  if (scores.coherence >= 7) {
    patterns.push("good_structure");
  }

  if (scores.task_fulfillment >= 7) {
    patterns.push("clear_task_response");
  }

  // Extract structural patterns based on writing type
  const content = document.pageContent;
  const type = document.metadata.type;

  if (
    type === "letter" &&
    content.includes("Dear") &&
    content.includes("Best regards")
  ) {
    patterns.push("proper_letter_format");
  }

  if (type === "essay" && content.split("\n").length >= 3) {
    patterns.push("multi_paragraph_structure");
  }

  return patterns;
};

/**
 * Calculate similarity score between two texts (simple implementation)
 */
const calculateSimilarityScore = (text1, text2) => {
  try {
    // Simple word-based similarity calculation
    const words1 = new Set(text1.toLowerCase().split(/\s+/));
    const words2 = new Set(text2.toLowerCase().split(/\s+/));

    const intersection = new Set(
      [...words1].filter((word) => words2.has(word))
    );
    const union = new Set([...words1, ...words2]);

    const jaccardSimilarity = intersection.size / union.size;

    // Add length similarity factor
    const lengthRatio =
      Math.min(text1.length, text2.length) /
      Math.max(text1.length, text2.length);

    // Combine Jaccard similarity with length factor
    return jaccardSimilarity * 0.7 + lengthRatio * 0.3;
  } catch (error) {
    logger.warn("Failed to calculate similarity score", error);
    return 0.5; // Default similarity
  }
};

/**
 * Analyze writing patterns across user's history
 */
export const analyzeWritingPatterns = async (userId, timeframe = "30d") => {
  try {
    // This would typically query from database
    // For now, return mock analysis
    return {
      structural_patterns: [
        {
          pattern_name: "letter_opening",
          frequency: 0.8,
          success_rate: 0.9,
          avg_score_improvement: 0.5,
        },
      ],
      linguistic_patterns: [
        {
          pattern_name: "transition_words",
          frequency: 0.6,
          success_rate: 0.7,
          avg_score_improvement: 0.3,
        },
      ],
      recommendations: [
        "Continue using formal letter openings - they improve your scores",
        "Practice more transition words for better coherence",
      ],
    };
  } catch (error) {
    logger.error("Error analyzing writing patterns", error);
    throw new Error(`Failed to analyze writing patterns: ${error.message}`);
  }
};
