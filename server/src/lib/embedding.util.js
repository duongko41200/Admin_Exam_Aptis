import { GoogleGenAI } from "@google/genai";

// Tạo embedding bằng Gemini
export const embedWithGemini = async (text, outputDimensionality = 768) => {
  try {
    const ai = new GoogleGenAI({
      apiKey: "AIzaSyCK8nm93rfyqzO00qyIuA131-0cf_Ft2SI",
    });
    const response = await ai.models.embedContent({
      model: "gemini-embedding-001",
      contents: text,
      taskType: "SEMANTIC_SIMILARITY",
      outputDimensionality: 768,
    });

    console.log("Gemini embedding response:", response);

    const embeddingValue = response.embeddings[0].values;
    return embeddingValue;
  } catch (error) {
    console.error("Gemini embedding error:", error);
    // Fallback: return zero vector with specified dimension
    return new Array(outputDimensionality).fill(0);
  }
};

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
let embeddingModel = null;

/**
 * Initialize embedding service
 */
// export const initialize = async () => {
//   if (embeddingModel) return embeddingModel;
//   // Tải mô hình embedding miễn phí từ HuggingFace qua Xenova
//   embeddingModel = await pipeline(
//     "feature-extraction",
//     "Xenova/all-MiniLM-L6-v2"
//   );
//   console.log("Embedding service initialized successfully (Xenova)");
//   return embeddingModel;
// };

/**
 * Create embedding for a single text
 * @param {string} text - Text to embed
 * @returns {Promise<number[]>} - Embedding vector
 */
export const embedText = async (text) => {
  if (!embeddingModel) {
    await initialize();
  }

  try {
    const embedding = await embeddingModel(text);
    return processEmbedding(embedding);
  } catch (error) {
    console.error("Error creating text embedding:", error);
    throw new Error("Failed to create text embedding");
  }
};

/**
 * Helper function to process embedding result from Xenova
 * @param {any} embedding - Raw embedding result
 * @returns {number[]} - Processed embedding vector
 */
const processEmbedding = (embedding) => {
  // Debug: log the embedding structure
  // console.log("Embedding type:", typeof embedding);
  // console.log("Embedding structure:", {
  //   isArray: Array.isArray(embedding),
  //   hasData: embedding && embedding.data,
  //   keys:
  //     embedding && typeof embedding === "object"
  //       ? Object.keys(embedding)
  //       : null,
  //   firstElementType: Array.isArray(embedding) ? typeof embedding[0] : null,
  // });

  // Handle different return formats from Xenova
  let data = embedding;

  // If it's a tensor-like object, get the data
  if (embedding && embedding.data) {
    data = Array.from(embedding.data);
    console.log("Using .data property, length:", data.length);
  }

  // If it's already a flat array, return as is
  if (Array.isArray(data) && typeof data[0] === "number") {
    console.log("Returning flat array, length:", data.length);
    return Array.from(data);
  }

  // If it's a 2D array, mean pool over tokens
  if (Array.isArray(data) && Array.isArray(data[0])) {
    console.log(
      "Processing 2D array, dimensions:",
      data.length,
      "x",
      data[0].length
    );
    const vectors = data;
    const dim = vectors[0].length;
    const meanVector = new Array(dim).fill(0);

    for (const vector of vectors) {
      for (let i = 0; i < dim; i++) {
        meanVector[i] += vector[i];
      }
    }

    const result = meanVector.map((v) => v / vectors.length);
    console.log("Returning mean pooled vector, length:", result.length);
    return result;
  }

  console.error("Unexpected embedding format:", {
    type: typeof data,
    isArray: Array.isArray(data),
    length: data?.length,
    sample: Array.isArray(data) ? data.slice(0, 5) : data,
  });
  throw new Error("Unexpected embedding format");
};

/**
 * Create embeddings for multiple documents
 * @param {string[]} documents - Array of texts to embed
 * @returns {Promise<number[][]>} - Array of embedding vectors
 */
export const embedDocuments = async (documents) => {
  if (!embeddingModel) {
    await initialize();
  }

  try {
    const embeddings = await Promise.all(
      documents.map(async (doc) => {
        const embedding = await embeddingModel(doc);
        return processEmbedding(embedding);
      })
    );
    return embeddings;
  } catch (error) {
    console.error("Error creating document embeddings:", error);
    throw new Error("Failed to create document embeddings");
  }
};

/**
 * Calculate cosine similarity between two embeddings
 * @param {number[]} embedding1 - First embedding vector
 * @param {number[]} embedding2 - Second embedding vector
 * @returns {number} - Similarity score between 0 and 1
 */
export const calculateSimilarity = (embedding1, embedding2) => {
  if (!embedding1 || !embedding2 || embedding1.length !== embedding2.length) {
    throw new Error("Invalid embeddings for similarity calculation");
  }
  let dotProduct = 0;
  let norm1 = 0;
  let norm2 = 0;
  for (let i = 0; i < embedding1.length; i++) {
    dotProduct += embedding1[i] * embedding2[i];
    norm1 += embedding1[i] * embedding1[i];
    norm2 += embedding2[i] * embedding2[i];
  }
  if (norm1 === 0 || norm2 === 0) {
    return 0;
  }
  return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
};

/**
 * Create embedding for writing content with metadata
 * @param {Object} writing - Writing object with content and metadata
 * @returns {Promise<{embedding: number[], metadata: Object}>}
 */
export const embedWriting = async (writing) => {
  const embedding = await embedWithGemini(writing.content);
  return {
    embedding,
    metadata: {
      id: writing.id,
      userId: writing.userId,
      type: writing.type,
      contentLength: writing.content.length,
      submittedAt: writing.metadata?.submittedAt || new Date().toISOString(),
    },
  };
};

/**
 * Batch process multiple writings for embedding
 * @param {Object[]} writings - Array of writing objects
 * @returns {Promise<Object[]>} - Array of embedded writings
 */
export const batchEmbedWritings = async (writings) => {
  const textsToEmbed = writings.map((writing) =>
    `
    Type: ${writing.type}
    Prompt: ${writing.prompt}
    Content: ${writing.content}
  `.trim()
  );
  const embeddings = await embedDocuments(textsToEmbed);
  return writings.map((writing, index) => ({
    ...writing,
    embedding: embeddings[index],
    metadata: {
      ...writing.metadata,
      id: writing.id,
      userId: writing.userId,
      type: writing.type,
      contentLength: writing.content.length,
      submittedAt: writing.metadata?.submittedAt || new Date().toISOString(),
    },
  }));
};
