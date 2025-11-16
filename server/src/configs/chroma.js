/**
 * Initialize ChromaDB client and collection
 * ChromaDB temporarily disabled due to API version compatibility issues
 */

import { ChromaClient } from "chromadb";
import fs from "fs/promises";
import path from "path";

// In-memory storage for development (replace with database in production)
let writingsDatabase = new Map();

// import { loadWritingsFromStorage } from "../services/writing.service.js";
const STORAGE_PATH = process.env.WRITING_STORAGE_PATH || "./data/writings";
const CHROMA_COLLECTION_NAME = "writing_documents";
export const initializeChromaDB = async () => {
  try {
    // Initialize ChromaDB client with path configuration for v1.x
    const chromaUrl = process.env.CHROMA_URL || "http://localhost:8001";

    const chromaClient = new ChromaClient({
      host: "localhost",
      port: 8001,
      ssl: false,
    });

    // Test connection first
    try {
      await chromaClient.heartbeat();
      console.log("ChromaDB connection established");
    } catch (error) {
      console.log("Failed to connect to ChromaDB:", error);
      throw new Error(
        `Cannot connect to ChromaDB at ${chromaUrl}. Please ensure ChromaDB is running.`
      );
    }

    // Create or get collection
    try {
      // Try to get existing collection first, if not exists then create
      let chromaCollection;
      try {
        chromaCollection = await chromaClient.getOrCreateCollection({
          name: CHROMA_COLLECTION_NAME,
          embeddingFunction: null, // Disable default embedding function
        });
        console.log(
          "Successfully connected to existing ChromaDB collection or created new one"
        );
      } catch (getOrCreateError) {
        // If getOrCreateCollection fails, try to delete and recreate
        try {
          await chromaClient.deleteCollection({ name: CHROMA_COLLECTION_NAME });
          console.log("Deleted existing ChromaDB collection");

          chromaCollection = await chromaClient.createCollection({
            name: CHROMA_COLLECTION_NAME,
            embeddingFunction: null, // Disable default embedding function
          });
          console.log("Created new ChromaDB collection");
        } catch (recreateError) {
          console.log(
            "Failed to recreate ChromaDB collection:",
            recreateError
          );
          throw recreateError;
        }
      }

      return { chromaClient, chromaCollection };
    } catch (createError) {
      console.log("Failed to create ChromaDB collection:", createError);
      throw createError;
    }
  } catch (error) {
    console.log("Failed to initialize ChromaDB:", error);
    throw error;
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
 * Initialize writing service
 */
export const initialize = async () => {
  try {
    // Ensure storage directory exists
    await fs.mkdir(STORAGE_PATH, { recursive: true });

    // Initialize ChromaDB
    await initializeChromaDB();

    // Load existing writings
    // await loadWritingsFromStorage();

    console.log("Writing service initialized successfully");
  } catch (error) {
    console.error("Failed to initialize writing service:", error);
    throw error;
  }
};
