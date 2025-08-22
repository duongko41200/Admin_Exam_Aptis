import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Chip,
  Divider,
} from "@mui/material";
import { SimpleR2FilePreview } from "../components/R2FileUpload";

const SimpleR2Demo: React.FC = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleSubmit = () => {
    if (selectedFiles.length === 0) {
      alert("Please select some files first!");
      return;
    }

    console.log("🚀 Files ready to upload:", selectedFiles);
    alert(`Ready to upload ${selectedFiles.length} files!`);
  };

  const handleReset = () => {
    setSelectedFiles([]);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 700,
            background: "linear-gradient(45deg, #1976d2, #42a5f5)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            mb: 2,
          }}
        >
          🎨 Enhanced R2 Upload
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
          Professional Image Upload Component
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Beautiful, responsive, and user-friendly file upload experience
        </Typography>
      </Box>

      {/* Main Upload Section */}
      <Paper
        elevation={6}
        sx={{
          p: 4,
          borderRadius: 4,
          background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
          boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
        }}
      >
        <SimpleR2FilePreview
          onFilesChange={setSelectedFiles}
          multiple={true}
          maxFiles={8}
        />

        <Divider sx={{ my: 4 }} />

        {/* Action Buttons */}
        <Box
          sx={{
            display: "flex",
            gap: 2,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Button
            variant="contained"
            size="large"
            onClick={handleSubmit}
            disabled={selectedFiles.length === 0}
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: 3,
              background: "linear-gradient(45deg, #1976d2, #42a5f5)",
              boxShadow: "0 4px 15px rgba(25, 118, 210, 0.3)",
              "&:hover": {
                background: "linear-gradient(45deg, #1565c0, #1976d2)",
                transform: "translateY(-2px)",
                boxShadow: "0 6px 20px rgba(25, 118, 210, 0.4)",
              },
              "&:disabled": {
                background: "linear-gradient(45deg, #bdbdbd, #e0e0e0)",
              },
            }}
          >
            🚀 Upload{" "}
            {selectedFiles.length > 0 && `${selectedFiles.length} Files`}
          </Button>

          <Button
            variant="outlined"
            size="large"
            onClick={handleReset}
            disabled={selectedFiles.length === 0}
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: 3,
              borderWidth: 2,
              "&:hover": {
                borderWidth: 2,
                transform: "translateY(-2px)",
              },
            }}
          >
            🔄 Reset
          </Button>
        </Box>
      </Paper>

      {/* Status Panel */}
      <Paper
        elevation={3}
        sx={{
          mt: 4,
          p: 3,
          borderRadius: 3,
          background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
        }}
      >
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
          📊 Upload Status
        </Typography>

        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <Chip
            label={`${selectedFiles.length} Files Selected`}
            color={selectedFiles.length > 0 ? "success" : "default"}
            variant="filled"
            sx={{ fontWeight: 600 }}
          />
          <Chip
            label={`${(
              selectedFiles.reduce((acc, f) => acc + f.size, 0) /
              1024 /
              1024
            ).toFixed(2)} MB Total`}
            color="secondary"
            variant="outlined"
            sx={{ fontWeight: 600 }}
          />
          <Chip
            label={
              selectedFiles.length > 0 ? "Ready to Upload" : "Waiting for Files"
            }
            color={selectedFiles.length > 0 ? "primary" : "default"}
            variant="outlined"
            sx={{ fontWeight: 600 }}
          />
        </Box>

        {selectedFiles.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Selected Files:
            </Typography>
            {selectedFiles.map((file, index) => (
              <Typography
                key={index}
                variant="body2"
                sx={{
                  ml: 2,
                  color: "text.secondary",
                  fontFamily: "monospace",
                  fontSize: "0.8rem",
                }}
              >
                • {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </Typography>
            ))}
          </Box>
        )}
      </Paper>

      {/* Feature Highlights */}
      <Box sx={{ mt: 4, textAlign: "center" }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
          ✨ Key Features
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
            gap: 2,
          }}
        >
          {[
            {
              icon: "🎨",
              title: "Beautiful Design",
              desc: "Modern gradient UI with smooth animations",
            },
            {
              icon: "📱",
              title: "Responsive",
              desc: "Adaptive layout for all screen sizes",
            },
            {
              icon: "⚡",
              title: "Fast Preview",
              desc: "Instant image previews with hover effects",
            },
            {
              icon: "🔒",
              title: "Secure Upload",
              desc: "File validation and error handling",
            },
            {
              icon: "🎯",
              title: "Drag & Drop",
              desc: "Intuitive file selection experience",
            },
            {
              icon: "🚀",
              title: "Performance",
              desc: "Optimized for speed and smooth UX",
            },
          ].map((feature, index) => (
            <Paper
              key={index}
              elevation={2}
              sx={{
                p: 2,
                borderRadius: 2,
                textAlign: "center",
                transition: "transform 0.2s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 8px 25px rgba(0, 0, 0, 0.1)",
                },
              }}
            >
              <Typography variant="h4" sx={{ mb: 1 }}>
                {feature.icon}
              </Typography>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                {feature.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {feature.desc}
              </Typography>
            </Paper>
          ))}
        </Box>
      </Box>
    </Container>
  );
};

export default SimpleR2Demo;
