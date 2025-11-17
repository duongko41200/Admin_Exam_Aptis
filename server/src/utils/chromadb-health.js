/**
 * ChromaDB Health Check Utility
 */

import { ChromaClient } from "chromadb";

export const checkChromaDBHealth = async () => {
  try {
    console.log("🔍 Checking ChromaDB health...");

    const chromaUrl = process.env.CHROMA_URL || "http://localhost:8001";
    const chromaClient = new ChromaClient({
      path: chromaUrl,
    });

    // Test heartbeat
    const heartbeat = await chromaClient.heartbeat();
    console.log("💓 ChromaDB heartbeat:", heartbeat);

    // Try to get collections
    const collections = await chromaClient.listCollections();
    console.log(
      "📚 Collections:",
      collections.map((c) => c.name)
    );

    return {
      status: "healthy",
      url: chromaUrl,
      heartbeat,
      collections: collections.length,
    };
  } catch (error) {
    console.error("❌ ChromaDB health check failed:", error.message);
    return {
      status: "unhealthy",
      error: error.message,
    };
  }
};

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  checkChromaDBHealth().then((result) => {
    console.log("🏥 Health check result:", result);
    if (result.status === "healthy") {
      console.log("✅ ChromaDB is ready!");
      process.exit(0);
    } else {
      console.log("💀 ChromaDB is not available");
      process.exit(1);
    }
  });
}
