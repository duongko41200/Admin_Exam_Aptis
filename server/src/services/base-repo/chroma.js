import { Document } from "@langchain/core/documents";

// ChromaDB client and collection - will be initialized by writing service
let chromaCollection = null;
let chromaClient = null;

/**
 * Initialize ChromaDB references from config
 */
export const initializeChromaReferences = (client, collection) => {
  chromaClient = client;
  chromaCollection = collection;
};

/**
 * Add document to ChromaDB
 */
export const addDocumentToChroma = async (document, embedding, writingId) => {
  try {
    if (!chromaCollection) {
      throw new Error("ChromaDB collection not initialized");
    }

    // Validate inputs
    if (
      !writingId ||
      !embedding ||
      !document.metadata ||
      !document.pageContent
    ) {
      console.error("One of the required parameters is missing or invalid");
      return;
    }

    // Validate embedding
    if (!Array.isArray(embedding) || embedding.length === 0) {
      console.error("Invalid embedding: not an array or empty");
      console.log("Embedding type:", typeof embedding);
      console.log("Embedding value:", embedding);
      return;
    }

    // Log embedding details
    console.log("=== ADDING TO CHROMADB ===");
    console.log("Writing ID:", writingId);
    console.log("Embedding length:", embedding.length);
    console.log("Embedding sample (first 5):", embedding.slice(0, 5));
    console.log("Document content length:", document.pageContent.length);
    console.log("Metadata:", JSON.stringify(document.metadata, null, 2));

    // Add to ChromaDB
    const addResult = await chromaCollection.add({
      ids: [writingId],
      embeddings: [embedding],
      metadatas: [document.metadata],
      documents: [document.pageContent],
    });

    console.log("ChromaDB add result:", addResult);

    // Verify immediately after adding
    const verifyResult = await chromaCollection.get({
      ids: [writingId],
      include: ["embeddings", "documents", "metadatas"],
    });

    console.log("Verification - Retrieved document:");
    console.log("IDs:", verifyResult.ids);
    console.log(
      "Embeddings length:",
      verifyResult.embeddings?.[0]?.length || 0
    );
    console.log(
      "Documents:",
      verifyResult.documents?.[0]?.substring(0, 50) + "..."
    );
    console.log("=== END CHROMADB ADD ===");

    console.log("Added document to ChromaDB", { writingId });
  } catch (error) {
    console.log("Failed to add document to ChromaDB:", error);
    throw error;
  }
};

/**
 * Get all documents from ChromaDB for similarity comparison
 */
export const getAllDocumentsFromChroma = async () => {
  try {
    if (!chromaCollection) {
      return [];
    }

    const result = await chromaCollection.get({
      include: ["embeddings", "documents", "metadatas"],
    });

    console.log("=== GET ALL DOCUMENTS FROM CHROMADB ===");
    console.log("Retrieved document count:", result.ids?.length || 0);
    console.log("Has embeddings:", !!result.embeddings);
    console.log("First embedding length:", result.embeddings?.[0]?.length || 0);
    console.log("=== END GET ALL DOCUMENTS ===");

    if (!result.ids || result.ids.length === 0) {
      return [];
    }

    return result.ids.map((id, index) => ({
      writingId: id,
      embedding: result.embeddings?.[index] || [],
      document: new Document({
        pageContent: result.documents?.[index] || "",
        metadata: result.metadatas?.[index] || {},
      }),
    }));
  } catch (error) {
    console.log("Failed to get documents from ChromaDB:", error);
    return [];
  }
};

/**
 * Delete document from ChromaDB
 */
export const deleteDocumentFromChroma = async (writingId) => {
  try {
    if (!chromaCollection) {
      return;
    }

    await chromaCollection.delete([writingId]);

    console.log("Deleted document from ChromaDB", { writingId });
  } catch (error) {
    console.log("Failed to delete document from ChromaDB:", error);
  }
};
