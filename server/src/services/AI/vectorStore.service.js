/**
 * Vector Store Service using LangChain + Google Gemini AI
 * Handles vector storage and similarity search with proper LangChain integration
 */

import { VectorStore } from "@langchain/core/vectorstores";
import { embedWithGemini } from "../../lib/embedding.util.js";

// Simple in-memory vector store implementation
class SimpleMemoryVectorStore extends VectorStore {
  constructor(embeddings) {
    super(embeddings, {});
    this.documents = [];
    this.vectors = [];
  }

  async addDocuments(documents) {
    const embeddings = await this.embeddings.embedDocuments(
      documents.map((doc) => doc.pageContent)
    );

    for (let i = 0; i < documents.length; i++) {
      this.documents.push(documents[i]);
      this.vectors.push(embeddings[i]);
    }
  }

  async addVectors(vectors, documents) {
    for (let i = 0; i < vectors.length; i++) {
      this.documents.push(documents[i]);
      this.vectors.push(vectors[i]);
    }
  }

  async similaritySearchVectorWithScore(query, k) {
    const queryEmbedding = await this.embeddings.embedQuery(query);

    const similarities = this.vectors.map((vector, index) => {
      const similarity = this.cosineSimilarity(queryEmbedding, vector);
      return [this.documents[index], similarity];
    });

    similarities.sort((a, b) => b[1] - a[1]);
    return similarities.slice(0, k);
  }

  async similaritySearch(query, k = 4) {
    const results = await this.similaritySearchVectorWithScore(query, k);
    return results.map(([doc]) => doc);
  }

  cosineSimilarity(a, b) {
    let dot = 0,
      normA = 0,
      normB = 0;
    for (let i = 0; i < a.length; i++) {
      dot += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }
    return dot / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  static fromTexts(texts, metadatas, embeddings, dbConfig) {
    throw new Error("fromTexts not implemented for SimpleMemoryVectorStore");
  }

  static fromDocuments(docs, embeddings, dbConfig) {
    throw new Error(
      "fromDocuments not implemented for SimpleMemoryVectorStore"
    );
  }
}

// Tìm tài liệu tương tự bằng Gemini embedding
export const searchSimilarDocumentsGemini = async (
  queryText,
  documents,
  k = 3,
  outputDimensionality = 768
) => {
  // Tạo embedding cho query
  const queryEmbedding = await embedWithGemini(queryText, outputDimensionality);
  // Tạo embedding cho từng document
  const docEmbeddings = await Promise.all(
    documents.map((doc) =>
      embedWithGemini(doc.pageContent, outputDimensionality)
    )
  );

  // Tính cosine similarity giữa query và từng document
  function cosineSimilarity(a, b) {
    let dot = 0,
      normA = 0,
      normB = 0;
    for (let i = 0; i < a.length; i++) {
      dot += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }
    return dot / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  // Tính điểm similarity cho từng document
  const scored = documents.map((doc, idx) => ({
    doc,
    score: cosineSimilarity(queryEmbedding, docEmbeddings[idx]),
  }));

  // Sắp xếp theo score giảm dần và lấy top k
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, k);
};
let vectorStore = null;
let embeddings = null;
let isInitialized = false;

// Initialize vector store service
export const initialize = async () => {
  try {
    console.log("Initializing vector store service...");

    // Create a custom embedding class that uses Gemini
    class GeminiEmbeddings {
      constructor() {
        this.modelName = "gemini-embedding";
      }

      async embedDocuments(texts) {
        try {
          const embeddings = await Promise.all(
            texts.map((text) => embedWithGemini(text))
          );
          return embeddings;
        } catch (error) {
          console.error("Error embedding documents:", error);
          // Fallback: return zero vectors
          return texts.map(() => new Array(768).fill(0));
        }
      }

      async embedQuery(text) {
        try {
          return await embedWithGemini(text);
        } catch (error) {
          console.error("Error embedding query:", error);
          // Fallback: return zero vector
          return new Array(768).fill(0);
        }
      }
    }

    // Initialize embeddings with Gemini
    embeddings = new GeminiEmbeddings();

    // Initialize vector store with proper embedding function
    vectorStore = new SimpleMemoryVectorStore(embeddings);

    console.log("Vector store instance:", vectorStore);
    isInitialized = true;
    console.log("Vector store service initialized successfully");
  } catch (error) {
    console.error("Failed to initialize vector store service", error);
    throw new Error("Vector store service initialization failed");
  }
};

// Add documents to vector store
export const addDocuments = async (documents) => {
  ensureInitialized();

  try {
    console.log(`Adding ${documents.length} documents to vector store`);
    await vectorStore.addDocuments(documents);
    console.log("Documents added successfully");
  } catch (error) {
    console.error("Failed to add documents", error);
    throw new Error("Failed to add documents to vector store");
  }
};

// Search for similar documents
export const searchSimilarDocuments = async (query, k = 3) => {
  ensureInitialized();

  try {
    const results = await vectorStore.similaritySearchVectorWithScore(query, k);

    console.log("Search results:", results);
    let data = [];
    results.forEach((doc) => {
      if (doc && doc[1] > 0.8) {
        data.push(doc[0]);
      }
    });
    console.log("Filtered search results:", data);
    return data;
  } catch (error) {
    console.error("Failed to search documents", error, query);
    throw new Error("Failed to search documents");
  }
};

// Health check for vector store
export const healthCheck = async () => {
  try {
    if (!isInitialized || !vectorStore) {
      return false;
    }

    // Perform a simple search to test functionality
    await vectorStore.similaritySearch("test", 1);
    return true;
  } catch (error) {
    console.warn("Vector store health check failed", error);
    return false;
  }
};

// Get document count
export const getDocumentCount = async () => {
  try {
    if (!isInitialized || !vectorStore) {
      return 0;
    }
    // Return document count from vector store
    return vectorStore.documents.length;
  } catch (error) {
    console.warn("Failed to get document count", error);
    return 0;
  }
};

// Ensure service is initialized
const ensureInitialized = () => {
  if (!isInitialized) {
    throw new Error("Vector store service not initialized");
  }
};
