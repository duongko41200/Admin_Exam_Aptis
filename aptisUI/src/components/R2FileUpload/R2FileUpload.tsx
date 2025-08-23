import React, { useState, useCallback } from "react";
import {
  Box,
  Button,
  Typography,
  LinearProgress,
  Alert,
  Chip,
} from "@mui/material";
import { CloudUpload, Delete, GetApp } from "@mui/icons-material";
import { useDropzone } from "react-dropzone";
import { useNotify } from "react-admin";

interface UploadedFile {
  key: string;
  filename: string;
  originalName: string;
  url: string;
  size: number;
  mimeType: string;
  fileType: string;
  uploadedAt: string;
}

interface R2FileUploadProps {
  fileType?: "listening" | "speaking" | "reading" | "writing" | "general";
  multiple?: boolean;
  maxFiles?: number;
  maxSize?: number; // in bytes
  acceptedFileTypes?: string[];
  onUploadSuccess?: (files: UploadedFile[]) => void;
  onUploadError?: (error: string) => void;
  className?: string;
}

const R2FileUpload: React.FC<R2FileUploadProps> = ({
  fileType = "general",
  multiple = false,
  maxFiles = 10,
  maxSize = 100 * 1024 * 1024, // 100MB
  acceptedFileTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "audio/mpeg",
    "audio/wav",
    "audio/mp3",
    "video/mp4",
    "video/webm",
    "application/pdf",
    "text/plain",
  ],
  onUploadSuccess,
  onUploadError,
  className = "",
}) => {
  const notify = useNotify();
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      setIsUploading(true);
      setError(null);
      setUploadProgress(0);

      try {
        const formData = new FormData();

        if (multiple) {
          acceptedFiles.forEach((file) => formData.append("files", file));
        } else {
          formData.append("file", acceptedFiles[0]);
        }

        formData.append("fileType", fileType);

        // Get auth token (adjust according to your auth implementation)
        const token =
          localStorage.getItem("authToken") ||
          sessionStorage.getItem("authToken");

        const endpoint = multiple
          ? "/v1/api/r2/upload/multiple"
          : "/v1/api/r2/upload/single";

        const response = await fetch(endpoint, {
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

        const newFiles = multiple
          ? result.metadata.successful
          : [result.metadata];
        setUploadedFiles((prev) => [...prev, ...newFiles]);

        notify("File(s) uploaded successfully!", { type: "success" });
        onUploadSuccess?.(newFiles);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Upload failed";
        setError(errorMessage);
        notify(`Upload failed: ${errorMessage}`, { type: "error" });
        onUploadError?.(errorMessage);
      } finally {
        setIsUploading(false);
        setUploadProgress(0);
      }
    },
    [fileType, multiple, notify, onUploadSuccess, onUploadError]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFileTypes.reduce((acc, type) => {
      acc[type] = [];
      return acc;
    }, {} as Record<string, string[]>),
    multiple,
    maxFiles: multiple ? maxFiles : 1,
    maxSize,
    disabled: isUploading,
  });

  const deleteFile = async (fileKey: string) => {
    try {
      const token =
        localStorage.getItem("authToken") ||
        sessionStorage.getItem("authToken");

      const response = await fetch(
        `/v1/api/r2/file/${encodeURIComponent(fileKey)}`,
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

      setUploadedFiles((prev) => prev.filter((file) => file.key !== fileKey));
      notify("File deleted successfully!", { type: "success" });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Delete failed";
      notify(`Delete failed: ${errorMessage}`, { type: "error" });
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileTypeColor = (mimeType: string) => {
    if (mimeType.startsWith("image/")) return "primary";
    if (mimeType.startsWith("audio/")) return "secondary";
    if (mimeType.startsWith("video/")) return "success";
    if (mimeType.includes("pdf")) return "error";
    return "default";
  };

  return (
    <Box className={className}>
      {/* Upload Area */}
      <Box
        {...getRootProps()}
        sx={{
          border: "2px dashed",
          borderColor: isDragActive ? "primary.main" : "grey.300",
          borderRadius: 2,
          padding: 4,
          textAlign: "center",
          cursor: isUploading ? "not-allowed" : "pointer",
          backgroundColor: isDragActive ? "action.hover" : "background.paper",
          transition: "all 0.3s ease",
          "&:hover": {
            borderColor: "primary.main",
            backgroundColor: "action.hover",
          },
        }}
      >
        <input {...getInputProps()} />
        <CloudUpload sx={{ fontSize: 48, color: "grey.400", mb: 2 }} />

        {isUploading ? (
          <Box>
            <Typography variant="h6" gutterBottom>
              Uploading...
            </Typography>
            <LinearProgress
              variant="determinate"
              value={uploadProgress}
              sx={{ mt: 2, mb: 2 }}
            />
          </Box>
        ) : (
          <Box>
            <Typography variant="h6" gutterBottom>
              {isDragActive
                ? "Drop files here..."
                : `Click or drag files to upload (${fileType})`}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {multiple
                ? `Support multiple files (max ${maxFiles})`
                : "Support single file"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Max file size: {formatFileSize(maxSize)}
            </Typography>
          </Box>
        )}
      </Box>

      {/* Error Display */}
      {error && (
        <Alert severity="error" sx={{ mt: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Uploaded Files ({uploadedFiles.length})
          </Typography>

          {uploadedFiles.map((file) => (
            <Box
              key={file.key}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: 2,
                border: "1px solid",
                borderColor: "grey.300",
                borderRadius: 1,
                mb: 1,
                backgroundColor: "background.paper",
              }}
            >
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="subtitle2" noWrap>
                  {file.originalName}
                </Typography>
                <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                  <Chip
                    label={file.mimeType}
                    size="small"
                    color={getFileTypeColor(file.mimeType)}
                  />
                  <Chip
                    label={formatFileSize(file.size)}
                    size="small"
                    variant="outlined"
                  />
                  <Chip label={file.fileType} size="small" variant="outlined" />
                </Box>
              </Box>

              <Box sx={{ display: "flex", gap: 1 }}>
                <Button
                  size="small"
                  startIcon={<GetApp />}
                  onClick={() => window.open(file.url, "_blank")}
                >
                  View
                </Button>
                <Button
                  size="small"
                  color="error"
                  startIcon={<Delete />}
                  onClick={() => deleteFile(file.key)}
                >
                  Delete
                </Button>
              </Box>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default R2FileUpload;
