import ApiService from "./api.service";

const serviceURL = "r2";

const R2UploadService = {
  /**
   * Upload single file
   */
  uploadSingleFile(file, fileType = "general") {
    const formData = new FormData();
    formData.append("files", file);
    formData.append("fileType", fileType);

    return ApiService.post(`${serviceURL}/upload/single`, formData, {}, true) // `true` để ApiService không set Content-Type JSON
      .then((result) => ({
        success: true,
        data: {
          url: result.metadata.url,
          key: result.metadata.key,
          originalName: result.metadata.originalName,
          size: result.metadata.size,
          mimeType: result.metadata.mimeType,
        },
      }))
      .catch((error) => ({
        success: false,
        error: error?.message || "Upload failed",
      }));
  },

  /**
   * Upload multiple files
   */
  uploadMultipleFiles(files, fileType = "general") {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));
    formData.append("fileType", fileType);

    return ApiService.post(`${serviceURL}/upload/multiple`, formData, {}, true)
      .then((result) => ({
        success: true,
        successful: result.metadata.successful.map((file) => ({
          url: file.url,
          key: file.key,
          originalName: file.originalName,
          size: file.size,
          mimeType: file.mimeType,
        })),
        failed: result.metadata.failed || [],
      }))
      .catch(() => ({
        success: false,
        successful: [],
        failed: files.map((f) => f.name),
      }));
  },

  /**
   * Delete file
   */
  deleteFile(key) {
    return ApiService.delete(`${serviceURL}/file/${encodeURIComponent(key)}`)
      .then(() => ({ success: true }))
      .catch((error) => ({
        success: false,
        error: error?.message || "Delete failed",
      }));
  },
};

export default R2UploadService;
