/**
 * Helper service for uploading files to R2 during form submission
 */

interface UploadResult {
  success: boolean;
  data?: {
    url: string;
    key: string;
    originalName: string;
    size: number;
    mimeType: string;
  };
  error?: string;
}

class R2UploadHelper {
  /**
   * Upload single file to R2
   */
  async uploadSingleFile(
    file: File,
    fileType: string = "general"
  ): Promise<UploadResult> {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("fileType", fileType);

      // Get auth token
      const token =
        localStorage.getItem("authToken") ||
        sessionStorage.getItem("authToken");

      const response = await fetch("/v1/api/r2/upload/single", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Upload failed");
      }

      return {
        success: true,
        data: {
          url: result.metadata.url,
          key: result.metadata.key,
          originalName: result.metadata.originalName,
          size: result.metadata.size,
          mimeType: result.metadata.mimeType,
        },
      };
    } catch (error) {
      console.error("R2 Upload Error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Upload failed",
      };
    }
  }

  /**
   * Upload multiple files to R2
   */
  async uploadMultipleFiles(
    files: File[],
    fileType: string = "general"
  ): Promise<{
    success: boolean;
    successful: Array<{
      url: string;
      key: string;
      originalName: string;
      size: number;
      mimeType: string;
    }>;
    failed: string[];
  }> {
    try {
      const formData = new FormData();
      files.forEach((file) => formData.append("files", file));
      formData.append("fileType", fileType);

      // Get auth token
      const token =
        localStorage.getItem("authToken") ||
        sessionStorage.getItem("authToken");

      const response = await fetch("/v1/api/r2/upload/multiple", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Upload failed");
      }

      return {
        success: true,
        successful: result.metadata.successful.map((file: any) => ({
          url: file.url,
          key: file.key,
          originalName: file.originalName,
          size: file.size,
          mimeType: file.mimeType,
        })),
        failed: result.metadata.failed || [],
      };
    } catch (error) {
      console.error("R2 Multiple Upload Error:", error);
      return {
        success: false,
        successful: [],
        failed: files.map((f) => f.name),
      };
    }
  }

  /**
   * Delete file from R2
   */
  async deleteFile(key: string): Promise<{ success: boolean; error?: string }> {
    try {
      const token =
        localStorage.getItem("authToken") ||
        sessionStorage.getItem("authToken");

      const response = await fetch(
        `/v1/api/r2/file/${encodeURIComponent(key)}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Delete failed");
      }

      return { success: true };
    } catch (error) {
      console.error("R2 Delete Error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Delete failed",
      };
    }
  }
}

export default new R2UploadHelper();
