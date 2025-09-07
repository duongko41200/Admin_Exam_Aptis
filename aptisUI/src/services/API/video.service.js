import ApiService from "./api.service";

const serviceURL = "video";

const VideoService = {
  // Upload video with optimization (compression + multipart)
  uploadVideo(videoFile, userId = null, options = {}) {
    const formData = new FormData();
    formData.append("video", videoFile);

    if (userId) {
      formData.append("userId", userId);
    }

    // Compression options
    const {
      enableCompression = true,
      crf = 23,
      preset = "medium",
      maxWidth = 1920,
      maxHeight = 1080,
    } = options;

    formData.append("enableCompression", enableCompression.toString());
    formData.append("crf", crf.toString());
    formData.append("preset", preset);
    formData.append("maxWidth", maxWidth.toString());
    formData.append("maxHeight", maxHeight.toString());

    return ApiService.post(`${serviceURL}/upload`, formData, {}, true); // isFormData = true
  },

  // Upload video with progress tracking
  async uploadVideoWithProgress(
    videoFile,
    userId = null,
    options = {},
    onProgress = null
  ) {
    const formData = new FormData();
    formData.append("video", videoFile);

    if (userId) {
      formData.append("userId", userId);
    }

    // Compression options
    const {
      enableCompression = true,
      crf = 23,
      preset = "medium",
      maxWidth = 1920,
      maxHeight = 1080,
    } = options;

    formData.append("enableCompression", enableCompression.toString());
    formData.append("crf", crf.toString());
    formData.append("preset", preset);
    formData.append("maxWidth", maxWidth.toString());
    formData.append("maxHeight", maxHeight.toString());

    // Sử dụng ApiService.post với onUploadProgress
    return ApiService.post(
      `${serviceURL}/upload`,
      formData,
      {},
      true,
      onProgress
    );
  },

  // Initialize direct upload (client uploads directly to R2)
  async initializeDirectUpload({ fileName, fileSize, userId, partCount }) {
    try {
      console.log("🔧 Calling initializeDirectUpload API:", {
        fileName,
        fileSize,
        userId,
        partCount,
      });

      const response = await ApiService.post(
        `${serviceURL}/direct-upload/init`,
        {
          fileName,
          fileSize,
          userId,
          partCount,
        }
      );

      console.log("📡 API Response:", response);

      if (response && response[0].success) {
        console.log("✅ Initialize direct upload successful:", response[0].data);
        return [response[0].data, null];
      } else {
        console.error("❌ API returned unsuccessful response:", response);
        return [null, { message: response?.message || "Unknown API error" }];
      }
    } catch (error) {
      console.error("❌ Initialize direct upload failed:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to initialize direct upload";
      return [null, { message: errorMessage, details: error.response?.data }];
    }
  },

  // Upload part directly to R2 using presigned URL
  async uploadPartToR2(presignedUrl, partData) {
    try {
      const response = await fetch(presignedUrl, {
        method: "PUT",
        body: partData,
        headers: {
          "Content-Type": "application/octet-stream",
        },
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const etag = response.headers.get("ETag");
      if (!etag) {
        throw new Error("No ETag received from upload");
      }

      return etag.replace(/"/g, ""); // Remove quotes from ETag
    } catch (error) {
      console.error("❌ Upload part to R2 failed:", error);
      throw error;
    }
  },

  // Complete multipart upload
  async completeMultipartUpload({ uploadId, key, parts }) {
    try {
      const response = await ApiService.post(
        `${serviceURL}/direct-upload/complete`,
        {
          uploadId,
          key,
          parts,
        }
      );

      return [response[0].data, null];
    } catch (error) {
      console.error("❌ Complete multipart upload failed:", error);
      return [null, error.response?.data || { message: error.message }];
    }
  },

  // Abort multipart upload
  async abortMultipartUpload({ uploadId, key }) {
    try {
      const response = await ApiService.post(
        `${serviceURL}/direct-upload/abort`,
        {
          uploadId,
          key,
        }
      );
      return [response.data, null];
    } catch (error) {
      console.error("❌ Abort multipart upload failed:", error);
      return [null, error.response?.data || { message: error.message }];
    }
  },

  // Initialize multipart upload
  initializeMultipartUpload({
    fileName,
    contentType,
    fileSize,
    userId,
    metadata,
  }) {
    return ApiService.post(`${serviceURL}/init`, {
      fileName,
      contentType,
      fileSize,
      userId,
      metadata,
    });
  },

  // Generate signed URLs for multipart upload
  generateSignedUrls({ uploadId, key, totalParts }) {
    return ApiService.post(`${serviceURL}/signed-urls`, {
      uploadId,
      key,
      totalParts,
    });
  },

  // Validate video file
  validateFile({ fileName, fileSize, contentType }) {
    return ApiService.post(`${serviceURL}/validate`, {
      fileName,
      fileSize,
      contentType,
    });
  },

  // Calculate optimal part size
  calculatePartSize(fileSize) {
    return ApiService.post(`${serviceURL}/part-size`, {
      fileSize,
    });
  },

  // Get upload configuration
  getUploadConfig() {
    return ApiService.get(`${serviceURL}/config`);
  },

  // Get upload progress
  getUploadProgress(uploadId, key) {
    return ApiService.get(`${serviceURL}/progress/${uploadId}/${key}`);
  },

  // Update part completion
  updatePartCompletion({ uploadId, partNumber, etag, size }) {
    return ApiService.post(`${serviceURL}/part-complete`, {
      uploadId,
      partNumber,
      etag,
      size,
    });
  },

  // Clean up videos folder and failed uploads
  async cleanupVideos(options = {}) {
    return ApiService.post(`${serviceURL}/cleanup`, options);
  },

  // Test R2 connection
  async testR2Connection() {
    try {
      const response = await ApiService.get(`${serviceURL}/test-r2`);
      return [response, null];
    } catch (error) {
      console.error("❌ Test R2 connection failed:", error);
      return [null, error.response?.data || { message: error.message }];
    }
  },
};

export default VideoService;
