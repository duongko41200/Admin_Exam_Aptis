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
} from "@mui/material";
import {
  CloudUpload,
  PlayArrow,
  Pause,
  Delete,
  VideoFile,
  Info,
  Schedule,
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

// Import video service
import VideoService from "../../services/API/video.service";

// Types
interface VideoUploadProps {
  onFileSelected?: (file: File | null, fileInfo: any) => void;
  initialVideoUrl?: string;
  maxSizeGB?: number;
  acceptedFormats?: string;
  disabled?: boolean;
  index?: number;
}

interface VideoUploadRef {
  uploadVideo: () => Promise<string>;
  hasFile: () => boolean;
  getFile: () => File | null;
  getFileInfo: () => any;
}

/**
 * Video Upload Component với multipart upload
 * Chỉ preview và chuẩn bị file, upload khi parent component gọi
 */
const VideoUpload = forwardRef<VideoUploadRef, VideoUploadProps>(
  (
    {
      onFileSelected,
      initialVideoUrl = "",
      maxSizeGB = 10,
      acceptedFormats = "video/*",
      disabled = false,
      index = 0,
    },
    ref
  ) => {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(initialVideoUrl);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [error, setError] = useState("");
    const [isPlaying, setIsPlaying] = useState(false);
    const [dragOver, setDragOver] = useState(false);
    const [fileInfo, setFileInfo] = useState(null);

    const fileInputRef = useRef(null);
    const videoRef = useRef(null);
    const uploadController = useRef(null);

    // Expose upload function to parent component
    useImperativeHandle(ref, () => ({
      uploadVideo: async () => {
        if (!file) {
          throw new Error("No file selected");
        }
        return await uploadFile();
      },
      hasFile: () => !!file,
      getFile: () => file,
      getFileInfo: () => fileInfo,
    }));

    useEffect(() => {
      return () => {
        // Cleanup object URLs
        if (preview && preview.startsWith("blob:")) {
          URL.revokeObjectURL(preview);
        }
      };
    }, []);

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
     * Upload file with optimization (compression + multipart)
     */
    const uploadFile = async () => {
      if (!file) {
        throw new Error("No file selected");
      }

      setUploading(true);
      setUploadProgress(0);
      setError("");

      try {
        console.log(
          `🚀 Starting optimized upload for ${file.name} (${(
            file.size /
            1024 /
            1024
          ).toFixed(1)}MB)`
        );

        const userId = localStorage.getItem("userId") || null;
        const fileSizeMB = file.size / 1024 / 1024;

        // ✅ Enhanced compression settings based on file size
        const compressionOptions = {
          enableCompression: fileSizeMB > 20, // Enable for files > 20MB
          crf: fileSizeMB > 200 ? 30 : fileSizeMB > 100 ? 28 : 25, // More aggressive for larger files
          preset: fileSizeMB > 500 ? "fast" : "medium",
          targetCompressionRatio: fileSizeMB > 200 ? 0.3 : 0.5, // ✅ 30% target for large files
          maxWidth: 1920,
          maxHeight: 1080,
          codec: "libx264", // Could be libx265 if supported
          audioBitrate: "96k", // Lower audio bitrate
        };

        console.log(`📊 Compression settings:`, compressionOptions);
        console.log(
          `🎯 Expected size reduction: ${fileSizeMB.toFixed(1)}MB → ${(
            fileSizeMB * compressionOptions.targetCompressionRatio
          ).toFixed(1)}MB`
        );

        // Upload with enhanced settings
        const [result, error] = await VideoService.uploadVideoWithProgress(
          file,
          userId,
          compressionOptions,
          (progress) => {
            console.log(`Progress update:`, progress);

            if (progress.stage === "compression") {
              setUploadProgress(Math.floor(progress.progress * 0.4)); // Compression = 40% of total
            } else if (progress.stage === "upload") {
              setUploadProgress(40 + Math.floor(progress.progress * 0.6)); // Upload = 60% of total
            }
          }
        );

        if (error || !result) {
          throw new Error(error?.message || "Failed to upload video");
        }

        console.log(`✅ Upload completed successfully:`, result);
        setUploadProgress(100);

        // ✅ Show enhanced performance stats
        if (result.metadata?.compressionStats) {
          const { compressionStats } = result.metadata;
          console.log(`📈 Compression Performance:
        - Original: ${(compressionStats.originalSize / 1024 / 1024).toFixed(
          1
        )}MB
        - Final: ${(compressionStats.compressedSize / 1024 / 1024).toFixed(1)}MB
        - Reduction: ${
          compressionStats.actualCompressionPercent?.toFixed(1) ||
          (compressionStats.compressionRatio * 100).toFixed(1)
        }%
        - Time: ${(compressionStats.compressionTime / 1000).toFixed(1)}s`);
        }

        return result.metadata.url;
      } catch (error) {
        console.error("❌ Upload error:", error);
        setError(error.message);
        throw error;
      } finally {
        setUploading(false);
      }
    };

    /**
     * Remove selected file
     */
    const removeFile = () => {
      setFile(null);
      setFileInfo(null);
      setUploadProgress(0);
      setError("");

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

          {/* Upload Progress */}
          {uploading && (
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <Typography variant="body2" sx={{ minWidth: "100px" }}>
                  Uploading: {uploadProgress}%
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
                      background: "linear-gradient(90deg, #1976d2, #42a5f5)",
                    },
                  }}
                />
              </Box>
              <Typography variant="caption" color="text.secondary">
                Uploading video to cloud storage...
              </Typography>
            </Box>
          )}

          {/* File Selection Area */}
          {!file && (
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
                      Kéo thả file video vào đây hoặc click để chọn file. Hỗ trợ
                      file lên đến {maxSizeGB}GB
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

                    <Box sx={{ mt: 3, pt: 2, borderTop: "1px solid #e0e0e0" }}>
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
          {file && (
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
                          label={fileInfo?.type || "Unknown"}
                          size="small"
                          color="primary"
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
                        // Force re-render to update duration
                        setFileInfo((prev) => ({ ...prev }));
                      }}
                    />
                  </Paper>
                )}

                {/* Status Messages */}
                {uploading && (
                  <Alert severity="info" sx={{ mt: 2 }}>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        Đang upload video...
                      </Typography>
                      <Typography variant="caption">
                        Video sẽ được upload khi bạn nhấn "Tạo Bài Học"
                      </Typography>
                    </Box>
                  </Alert>
                )}

                {!uploading && (
                  <Alert severity="success" sx={{ mt: 2 }}>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        Video đã sẵn sàng!
                      </Typography>
                      <Typography variant="caption">
                        Video sẽ được upload khi bạn nhấn "Tạo Bài Học"
                      </Typography>
                    </Box>
                  </Alert>
                )}
              </Box>
            </Grow>
          )}
        </Box>
      </Fade>
    );
  }
);

export default VideoUpload;
