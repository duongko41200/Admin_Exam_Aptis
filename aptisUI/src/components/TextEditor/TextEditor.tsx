import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./TextEditor.css";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import { Cancel, Fullscreen, Save } from "@mui/icons-material";



interface PropType {
  placeholder: string;
  setSuggestion: any;
  suggestion: string;
  editorId?: number | string;
  key?: string | number;
  enableFullscreen?: boolean; // Tùy chọn bật/tắt chức năng phóng to
  modalTitle?: string; // Tiêu đề cho modal
}

/* Event handler to insert a star at the cursor position */
const insertStar = function () {
  const cursorPosition = this.quill.getSelection()?.index || 0;
  this.quill.insertText(cursorPosition, "★");
  this.quill.setSelection(cursorPosition + 1);
};

/* Custom toolbar component */
const CustomToolbar = ({ toolbarId }) => (
  <div id={toolbarId} className="toolbar">
    <select className="ql-header" defaultValue={""}>
      <option value="1" />
      <option value="2" />
      <option selected />
    </select>
    <select className="ql-font">
      <option value="serif"></option>
      <option value="monospace"></option>
    </select>
    <button className="ql-bold" />
    <button className="ql-italic" />
    <button className="ql-underline"></button>

    <span className="ql-formats">
      <select className="ql-color"></select>
      <select className="ql-background"></select>
    </span>
    <span className="ql-formats">
      <button className="ql-list" value="ordered"></button>
      <button className="ql-list" value="bullet"></button>
      <button className="ql-indent" value="-1"></button>
      <button className="ql-indent" value="+1"></button>
    </span>
    <span className="ql-formats">
      <button className="ql-direction" value="rtl"></button>
      <select className="ql-align"></select>
    </span>
    <span className="ql-formats">
      <button className="ql-header" value="1"></button>
      <button className="ql-header" value="2"></button>
      <button className="ql-blockquote"></button>
      <button className="ql-code-block"></button>
    </span>
    <button className="ql-strike"></button>

    <button className="ql-link"></button>

    <button className="ql-image"></button>

    {/* <button className="ql-insertStar">
      <CustomButton />
    </button> */}
  </div>
);

/* Main TextEditor Component */
const TextEditor = ({
  placeholder,
  setSuggestion,
  suggestion,
  editorId = 1,
  enableFullscreen = true, // Mặc định bật chức năng phóng to
  modalTitle = "Text Editor - Expanded View",
}: PropType) => {
  const quillRef = useRef(null);
  const modalQuillRef = useRef(null);
  const toolbarId = `toolbar-${editorId}`;
  const modalToolbarId = `toolbar-modal-${editorId}`;
  
  // State cho modal phóng to
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(suggestion);

  useEffect(() => {
    if (quillRef.current) {
      const quill = quillRef.current.getEditor();
      quill
        .getModule("toolbar")
        .addHandler("insertStar", insertStar.bind({ quill }));
    }
  }, []);

  // Sync modal content với suggestion khi suggestion thay đổi từ bên ngoài
  useEffect(() => {
    setModalContent(suggestion);
  }, [suggestion]);

  // Handler mở modal
  const handleOpenModal = () => {
    setModalContent(suggestion);
    setIsModalOpen(true);
  };

  // Handler đóng modal và lưu content
  const handleCloseModal = () => {
    setSuggestion(modalContent);
    setIsModalOpen(false);
  };

  // Handler hủy modal (không lưu thay đổi)
  const handleCancelModal = () => {
    setModalContent(suggestion); // Reset về giá trị ban đầu
    setIsModalOpen(false);
  };

  return (
    <div className="text-editor">
      <Box sx={{ position: "relative" }}>
        {/* Nút phóng to */}
        {enableFullscreen && (
          <IconButton
            onClick={handleOpenModal}
            sx={{
              position: "absolute",
              top: 4,
              right: 4,
              zIndex: 10,
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 1)",
                boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
              },
              transition: "all 0.2s ease",
            }}
            size="small"
          >
            <Fullscreen fontSize="small" />
          </IconButton>
        )}

        <CustomToolbar toolbarId={toolbarId} />
        <ReactQuill
          ref={quillRef}
          value={suggestion}
          onChange={setSuggestion}
          placeholder={placeholder}
          modules={TextEditor.modules(toolbarId)}
          formats={TextEditor.formats}
          theme="snow"
        />
      </Box>

      {/* Modal phóng to */}
      {enableFullscreen && (
        <Dialog
          open={isModalOpen}
          onClose={handleCancelModal}
          maxWidth="lg"
          fullWidth
          PaperProps={{
            sx: {
              minHeight: "70vh",
              borderRadius: 3,
            },
          }}
        >
          <DialogTitle
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              fontWeight: 600,
              borderBottom: "1px solid",
              borderColor: "grey.200",
              bgcolor: "grey.50",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Fullscreen sx={{ color: "primary.main" }} />
              {modalTitle}
            </Box>
            <IconButton
              onClick={handleCancelModal}
              sx={{ color: "grey.500" }}
              size="small"
            >
              <Cancel />
            </IconButton>
          </DialogTitle>

          <DialogContent sx={{ p: 3 }}>
            <Box className="text-editor">
              <CustomToolbar toolbarId={modalToolbarId} />
              <ReactQuill
                ref={modalQuillRef}
                value={modalContent}
                onChange={setModalContent}
                placeholder={`${placeholder} (Expanded view)`}
                modules={TextEditor.modules(modalToolbarId)}
                formats={TextEditor.formats}
                theme="snow"
                style={{ minHeight: "300px" }}
              />
            </Box>
          </DialogContent>

          <DialogActions
            sx={{
              p: 2,
              borderTop: "1px solid",
              borderColor: "grey.200",
              bgcolor: "grey.50",
              gap: 1,
            }}
          >
            <Button
              onClick={handleCancelModal}
              variant="outlined"
              startIcon={<Cancel />}
              sx={{ borderRadius: 2 }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCloseModal}
              variant="contained"
              startIcon={<Save />}
              sx={{
                borderRadius: 2,
                background: "linear-gradient(45deg, #1976d2, #42a5f5)",
                "&:hover": {
                  background: "linear-gradient(45deg, #1565c0, #1976d2)",
                },
              }}
            >
              Save & Close
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
};

/* Quill modules */
TextEditor.modules = (toolbarId: any) => ({
  toolbar: {
    container: `#${toolbarId}`,
    handlers: {
      insertStar: insertStar,
    },
  },
  clipboard: {
    matchVisual: false,
  },
});

/* Quill formats */
TextEditor.formats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "background",
  "direction",
  "align",
  "strike",
  "code-block",
  "stroke",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
  "color",
];

/* PropType validation */
TextEditor.propTypes = {
  placeholder: PropTypes.string,
};

/* Render component */
export default TextEditor;
