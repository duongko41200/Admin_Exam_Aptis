import { Document } from "@langchain/core/documents";
import cosineSimilarity from "compute-cosine-similarity";
import fs from "fs/promises";
import path from "path";
import { WritingSubmissionSchema } from "../../../schema/writing.model.js";
import { initializeChromaDB } from "../../configs/chroma.js";
import { embedWithGemini } from "../../lib/embedding.util.js";
import {
  addDocumentToChroma,
  deleteDocumentFromChroma,
  getAllDocumentsFromChroma,
  initializeChromaReferences,
} from "../base-repo/chroma.js";
import * as scoringPipeline from "./scoringPipeline.service.js";

import { initialize as initializeGemini } from "../../configs/gemini.js";
import {
  genPromptAIScore,
  genPromptFormEmailFormal,
} from "../../const/prompt.js";

// In-memory storage for development (replace with database in production)
let writingsDatabase = new Map();

// ChromaDB configuration
// let chromaCollection = null;

const STORAGE_PATH = process.env.WRITING_STORAGE_PATH || "./data/writings";
function cleanJsonResponse(response) {
  // Loại bỏ các đoạn markdown như ```json ... ```
  return response.replace(/```json|```/g, "").trim();
}
/**
 * Submit a new writing for scoring and storage
 * Implements the core Flow A from API_FLOW_GUIDE.md
 */
export const submitWriting = async (writingData) => {
  const startTime = Date.now();
  console.log("writingData", writingData);
  try {
    // Validate input
    const validatedData = WritingSubmissionSchema.parse(writingData);

    // // Generate unique ID
    // const writingId = uuidv4();
    // const submittedAt = new Date().toISOString();

    // Step 1: Score the writing
    const scoringResult = await scoringPipeline.scoreWriting(
      validatedData.content,
      validatedData.type,
      true // use detailed feedback
    );

    /// Ai chấm điểm

    const geminiModel = await initializeGemini();

    const prompt = genPromptAIScore({
      content: validatedData.content,
      debai: validatedData.prompt,
    });

    const resultAi = await geminiModel.generateContent(prompt);

    const response = resultAi.response.text();

    const cleanResponse = cleanJsonResponse(response);

    const convertTextByJson = JSON.parse(cleanResponse);

    console.log("Ai review", convertTextByJson);

    // Step 2: Create embedding for the writing content
    const embedding = await embedWithGemini(validatedData.content);

    // // Step 3: Create LangChain Document
    // const document = new Document({
    //   pageContent: validatedData.content,
    //   metadata: {
    //     id: writingId,
    //     userId: validatedData.userId,
    //     type: validatedData.type,
    //     prompt: validatedData.prompt,
    //     submittedAt,
    //     taskId: validatedData.metadata?.taskId,
    //   },
    // });

    // // Step 4: Calculate similarity with existing documents
    // await calculateAndLogSimilarity(document, embedding, writingId);

    // // Step 5: Store document in ChromaDB
    // await addDocumentToChroma(document, embedding, writingId);

    // Step 6: Create complete writing object
    const writing = {
      id: validatedData.writingId,
      userId: validatedData.userId,
      prompt: validatedData.prompt,
      type: validatedData.type,
      content: validatedData.content,
      embedding: embedding,
      scores: {
        grammar: scoringResult.criteria_scores.grammatical_range_accuracy || 0,
        vocabulary: scoringResult.criteria_scores.lexical_resource || 0,
        coherence: scoringResult.criteria_scores.coherence_cohesion || 0,
        task_fulfillment: scoringResult.criteria_scores.task_achievement || 0,
        overall: scoringResult.overall_score || 0,
        Ai_Score: convertTextByJson || 0,
      },
      detailedFeedback: scoringResult.detailed_feedback || {},
      metadata: {
        submittedAt: validatedData.submittedAt,
        processingTime: (Date.now() - startTime) / 1000,
        taskId: validatedData.metadata?.taskId,
      },
      createdAt: validatedData.submittedAt,
      updatedAt: validatedData.submittedAt,
    };

    // // Step 7: Store in database
    // await storeWriting(writing);

    // // Step 8: Add to vector store for similarity search
    // await addToVectorStore(writing);

    // Step 9: Generate progress analysis
    const progressAnalysis = await generateProgressAnalysis(
      validatedData.userId,
      writing
    );

    const result = {
      ...writing,
      progressAnalysis,
      processingTime: (Date.now() - startTime) / 1000,
    };

    return result;
  } catch (error) {
    console.log("Error in submitWriting", error);
    throw new Error(`Failed to submit writing: ${error.message}`);
  }
};

