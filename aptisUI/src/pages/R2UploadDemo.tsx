import React, { useState } from "react";
import { Box, Button, Typography, Paper, Divider } from "@mui/material";
import { R2FilePreview } from "../components/R2FileUpload";
import r2UploadHelper from "../services/API/r2UploadHelper.service";

const R2UploadDemo: React.FC = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewImageUrls, setPreviewImageUrls] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResults, setUploadResults] = useState<any>(null);

  const handleSubmit = async () => {
    if (selectedFiles.length === 0) {
      alert("Please select files first!");
      return;
    }

    try {
      setIsUploading(true);
      console.log("🚀 Starting upload process...");
      console.log(
        "📁 Selected files:",
        selectedFiles.map((f) => f.name)
      );

      const results = await r2UploadHelper.uploadMultipleFiles(
        selectedFiles,
        "general"
      );

      console.log("✅ Upload completed:", results);
      setUploadResults(results);

      // Reset after successful upload
      setSelectedFiles([]);
      setPreviewImageUrls([]);
    } catch (error) {
      console.error("❌ Upload failed:", error);
      alert("Upload failed: " + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleReset = () => {
    setSelectedFiles([]);
    setPreviewImageUrls([]);
    setUploadResults(null);
  };

  return (
    <Box sx={{ maxWidth: 800, margin: "0 auto", padding: 3 }}>
      <Typography variant="h4" gutterBottom align="center">
        🚀 R2 File Upload Demo
      </Typography>

      <Typography
        variant="body1"
        color="text.secondary"
        align="center"
        sx={{ mb: 3 }}
      >
        Drag & drop images to preview them. Click submit to upload to Cloudflare
        R2.
      </Typography>

      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          📸 Preview Mode Upload
        </Typography>

        <R2FilePreview
          fileType="general"
          multiple={true}
          maxFiles={5}
          maxSize={50 * 1024 * 1024} // 50MB
          onFilesChange={(files) => {
            console.log(
              "📝 Files changed:",
              files.map((f) => f.name)
            );
            setSelectedFiles(files);
          }}
          onPreviewUrlsChange={(urls) => {
            console.log("🖼️ Preview URLs updated:", urls);
            setPreviewImageUrls(urls);
          }}
        />

        <Box sx={{ mt: 3, display: "flex", gap: 2, justifyContent: "center" }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={isUploading || selectedFiles.length === 0}
            size="large"
          >
            {isUploading
              ? "📤 Uploading..."
              : `🚀 Upload ${selectedFiles.length} files`}
          </Button>

          <Button
            variant="outlined"
            color="secondary"
            onClick={handleReset}
            disabled={isUploading}
            size="large"
          >
            🔄 Reset
          </Button>
        </Box>
      </Paper>

      {/* Upload Status */}
      <Paper elevation={2} sx={{ p: 2, mb: 2, backgroundColor: "#f5f5f5" }}>
        <Typography variant="h6" gutterBottom>
          📊 Current Status
        </Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 2,
          }}
        >
          <Box>
            <Typography variant="subtitle2" color="primary">
              Selected Files:
            </Typography>
            <Typography variant="body2">
              {selectedFiles.length} files (
              {(
                selectedFiles.reduce((acc, f) => acc + f.size, 0) /
                1024 /
                1024
              ).toFixed(2)}{" "}
              MB)
            </Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="secondary">
              Preview URLs:
            </Typography>
            <Typography variant="body2">
              {previewImageUrls.length} previews generated
            </Typography>
          </Box>
          <Box>
            <Typography
              variant="subtitle2"
              color={isUploading ? "warning.main" : "success.main"}
            >
              Upload Status:
            </Typography>
            <Typography variant="body2">
              {isUploading ? "⏳ Uploading..." : "✅ Ready"}
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* File List */}
      {selectedFiles.length > 0 && (
        <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            📋 Selected Files
          </Typography>
          {selectedFiles.map((file, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                py: 1,
                borderBottom:
                  index < selectedFiles.length - 1 ? "1px solid #eee" : "none",
              }}
            >
              <Typography variant="body2">📄 {file.name}</Typography>
              <Typography variant="caption" color="text.secondary">
                {(file.size / 1024 / 1024).toFixed(2)} MB | {file.type}
              </Typography>
            </Box>
          ))}
        </Paper>
      )}

      {/* Upload Results */}
      {uploadResults && (
        <Paper
          elevation={2}
          sx={{
            p: 2,
            backgroundColor: uploadResults.success ? "#e8f5e8" : "#ffebee",
          }}
        >
          <Typography
            variant="h6"
            gutterBottom
            color={uploadResults.success ? "success.main" : "error.main"}
          >
            {uploadResults.success ? "✅ Upload Success!" : "❌ Upload Failed"}
          </Typography>

          {uploadResults.successful && uploadResults.successful.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                ✅ Successfully uploaded ({uploadResults.successful.length}):
              </Typography>
              {uploadResults.successful.map((result: any, index: number) => (
                <Box key={index} sx={{ ml: 2, mb: 1 }}>
                  <Typography variant="body2">
                    📁 <strong>{result.originalName}</strong>
                  </Typography>
                  <Typography
                    variant="caption"
                    color="primary"
                    sx={{ wordBreak: "break-all" }}
                  >
                    🔗 {result.url}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}

          {uploadResults.failed && uploadResults.failed.length > 0 && (
            <Box>
              <Typography variant="subtitle2" gutterBottom color="error">
                ❌ Failed uploads ({uploadResults.failed.length}):
              </Typography>
              {uploadResults.failed.map((error: string, index: number) => (
                <Typography
                  key={index}
                  variant="body2"
                  color="error"
                  sx={{ ml: 2 }}
                >
                  • {error}
                </Typography>
              ))}
            </Box>
          )}

          <Divider sx={{ my: 2 }} />

          <Typography variant="caption" color="text.secondary">
            📊 Total: {uploadResults.total} files | ✅ Success:{" "}
            {uploadResults.successful?.length || 0} | ❌ Failed:{" "}
            {uploadResults.failed?.length || 0}
          </Typography>
        </Paper>
      )}

      {/* Debug Info */}
      <Paper elevation={1} sx={{ p: 2, backgroundColor: "#f9f9f9" }}>
        <Typography variant="h6" gutterBottom>
          🐛 Debug Info
        </Typography>
        <Typography
          variant="caption"
          component="pre"
          sx={{
            display: "block",
            backgroundColor: "#f5f5f5",
            p: 1,
            borderRadius: 1,
            overflow: "auto",
            fontSize: "11px",
          }}
        >
          {JSON.stringify(
            {
              selectedFilesCount: selectedFiles.length,
              previewUrlsCount: previewImageUrls.length,
              isUploading,
              hasUploadResults: !!uploadResults,
              fileTypes: selectedFiles.map((f) => f.type),
              fileSizes: selectedFiles.map(
                (f) => `${(f.size / 1024).toFixed(1)}KB`
              ),
            },
            null,
            2
          )}
        </Typography>
      </Paper>
    </Box>
  );
};

export default R2UploadDemo;
