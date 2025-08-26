import React, { useState, useCallback } from "react";
import {
  Box,
  Typography,
  Alert,
  Chip,
  IconButton,
  Paper,
  Fade,
  Grow,
  Badge,
} from "@mui/material";
import {
  CloudUpload,
  Delete,
  Visibility,
  PhotoLibrary,
  CheckCircle,
} from "@mui/icons-material";
import { useDropzone } from "react-dropzone";

interface SimplePreviewFile {
  file: File;
  previewUrl: string;
  id: string;
}

interface SimpleR2FilePreviewProps {
  onFilesChange?: (files: File[]) => void;
  multiple?: boolean;
  maxFiles?: number;
  initialImageUrls?: string[]; // Ảnh hiện tại từ server
  onRemoveExistingImage?: (url: string) => void; // Callback khi xóa ảnh có sẵn
}

const SimpleR2FilePreview: React.FC<SimpleR2FilePreviewProps> = ({
  onFilesChange,
  multiple = true,
  maxFiles = 2,
  initialImageUrls = [],
  onRemoveExistingImage,
}) => {
  const [previewFiles, setPreviewFiles] = useState<SimplePreviewFile[]>([]);
  const [existingImages, setExistingImages] =
    useState<string[]>(initialImageUrls);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      setError(null);

      try {
        const newPreviews: SimplePreviewFile[] = acceptedFiles.map(
          (file, index) => {
            const previewUrl = URL.createObjectURL(file);

            return {
              file,
              previewUrl,
              id: `preview-${Date.now()}-${index}`,
            };
          }
        );

        let updatedPreviews: SimplePreviewFile[];

        if (multiple) {
          const totalCount =
            previewFiles.length + existingImages.length + newPreviews.length;
          if (totalCount > maxFiles) {
            setError(`Chúng tôi chỉ cần  ${maxFiles} files `);
            return;
          }
          updatedPreviews = [...previewFiles, ...newPreviews];
        } else {
          // Nếu không phải multiple, xóa existing images khi thêm file mới
          if (existingImages.length > 0) {
            existingImages.forEach((url) => onRemoveExistingImage?.(url));
            setExistingImages([]);
          }
          updatedPreviews = newPreviews.slice(0, 1);
        }

        setPreviewFiles(updatedPreviews);

        const allFiles = updatedPreviews.map((p) => p.file);
        onFilesChange?.(allFiles);
      } catch (err) {
        console.error("❌ Error creating previews:", err);
        setError(`Error: ${err.message}`);
      }
    },
    [previewFiles, multiple, maxFiles, onFilesChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/gif": [".gif"],
      "image/webp": [".webp"],
    },
    multiple,
    maxFiles: multiple ? maxFiles : 1,
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  const removeFile = (id: string) => {
    const fileToRemove = previewFiles.find((p) => p.id === id);
    if (fileToRemove) {
      URL.revokeObjectURL(fileToRemove.previewUrl);
    }

    const updatedPreviews = previewFiles.filter((p) => p.id !== id);
    setPreviewFiles(updatedPreviews);

    const allFiles = updatedPreviews.map((p) => p.file);
    onFilesChange?.(allFiles);
  };

  const removeExistingImage = (url: string) => {
    const updatedImages = existingImages.filter((img) => img !== url);
    setExistingImages(updatedImages);
    onRemoveExistingImage?.(url);
  };

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      previewFiles.forEach((preview) => {
        URL.revokeObjectURL(preview.previewUrl);
      });
    };
  }, []);

  // Update existing images when prop changes
  React.useEffect(() => {
    setExistingImages(initialImageUrls);
  }, [initialImageUrls]);

  return (
    <Box sx={{ width: "100%" }}>
      {/* Header Section */}
      <Fade in={true} timeout={800}>
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <PhotoLibrary sx={{ color: "primary.main", fontSize: 28 }} />
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                background: "linear-gradient(45deg, #1976d2, #42a5f5)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Image Upload
            </Typography>
            {(previewFiles.length > 0 || existingImages.length > 0) && (
              <Badge
                badgeContent={previewFiles.length + existingImages.length}
                color="success"
                sx={{
                  "& .MuiBadge-badge": {
                    fontSize: "0.7rem",
                    fontWeight: "bold",
                  },
                }}
              >
                <CheckCircle sx={{ color: "success.main", fontSize: 20 }} />
              </Badge>
            )}
          </Box>
          <Typography variant="body2" color="text.secondary">
            Drag and drop your images or click to browse files
          </Typography>
        </Box>
      </Fade>

      {/* Drop Zone */}
      <Grow in={true} timeout={1000}>
        <Paper
          {...getRootProps()}
          elevation={isDragActive ? 12 : 3}
          sx={{
            border: isDragActive ? "3px dashed" : "2px dashed",
            borderColor: isDragActive ? "primary.main" : "grey.300",
            borderRadius: 3,
            padding: { xs: 3, md: 2 },
            textAlign: "center",
            cursor: "pointer",
            position: "relative",
            overflow: "hidden",
            background: isDragActive
              ? "linear-gradient(135deg, rgba(25, 118, 210, 0.08) 0%, rgba(66, 165, 245, 0.05) 100%)"
              : "linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.8) 100%)",
            transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
            transform: isDragActive ? "scale(1.02)" : "scale(1)",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: isDragActive
                ? "radial-gradient(circle at center, rgba(25, 118, 210, 0.1) 0%, transparent 70%)"
                : "transparent",
              transition: "all 0.3s ease",
            },
            "&:hover": {
              borderColor: "primary.main",
              background:
                "linear-gradient(135deg, rgba(25, 118, 210, 0.04) 0%, rgba(66, 165, 245, 0.02) 100%)",
              transform: "translateY(-2px)",
              boxShadow: "0 8px 25px rgba(25, 118, 210, 0.15)",
            },
          }}
        >
          <input {...getInputProps()} />

          {/* Upload Icon with Animation */}
          <Box
            sx={{
              position: "relative",
              zIndex: 1,
              animation: isDragActive ? "bounce 1s infinite" : "none",
              "@keyframes bounce": {
                "0%, 20%, 50%, 80%, 100%": {
                  transform: "translateY(0)",
                },
                "40%": {
                  transform: "translateY(-10px)",
                },
                "60%": {
                  transform: "translateY(-5px)",
                },
              },
            }}
          >
            <CloudUpload
              sx={{
                fontSize: { xs: 48, md: 56 },
                color: isDragActive ? "primary.main" : "grey.400",
                mb: 2,
                transition: "all 0.3s ease",
                filter: isDragActive
                  ? "drop-shadow(0 4px 8px rgba(25, 118, 210, 0.3))"
                  : "none",
              }}
            />
          </Box>

          <Typography
            variant="h6"
            gutterBottom
            sx={{
              position: "relative",
              zIndex: 1,
              fontWeight: 600,
              color: isDragActive ? "primary.main" : "text.primary",
              transition: "color 0.3s ease",
            }}
          >
            {isDragActive
              ? "🎯 Drop your images here"
              : "📸 Choose images to preview"}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              position: "relative",
              zIndex: 1,
              mb: 1,
              opacity: 0.8,
            }}
          >
            Supports JPG, PNG, GIF, WebP • Max {maxFiles} files • Up to 10MB
            each
          </Typography>
        </Paper>
      </Grow>

      {/* Error Display */}
      {error && (
        <Fade in={true}>
          <Alert
            severity="error"
            sx={{
              mt: 3,
              borderRadius: 2,
              boxShadow: "0 4px 12px rgba(211, 47, 47, 0.15)",
            }}
            onClose={() => setError(null)}
          >
            {error}
          </Alert>
        </Fade>
      )}

      {/* Preview Grid */}
      {(previewFiles.length > 0 || existingImages.length > 0) && (
        <Fade in={true} timeout={600}>
          <Box sx={{ mt: 4 }}>
            {/* Section Header */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 3,
                pb: 2,
                borderBottom: "2px solid",
                borderColor: "divider",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <PhotoLibrary sx={{ color: "primary.main", fontSize: 24 }} />
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    color: "text.primary",
                  }}
                >
                  Selected Images
                </Typography>
                <Chip
                  label={`${previewFiles.length + existingImages.length} ${
                    previewFiles.length + existingImages.length === 1
                      ? "file"
                      : "files"
                  }`}
                  color="primary"
                  size="small"
                  sx={{ fontWeight: 600 }}
                />
              </Box>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontStyle: "italic" }}
              >
                Ready for upload
              </Typography>
            </Box>

            {/* Images Grid */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, 1fr)",
                  md: "repeat(3, 1fr)",
                  lg: "repeat(2, 1fr)",
                },
                gap: 3,
                maxHeight: "200px",
                minHeight: "200px",
                overflowY: "auto",
              }}
            >
              {/* Existing Images */}
              {existingImages.map((imageUrl, index) => (
                <Grow
                  key={`existing-${index}`}
                  in={true}
                  timeout={800 + index * 100}
                  style={{ transformOrigin: "center center" }}
                >
                  <Paper
                    elevation={4}
                    sx={{
                      position: "relative",
                      borderRadius: 3,
                      overflow: "hidden",
                      background:
                        "linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)",
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      border: "2px solid #e3f2fd", // Blue border for existing images
                      "&:hover": {
                        transform: "translateY(-8px)",
                        boxShadow: "0 12px 30px rgba(0, 0, 0, 0.15)",
                        "& .image-overlay": {
                          opacity: 1,
                        },
                        "& .action-buttons": {
                          transform: "translateY(0)",
                          opacity: 1,
                        },
                      },
                    }}
                  >
                    {/* Image Container */}
                    <Box
                      sx={{
                        width: "100%",
                        height: "100px",
                        position: "relative",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background:
                          "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
                        overflow: "hidden",
                      }}
                    >
                      {/* Actual Image */}
                      <img
                        src={imageUrl}
                        alt={`Existing image ${index + 1}`}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          transition: "transform 0.3s ease",
                        }}
                        onLoad={() => {
                          console.log(`✅ Existing image loaded: ${imageUrl}`);
                        }}
                        onError={(e) => {
                          console.error(
                            `❌ Existing image failed: ${imageUrl}`,
                            e
                          );
                        }}
                      />

                      {/* Hover Overlay */}
                      <Box
                        className="image-overlay"
                        sx={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background:
                            "linear-gradient(135deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.6) 100%)",
                          opacity: 0,
                          transition: "opacity 0.3s ease",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      />

                      {/* Action Buttons */}
                      <Box
                        className="action-buttons"
                        sx={{
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%, -50%) translateY(10px)",
                          display: "flex",
                          gap: 1,
                          opacity: 0,
                          transition: "all 0.3s ease",
                        }}
                      >
                        <IconButton
                          size="large"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(imageUrl, "_blank");
                          }}
                          sx={{
                            backgroundColor: "rgba(255, 255, 255, 0.95)",
                            color: "primary.main",
                            "&:hover": {
                              backgroundColor: "white",
                              transform: "scale(1.1)",
                            },
                          }}
                        >
                          <Visibility />
                        </IconButton>
                        <IconButton
                          size="large"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeExistingImage(imageUrl);
                          }}
                          sx={{
                            backgroundColor: "rgba(255, 255, 255, 0.95)",
                            color: "error.main",
                            "&:hover": {
                              backgroundColor: "white",
                              transform: "scale(1.1)",
                            },
                          }}
                        >
                          <Delete />
                        </IconButton>
                      </Box>

                      {/* File Index Badge - Blue for existing */}
                      <Box
                        sx={{
                          position: "absolute",
                          top: 12,
                          left: 12,
                          backgroundColor: "#1976d2",
                          color: "white",
                          borderRadius: "50%",
                          width: 32,
                          height: 32,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: "bold",
                          fontSize: "0.875rem",
                          boxShadow: "0 2px 8px rgba(25, 118, 210, 0.3)",
                        }}
                      >
                        E{index + 1}
                      </Box>
                    </Box>

                    {/* File Info Section */}
                    <Box sx={{ p: 2.5 }}>
                      <Typography
                        variant="body2"
                        fontWeight="600"
                        noWrap
                        sx={{
                          mb: 1.5,
                          color: "text.primary",
                          fontSize: "0.875rem",
                        }}
                      >
                        Existing Image {index + 1}
                      </Typography>

                      <Box
                        sx={{
                          display: "flex",
                          gap: 1,
                          flexWrap: "wrap",
                          alignItems: "center",
                        }}
                      >
                        <Chip
                          label="EXISTING"
                          size="small"
                          color="info"
                          variant="filled"
                          sx={{
                            fontWeight: 600,
                            fontSize: "0.7rem",
                            height: 24,
                          }}
                        />
                        <Chip
                          label="R2 STORED"
                          size="small"
                          color="primary"
                          variant="outlined"
                          sx={{
                            fontWeight: 600,
                            fontSize: "0.7rem",
                            height: 24,
                          }}
                        />
                      </Box>
                    </Box>
                  </Paper>
                </Grow>
              ))}

              {/* New Preview Files */}
              {previewFiles.map((preview, index) => (
                <Grow
                  key={preview.id}
                  in={true}
                  timeout={800 + (existingImages.length + index) * 100}
                  style={{ transformOrigin: "center center" }}
                >
                  <Paper
                    elevation={4}
                    sx={{
                      position: "relative",
                      borderRadius: 3,
                      overflow: "hidden",
                      background:
                        "linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)",
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      "&:hover": {
                        transform: "translateY(-8px)",
                        boxShadow: "0 12px 30px rgba(0, 0, 0, 0.15)",
                        "& .image-overlay": {
                          opacity: 1,
                        },
                        "& .action-buttons": {
                          transform: "translateY(0)",
                          opacity: 1,
                        },
                      },
                    }}
                  >
                    {/* Image Container */}
                    <Box
                      sx={{
                        width: "100%",
                        height: "100px",
                        position: "relative",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background:
                          "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
                        overflow: "hidden",
                      }}
                    >
                      {/* Actual Image */}
                      <img
                        src={preview.previewUrl}
                        alt={preview.file.name}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          transition: "transform 0.3s ease",
                        }}
                        onLoad={() => {
                          console.log(`✅ Image loaded: ${preview.file.name}`);
                        }}
                        onError={(e) => {
                          console.error(
                            `❌ Image failed: ${preview.file.name}`,
                            e
                          );
                        }}
                      />

                      {/* Hover Overlay */}
                      <Box
                        className="image-overlay"
                        sx={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background:
                            "linear-gradient(135deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.6) 100%)",
                          opacity: 0,
                          transition: "opacity 0.3s ease",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      />

                      {/* Action Buttons */}
                      <Box
                        className="action-buttons"
                        sx={{
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%, -50%) translateY(10px)",
                          display: "flex",
                          gap: 1,
                          opacity: 0,
                          transition: "all 0.3s ease",
                        }}
                      >
                        <IconButton
                          size="large"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(preview.previewUrl, "_blank");
                          }}
                          sx={{
                            backgroundColor: "rgba(255, 255, 255, 0.95)",
                            color: "primary.main",
                            "&:hover": {
                              backgroundColor: "white",
                              transform: "scale(1.1)",
                            },
                          }}
                        >
                          <Visibility />
                        </IconButton>
                        <IconButton
                          size="large"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFile(preview.id);
                          }}
                          sx={{
                            backgroundColor: "rgba(255, 255, 255, 0.95)",
                            color: "error.main",
                            "&:hover": {
                              backgroundColor: "white",
                              transform: "scale(1.1)",
                            },
                          }}
                        >
                          <Delete />
                        </IconButton>
                      </Box>

                      {/* File Index Badge */}
                      <Box
                        sx={{
                          position: "absolute",
                          top: 12,
                          left: 12,
                          backgroundColor: "rgba(25, 118, 210, 0.9)",
                          color: "white",
                          borderRadius: "50%",
                          width: 32,
                          height: 32,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: "bold",
                          fontSize: "0.875rem",
                          boxShadow: "0 2px 8px rgba(25, 118, 210, 0.3)",
                        }}
                      >
                        N{index + 1}
                      </Box>
                    </Box>

                    {/* File Info Section */}
                    <Box sx={{ p: 2.5 }}>
                      <Typography
                        variant="body2"
                        fontWeight="600"
                        noWrap
                        sx={{
                          mb: 1.5,
                          color: "text.primary",
                          fontSize: "0.875rem",
                        }}
                      >
                        {preview.file.name}
                      </Typography>

                      <Box
                        sx={{
                          display: "flex",
                          gap: 1,
                          flexWrap: "wrap",
                          alignItems: "center",
                        }}
                      >
                        <Chip
                          label={preview.file.type.split("/")[1].toUpperCase()}
                          size="small"
                          color="primary"
                          variant="outlined"
                          sx={{
                            fontWeight: 600,
                            fontSize: "0.7rem",
                            height: 24,
                          }}
                        />
                        <Chip
                          label={`${(preview.file.size / 1024 / 1024).toFixed(
                            1
                          )}MB`}
                          size="small"
                          color="secondary"
                          variant="outlined"
                          sx={{
                            fontWeight: 600,
                            fontSize: "0.7rem",
                            height: 24,
                          }}
                        />
                        <Chip
                          label="NEW"
                          size="small"
                          color="success"
                          variant="filled"
                          sx={{
                            fontWeight: 600,
                            fontSize: "0.7rem",
                            height: 24,
                          }}
                        />
                      </Box>
                    </Box>
                  </Paper>
                </Grow>
              ))}
            </Box>
          </Box>
        </Fade>
      )}

      {/* Optional Debug Panel - Collapsible */}
      {process.env.NODE_ENV === "development" && (
        <Fade in={true} timeout={1200}>
          <Box sx={{ mt: 3 }}>
            <details>
              <summary
                style={{
                  cursor: "pointer",
                  padding: "8px 12px",
                  backgroundColor: "#f8f9fa",
                  border: "1px solid #e9ecef",
                  borderRadius: "6px",
                  marginBottom: "8px",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  color: "#6c757d",
                }}
              >
                🔧 Debug Info ({previewFiles.length} new,{" "}
                {existingImages.length} existing)
              </summary>
              <Box
                sx={{
                  p: 2,
                  backgroundColor: "#f8f9fa",
                  borderRadius: 2,
                  border: "1px solid #e9ecef",
                  fontFamily: "monospace",
                  fontSize: "0.75rem",
                }}
              >
                {/* Existing Images Debug */}
                {existingImages.length > 0 && (
                  <Box sx={{ mb: 2 }}>
                    <Typography
                      variant="caption"
                      sx={{ fontWeight: "bold", color: "#1976d2" }}
                    >
                      EXISTING IMAGES:
                    </Typography>
                    {existingImages.map((url, i) => (
                      <Box key={i} sx={{ mb: 1, color: "#495057" }}>
                        <strong>Existing {i + 1}:</strong>{" "}
                        {url.substring(url.lastIndexOf("/") + 1)}
                        <br />
                        <span style={{ color: "#6c757d" }}>
                          URL: {url.substring(0, 60)}...
                        </span>
                      </Box>
                    ))}
                  </Box>
                )}

                {/* New Files Debug */}
                {previewFiles.length > 0 && (
                  <Box>
                    <Typography
                      variant="caption"
                      sx={{ fontWeight: "bold", color: "#2e7d32" }}
                    >
                      NEW FILES:
                    </Typography>
                    {previewFiles.map((p, i) => (
                      <Box key={p.id} sx={{ mb: 1, color: "#495057" }}>
                        <strong>New {i + 1}:</strong> {p.file.name}
                        <br />
                        <span style={{ color: "#6c757d" }}>
                          Type: {p.file.type} | Size:{" "}
                          {(p.file.size / 1024).toFixed(1)}KB
                          <br />
                          Preview: {p.previewUrl.substring(0, 60)}...
                        </span>
                      </Box>
                    ))}
                  </Box>
                )}

                {previewFiles.length === 0 && existingImages.length === 0 && (
                  <Typography variant="caption" color="text.secondary">
                    No files selected
                  </Typography>
                )}
              </Box>
            </details>
          </Box>
        </Fade>
      )}
    </Box>
  );
};

export default SimpleR2FilePreview;