/**
 * Calculate and log similarity with existing documents using ChromaDB
 */
export const calculateAndLogSimilarity = async (
  newDocument,
  newEmbedding,
  newWritingId
) => {
  // Get all existing documents from ChromaDB
  const existingDocuments = await getAllDocumentsFromChroma();

  // if (existingDocuments.length === 0) {
  //   console.log(
  //     `\n=== SIMILARITY ANALYSIS FOR WRITING ID: ${newWritingId} ===`
  //   );
  //   console.log(
  //     "First document submitted - no similarity comparisons available"
  //   );
  //   console.log(
  //     "Document Content Preview:",
  //     newDocument.pageContent.substring(0, 100) + "..."
  //   );
  //   console.log("=== END SIMILARITY ANALYSIS ===\n");
  //   return;
  // }

  const similarityResults = [];

  for (let i = 0; i < existingDocuments.length; i++) {
    const existingDoc = existingDocuments[i];

    console.log("existingDoc", existingDocuments[i]);

    // Check embedding validity before calculating similarity
    if (
      !existingDoc.embedding ||
      !Array.isArray(existingDoc.embedding) ||
      !newEmbedding ||
      !Array.isArray(newEmbedding)
    ) {
      console.log(`--- Comparison ${i + 1} ---`);
      console.log(`Existing Writing ID: ${existingDoc.writingId}`);
      console.log(`Skipping similarity calculation - invalid embedding data`);
      console.log(
        `Existing embedding valid: ${Array.isArray(existingDoc.embedding)}`
      );
      console.log(`New embedding valid: ${Array.isArray(newEmbedding)}`);
      console.log("---");
      continue;
    }

    // // Check embedding lengths match
    // if (existingDoc.embedding.length !== newEmbedding.length) {
    //   console.log(`--- Comparison ${i + 1} ---`);
    //   console.log(`Existing Writing ID: ${existingDoc.writingId}`);
    //   console.log(
    //     `Skipping similarity calculation - embedding length mismatch`
    //   );
    //   console.log(`Existing embedding length: ${existingDoc.embedding.length}`);
    //   console.log(`New embedding length: ${newEmbedding.length}`);
    //   console.log("---");
    //   continue;
    // }

    try {
      console.log("existingDoc.embedding:", existingDoc.embedding);
      const similarity = cosineSimilarity(existingDoc.embedding, newEmbedding);

      console.log(`--- Comparison ${i + 1} ---`);
      console.log(`Existing Writing ID: ${existingDoc.writingId}`);
      console.log(
        `Existing Content Preview: ${existingDoc.document.pageContent.substring(
          0,
          100
        )}...`
      );
      console.log(
        `User ID: ${existingDoc.document.metadata.userId} | Type: ${existingDoc.document.metadata.type}`
      );
      console.log(`Cosine Similarity: ${similarity.toFixed(4)}`);

      // Categorize similarity level
      let similarityLevel = "";
      if (similarity >= 0.7) {
        similarityLevel = "VERY HIGH (Possible duplicate)";
        similarityResults.push({
          writingId: existingDoc.writingId,
          similarity: similarity,
          document: existingDoc.document,
          level: similarityLevel,
        });
      } else if (similarity >= 0.5) {
        similarityLevel = "MODERATE (Some similarities)";
      } else if (similarity >= 0.3) {
        similarityLevel = "LOW (Few similarities)";
      } else {
        similarityLevel = "VERY LOW (Minimal similarities)";
      }

      console.log(`Similarity Level: ${similarityLevel}`);
      console.log("---");

      return similarityResults;
    } catch (error) {
      console.log(`--- Comparison ${i + 1} ---`);
      console.log(`Existing Writing ID: ${existingDoc.writingId}`);
      console.log(`Error calculating similarity: ${error.message}`);
      console.log("---");
    }
  }

  console.log("=== END SIMILARITY ANALYSIS ===\n");
};

