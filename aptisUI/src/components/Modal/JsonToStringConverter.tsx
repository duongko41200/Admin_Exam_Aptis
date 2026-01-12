import {
  Clear as ClearIcon,
  Transform as TransformIcon,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Grid,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import CopyButton from "../CopyButton";
import ModalBasic from "./ModalBasic";

interface JsonToStringConverterProps {
  open: boolean;
  handleClose: () => void;
}

const JsonToStringConverter: React.FC<JsonToStringConverterProps> = ({
  open,
  handleClose,
}) => {
  const [jsonInput, setJsonInput] = useState<string>("");
  const [stringOutput, setStringOutput] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleConvert = () => {
    try {
      setError("");

      if (!jsonInput.trim()) {
        setError("Vui lòng nhập dữ liệu JSON");
        return;
      }

      // Parse JSON để validate
      const parsedJson = JSON.parse(jsonInput);

      // Convert to minified string (không có spaces và newlines)
      const stringResult = JSON.stringify(parsedJson);

      setStringOutput(stringResult);
    } catch (err) {
      setError("Dữ liệu JSON không hợp lệ. Vui lòng kiểm tra lại!");
    }
  };

  const handleClear = () => {
    setJsonInput("");
    setStringOutput("");
    setError("");
  };

  const handleClose_ = () => {
    handleClear();
    handleClose();
  };

  return (
    <ModalBasic
      open={open}
      handleClose={handleClose_}
      label="JSON to String Converter"
      subLabel="Chuyển đổi JSON thành chuỗi string minified"
      size="large"
      draggable={true}
      resizable={true}
    >
      <Box sx={{ p: 3, height: "100%" }}>
        <Grid container spacing={3} sx={{ height: "100%" }}>
          {/* Input Section */}
          <Grid item xs={12} md={6} sx={{ height: "100%" }}>
            <Box
              sx={{ height: "100%", display: "flex", flexDirection: "column" }}
            >
              <Typography variant="h6" sx={{ mb: 2, color: "#1976d2" }}>
                📝 JSON Input
              </Typography>

              <TextField
                multiline
                fullWidth
                rows={15}
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                placeholder='Nhập JSON vào đây...\n\nVí dụ:\n[\n  {\n    "timestamp": [0, 3],\n    "text": "Hello"\n  }\n]'
                variant="outlined"
                sx={{
                  flex: 1,
                  "& .MuiInputBase-input": {
                    fontFamily: "monospace",
                    fontSize: "14px",
                  },
                }}
                InputProps={{
                  endAdornment: jsonInput && (
                    <InputAdornment position="end">
                      <Button
                        size="small"
                        onClick={handleClear}
                        startIcon={<ClearIcon />}
                        sx={{ position: "absolute", top: 8, right: 8 }}
                      >
                        Xóa
                      </Button>
                    </InputAdornment>
                  ),
                }}
              />

              {/* Control Buttons */}
              <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={handleConvert}
                  startIcon={<TransformIcon />}
                  disabled={!jsonInput.trim()}
                  sx={{
                    py: 1.5,
                    backgroundColor: "#4caf50",
                    "&:hover": {
                      backgroundColor: "#45a049",
                    },
                  }}
                >
                  Chuyển đổi
                </Button>
              </Box>
            </Box>
          </Grid>

          {/* Output Section */}
          <Grid item xs={12} md={6} sx={{ height: "100%" }}>
            <Box
              sx={{ height: "100%", display: "flex", flexDirection: "column" }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mb: 2,
                }}
              >
                <Typography variant="h6" sx={{ color: "#1976d2" }}>
                  📄 String Output
                </Typography>
                {stringOutput && (
                  <CopyButton
                    text={stringOutput}
                    tooltip="Copy string output"
                    size="medium"
                  />
                )}
              </Box>

              <Paper
                variant="outlined"
                sx={{
                  flex: 1,
                  p: 2,
                  backgroundColor: "#f8f9fa",
                  border: "2px dashed #dee2e6",
                  overflow: "auto",
                }}
              >
                {stringOutput ? (
                  <Typography
                    component="pre"
                    sx={{
                      fontFamily: "monospace",
                      fontSize: "14px",
                      wordBreak: "break-all",
                      whiteSpace: "pre-wrap",
                      color: "#28a745",
                      margin: 0,
                    }}
                  >
                    {stringOutput}
                  </Typography>
                ) : (
                  <Typography
                    color="text.secondary"
                    sx={{
                      fontStyle: "italic",
                      textAlign: "center",
                      mt: 10,
                    }}
                  >
                    String output sẽ hiển thị ở đây sau khi chuyển đổi...
                  </Typography>
                )}
              </Paper>

              {/* Stats */}
              {stringOutput && (
                <Box sx={{ mt: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    Độ dài: {stringOutput.length} ký tự
                  </Typography>
                </Box>
              )}
            </Box>
          </Grid>
        </Grid>

        {/* Error Alert */}
        {error && (
          <Alert
            severity="error"
            sx={{
              mt: 2,
              "& .MuiAlert-message": {
                fontWeight: 500,
              },
            }}
            onClose={() => setError("")}
          >
            {error}
          </Alert>
        )}

        {/* Success Message */}
        {stringOutput && !error && (
          <Alert
            severity="success"
            sx={{
              mt: 2,
              "& .MuiAlert-message": {
                fontWeight: 500,
              },
            }}
          >
            ✅ Chuyển đổi thành công! JSON đã được format thành string minified.
          </Alert>
        )}
      </Box>
    </ModalBasic>
  );
};

export default JsonToStringConverter;
