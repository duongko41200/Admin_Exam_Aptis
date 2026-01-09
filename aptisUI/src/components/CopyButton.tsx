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

    if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setShowSnackbar(true);
        setTimeout(() => setCopied(false), 1000);
      } catch (err) {
        console.error("Failed to copy:", err);
      }
    } else {
      // Fallback for browsers/environments without Clipboard API
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed"; // Prevent scrolling to bottom
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      try {
        const successful = document.execCommand("copy");
        if (successful) {
          setCopied(true);
          setShowSnackbar(true);
          setTimeout(() => setCopied(false), 1000);
        } else {
          console.error("Fallback: Copy command was unsuccessful.");
        }
      } catch (err) {
        console.error("Fallback: Failed to copy:", err);
      }
      document.body.removeChild(textarea);
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