/**
 * Find similar writings based on content using ChromaDB
 */
export const findSimilarWritings = async (content, topK = 5) => {
  try {
    // Get all existing documents from ChromaDB
    const existingDocuments = await getAllDocumentsFromChroma();

    if (existingDocuments.length === 0) {
      return [];
    }

    // Create embedding for the query content
    const queryEmbedding = await embedWithGemini(content);

    // Calculate similarity with all stored documents
    const similarities = existingDocuments
      .map((docItem) => {
        // Check embedding validity
        if (
          !docItem.embedding ||
          !Array.isArray(docItem.embedding) ||
          !queryEmbedding ||
          !Array.isArray(queryEmbedding)
        ) {
          console.log(
            `Skipping document ${docItem.writingId} - invalid embedding`
          );
          return null;
        }

        // Check embedding lengths match
        if (docItem.embedding.length !== queryEmbedding.length) {
          console.log(
            `Skipping document ${docItem.writingId} - embedding length mismatch`
          );
          console.log(`Document embedding length: ${docItem.embedding.length}`);
          console.log(`Query embedding length: ${queryEmbedding.length}`);
          return null;
        }

        try {
          const similarity = cosineSimilarity(
            docItem.embedding,
            queryEmbedding
          );
          return {
            writingId: docItem.writingId,
            document: docItem.document,
            similarity: similarity,
            content: docItem.document.pageContent,
            metadata: docItem.document.metadata,
          };
        } catch (error) {
          console.log(
            `Error calculating similarity for document ${docItem.writingId}: ${error.message}`
          );
          return null;
        }
      })
      .filter((item) => item !== null); // Remove null entries

    // Sort by similarity score and return top K
    similarities.sort((a, b) => b.similarity - a.similarity);
    const topSimilar = similarities.slice(0, topK);

    console.log(`\n=== SIMILAR WRITINGS SEARCH ===`);
    console.log(`Query Content Preview: ${content.substring(0, 100)}...`);
    console.log(`Found ${topSimilar.length} similar writings:\n`);

    topSimilar.forEach((item, index) => {
      console.log(`${index + 1}. Writing ID: ${item.writingId}`);
      console.log(`   Similarity: ${item.similarity.toFixed(4)}`);
      console.log(`   Content Preview: ${item.content.substring(0, 100)}...`);
      console.log(
        `   User: ${item.metadata.userId} | Type: ${item.metadata.type}`
      );
      console.log("---");
    });

    console.log("=== END SIMILAR WRITINGS SEARCH ===\n");

    return topSimilar;
  } catch (error) {
    console.log("Error finding similar writings", error);
    throw new Error(`Failed to find similar writings: ${error.message}`);
  }
};

/**
 * Get writing by ID
 */
export const getWritingById = async (writingId) => {
  const writing = writingsDatabase.get(writingId);
  if (!writing) {
    return null;
  }
  return writing;
};

/**
 * Get all writings for a user with pagination and filters
 */
