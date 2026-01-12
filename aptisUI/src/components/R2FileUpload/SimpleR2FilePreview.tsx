import {
  AudioFile,
  CheckCircle,
  CloudUpload,
  Delete,
  Pause,
  PhotoLibrary,
  PlayArrow,
  Visibility,
  VolumeUp,
} from "@mui/icons-material";
import {
  Alert,
  Badge,
  Box,
  Chip,
  Fade,
  Grow,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import React, { useCallback, useRef, useState } from "react";
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
  initialImageUrls?: string[]; // Đổi tên thành initialFileUrls cho phù hợp
  onRemoveExistingImage?: (url: string) => void; // Đổi tên thành onRemoveExistingFile
  acceptedFileTypes?: string[]; // Thêm prop để định nghĩa loại file
  fileTypeLabel?: string; // Thêm prop để hiển thị label
  icon?: string; // Thêm prop để hiển thị icon
}

const SimpleR2FilePreview: React.FC<SimpleR2FilePreviewProps> = ({
  onFilesChange,
  multiple = true,
  maxFiles = 2,
  initialImageUrls = [],
  onRemoveExistingImage,
  acceptedFileTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"],
  fileTypeLabel = "Image",
  icon = "📸",
}) => {
  const [previewFiles, setPreviewFiles] = useState<SimplePreviewFile[]>([]);
  const [existingFiles, setExistingFiles] =
    useState<string[]>(initialImageUrls);
  const [error, setError] = useState<string | null>(null);
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  const [audioSpeeds, setAudioSpeeds] = useState<{ [id: string]: number }>({});
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement | null }>({}); // <-- Thêm dòng này

  // Check if file type is audio
  const isAudioFile = (fileType: string) => fileType.startsWith("audio/");
  const isImageFile = (fileType: string) => fileType.startsWith("image/");

  // Helper function to get file extension from URL
  const getFileExtension = (url: string) => {
    const pathname = new URL(url).pathname;

    console.log("pathname", pathname);
    return pathname.split(".").pop()?.toLowerCase() || "";
  };

  // Helper function to determine if existing file is audio based on URL
  const isExistingFileAudio = (url: string) => {
    const extension = getFileExtension(url);
    return ["mp3", "wav", "ogg", "mp4", "m4a", "aac"].includes(extension);
  };

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
            previewFiles.length + existingFiles.length + newPreviews.length;
          if (totalCount > maxFiles) {
            setError(`Chúng tôi chỉ cần ${maxFiles} files`);
            return;
          }
          updatedPreviews = [...previewFiles, ...newPreviews];
        } else {
          // Nếu không phải multiple, xóa existing files khi thêm file mới
          if (existingFiles.length > 0) {
            existingFiles.forEach((url) => onRemoveExistingImage?.(url));
            setExistingFiles([]);
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
    [previewFiles, multiple, maxFiles, onFilesChange, existingFiles]
  );

  // Create accept object dynamically based on acceptedFileTypes
  const createAcceptObject = () => {
    const acceptObject: { [key: string]: string[] } = {};

    acceptedFileTypes.forEach((mimeType) => {
      if (mimeType === "audio/mp3" || mimeType === "audio/mpeg") {
        acceptObject["audio/mpeg"] = [".mp3"];
      } else if (mimeType === "audio/wav") {
        acceptObject["audio/wav"] = [".wav"];
      } else if (mimeType === "audio/mp4") {
        acceptObject["audio/mp4"] = [".mp4", ".m4a"];
      } else if (mimeType === "audio/x-m4a") {
        acceptObject["audio/x-m4a"] = [".m4a"];
      } else if (mimeType === "image/jpeg") {
        acceptObject["image/jpeg"] = [".jpg", ".jpeg"];
      } else if (mimeType === "image/png") {
        acceptObject["image/png"] = [".png"];
      } else if (mimeType === "image/gif") {
        acceptObject["image/gif"] = [".gif"];
      } else if (mimeType === "image/webp") {
        acceptObject["image/webp"] = [".webp"];
      }
    });

    return acceptObject;
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: createAcceptObject(),
    multiple,
    maxFiles: multiple ? maxFiles : 1,
    maxSize: 50 * 1024 * 1024, // 50MB for audio files
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

  const removeExistingFile = (url: string) => {
    const updatedFiles = existingFiles.filter((file) => file !== url);
    setExistingFiles(updatedFiles);
    onRemoveExistingImage?.(url);
  };

  // Audio playback controls
  const toggleAudioPlayback = (audioUrl: string) => {
    if (playingAudio === audioUrl) {
      setPlayingAudio(null);
    } else {
      setPlayingAudio(audioUrl);
    }
  };

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      previewFiles.forEach((preview) => {
        URL.revokeObjectURL(preview.previewUrl);
      });
    };
  }, []);

  // Update existing files when prop changes
  React.useEffect(() => {
    setExistingFiles(initialImageUrls);
  }, [initialImageUrls]);

  const getSupportedFormatsText = () => {
    if (acceptedFileTypes.some((type) => type.startsWith("audio/"))) {
      return "Supports MP3, WAV, MP4, M4A";
    }
    return "Supports JPG, PNG, GIF, WebP";
  };

  const getDropZoneIcon = () => {
    if (acceptedFileTypes.some((type) => type.startsWith("audio/"))) {
      return (
        <VolumeUp
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
      );
    }
    return (
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
    );
  };

  const getHeaderIcon = () => {
    if (acceptedFileTypes.some((type) => type.startsWith("audio/"))) {
      return <AudioFile sx={{ color: "primary.main", fontSize: 28 }} />;
    }
    return <PhotoLibrary sx={{ color: "primary.main", fontSize: 28 }} />;
  };

  const handleAudioSpeedChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
    audioId: string
  ) => {
    const speed = parseFloat(e.target.value);
    setAudioSpeeds((prev) => ({ ...prev, [audioId]: speed }));
    if (audioRefs.current[audioId]) {
      audioRefs.current[audioId]!.playbackRate = speed;
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      {/* Header Section */}
      <Fade in={true} timeout={800}>
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            {getHeaderIcon()}
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
              {fileTypeLabel} Upload
            </Typography>
            {(previewFiles.length > 0 || existingFiles.length > 0) && (
              <Badge
                badgeContent={previewFiles.length + existingFiles.length}
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
            Drag and drop your {fileTypeLabel.toLowerCase()} files or click to
            browse
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
              ? `🎯 Drop your ${fileTypeLabel.toLowerCase()} files here`
              : `${icon} Choose ${fileTypeLabel.toLowerCase()} files to preview`}
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
            {getSupportedFormatsText()} • Max {maxFiles} files • Up to 50MB each
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
      {(previewFiles.length > 0 || existingFiles.length > 0) && (
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
                {getHeaderIcon()}
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    color: "text.primary",
                  }}
                >
                  Selected {fileTypeLabel} Files
                </Typography>
                <Chip
                  label={`${previewFiles.length + existingFiles.length} ${
                    previewFiles.length + existingFiles.length === 1
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

            {/* Files Grid */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: 3,
                maxHeight: "400px",
                overflowY: "auto",
              }}
            >
              {/* Existing Files */}
              {existingFiles.map((fileUrl, index) => {
                const isAudio = isExistingFileAudio(fileUrl);
                return (
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
                        border: "2px solid #e3f2fd",
                        "&:hover": {
                          transform: "translateY(-8px)",
                          boxShadow: "0 12px 30px rgba(0, 0, 0, 0.15)",
                          "& .file-overlay": {
                            opacity: 1,
                          },
                          "& .action-buttons": {
                            transform: "translateY(0)",
                            opacity: 1,
                          },
                        },
                      }}
                    >
                      {/* File Container */}
                      <Box
                        sx={{
                          width: "100%",
                          height: "120px",
                          position: "relative",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background:
                            "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
                          overflow: "hidden",
                        }}
                      >
                        {isAudio ? (
                          // Audio Player Preview
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              justifyContent: "center",
                              width: "100%",
                              height: "100%",
                              gap: 2,
                            }}
                          >
                            <AudioFile
                              sx={{
                                fontSize: 48,
                                color: "primary.main",
                              }}
                            />
                            <audio
                              controls
                              style={{ width: "90%", height: "30px" }}
                              onPlay={() => setPlayingAudio(fileUrl)}
                              onPause={() => setPlayingAudio(null)}
                            >
                              <source src={fileUrl} />
                              Your browser does not support the audio element.
                            </audio>
                          </Box>
                        ) : (
                          // Image Preview
                          <img
                            src={fileUrl}
                            alt={`Existing file ${index + 1}`}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              transition: "transform 0.3s ease",
                            }}
                          />
                        )}

                        {/* Hover Overlay */}
                        <Box
                          className="file-overlay"
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
                              window.open(fileUrl, "_blank");
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
                              removeExistingFile(fileUrl);
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
                          Existing {fileTypeLabel} {index + 1}
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
                            label={isAudio ? "AUDIO" : "IMAGE"}
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
                );
              })}

              {/* New Preview Files */}
              {previewFiles.map((preview, index) => {
                const isAudio = isAudioFile(preview.file.type);
                return (
                  <Grow
                    key={preview.id}
                    in={true}
                    timeout={800 + (existingFiles.length + index) * 100}
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
                          "& .file-overlay": { opacity: 1 },
                          "& .action-buttons": {
                            transform: "translateY(0)",
                            opacity: 1,
                          },
                        },
                      }}
                    >
                      {/* File Container */}
                      <Box
                        sx={{
                          width: "100%",
                          height: "120px",
                          position: "relative",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background:
                            "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
                          overflow: "hidden",
                          flexDirection: "column",
                        }}
                      >
                        {isAudio ? (
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              justifyContent: "center",
                              width: "100%",
                              height: "100%",
                              gap: 2,
                            }}
                          >
                            <AudioFile
                              sx={{ fontSize: 48, color: "primary.main" }}
                            />
                            <audio
                              ref={(el) => (audioRefs.current[preview.id] = el)}
                              controls
                              style={{ width: "90%", height: "30px" }}
                              onPlay={() => setPlayingAudio(preview.previewUrl)}
                              onPause={() => setPlayingAudio(null)}
                              onLoadedMetadata={() => {
                                if (audioRefs.current[preview.id]) {
                                  audioRefs.current[preview.id]!.playbackRate =
                                    audioSpeeds[preview.id] || 1;
                                }
                              }}
                            >
                              <source src={preview.previewUrl} />
                              Your browser does not support the audio element.
                            </audio>
                          </Box>
                        ) : (
                          // Image Preview
                          <img
                            src={preview.previewUrl}
                            alt={preview.file.name}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              transition: "transform 0.3s ease",
                            }}
                          />
                        )}

                        {/* Hover Overlay */}
                        <Box
                          className="file-overlay"
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
                            justifyContent: "start",
                          }}
                        />

                        {/* Action Buttons + Audio Speed */}
                        <Box
                          className="action-buttons"
                          sx={{
                            position: "absolute",
                            top: "50%",
                            display: "flex",
                            gap: 1,
                            alignItems: "center",
                            opacity: 0,
                            transition: "all 0.3s ease",
                            background: "rgba(255,255,255,0.95)",
                            borderRadius: 2,
                            px: 1,
                            py: 0.5,
                          }}
                        >
                          <IconButton
                            size="large"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (isAudio) {
                                const audio = audioRefs.current[preview.id];
                                if (audio) {
                                  if (audio.paused) {
                                    audio.play();
                                    setPlayingAudio(preview.previewUrl);
                                  } else {
                                    audio.pause();
                                    setPlayingAudio(null);
                                  }
                                }
                              } else {
                                window.open(preview.previewUrl, "_blank");
                              }
                            }}
                            sx={{
                              color: "primary.main",
                              "&:hover": {
                                backgroundColor: "white",
                                transform: "scale(1.1)",
                              },
                            }}
                          >
                            {isAudio ? (
                              playingAudio === preview.previewUrl ? (
                                <Pause />
                              ) : (
                                <PlayArrow />
                              )
                            ) : (
                              <Visibility />
                            )}
                          </IconButton>
                          <IconButton
                            size="large"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeFile(preview.id);
                            }}
                            sx={{
                              color: "error.main",
                              "&:hover": {
                                backgroundColor: "white",
                                transform: "scale(1.1)",
                              },
                            }}
                          >
                            <Delete />
                          </IconButton>
                          {/* Audio speed select chỉ hiện với audio */}
                          {isAudio && (
                            <select
                              style={{
                                borderRadius: 4,
                                padding: "2px 8px",
                                fontWeight: 600,
                                border: "1px solid #1976d2",
                                color: "#1976d2",
                                background: "#f8fafc",
                                marginLeft: 8,
                                height: 32,
                              }}
                              value={audioSpeeds[preview.id] || 1}
                              onChange={(e) =>
                                handleAudioSpeedChange(e, preview.id)
                              }
                            >
                              <option value={1}>x1</option>
                              <option value={1.25}>x1.25</option>
                              <option value={1.5}>x1.5</option>
                              <option value={2}>x2</option>
                            </select>
                          )}
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
                            label={preview.file.type
                              .split("/")[1]
                              .toUpperCase()}
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
                );
              })}
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
                🔧 Debug Info ({previewFiles.length} new, {existingFiles.length}{" "}
                existing)
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
                {existingFiles.length > 0 && (
                  <Box sx={{ mb: 2 }}>
                    <Typography
                      variant="caption"
                      sx={{ fontWeight: "bold", color: "#1976d2" }}
                    >
                      EXISTING IMAGES:
                    </Typography>
                    {existingFiles.map((url, i) => (
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

                {previewFiles.length === 0 && existingFiles.length === 0 && (
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
