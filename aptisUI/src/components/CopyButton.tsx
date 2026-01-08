import {
  Check as CheckIcon,
  ContentCopy as CopyIcon,
} from "@mui/icons-material";
import { Alert, IconButton, Snackbar, Tooltip } from "@mui/material";
import React, { useState } from "react";

interface CopyButtonProps {
  text: string;
  tooltip?: string;
  size?: "small" | "medium";
}

const CopyButton: React.FC<CopyButtonProps> = ({
  text,
  tooltip = "Copy",
  size = "small",
}) => {
  const [copied, setCopied] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);

  const handleCopy = async () => {
    if (!text) return;

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setShowSnackbar(true);
      setTimeout(() => setCopied(false), 1000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <>
      <Tooltip title={copied ? "Đã copy!" : tooltip}>
        <IconButton
          size={size}
          onClick={handleCopy}
          color={copied ? "success" : "default"}
        >
          {copied ? (
            <CheckIcon fontSize="small" />
          ) : (
            <CopyIcon fontSize="small" />
          )}
        </IconButton>
      </Tooltip>

      <Snackbar
        open={showSnackbar}
        autoHideDuration={2000}
        onClose={() => setShowSnackbar(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setShowSnackbar(false)}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          Đã copy vào clipboard!
        </Alert>
      </Snackbar>
    </>
  );
};

export default CopyButton;
