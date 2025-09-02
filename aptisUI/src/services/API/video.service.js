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
  initializeDirectUpload({ fileName, fileSize, userId, partCount }) {
    return ApiService.post(`${serviceURL}/direct/init`, {
      fileName,
      fileSize,
      userId,
      partCount,
    });
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
        throw new Error(
          `Upload failed: ${response.status} ${response.statusText}`
        );
      }

      return {
        success: true,
        etag: response.headers.get("ETag"),
      };
    } catch (error) {
      console.error("Direct upload error:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  },

  // Complete multipart upload
  completeMultipartUpload({ uploadId, key, parts }) {
    return ApiService.post(`${serviceURL}/complete`, {
      uploadId,
      key,
      parts,
    });
  },

  // Abort multipart upload
  abortMultipartUpload({ uploadId, key }) {
    return ApiService.post(`${serviceURL}/abort`, {
      uploadId,
      key,
    });
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
};

export default VideoService;
