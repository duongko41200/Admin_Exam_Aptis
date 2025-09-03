import React, {
  useState,
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import {
  Box,
  Button,
  LinearProgress,
  Typography,
  Alert,
  IconButton,
  Paper,
  Chip,
  Card,
  CardContent,
  Fade,
  Grow,
  Switch,
  FormControlLabel,
  TextField,
  Divider,
  ButtonGroup,
} from "@mui/material";
import {
  CloudUpload,
  PlayArrow,
  Pause,
  Delete,
  VideoFile,
  Info,
  Schedule,
  Link as LinkIcon,
  Upload as UploadIcon,
  Speed as SpeedIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const VideoPreview = styled("video")({
  width: "100%",
  maxHeight: "250px",
  borderRadius: "12px",
  backgroundColor: "#000",
  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
});

const StyledCard = styled(Card)(({ theme }) => ({
  background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
  border: "2px dashed #e0e4e7",
  borderRadius: "16px",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  "&:hover": {
    borderColor: "#1976d2",
    transform: "translateY(-2px)",
    boxShadow: "0 8px 25px rgba(25, 118, 210, 0.15)",
  },
  "&.drag-over": {
    borderColor: "#1976d2",
    backgroundColor: "rgba(25, 118, 210, 0.05)",
  },
}));

const FileInfoBox = styled(Box)(({ theme }) => ({
  background: "linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)",
  border: "1px solid #bbdefb",
  borderRadius: "12px",
  padding: "16px",
  margin: "16px 0",
}));

const UploadMethodCard = styled(Paper)(({ theme }) => ({
  padding: "16px",
  margin: "8px 0",
  borderRadius: "12px",
  border: "2px solid transparent",
  transition: "all 0.3s ease",
  cursor: "pointer",
  "&.selected": {
    borderColor: "#1976d2",
    backgroundColor: "rgba(25, 118, 210, 0.05)",
  },
  "&:hover": {
    borderColor: "#1976d2",
    transform: "translateY(-1px)",
  },
}));

/**
 * Video Upload Component với cả server upload và direct client upload
 */
const VideoUpload = forwardRef(
  (
    {
      onFileSelected,
      onUrlChange,
      initialVideoUrl = "",
      maxSizeGB = 10,
      acceptedFormats = "video/*",
      disabled = false,
      index = 0,
    },
    ref
  ) => {
    // Existing states
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(initialVideoUrl);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [error, setError] = useState("");
    const [isPlaying, setIsPlaying] = useState(false);
    const [dragOver, setDragOver] = useState(false);
    const [fileInfo, setFileInfo] = useState(null);

    // New states for upload methods
    const [uploadMethod, setUploadMethod] = useState("server");
    const [manualUrl, setManualUrl] = useState(initialVideoUrl);
    const [directUploadUrl, setDirectUploadUrl] = useState("");
    const [showUrlInput, setShowUrlInput] = useState(false);

    const fileInputRef = useRef(null);
    const videoRef = useRef(null);
    const uploadController = useRef(null);

    // Expose methods to parent component
    useImperativeHandle(ref, () => ({
      uploadVideo: async () => {
        if (uploadMethod === "manual") {
          return manualUrl;
        }
        if (uploadMethod === "direct") {
          return directUploadUrl;
        }
        if (!file) {
          throw new Error("No file selected");
        }
        return await uploadFileViaServer();
      },
      hasFile: () => !!file || !!manualUrl || !!directUploadUrl,
      getFile: () => file,
      getFileInfo: () => fileInfo,
      getVideoUrl: () => {
        if (uploadMethod === "manual") return manualUrl;
        if (uploadMethod === "direct") return directUploadUrl;
        return preview;
      },
    }));

    useEffect(() => {
      return () => {
        // Cleanup object URLs
        if (preview && preview.startsWith("blob:")) {
          URL.revokeObjectURL(preview);
        }
      };
    }, []);

    useEffect(() => {
      if (onUrlChange) {
        const currentUrl =
          uploadMethod === "manual"
            ? manualUrl
            : uploadMethod === "direct"
            ? directUploadUrl
            : "";
        onUrlChange(currentUrl);
      }
    }, [manualUrl, directUploadUrl, uploadMethod, onUrlChange]);

    /**
     * Validate video file
     */
    const validateFile = (file) => {
      const maxSize = maxSizeGB * 1024 * 1024 * 1024; // Convert GB to bytes
      const allowedTypes = [
        "video/mp4",
        "video/avi",
        "video/mov",
        "video/wmv",
        "video/flv",
        "video/webm",
        "video/mkv",
      ];

      if (file.size > maxSize) {
        return `File size must be less than ${maxSizeGB}GB`;
      }

      if (!allowedTypes.includes(file.type)) {
        return "Please select a valid video file (MP4, AVI, MOV, WMV, FLV, WEBM, MKV)";
      }

      return null;
    };

    /**
     * Handle file selection
     */
    const handleFileSelect = (event) => {
      const selectedFile = event.target.files[0];
      if (!selectedFile) return;

      const validationError = validateFile(selectedFile);
      if (validationError) {
        setError(validationError);
        return;
      }

      setError("");
      setFile(selectedFile);

      // Create file info
      const info = {
        name: selectedFile.name,
        size: selectedFile.size,
        type: selectedFile.type,
        lastModified: selectedFile.lastModified,
      };
      setFileInfo(info);

      // Create preview URL
      if (preview && preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
      const previewUrl = URL.createObjectURL(selectedFile);
      setPreview(previewUrl);

      // Notify parent component
      if (onFileSelected) {
        onFileSelected(selectedFile, info);
      }
    };

    /**
     * Handle drag and drop
     */
    const handleDragEnter = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setDragOver(true);
    };

    const handleDragLeave = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setDragOver(false);
    };

    const handleDragOver = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const handleDrop = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setDragOver(false);

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        const file = files[0];

        const validationError = validateFile(file);
        if (validationError) {
          setError(validationError);
          return;
        }

        setError("");
        setFile(file);

        // Create file info
        const info = {
          name: file.name,
          size: file.size,
          type: file.type,
          lastModified: file.lastModified,
        };
        setFileInfo(info);

        // Create preview URL
        if (preview && preview.startsWith("blob:")) {
          URL.revokeObjectURL(preview);
        }
        const previewUrl = URL.createObjectURL(file);
        setPreview(previewUrl);

        // Notify parent component
        if (onFileSelected) {
          onFileSelected(file, info);
        }
      }
    };

    /**
     * Upload file via server (existing method)
     */
    const uploadFileViaServer = async () => {
      if (!file) {
        throw new Error("No file selected");
      }

      setUploading(true);
      setUploadProgress(0);
      setError("");

      try {
        console.log(
          `🚀 Starting server upload for ${file.name} (${(
            file.size /
            1024 /
            1024
          ).toFixed(1)}MB)`
        );

        const userId = localStorage.getItem("userId") || null;
        const fileSizeMB = file.size / 1024 / 1024;

        const compressionOptions = {
          enableCompression: fileSizeMB > 20,
          crf: fileSizeMB > 200 ? 30 : fileSizeMB > 100 ? 28 : 25,
          preset: fileSizeMB > 500 ? "fast" : "medium",
          targetCompressionRatio: fileSizeMB > 200 ? 0.3 : 0.5,
          maxWidth: 1920,
          maxHeight: 1080,
          codec: "libx264",
          audioBitrate: "96k",
        };

        const [result, error] = await VideoService.uploadVideoWithProgress(
          file,
          userId,
          compressionOptions,
          (progress) => {
            if (progress.stage === "compression") {
              setUploadProgress(Math.floor(progress.progress * 0.4));
            } else if (progress.stage === "upload") {
              setUploadProgress(40 + Math.floor(progress.progress * 0.6));
            }
          }
        );

        if (error || !result) {
          throw new Error(error?.message || "Failed to upload video");
        }

        setUploadProgress(100);
        return result.metadata.url;
      } catch (error) {
        console.error("❌ Server upload error:", error);
        setError(error.message);
        removeFile();
        throw error;
      } finally {
        setUploading(false);
      }
    };

    /**
     * Upload file directly from client to R2
     */
    const uploadFileDirectly = async () => {
      if (!file) {
        throw new Error("No file selected");
      }

      setUploading(true);
      setUploadProgress(0);
      setError("");

      try {
        console.log(
          `🚀 Starting direct upload for ${file.name} (${(
            file.size /
            1024 /
            1024
          ).toFixed(1)}MB)`
        );

        const userId = localStorage.getItem("userId") || null;

        // Step 1: Initialize direct upload
        const [initResult, initError] =
          await VideoService.initializeDirectUpload({
            fileName: file.name,
            fileSize: file.size,
            userId,
            partCount: Math.ceil(file.size / (10 * 1024 * 1024)), // 10MB parts
          });

        if (initError || !initResult) {
          throw new Error(
            initError?.message || "Failed to initialize direct upload"
          );
        }

        const { uploadId, key, presignedUrls, publicUrl } = initResult;
        console.log(`📦 Direct upload initialized: ${uploadId}`);

        // Step 2: Upload parts directly to R2
        const uploadedParts = [];
        const partSize = 10 * 1024 * 1024; // 10MB

        for (let i = 0; i < presignedUrls.length; i++) {
          const { partNumber, signedUrl } = presignedUrls[i];
          const start = (partNumber - 1) * partSize;
          const end = Math.min(start + partSize, file.size);
          const partData = file.slice(start, end);

          try {
            console.log(
              `⬆️ Uploading part ${partNumber}/${presignedUrls.length}`
            );

            const etag = await VideoService.uploadPartToR2(signedUrl, partData);
            uploadedParts.push({
              partNumber,
              etag,
            });

            // Update progress
            const progress = Math.floor(((i + 1) / presignedUrls.length) * 100);
            setUploadProgress(progress);
          } catch (partError) {
            console.error(`❌ Failed to upload part ${partNumber}:`, partError);
            throw new Error(
              `Failed to upload part ${partNumber}: ${partError.message}`
            );
          }
        }

        // Step 3: Complete multipart upload
        console.log("🔗 Completing direct multipart upload...");
        const [completeResult, completeError] =
          await VideoService.completeMultipartUpload({
            uploadId,
            key,
            parts: uploadedParts,
          });

        if (completeError || !completeResult) {
          throw new Error(
            completeError?.message || "Failed to complete direct upload"
          );
        }

        console.log(`✅ Direct upload completed: ${completeResult.url}`);
        setDirectUploadUrl(completeResult.url);
        setUploadProgress(100);

        return completeResult.url;
      } catch (error) {
        console.error("❌ Direct upload error:", error);
        setError(error.message);

        // Try to abort the upload if it was initialized
        // This would require additional error handling

        throw error;
      } finally {
        setUploading(false);
      }
    };

    /**
     * Handle upload based on selected method
     */
    const handleUpload = async () => {
      try {
        if (uploadMethod === "server") {
          return await uploadFileViaServer();
        } else if (uploadMethod === "direct") {
          return await uploadFileDirectly();
        } else {
          return manualUrl;
        }
      } catch (error) {
        console.error("Upload failed:", error);
        throw error;
      }
    };

    /**
     * Remove selected file and reset states
     */
    const removeFile = () => {
      setFile(null);
      setFileInfo(null);
      setUploadProgress(0);
      setError("");
      setDirectUploadUrl("");

      if (preview && preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
      setPreview("");

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      if (onFileSelected) {
        onFileSelected(null, null);
      }
    };

    /**
     * Handle manual URL input
     */
    const handleManualUrlChange = (event) => {
      const url = event.target.value;
      setManualUrl(url);
      setPreview(url);

      if (onUrlChange) {
        onUrlChange(url);
      }
    };

    /**
     * Toggle video play/pause
     */
    const togglePlayPause = () => {
      if (videoRef.current) {
        if (isPlaying) {
          videoRef.current.pause();
        } else {
          videoRef.current.play();
        }
        setIsPlaying(!isPlaying);
      }
    };

    /**
     * Format file size
     */
    const formatFileSize = (bytes) => {
      if (bytes === 0) return "0 Bytes";
      const k = 1024;
      const sizes = ["Bytes", "KB", "MB", "GB"];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    /**
     * Get video duration
     */
    const getVideoDuration = () => {
      if (videoRef.current) {
        const duration = videoRef.current.duration;
        if (!isNaN(duration)) {
          const minutes = Math.floor(duration / 60);
          const seconds = Math.floor(duration % 60);
          return `${minutes}:${seconds.toString().padStart(2, "0")}`;
        }
      }
      return "N/A";
    };

    return (
      <Fade in={true} timeout={800}>
        <Box sx={{ width: "100%" }}>
          {/* Error Display */}
          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
              {error}
            </Alert>
          )}

          {/* Upload Method Selection */}
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ fontWeight: 600, color: "#1976d2" }}
            >
              📤 Chọn Phương Thức Upload
            </Typography>

            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              <UploadMethodCard
                className={uploadMethod === "server" ? "selected" : ""}
                onClick={() => setUploadMethod("server")}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <UploadIcon
                    color={uploadMethod === "server" ? "primary" : "disabled"}
                  />
                  <Box>
                    <Typography variant="subtitle2" fontWeight={600}>
                      Server Upload
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Upload qua backend với nén video
                    </Typography>
                  </Box>
                </Box>
              </UploadMethodCard>

              <UploadMethodCard
                className={uploadMethod === "direct" ? "selected" : ""}
                onClick={() => setUploadMethod("direct")}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <SpeedIcon
                    color={uploadMethod === "direct" ? "primary" : "disabled"}
                  />
                  <Box>
                    <Typography variant="subtitle2" fontWeight={600}>
                      Direct Upload
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Upload trực tiếp lên R2 (nhanh hơn)
                    </Typography>
                  </Box>
                </Box>
              </UploadMethodCard>

              <UploadMethodCard
                className={uploadMethod === "manual" ? "selected" : ""}
                onClick={() => setUploadMethod("manual")}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <LinkIcon
                    color={uploadMethod === "manual" ? "primary" : "disabled"}
                  />
                  <Box>
                    <Typography variant="subtitle2" fontWeight={600}>
                      Manual URL
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Nhập URL video có sẵn
                    </Typography>
                  </Box>
                </Box>
              </UploadMethodCard>
            </Box>
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Upload Progress */}
          {uploading && (
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <Typography variant="body2" sx={{ minWidth: "100px" }}>
                  {uploadMethod === "direct"
                    ? "Direct Upload"
                    : "Server Upload"}
                  : {uploadProgress}%
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={uploadProgress}
                  sx={{
                    flex: 1,
                    ml: 2,
                    height: 8,
                    borderRadius: 4,
                    "& .MuiLinearProgress-bar": {
                      background:
                        uploadMethod === "direct"
                          ? "linear-gradient(90deg, #4caf50, #81c784)"
                          : "linear-gradient(90deg, #1976d2, #42a5f5)",
                    },
                  }}
                />
              </Box>
              <Typography variant="caption" color="text.secondary">
                {uploadMethod === "direct"
                  ? "Uploading directly to cloud storage..."
                  : "Processing and uploading video..."}
              </Typography>
            </Box>
          )}

          {/* Manual URL Input */}
          {uploadMethod === "manual" && (
            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                label="URL Video"
                placeholder="https://example.com/video.mp4"
                value={manualUrl}
                onChange={handleManualUrlChange}
                disabled={disabled || uploading}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <LinkIcon sx={{ mr: 1, color: "text.secondary" }} />
                  ),
                }}
              />
              {manualUrl && (
                <Alert severity="info" sx={{ mt: 2 }}>
                  URL đã được thiết lập: {manualUrl}
                </Alert>
              )}
            </Box>
          )}

          {/* File Selection Area for Server and Direct Upload */}
          {(uploadMethod === "server" || uploadMethod === "direct") &&
            !file && (
              <StyledCard
                className={dragOver ? "drag-over" : ""}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <CardContent sx={{ textAlign: "center", py: 4 }}>
                  <Grow in={true} timeout={1000}>
                    <Box>
                      <VideoFile
                        sx={{
                          fontSize: 64,
                          color: dragOver ? "#1976d2" : "#bdbdbd",
                          mb: 2,
                          transition: "color 0.3s ease",
                        }}
                      />
                      <Typography
                        variant="h6"
                        gutterBottom
                        sx={{ color: "#424242", fontWeight: 600 }}
                      >
                        Chọn Video Bài Học
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 3, maxWidth: 400, mx: "auto" }}
                      >
                        {uploadMethod === "direct"
                          ? "Upload trực tiếp lên R2 - nhanh hơn, không qua server"
                          : "Upload qua server với tính năng nén video tự động"}
                      </Typography>

                      <Button
                        component="label"
                        variant="contained"
                        startIcon={<CloudUpload />}
                        disabled={disabled || uploading}
                        sx={{
                          borderRadius: "12px",
                          px: 4,
                          py: 1.5,
                          textTransform: "none",
                          fontSize: "16px",
                          fontWeight: 600,
                          background:
                            uploadMethod === "direct"
                              ? "linear-gradient(135deg, #4caf50 0%, #81c784 100%)"
                              : "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
                        }}
                      >
                        Chọn File Video
                        <VisuallyHiddenInput
                          ref={fileInputRef}
                          type="file"
                          accept={acceptedFormats}
                          onChange={handleFileSelect}
                        />
                      </Button>

                      <Box
                        sx={{ mt: 3, pt: 2, borderTop: "1px solid #e0e0e0" }}
                      >
                        <Typography variant="caption" color="text.secondary">
                          Định dạng hỗ trợ: MP4, AVI, MOV, WMV, FLV, WEBM, MKV
                        </Typography>
                      </Box>
                    </Box>
                  </Grow>
                </CardContent>
              </StyledCard>
            )}

          {/* File Preview Area */}
          {file && (uploadMethod === "server" || uploadMethod === "direct") && (
            <Grow in={true} timeout={600}>
              <Box>
                {/* File Info */}
                <FileInfoBox>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <VideoFile sx={{ color: "#1976d2", mr: 2, fontSize: 32 }} />
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 600, mb: 0.5 }}
                      >
                        {fileInfo?.name}
                      </Typography>
                      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                        <Chip
                          icon={<Info />}
                          label={formatFileSize(fileInfo?.size || 0)}
                          size="small"
                          variant="outlined"
                        />
                        <Chip
                          icon={<Schedule />}
                          label={getVideoDuration()}
                          size="small"
                          variant="outlined"
                        />
                        <Chip
                          label={
                            uploadMethod === "direct"
                              ? "Direct Upload"
                              : "Server Upload"
                          }
                          size="small"
                          color={
                            uploadMethod === "direct" ? "success" : "primary"
                          }
                          variant="outlined"
                        />
                      </Box>
                    </Box>
                    <IconButton
                      onClick={removeFile}
                      disabled={uploading}
                      sx={{
                        color: "error.main",
                        "&:hover": {
                          backgroundColor: "rgba(244, 67, 54, 0.1)",
                        },
                      }}
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                </FileInfoBox>

                {/* Video Preview */}
                {preview && (
                  <Paper
                    elevation={3}
                    sx={{
                      borderRadius: "16px",
                      overflow: "hidden",
                      position: "relative",
                      mb: 2,
                    }}
                  >
                    <VideoPreview
                      ref={videoRef}
                      src={preview}
                      controls
                      onPlay={() => setIsPlaying(true)}
                      onPause={() => setIsPlaying(false)}
                      onLoadedMetadata={() => {
                        setFileInfo((prev) => ({ ...prev }));
                      }}
                    />
                  </Paper>
                )}

                {/* Upload Result URL Display */}
                {directUploadUrl && uploadMethod === "direct" && (
                  <Alert severity="success" sx={{ mt: 2 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                      ✅ Direct Upload Completed!
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      label="Video URL"
                      value={directUploadUrl}
                      InputProps={{
                        readOnly: true,
                        sx: { fontSize: "12px" },
                      }}
                      sx={{ mt: 1 }}
                    />
                  </Alert>
                )}

                {/* Status Messages */}
                {uploading && (
                  <Alert severity="info" sx={{ mt: 2 }}>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {uploadMethod === "direct"
                          ? "Đang upload trực tiếp lên R2..."
                          : "Đang upload qua server..."}
                      </Typography>
                      <Typography variant="caption">
                        {uploadMethod === "direct"
                          ? "Upload sẽ nhanh hơn vì không qua server backend"
                          : "Video sẽ được nén tự động để tối ưu dung lượng"}
                      </Typography>
                    </Box>
                  </Alert>
                )}

                {!uploading && !directUploadUrl && (
                  <Alert severity="success" sx={{ mt: 2 }}>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        Video đã sẵn sàng!
                      </Typography>
                      <Typography variant="caption">
                        {uploadMethod === "direct"
                          ? "Video sẽ được upload trực tiếp lên R2 khi tạo bài học"
                          : "Video sẽ được upload qua server khi tạo bài học"}
                      </Typography>
                    </Box>
                  </Alert>
                )}
              </Box>
            </Grow>
          )}

          {/* Manual URL Preview */}
          {uploadMethod === "manual" && manualUrl && (
            <Paper
              elevation={3}
              sx={{
                borderRadius: "16px",
                overflow: "hidden",
                position: "relative",
                mb: 2,
              }}
            >
              <VideoPreview
                src={manualUrl}
                controls
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />
            </Paper>
          )}
        </Box>
      </Fade>
    );
  }
);

export default VideoUpload;
