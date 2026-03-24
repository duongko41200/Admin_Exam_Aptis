import {
  CloudUpload,
  Delete,
  Info,
  Link as LinkIcon,
  Schedule,
  Speed as SpeedIcon,
  VideoFile,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grow,
  IconButton,
  LinearProgress,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import Fade from "@mui/material/Fade";
import { styled } from "@mui/material/styles";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import R2Service from "../../services/API/r2.service";

interface VideoUploadProps {
  onFileSelected?: (file: File | null, fileInfo: any) => void;
  onUrlChange?: (url: string) => void;
  initialVideoUrl?: string;
  existingR2Key?: string;
  maxSizeGB?: number;
  acceptedFormats?: string;
  disabled?: boolean;
  index?: number;
}

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
 * Video Upload Component – Hỗ trợ Manual URL và Direct Upload lên R2
 */
const VideoUpload = forwardRef<any, VideoUploadProps>(
  (
    {
      onFileSelected,
      onUrlChange,
      initialVideoUrl = "",
      existingR2Key = "",
      maxSizeGB = 10,
      acceptedFormats = "video/*",
      disabled = false,
      index = 0,
    },
    ref
  ) => {
    // File states
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(initialVideoUrl);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [error, setError] = useState("");
    const [isPlaying, setIsPlaying] = useState(false);
    const [dragOver, setDragOver] = useState(false);
    const [fileInfo, setFileInfo] = useState(null);

    // Upload method: "direct" (R2) hoặc "manual" (nhập URL)
    const [uploadMethod, setUploadMethod] = useState<"direct" | "manual">(
      initialVideoUrl ? "manual" : "direct"
    );
    const [manualUrl, setManualUrl] = useState(initialVideoUrl);
    const [directUploadUrl, setDirectUploadUrl] = useState("");
    const [r2FileKey, setR2FileKey] = useState(existingR2Key);
    const [uploadStage, setUploadStage] = useState("");
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const fileInputRef = useRef(null);
    const videoRef = useRef(null);

    // Sync initialVideoUrl khi record thay đổi
    useEffect(() => {
      if (initialVideoUrl) {
        setPreview(initialVideoUrl);
        setManualUrl(initialVideoUrl);
      }
    }, [initialVideoUrl]);

    // Sync existingR2Key
    useEffect(() => {
      if (existingR2Key) {
        setR2FileKey(existingR2Key);
      }
    }, [existingR2Key]);

    // Expose methods to parent component
    useImperativeHandle(ref, () => ({
      uploadVideo: async () => {
        if (uploadMethod === "manual") {
          return manualUrl;
        }
        // Direct upload to R2
        if (!file) {
          // Nếu không có file mới nhưng đã có URL (từ upload trước hoặc initialVideoUrl)
          if (directUploadUrl) return directUploadUrl;
          if (initialVideoUrl) return initialVideoUrl;
          throw new Error("No file selected");
        }
        return await uploadFileToR2();
      },
      hasFile: () => !!file || !!manualUrl || !!directUploadUrl || !!initialVideoUrl,
      getFile: () => file,
      getFileInfo: () => fileInfo,
      getVideoUrl: () => {
        if (uploadMethod === "manual") return manualUrl;
        return directUploadUrl || initialVideoUrl || preview;
      },
    }));

    useEffect(() => {
      return () => {
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
            : directUploadUrl || "";
        onUrlChange(currentUrl);
      }
    }, [manualUrl, directUploadUrl, uploadMethod, onUrlChange]);

    /**
     * Validate video file
     */
    const validateFile = (file) => {
      const maxSize = maxSizeGB * 1024 * 1024 * 1024;
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

      const info = {
        name: selectedFile.name,
        size: selectedFile.size,
        type: selectedFile.type,
        lastModified: selectedFile.lastModified,
      };
      setFileInfo(info);

      if (preview && preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
      const previewUrl = URL.createObjectURL(selectedFile);
      setPreview(previewUrl);

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
        const droppedFile = files[0];

        const validationError = validateFile(droppedFile);
        if (validationError) {
          setError(validationError);
          return;
        }

        setError("");
        setFile(droppedFile);

        const info = {
          name: droppedFile.name,
          size: droppedFile.size,
          type: droppedFile.type,
          lastModified: droppedFile.lastModified,
        };
        setFileInfo(info);

        if (preview && preview.startsWith("blob:")) {
          URL.revokeObjectURL(preview);
        }
        const previewUrl = URL.createObjectURL(droppedFile);
        setPreview(previewUrl);

        if (onFileSelected) {
          onFileSelected(droppedFile, info);
        }
      }
    };

    /**
     * Upload file trực tiếp lên R2 (Direct Upload)
     * Nếu có video cũ (r2FileKey) → xoá trước khi upload mới
     */
    const uploadFileToR2 = async () => {
      if (!file) {
        throw new Error("No file selected");
      }

      setUploading(true);
      setUploadProgress(0);
      setError("");
      setUploadStage("Đang chuẩn bị upload...");

      try {
        console.log(
          `🚀 Starting R2 direct upload for ${file.name} (${(
            file.size /
            1024 /
            1024
          ).toFixed(1)}MB)`
        );

        // Xoá video cũ trên R2 trước khi upload mới
        if (r2FileKey) {
          try {
            console.log("🗑️ Deleting old video from R2:", r2FileKey);
            setUploadStage("Đang xoá video cũ trên R2...");
            const [deleteSuccess, deleteError] = await R2Service.deleteFile(
              r2FileKey
            );

            if (deleteError) {
              console.error("❌ Failed to delete old video from R2:", deleteError);
              // Tiếp tục upload mới dù xoá cũ thất bại
            } else {
              console.log("✅ Old video deleted from R2 successfully");
            }
          } catch (deleteErr) {
            console.error("❌ Error deleting old video:", deleteErr);
          }
        }

        const userId = localStorage.getItem("userId") || null;

        const onProgress = (progressInfo) => {
          setUploadProgress(progressInfo.percent);
          setUploadStage(`Đang upload... ${progressInfo.percent}%`);
        };

        setUploadStage("Đang upload lên R2...");
        const [uploadResult, uploadError] = await R2Service.directUpload(
          file,
          onProgress,
          userId
        );

        if (uploadError || !uploadResult) {
          console.error("❌ R2 upload error:", uploadError);
          throw new Error(uploadError?.message || "Upload failed");
        }

        const { publicUrl, key } = uploadResult;
        console.log(`✅ R2 upload completed:`, { publicUrl, key });

        setDirectUploadUrl(publicUrl);
        setR2FileKey(key);
        setPreview(publicUrl);
        setUploadProgress(100);
        setUploadStage("Hoàn thành!");

        return publicUrl;
      } catch (uploadErr) {
        console.error("❌ R2 upload error:", uploadErr);
        setError(`Upload failed: ${uploadErr.message}`);
        setUploadStage("Lỗi upload!");
        throw uploadErr;
      } finally {
        setUploading(false);
        setTimeout(() => setUploadStage(""), 3000);
      }
    };

    /**
     * Show delete confirmation dialog
     */
    const showDeleteConfirmation = () => {
      setShowDeleteDialog(true);
    };

    const handleDeleteConfirm = async () => {
      setShowDeleteDialog(false);
      await removeFile();
    };

    const handleDeleteCancel = () => {
      setShowDeleteDialog(false);
    };

    /**
     * Remove selected file and reset states
     * Xoá file từ R2 nếu đã upload
     */
    const removeFile = async () => {
      if (r2FileKey) {
        try {
          console.log("🗑️ Deleting file from R2:", r2FileKey);
          const [deleteSuccess, deleteError] = await R2Service.deleteFile(
            r2FileKey
          );

          if (deleteError) {
            console.error("❌ Failed to delete file from R2:", deleteError);
            setError(
              `Cảnh báo: Không thể xóa file trên R2. ${deleteError.message}`
            );
          } else {
            console.log("✅ File deleted from R2 successfully");
          }
        } catch (delErr) {
          console.error("❌ Error deleting file from R2:", delErr);
          setError(`Cảnh báo: Lỗi khi xóa file trên R2. ${delErr.message}`);
        }
      }

      setFile(null);
      setFileInfo(null);
      setUploadProgress(0);
      setError("");
      setDirectUploadUrl("");
      setR2FileKey("");
      setUploadStage("");

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
      <Fade in={true} timeout={500}>
        <Box sx={{ width: "100%" }}>
          {/* Error Display */}
          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
              {error}
            </Alert>
          )}

          {/* Upload Method Selection – chỉ Manual URL và Direct Upload (R2) */}
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
                className={uploadMethod === "direct" ? "selected" : ""}
                onClick={() => setUploadMethod("direct")}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <SpeedIcon
                    color={uploadMethod === "direct" ? "primary" : "disabled"}
                  />
                  <Box>
                    <Typography variant="subtitle2" fontWeight={600}>
                      Upload lên R2
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Upload trực tiếp lên R2 Cloud Storage
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
                <Typography variant="body2" sx={{ minWidth: "120px" }}>
                  R2 Upload: {uploadProgress}%
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
                        "linear-gradient(90deg, #4caf50, #81c784)",
                    },
                  }}
                />
              </Box>

              {uploadStage && (
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
                >
                  <CircularProgress size={16} />
                  <Typography
                    variant="caption"
                    color="primary.main"
                    sx={{ fontWeight: 600 }}
                  >
                    {uploadStage}
                  </Typography>
                </Box>
              )}

              <Typography variant="caption" color="text.secondary">
                Đang upload trực tiếp lên R2 Cloud Storage...
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

          {/* Direct Upload – URL display sau khi upload */}
          {uploadMethod === "direct" && directUploadUrl && (
            <Box sx={{ mb: 3 }}>
              <Alert severity="success">
                ✅ Upload hoàn thành! Video URL: {directUploadUrl}
              </Alert>
            </Box>
          )}

          {/* File Selection Area – chỉ cho Direct Upload */}
          {uploadMethod === "direct" && !file && (
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
                      Chọn file và upload trực tiếp lên R2 Cloud Storage
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
                          "linear-gradient(135deg, #4caf50 0%, #81c784 100%)",
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

          {/* File Preview Area – cho Direct Upload khi đã chọn file */}
          {file && uploadMethod === "direct" && (
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
                          label="R2 Upload"
                          size="small"
                          color="success"
                          variant="outlined"
                        />
                      </Box>
                    </Box>
                    <IconButton
                      onClick={showDeleteConfirmation}
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

                {/* Upload Button */}
                {!directUploadUrl && !uploading && (
                  <Button
                    variant="contained"
                    startIcon={<CloudUpload />}
                    onClick={uploadFileToR2}
                    disabled={disabled || uploading}
                    sx={{
                      borderRadius: "12px",
                      px: 4,
                      py: 1.5,
                      textTransform: "none",
                      fontSize: "16px",
                      fontWeight: 600,
                      background:
                        "linear-gradient(135deg, #4caf50 0%, #81c784 100%)",
                      "&:hover": {
                        background:
                          "linear-gradient(135deg, #43a047 0%, #66bb6a 100%)",
                      },
                    }}
                  >
                    Upload Video lên R2
                  </Button>
                )}

                {/* Status Messages */}
                {uploading && (
                  <Alert severity="info" sx={{ mt: 2 }}>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        Đang upload trực tiếp lên R2...
                      </Typography>
                      <Typography variant="caption">
                        Upload sẽ nhanh vì gửi trực tiếp lên Cloud Storage
                      </Typography>
                    </Box>
                  </Alert>
                )}

                {!uploading && directUploadUrl && (
                  <Alert severity="success" sx={{ mt: 2 }}>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        ✅ Upload Hoàn Thành!
                      </Typography>
                      <Typography variant="caption">
                        Video đã được upload lên R2 thành công
                      </Typography>
                    </Box>
                  </Alert>
                )}

                {!uploading && !directUploadUrl && file && (
                  <Alert severity="warning" sx={{ mt: 2 }}>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        File đã chọn - Sẵn sàng upload
                      </Typography>
                      <Typography variant="caption">
                        Nhấn nút "Upload Video lên R2" để bắt đầu upload
                      </Typography>
                    </Box>
                  </Alert>
                )}
              </Box>
            </Grow>
          )}

          {/* Video Preview cho Manual URL hoặc initialVideoUrl */}
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

          {/* Video Preview cho video đã lưu khi chưa chọn file mới (Direct mode) */}
          {uploadMethod === "direct" && !file && initialVideoUrl && (
            <Box sx={{ mb: 2 }}>
              <Alert severity="info" sx={{ mb: 2 }}>
                Video hiện tại đã được lưu. Chọn file mới để thay thế.
              </Alert>
              <Paper
                elevation={3}
                sx={{
                  borderRadius: "16px",
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                <VideoPreview
                  src={initialVideoUrl}
                  controls
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                />
              </Paper>
            </Box>
          )}

          {/* Delete Confirmation Dialog */}
          <Dialog
            open={showDeleteDialog}
            onClose={handleDeleteCancel}
            aria-labelledby="delete-dialog-title"
            aria-describedby="delete-dialog-description"
          >
            <DialogTitle id="delete-dialog-title">
              🗑️ Xác nhận xóa file
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="delete-dialog-description">
                {r2FileKey ? (
                  <>
                    Bạn có chắc chắn muốn xóa file này không?
                    <br />
                    <strong>⚠️ Lưu ý:</strong> File này đã được upload lên R2
                    Cloud Storage và sẽ bị xóa vĩnh viễn khỏi server.
                    <br />
                    <br />
                    <strong>File:</strong> {fileInfo?.name}
                    <br />
                    <strong>Kích thước:</strong>{" "}
                    {formatFileSize(fileInfo?.size || 0)}
                  </>
                ) : (
                  <>
                    Bạn có chắc chắn muốn xóa file này không?
                    <br />
                    <strong>File:</strong> {fileInfo?.name}
                    <br />
                    <strong>Kích thước:</strong>{" "}
                    {formatFileSize(fileInfo?.size || 0)}
                  </>
                )}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDeleteCancel} color="primary">
                Hủy
              </Button>
              <Button
                onClick={handleDeleteConfirm}
                color="error"
                variant="contained"
                startIcon={<Delete />}
              >
                {r2FileKey ? "Xóa khỏi R2 & Local" : "Xóa file"}
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Fade>
    );
  }
);

export default VideoUpload;