export const getUserWritings = async (userId, options = {}) => {
  const { page = 1, limit = 10, type } = options;

  const userWritings = Array.from(writingsDatabase.values())
    .filter((writing) => {
      if (writing.userId !== userId) return false;
      if (type && writing.type !== type) return false;
      return true;
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedWritings = userWritings.slice(startIndex, endIndex);

  return {
    writings: paginatedWritings,
    pagination: {
      current_page: page,
      total_pages: Math.ceil(userWritings.length / limit),
      total_items: userWritings.length,
      items_per_page: limit,
    },
  };
};

export async function validateAptisEmail(emailText) {
  const parts = [
    {
      key: "greeting",
      label: "Lời chào",
      regex: /Dear\s+[\w\s,]+/,
      suggestion:
        "Thêm lời chào như 'Dear Sir,' hoặc 'Dear [Tên người nhận],' ở đầu email.",
    },
    {
      key: "introduction",
      label: "Giới thiệu bản thân",
      regex: /My name is|I have been a member|I am/,
      suggestion: "Giới thiệu tên, vai trò, thời gian tham gia câu lạc bộ.",
    },
    {
      key: "purpose",
      label: "Mục đích email",
      regex: /I am writing|purpose|notice|announcement/,
      suggestion:
        "Nêu lý do viết email, ví dụ: cảm nhận, đề xuất về thông báo.",
    },
    {
      key: "feelings",
      label: "Cảm nhận",
      regex: /I think|I felt|feel|problem|plan/,
      suggestion: "Trình bày cảm nhận về thông báo/plan/problem.",
    },
    {
      key: "suggestions",
      label: "Đề xuất/giải pháp",
      regex: /In my opinion|suggest|should|need to/,
      suggestion:
        "Đề xuất giải pháp hoặc ý kiến, ví dụ: 'In my opinion, we should...'",
    },
    {
      key: "closing",
      label: "Kết thúc",
      regex: /I hope that|Sincerely|Best regards/,
      suggestion:
        "Kết thúc email bằng câu như 'I hope that my suggestions are useful...' và lời chào cuối 'Sincerely, [Tên người viết]'.",
    },
  ];

  const missing = [];
  const suggestions = {};

  parts.forEach((part) => {
    if (!part.regex.test(emailText)) {
      missing.push(part.label);
      suggestions[part.key] = part.suggestion;
    }
  });

  if (missing.length > 0) {
    const geminiModel = await initializeGemini();

    const prompt = genPromptFormEmailFormal({ content: emailText });

    const result = await geminiModel.generateContent(prompt);

    const response = result.response.text();

    const cleanResponse = cleanJsonResponse(response);

    const convertTextByJson = JSON.parse(cleanResponse);

    console.log("test:", convertTextByJson);
  }

  return {
    isValid: missing.length === 0,
    missingParts: missing,
    suggestions: missing.length ? suggestions : {},
  };
}

/**
 * Generate progress analysis for the user
 */
const generateProgressAnalysis = async (userId, currentWriting) => {
  try {
    const userWritings = Array.from(writingsDatabase.values())
      .filter((w) => w.userId === userId)
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    if (userWritings.length === 0) {
      return {
        improvement: "First writing submission - baseline established",
        recurring_issues: [],
        strengths: ["Getting started with writing practice"],
      };
    }

    const lastWriting = userWritings[userWritings.length - 1];
    const improvement =
      currentWriting.scores.overall - lastWriting.scores.overall;

    return {
      improvement:
        improvement > 0
          ? `Improved by ${improvement.toFixed(1)} points from last writing`
          : improvement < 0
          ? `Decreased by ${Math.abs(improvement).toFixed(
              1
            )} points from last writing`
          : "Maintained same performance level",
      recurring_issues: identifyRecurringIssues(userWritings),
      strengths: identifyStrengths(currentWriting),
    };
  } catch (error) {
    console.log("Failed to generate progress analysis", error);
    return {
      improvement: "Analysis unavailable",
      recurring_issues: [],
      strengths: [],
    };
  }
};

/**
 * Identify recurring issues from user's writing history
 */
const identifyRecurringIssues = (writings) => {
  const issues = [];

  // Check for consistently low grammar scores
  const grammarScores = writings.map((w) => w.scores.grammar).slice(-5);
  if (grammarScores.every((score) => score < 6)) {
    issues.push("Grammar consistency");
  }

  // Check for coherence issues
  const coherenceScores = writings.map((w) => w.scores.coherence).slice(-5);
  if (coherenceScores.every((score) => score < 6)) {
    issues.push("Text coherence and flow");
  }

  return issues;
};

/**
 * Identify user's strengths based on current writing
 */
const identifyStrengths = (writing) => {
  const strengths = [];

  if (writing.scores.vocabulary >= 7) {
    strengths.push("Strong vocabulary usage");
  }

  if (writing.scores.task_fulfillment >= 7) {
    strengths.push("Good task understanding");
  }

  if (writing.scores.coherence >= 7) {
    strengths.push("Clear structure and organization");
  }

  return strengths.length > 0 ? strengths : ["Consistent writing practice"];
};

/**
 * Load writings from storage on startup
 */
const loadWritingsFromStorage = async () => {
  try {
    const files = await fs.readdir(STORAGE_PATH);
    const jsonFiles = files.filter((file) => file.endsWith(".json"));

    for (const file of jsonFiles) {
      try {
        const filePath = path.join(STORAGE_PATH, file);
        const content = await fs.readFile(filePath, "utf8");
        const writing = JSON.parse(content);
        writingsDatabase.set(writing.id, writing);

        // Recreate LangChain Document and add to ChromaDB
        if (writing.content && writing.embedding) {
          const document = new Document({
            pageContent: writing.content,
            metadata: {
              id: writing.id,
              userId: writing.userId,
              type: writing.type,
              prompt: writing.prompt,
              submittedAt: writing.metadata?.submittedAt || writing.createdAt,
              taskId: writing.metadata?.taskId,
            },
          });

          // Add to ChromaDB if not already exists
          try {
            await addDocumentToChroma(document, writing.embedding, writing.id);
          } catch (error) {
            // Document might already exist in ChromaDB, which is fine
            console.log(
              `Document ${writing.id} might already exist in ChromaDB`
            );
          }
        }
      } catch (error) {
        console.log(`Failed to load writing from ${file}`, error);
      }
    }

    // Get count from ChromaDB
    const chromaDocuments = await getAllDocumentsFromChroma();

    console.log(`Loaded ${writingsDatabase.size} writings from storage`);
    console.log(
      `Loaded ${chromaDocuments.length} documents in ChromaDB for similarity comparison`
    );
  } catch (error) {
    console.log("Failed to load writings from storage", error);
  }
};

/**
 * Remove writing from storage
 */
const removeFromStorage = async (writingId) => {
  try {
    const filePath = path.join(STORAGE_PATH, `${writingId}.json`);
    await fs.unlink(filePath);
  } catch (error) {
    console.log(`Failed to remove writing ${writingId} from storage`, error);
  }
};

/**
 * Store writing in persistent storage
 */
export const storeWriting = async (writing) => {
  // Store in memory
  writingsDatabase.set(writing.id, writing);

  // Store in file system (for development)
  const filePath = path.join(STORAGE_PATH, `${writing.id}.json`);
  await fs.writeFile(filePath, JSON.stringify(writing, null, 2));
};

/**
 * Delete a writing
 */
export const deleteWriting = async (writingId) => {
  const writing = writingsDatabase.get(writingId);
  if (!writing) {
    throw new Error("Writing not found");
  }

  // Remove from database
  writingsDatabase.delete(writingId);

  // Remove from ChromaDB
  await deleteDocumentFromChroma(writingId);

  // Remove from storage
  await removeFromStorage(writingId);

  console.log("Writing deleted", { writingId });
};

/**
 * Initialize writing service
 */
export const initialize = async () => {
  try {
    // Ensure storage directory exists
    await fs.mkdir(STORAGE_PATH, { recursive: true });

    // Initialize ChromaDB
    const { chromaClient, chromaCollection } = await initializeChromaDB();

    // Initialize ChromaDB references in repo
    initializeChromaReferences(chromaClient, chromaCollection);

    // Load existing writings
    await loadWritingsFromStorage();

    console.log("Writing service initialized successfully");
  } catch (error) {
    console.log("Failed to initialize writing service:", error);
    throw error;
  }
};
