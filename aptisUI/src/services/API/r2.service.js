import ApiService from "./api.service";

const serviceURL = "r2";

const R2Service = {
  /**
   * Get presigned URL for direct upload to R2
   * @param {string} fileName - Original file name
   * @param {string} contentType - File MIME type
   * @param {number} expiresIn - URL expiration in seconds (optional, default: 3600)
   * @param {string} userId - User ID for file organization (optional)
   * @returns {Promise} - Returns [data, error]
   */
  async getPresignedUploadUrl(
    fileName,
    contentType,
    expiresIn = 3600,
    userId = null
  ) {
    try {
      console.log("🔧 Getting presigned upload URL for:", {
        fileName,
        contentType,
        expiresIn,
        userId,
      });

      const requestBody = {
        fileName,
        contentType,
        expiresIn,
      };

      if (userId) {
        requestBody.userId = userId;
      }

      const [data, error] = await ApiService.post(
        `${serviceURL}/get-presigned-upload-url`,
        requestBody
      );

      console.log("📡 Presigned URL Response:", { data, error });

      if (error) {
        console.error("❌ API returned error:", error);
        return [null, error];
      }

      if (data.metadata) {
        console.log("✅ Get presigned URL successful:", data.metadata);
        return [data.metadata, null];
      } else {
        console.error("❌ API returned unsuccessful response:", data);
        return [null, { message: data?.message || "Unknown API error" }];
      }
    } catch (error) {
      console.error("❌ Get presigned URL failed:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to get presigned upload URL";
      return [null, { message: errorMessage, details: error.response?.data }];
    }
  },

  /**
   * Upload file directly to R2 using presigned URL
   * @param {string} presignedUrl - The presigned upload URL
   * @param {File} file - The file to upload
   * @param {string} contentType - File MIME type
   * @param {Function} onProgress - Progress callback function
   * @returns {Promise} - Returns [success, error]
   */
  async uploadToR2(presignedUrl, file, contentType, onProgress = null) {
    try {
      console.log("🚀 Uploading to R2:", {
        url: presignedUrl.substring(0, 100) + "...",
        fileName: file.name,
        fileSize: file.size,
        contentType,
      });

      // For R2 presigned URLs, we need minimal headers
      const headers = {
        "Content-Type": contentType,
      };

      // Try using fetch method first (better CORS handling)
      const [data, error] = await ApiService.putToExternalUrlWithFetch(
        presignedUrl,
        file,
        headers,
        onProgress
      );

      console.log("📡 R2 Upload Response:", { data, error });

      if (error) {
        console.error("❌ R2 upload failed:", error);
        return [false, error];
      }

      console.log("✅ R2 upload successful");
      return [true, null];
    } catch (error) {
      console.error("❌ R2 upload error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.statusText ||
        error.message ||
        "Failed to upload to R2";
      return [false, { message: errorMessage, details: error.response?.data }];
    }
  },

  /**
   * Complete direct upload process
   * @param {File} file - The file to upload
   * @param {Function} onProgress - Progress callback function
   * @param {string} userId - User ID for file organization (optional)
   * @returns {Promise} - Returns [publicUrl, error]
   */
  async directUpload(file, onProgress = null, userId = null) {
    try {
      console.log("🎬 Starting direct upload process for:", file.name);

      // Step 1: Get presigned upload URL
      const [presignedData, presignedError] = await this.getPresignedUploadUrl(
        file.name,
        file.type,
        3600, // 1 hour expiration
        userId
      );

      if (presignedError) {
        console.error("❌ Failed to get presigned URL:", presignedError);
        return [null, presignedError];
      }

      const { uploadUrl, publicUrl, key } = presignedData;

      // Step 2: Upload file directly to R2
      const [uploadSuccess, uploadError] = await this.uploadToR2(
        uploadUrl,
        file,
        file.type,
        onProgress
      );

      if (uploadError) {
        console.error("❌ Failed to upload to R2:", uploadError);
        return [null, uploadError];
      }

      console.log("✅ Direct upload completed. Public URL:", publicUrl);

      // Return both public URL and key for potential deletion
      return [{ publicUrl, key }, null];
    } catch (error) {
      console.error("❌ Direct upload process failed:", error);
      return [null, { message: error.message }];
    }
  },

  /**
   * Delete file from R2 storage
   * @param {string} key - File key/path on R2
   * @returns {Promise} - Returns [success, error]
   */
  async deleteFile(key) {
    try {
      console.log("🗑️ Deleting file from R2:", key);

      const [data, error] = await ApiService.delete(
        `${serviceURL}/delete/${encodeURIComponent(key)}`
      );

      console.log("📡 Delete Response:", { data, error });

      if (error) {
        console.error("❌ API returned delete error:", error);
        return [false, error];
      }

      if (data.metadata) {
        console.log("✅ Delete successful:", data.metadata);
        return [true, null];
      } else {
        console.error("❌ API returned unsuccessful delete response:", data);
        return [false, { message: data?.message || "Unknown delete error" }];
      }
    } catch (error) {
      console.error("❌ Delete file failed:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to delete file from R2";
      return [false, { message: errorMessage, details: error.response?.data }];
    }
  },
};

export default R2Service;
