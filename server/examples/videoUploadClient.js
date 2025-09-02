/**
 * Video Upload Client Example
 * Demonstrates how to use the multipart video upload API
 */

class VideoUploadClient {
  constructor(baseUrl = "http://localhost:3000", apiKey = null) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
    this.maxConcurrentUploads = 3; // Maximum parallel chunk uploads
  }

  /**
   * Set request headers
   */
  getHeaders(contentType = "application/json") {
    const headers = {
      "Content-Type": contentType,
    };

    if (this.apiKey) {
      headers["x-api-key"] = this.apiKey;
    }

    return headers;
  }

  /**
   * Upload video file using multipart upload
   * @param {File} file - Video file to upload
   * @param {object} options - Upload options
   * @param {function} onProgress - Progress callback
   * @returns {Promise<object>} Upload result
   */
  async uploadVideo(file, options = {}, onProgress = null) {
    try {
      console.log(`Starting upload for ${file.name} (${file.size} bytes)`);

      // Step 1: Validate file
      await this.validateFile(file);

      // Step 2: Initialize multipart upload
      const initResult = await this.initializeUpload(file, options);
      const { uploadId, key, totalParts, partSize } = initResult;

      console.log(`Upload initialized: ${uploadId}, ${totalParts} parts`);

      // Step 3: Generate signed URLs
      const urlsResult = await this.generateSignedUrls(
        uploadId,
        key,
        totalParts
      );
      const { signedUrls } = urlsResult;

      // Step 4: Upload parts in parallel
      const parts = await this.uploadParts(
        file,
        signedUrls,
        partSize,
        onProgress
      );

      // Step 5: Complete multipart upload
      const result = await this.completeUpload(uploadId, key, parts);

      console.log("Upload completed successfully:", result.publicUrl);
      return result;
    } catch (error) {
      console.error("Upload failed:", error);
      throw error;
    }
  }

  /**
   * Validate video file
   */
  async validateFile(file) {
    const response = await fetch(
      `${this.baseUrl}/v1/api/video/upload/validate`,
      {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify({
          fileName: file.name,
          contentType: file.type,
          fileSize: file.size,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "File validation failed");
    }

    return await response.json();
  }

  /**
   * Initialize multipart upload
   */
  async initializeUpload(file, options = {}) {
    const response = await fetch(`${this.baseUrl}/v1/api/video/upload/init`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify({
        fileName: file.name,
        contentType: file.type,
        fileSize: file.size,
        userId: options.userId,
        metadata: options.metadata || {},
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Upload initialization failed");
    }

    const result = await response.json();
    return result.metadata;
  }

  /**
   * Generate signed URLs for parts
   */
  async generateSignedUrls(uploadId, key, totalParts) {
    const response = await fetch(
      `${this.baseUrl}/v1/api/video/upload/signed-urls`,
      {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify({
          uploadId,
          key,
          totalParts,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Signed URL generation failed");
    }

    const result = await response.json();
    return result.metadata;
  }

  /**
   * Upload parts in parallel
   */
  async uploadParts(file, signedUrls, partSize, onProgress = null) {
    const parts = [];
    const uploadPromises = [];
    let completedParts = 0;

    // Create semaphore for concurrent uploads
    const semaphore = new Semaphore(this.maxConcurrentUploads);

    for (let i = 0; i < signedUrls.length; i++) {
      const { partNumber, signedUrl } = signedUrls[i];
      const start = (partNumber - 1) * partSize;
      const end = Math.min(start + partSize, file.size);
      const chunk = file.slice(start, end);

      const uploadPromise = semaphore.acquire().then(async (release) => {
        try {
          console.log(`Uploading part ${partNumber}/${signedUrls.length}`);

          const response = await fetch(signedUrl, {
            method: "PUT",
            body: chunk,
            headers: {
              "Content-Type": file.type,
            },
          });

          if (!response.ok) {
            throw new Error(
              `Part ${partNumber} upload failed: ${response.statusText}`
            );
          }

          const etag = response.headers.get("ETag");
          if (!etag) {
            throw new Error(`No ETag received for part ${partNumber}`);
          }

          completedParts++;

          // Report progress
          if (onProgress) {
            const progress = Math.round(
              (completedParts / signedUrls.length) * 100
            );
            onProgress(progress, completedParts, signedUrls.length);
          }

          console.log(
            `Part ${partNumber} uploaded successfully, ETag: ${etag}`
          );

          return {
            partNumber,
            etag: etag.replace(/"/g, ""), // Remove quotes from ETag
            size: chunk.size,
          };
        } finally {
          release();
        }
      });

      uploadPromises.push(uploadPromise);
    }

    // Wait for all parts to complete
    const results = await Promise.all(uploadPromises);

    // Sort by part number
    results.sort((a, b) => a.partNumber - b.partNumber);

    return results;
  }

  /**
   * Complete multipart upload
   */
  async completeUpload(uploadId, key, parts) {
    const response = await fetch(
      `${this.baseUrl}/v1/api/video/upload/complete`,
      {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify({
          uploadId,
          key,
          parts,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Upload completion failed");
    }

    const result = await response.json();
    return result.metadata;
  }

  /**
   * Abort upload
   */
  async abortUpload(uploadId, key) {
    const response = await fetch(`${this.baseUrl}/v1/api/video/upload/abort`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify({
        uploadId,
        key,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Upload abort failed");
    }

    return await response.json();
  }

  /**
   * Get upload progress
   */
  async getUploadProgress(uploadId, key) {
    const response = await fetch(
      `${this.baseUrl}/v1/api/video/upload/progress/${uploadId}/${key}`,
      {
        method: "GET",
        headers: this.getHeaders(),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Progress fetch failed");
    }

    const result = await response.json();
    return result.metadata;
  }

  /**
   * Get user uploads
   */
  async getUserUploads(userId, status = null, limit = 10) {
    let url = `${this.baseUrl}/v1/api/video/upload/user/${userId}?limit=${limit}`;
    if (status) {
      url += `&status=${status}`;
    }

    const response = await fetch(url, {
      method: "GET",
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch user uploads");
    }

    const result = await response.json();
    return result.metadata;
  }
}

/**
 * Simple semaphore implementation for controlling concurrency
 */
class Semaphore {
  constructor(permits) {
    this.permits = permits;
    this.waiting = [];
  }

  acquire() {
    return new Promise((resolve) => {
      if (this.permits > 0) {
        this.permits--;
        resolve(() => this.release());
      } else {
        this.waiting.push(() => {
          this.permits--;
          resolve(() => this.release());
        });
      }
    });
  }

  release() {
    this.permits++;
    if (this.waiting.length > 0) {
      const next = this.waiting.shift();
      next();
    }
  }
}

/**
 * Usage example
 */
function exampleUsage() {
  const uploader = new VideoUploadClient(
    "http://localhost:3000",
    "your-api-key"
  );

  // Get file input element
  const fileInput = document.getElementById("video-file");

  fileInput.addEventListener("change", async (event) => {
    const file = event.target.files[0];

    if (!file) return;

    try {
      const result = await uploader.uploadVideo(
        file,
        {
          userId: "user123",
          metadata: {
            title: "My Video",
            description: "Test video upload",
          },
        },
        // Progress callback
        (progress, completed, total) => {
          console.log(`Progress: ${progress}% (${completed}/${total} parts)`);

          // Update progress bar
          const progressBar = document.getElementById("progress-bar");
          if (progressBar) {
            progressBar.style.width = `${progress}%`;
            progressBar.textContent = `${progress}%`;
          }
        }
      );

      console.log("Upload successful:", result);
      alert(`Upload successful! Video URL: ${result.publicUrl}`);
    } catch (error) {
      console.error("Upload failed:", error);
      alert(`Upload failed: ${error.message}`);
    }
  });
}

// Export for use
if (typeof module !== "undefined" && module.exports) {
  module.exports = { VideoUploadClient, Semaphore };
}
