import React, { useState, useCallback } from "react";
import {
  Box,
  Button,
  Typography,
  Alert,
  Chip,
  IconButton,
} from "@mui/material";
import { CloudUpload, Delete, Visibility } from "@mui/icons-material";
import { useDropzone } from "react-dropzone";

interface PreviewFile {
  file: File;
  previewUrl: string;
  id: string;
}

interface R2FilePreviewProps {
  fileType?: "listening" | "speaking" | "reading" | "writing" | "general";
  multiple?: boolean;
  maxFiles?: number;
  maxSize?: number; // in bytes
  acceptedFileTypes?: string[];
  onFilesChange?: (files: File[]) => void;
  onPreviewUrlsChange?: (urls: string[]) => void;
  className?: string;
  initialImages?: string[]; // For edit mode
}

const R2FilePreview: React.FC<R2FilePreviewProps> = ({
  fileType = "general",
  multiple = false,
  maxFiles = 10,
  maxSize = 100 * 1024 * 1024, // 100MB
  acceptedFileTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"],
  onFilesChange,
  onPreviewUrlsChange,
  className = "",
  initialImages = [],
}) => {
  const [previewFiles, setPreviewFiles] = useState<PreviewFile[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Initialize with existing images in edit mode
  React.useEffect(() => {
    if (initialImages.length > 0) {
      const existingPreviews = initialImages.map((url, index) => ({
        file: null as any, // For existing images, we don't have the file object
        previewUrl: url,
        id: `existing-${index}`,
      }));
      setPreviewFiles(existingPreviews);
    }
  }, [initialImages]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      setError(null);

      try {
        const newPreviews: PreviewFile[] = acceptedFiles.map((file, index) => {
          const previewUrl = URL.createObjectURL(file);
          console.log(
            `🖼️ Creating preview for file: ${file.name}, type: ${file.type}, URL: ${previewUrl}`
          );

          return {
            file,
            previewUrl,
            id: `new-${Date.now()}-${index}`,
          };
        });

        let updatedPreviews: PreviewFile[];

        if (multiple) {
          // Check total count including existing files
          const totalCount = previewFiles.length + newPreviews.length;
          if (totalCount > maxFiles) {
            setError(
              `Maximum ${maxFiles} files allowed. Current: ${previewFiles.length}, trying to add: ${newPreviews.length}`
            );
            return;
          }
          updatedPreviews = [...previewFiles, ...newPreviews];
        } else {
          // Single file mode - replace existing
          updatedPreviews = newPreviews.slice(0, 1);
        }

        console.log(
          `📋 Updated previews:`,
          updatedPreviews.map((p) => ({
            id: p.id,
            fileName: p.file?.name || "existing",
            fileType: p.file?.type || "unknown",
            previewUrl: p.previewUrl,
            isImage: isImageFile(p),
          }))
        );

        setPreviewFiles(updatedPreviews);

        // Extract only new files (not existing URLs)
        const newFiles = updatedPreviews
          .filter((p) => p.file)
          .map((p) => p.file);

        const allUrls = updatedPreviews.map((p) => p.previewUrl);

        // Notify parent components
        onFilesChange?.(newFiles);
        onPreviewUrlsChange?.(allUrls);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Preview failed";
        setError(errorMessage);
        console.error("🚨 Preview creation error:", err);
      }
    },
    [previewFiles, multiple, maxFiles, onFilesChange, onPreviewUrlsChange]
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
  });

  const removeFile = (id: string) => {
    const updatedPreviews = previewFiles.filter((p) => p.id !== id);
    setPreviewFiles(updatedPreviews);

    // Extract files and URLs
    const newFiles = updatedPreviews.filter((p) => p.file).map((p) => p.file);

    const allUrls = updatedPreviews.map((p) => p.previewUrl);

    // Notify parent components
    onFilesChange?.(newFiles);
    onPreviewUrlsChange?.(allUrls);

    // Clean up object URL for removed file
    const removedFile = previewFiles.find((p) => p.id === id);
    if (removedFile && removedFile.file) {
      URL.revokeObjectURL(removedFile.previewUrl);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileTypeFromUrl = (url: string, file?: File) => {
    // Nếu có file object, check MIME type trước
    if (file && file.type.startsWith("image/")) {
      return "image";
    }

    // Fallback: check extension từ URL
    const extension = url.split(".").pop()?.toLowerCase();
    if (
      ["jpg", "jpeg", "png", "gif", "webp", "svg", "bmp", "tiff"].includes(
        extension || ""
      )
    ) {
      return "image";
    }
    return "file";
  };

  // Helper function để check xem có phải image không
  const isImageFile = (preview: PreviewFile) => {
    // Check MIME type nếu có file object
    if (preview.file && preview.file.type.startsWith("image/")) {
      return true;
    }

    // Check extension từ URL cho existing images
    const extension = preview.previewUrl.split(".").pop()?.toLowerCase();
    return ["jpg", "jpeg", "png", "gif", "webp", "svg", "bmp", "tiff"].includes(
      extension || ""
    );
  };

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      previewFiles.forEach((preview) => {
        if (preview.file) {
          URL.revokeObjectURL(preview.previewUrl);
        }
      });
    };
  }, []);

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
          cursor: "pointer",
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

        <Box>
          <Typography variant="h6" gutterBottom>
            {isDragActive
              ? "Drop files here..."
              : `Click or drag files to preview (${fileType})`}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {multiple
              ? `Support multiple files (max ${maxFiles})`
              : "Support single file"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Max file size: {formatFileSize(maxSize)}
          </Typography>
          <Typography variant="body2" color="warning.main" sx={{ mt: 1 }}>
            ⚠️ Files will be uploaded when you submit the form
          </Typography>
        </Box>
      </Box>

      {/* Error Display */}
      {error && (
        <Alert severity="error" sx={{ mt: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Preview Files Grid */}
      {previewFiles.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Preview Files ({previewFiles.length})
          </Typography>

          {/* Debug info */}
          {process.env.NODE_ENV === "development" && (
            <Box
              sx={{
                mb: 2,
                p: 1,
                backgroundColor: "#f0f0f0",
                borderRadius: 1,
                fontSize: "12px",
              }}
            >
              <Typography variant="caption" component="div">
                🐛 Debug:{" "}
                {previewFiles
                  .map(
                    (p, i) =>
                      `File ${i + 1}: ${p.file?.name || "existing"} | Type: ${
                        p.file?.type || "unknown"
                      } | IsImage: ${isImageFile(p)}`
                  )
                  .join(" | ")}
              </Typography>
            </Box>
          )}

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: 2,
              mt: 2,
            }}
          >
            {previewFiles.map((preview) => (
              <Box
                key={preview.id}
                sx={{
                  position: "relative",
                  border: "1px solid",
                  borderColor: "grey.300",
                  borderRadius: 1,
                  overflow: "hidden",
                  backgroundColor: "background.paper",
                  minHeight: "200px", // Đảm bảo có chiều cao tối thiểu
                }}
              >
                {/* Image Preview - Hiển thị cho tất cả image files */}
                {isImageFile(preview) ? (
                  <Box
                    sx={{
                      width: "100%",
                      height: "150px",
                      position: "relative",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#f5f5f5",
                    }}
                  >
                    <img
                      src={preview.previewUrl}
                      alt={preview.file ? preview.file.name : "Preview"}
                      style={{
                        maxWidth: "100%",
                        maxHeight: "100%",
                        objectFit: "contain",
                        borderRadius: "4px",
                      }}
                      onError={(e) => {
                        console.error("Image load error:", e);
                        // Fallback: hiển thị placeholder nếu image không load được
                        e.currentTarget.style.display = "none";
                      }}
                    />

                    {/* Actions Overlay */}
                    <Box
                      sx={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        display: "flex",
                        gap: 1,
                      }}
                    >
                      <IconButton
                        size="small"
                        onClick={() =>
                          window.open(preview.previewUrl, "_blank")
                        }
                        sx={{
                          backgroundColor: "rgba(255, 255, 255, 0.8)",
                          "&:hover": {
                            backgroundColor: "rgba(255, 255, 255, 0.9)",
                          },
                        }}
                      >
                        <Visibility fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => removeFile(preview.id)}
                        sx={{
                          backgroundColor: "rgba(255, 255, 255, 0.8)",
                          "&:hover": {
                            backgroundColor: "rgba(255, 255, 255, 0.9)",
                          },
                        }}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                ) : (
                  // Non-image files - show file icon
                  <Box
                    sx={{
                      width: "100%",
                      height: "150px",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#f5f5f5",
                      position: "relative",
                    }}
                  >
                    <CloudUpload
                      sx={{ fontSize: 48, color: "grey.400", mb: 1 }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      Non-image file
                    </Typography>

                    {/* Actions for non-image files */}
                    <Box
                      sx={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        display: "flex",
                        gap: 1,
                      }}
                    >
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => removeFile(preview.id)}
                        sx={{
                          backgroundColor: "rgba(255, 255, 255, 0.8)",
                          "&:hover": {
                            backgroundColor: "rgba(255, 255, 255, 0.9)",
                          },
                        }}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                )}

                {/* File Info */}
                <Box sx={{ p: 1 }}>
                  <Typography variant="body2" noWrap>
                    {preview.file ? preview.file.name : "Existing image"}
                  </Typography>
                  <Box
                    sx={{ display: "flex", gap: 1, mt: 1, flexWrap: "wrap" }}
                  >
                    {preview.file && (
                      <>
                        <Chip
                          label={preview.file.type}
                          size="small"
                          color="primary"
                        />
                        <Chip
                          label={formatFileSize(preview.file.size)}
                          size="small"
                          variant="outlined"
                        />
                      </>
                    )}
                    <Chip
                      label={preview.file ? "New" : "Existing"}
                      size="small"
                      color={preview.file ? "secondary" : "default"}
                      variant="outlined"
                    />
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default R2FilePreview;
