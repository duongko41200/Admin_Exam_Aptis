import {
  Cancel,
  Code,
  Fullscreen,
  Save,
  TableChart,
  Visibility,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import PropTypes from "prop-types";
import { useCallback, useEffect, useRef, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./TextEditor.css";
import VisualTableEditor, {
  parseTableHtml,
  tableDataToHtml,
} from "./VisualTableEditor";

interface PropType {
  placeholder: string;
  setSuggestion: any;
  suggestion: string;
  editorId?: number | string;
  key?: string | number;
  enableFullscreen?: boolean;
  modalTitle?: string;
}

/* Event handler to insert a star at the cursor position */
const insertStar = function () {
  const cursorPosition = this.quill.getSelection()?.index || 0;
  this.quill.insertText(cursorPosition, "★");
  this.quill.setSelection(cursorPosition + 1);
};

/**
 * Tách nội dung HTML thành phần text (cho Quill) và phần table (cho VisualTableEditor).
 * Trả về: { textParts: string[], tableParts: string[] }
 * Luôn xen kẽ: textParts[0], tableParts[0], textParts[1], tableParts[1], ...
 */
const splitContentByTables = (
  html: string
): { textParts: string[]; tableParts: string[] } => {
  if (!html) return { textParts: [""], tableParts: [] };

  // Match toàn bộ <table...>...</table> blocks
  const tableRegex = /<table[\s\S]*?<\/table>/gi;
  const textParts: string[] = [];
  const tableParts: string[] = [];

  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = tableRegex.exec(html)) !== null) {
    // Phần text trước table
    textParts.push(html.substring(lastIndex, match.index));
    tableParts.push(match[0]);
    lastIndex = match.index + match[0].length;
  }

  // Phần text sau table cuối cùng
  textParts.push(html.substring(lastIndex));

  return { textParts, tableParts };
};

/**
 * Ghép lại textParts và tableParts thành HTML hoàn chỉnh
 */
const mergeContent = (textParts: string[], tableParts: string[]): string => {
  let result = "";
  for (let i = 0; i < textParts.length; i++) {
    result += textParts[i];
    if (i < tableParts.length) {
      result += tableParts[i];
    }
  }
  return result;
};

/* ===== Table Dialog ===== */
const TableDialog = ({
  open,
  onClose,
  onInsert,
}: {
  open: boolean;
  onClose: () => void;
  onInsert: (rows: number, cols: number, headerColor: string) => void;
}) => {
  const [rows, setRows] = useState(4);
  const [cols, setCols] = useState(3);
  const [headerColor, setHeaderColor] = useState("#2196F3");

  const headerColors = [
    { label: "Xanh dương", value: "#2196F3" },
    { label: "Xanh lá", value: "#4CAF50" },
    { label: "Cam", value: "#FF9800" },
    { label: "Đỏ", value: "#f44336" },
    { label: "Tím", value: "#9C27B0" },
    { label: "Xám đậm", value: "#424242" },
  ];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          fontWeight: 600,
          borderBottom: "1px solid",
          borderColor: "grey.200",
          bgcolor: "grey.50",
        }}
      >
        <TableChart sx={{ color: "primary.main" }} />
        Tạo Bảng
      </DialogTitle>
      <DialogContent sx={{ pt: 3 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5, mt: 1 }}>
          {/* Grid preview */}
          <Box
            sx={{
              border: "1px solid #e0e0e0",
              borderRadius: 2,
              p: 2,
              bgcolor: "#fafafa",
              textAlign: "center",
            }}
          >
            <Box
              sx={{
                display: "inline-grid",
                gridTemplateColumns: `repeat(${Math.min(cols, 8)}, 1fr)`,
                gap: "2px",
              }}
            >
              {Array.from({
                length: Math.min(rows, 8) * Math.min(cols, 8),
              }).map((_, i) => {
                const isHeader = i < Math.min(cols, 8);
                return (
                  <Box
                    key={i}
                    sx={{
                      width: 28,
                      height: 20,
                      bgcolor: isHeader
                        ? headerColor
                        : i % 2 === 0
                        ? "#e3f2fd"
                        : "#fff",
                      border: "1px solid #ccc",
                      borderRadius: "2px",
                    }}
                  />
                );
              })}
            </Box>
          </Box>

          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              label="Số hàng"
              type="number"
              value={rows}
              onChange={(e) =>
                setRows(
                  Math.max(2, Math.min(50, parseInt(e.target.value) || 2))
                )
              }
              inputProps={{ min: 2, max: 50 }}
              size="small"
              sx={{ flex: 1 }}
            />
            <TextField
              label="Số cột"
              type="number"
              value={cols}
              onChange={(e) =>
                setCols(
                  Math.max(1, Math.min(20, parseInt(e.target.value) || 1))
                )
              }
              inputProps={{ min: 1, max: 20 }}
              size="small"
              sx={{ flex: 1 }}
            />
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="body2" sx={{ minWidth: 80 }}>
              Màu header:
            </Typography>
            {headerColors.map((c) => (
              <Tooltip key={c.value} title={c.label}>
                <Box
                  onClick={() => setHeaderColor(c.value)}
                  sx={{
                    width: 24,
                    height: 24,
                    borderRadius: "50%",
                    bgcolor: c.value,
                    cursor: "pointer",
                    border:
                      headerColor === c.value
                        ? "3px solid #000"
                        : "2px solid #ccc",
                    "&:hover": { transform: "scale(1.15)" },
                    transition: "all 0.15s",
                  }}
                />
              </Tooltip>
            ))}
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button onClick={onClose} variant="outlined" sx={{ borderRadius: 2 }}>
          Hủy
        </Button>
        <Button
          onClick={() => {
            onInsert(rows, cols, headerColor);
            onClose();
          }}
          variant="contained"
          startIcon={<TableChart />}
          sx={{ borderRadius: 2 }}
        >
          Chèn Bảng
        </Button>
      </DialogActions>
    </Dialog>
  );
};

/* ===== Custom Toolbar ===== */
const CustomToolbar = ({
  toolbarId,
  isSourceMode,
  onToggleSource,
  onInsertTable,
}: {
  toolbarId: string;
  isSourceMode?: boolean;
  onToggleSource?: () => void;
  onInsertTable?: () => void;
}) => (
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

    {/* Nút chèn bảng */}
    <span className="ql-formats">
      <Tooltip title="Chèn bảng">
        <button
          type="button"
          className="source-toggle-btn"
          onClick={(e) => {
            e.preventDefault();
            onInsertTable?.();
          }}
        >
          <TableChart style={{ fontSize: 14 }} /> Bảng
        </button>
      </Tooltip>
    </span>

    {/* Nút Source/Visual */}
    <span className="ql-formats" style={{ float: "right" }}>
      <Tooltip
        title={
          isSourceMode
            ? "Chuyển về Visual Editor"
            : "Chuyển sang HTML Source"
        }
      >
        <button
          type="button"
          className={`source-toggle-btn ${isSourceMode ? "active" : ""}`}
          onClick={(e) => {
            e.preventDefault();
            onToggleSource?.();
          }}
        >
          {isSourceMode ? (
            <>
              <Visibility style={{ fontSize: 14 }} /> Visual
            </>
          ) : (
            <>
              <Code style={{ fontSize: 14 }} /> {"</>"}
            </>
          )}
        </button>
      </Tooltip>
    </span>
  </div>
);

/* ========== Main TextEditor Component ========== */
const TextEditor = ({
  placeholder,
  setSuggestion,
  suggestion,
  editorId = 1,
  enableFullscreen = true,
  modalTitle = "Text Editor - Expanded View",
}: PropType) => {
  const quillRef = useRef(null);
  const modalQuillRef = useRef(null);
  const toolbarId = `toolbar-${editorId}`;
  const modalToolbarId = `toolbar-modal-${editorId}`;

  // Tách nội dung thành text parts và table parts
  const { textParts: initTextParts, tableParts: initTableParts } =
    splitContentByTables(suggestion);

  // Quill chỉ nhận phần text (không có table)
  const [quillValue, setQuillValue] = useState(initTextParts[0] || "");
  // Table parts được quản lý riêng
  const [tables, setTables] = useState<string[]>(initTableParts);
  // textParts giữ các đoạn text giữa các bảng
  const textPartsRef = useRef<string[]>(initTextParts);

  // Ref giữ toàn bộ HTML gốc
  const rawHtmlRef = useRef<string>(suggestion);

  // State cho modal, source mode
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(suggestion);
  const [isSourceMode, setIsSourceMode] = useState(false);
  const [sourceContent, setSourceContent] = useState(suggestion);
  const [showTableDialog, setShowTableDialog] = useState(false);
  const [showPreview, setShowPreview] = useState(true);

  // Modal source mode
  const [isModalSourceMode, setIsModalSourceMode] = useState(false);
  const [modalSourceContent, setModalSourceContent] = useState(suggestion);

  // Sync từ bên ngoài (load record)
  useEffect(() => {
    const { textParts, tableParts } = splitContentByTables(suggestion);
    textPartsRef.current = textParts;
    setTables(tableParts);
    setQuillValue(textParts[0] || "");
    rawHtmlRef.current = suggestion;
    setSourceContent(suggestion);
  }, [suggestion]);

  // Setup Quill toolbar handler
  useEffect(() => {
    if (quillRef.current && !isSourceMode) {
      const quill = quillRef.current.getEditor();
      quill
        .getModule("toolbar")
        .addHandler("insertStar", insertStar.bind({ quill }));
    }
  }, [isSourceMode]);

  // ===== Emit combined HTML khi parts thay đổi =====
  const emitCombined = useCallback(
    (quillVal?: string, tableArr?: string[]) => {
      const qv = quillVal ?? quillValue;
      const ta = tableArr ?? tables;
      const textParts = [...textPartsRef.current];
      textParts[0] = qv;
      const combined = mergeContent(textParts, ta);
      rawHtmlRef.current = combined;
      setSuggestion(combined);
    },
    [quillValue, tables, setSuggestion]
  );

  // ===== Quill onChange =====
  const handleQuillChange = (value: string) => {
    setQuillValue(value);
    textPartsRef.current[0] = value;
    emitCombined(value);
  };

  // ===== Table onChange =====
  const handleTableChange = (index: number, html: string) => {
    setTables((prev) => {
      const updated = [...prev];
      updated[index] = html;
      emitCombined(undefined, updated);
      return updated;
    });
  };

  // ===== Remove table =====
  const handleRemoveTable = (index: number) => {
    setTables((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      // Merge textParts bên cạnh table bị xóa
      const tp = [...textPartsRef.current];
      if (index < tp.length - 1) {
        tp[index] = (tp[index] || "") + (tp[index + 1] || "");
        tp.splice(index + 1, 1);
      }
      textPartsRef.current = tp;
      emitCombined(undefined, updated);
      return updated;
    });
  };

  // ===== Insert new table =====
  const handleInsertTable = (
    rows: number,
    cols: number,
    headerColor: string
  ) => {
    const headers = Array.from(
      { length: cols },
      (_, i) => `Tiêu đề ${i + 1}`
    );
    const bodyRows = Array.from({ length: rows - 1 }, () =>
      Array(cols).fill("")
    );
    const tableData = {
      headers,
      rows: bodyRows,
      headerColor,
      hasHeader: true,
    };
    const html = tableDataToHtml(tableData);

    setTables((prev) => [...prev, html]);
    textPartsRef.current.push("");
    emitCombined(undefined, [...tables, html]);
  };

  // ===== Source Mode =====
  const handleToggleSource = () => {
    if (isSourceMode) {
      // Source → Visual
      const { textParts, tableParts } = splitContentByTables(sourceContent);
      textPartsRef.current = textParts;
      setTables(tableParts);
      setQuillValue(textParts[0] || "");
      rawHtmlRef.current = sourceContent;
      setSuggestion(sourceContent);
      setIsSourceMode(false);
    } else {
      // Visual → Source
      const combined = rawHtmlRef.current;
      setSourceContent(combined);
      setIsSourceMode(true);
    }
  };

  const handleSourceChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setSourceContent(val);
    rawHtmlRef.current = val;
    setSuggestion(val);
  };

  // ===== Modal Handlers =====
  const handleOpenModal = () => {
    setModalContent(rawHtmlRef.current || suggestion);
    setModalSourceContent(rawHtmlRef.current || suggestion);
    setIsModalSourceMode(isSourceMode);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    const finalContent = isModalSourceMode
      ? modalSourceContent
      : modalContent;
    rawHtmlRef.current = finalContent;
    setSuggestion(finalContent);
    const { textParts, tableParts } = splitContentByTables(finalContent);
    textPartsRef.current = textParts;
    setTables(tableParts);
    setQuillValue(textParts[0] || "");
    setSourceContent(finalContent);
    setIsSourceMode(isModalSourceMode);
    setIsModalOpen(false);
  };

  const handleCancelModal = () => {
    setIsModalOpen(false);
  };

  const handleModalToggleSource = () => {
    if (isModalSourceMode) {
      setModalContent(modalSourceContent);
    } else {
      setModalSourceContent(modalContent);
    }
    setIsModalSourceMode(!isModalSourceMode);
  };

  return (
    <div className="text-editor">
      <Box sx={{ position: "relative" }}>
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
            }}
            size="small"
          >
            <Fullscreen fontSize="small" />
          </IconButton>
        )}

        <CustomToolbar
          toolbarId={toolbarId}
          isSourceMode={isSourceMode}
          onToggleSource={handleToggleSource}
          onInsertTable={() => setShowTableDialog(true)}
        />

        {/* === Visual Mode === */}
        {!isSourceMode && (
          <Box>
            {/* Quill Editor (phần text) */}
            <ReactQuill
              ref={quillRef}
              value={quillValue}
              onChange={handleQuillChange}
              placeholder={placeholder}
              modules={TextEditor.modules(toolbarId)}
              formats={TextEditor.formats}
              theme="snow"
            />

            {/* Visual Table Editors */}
            {tables.map((tableHtml, index) => (
              <VisualTableEditor
                key={index}
                initialHtml={tableHtml}
                onChange={(html) => handleTableChange(index, html)}
                onRemove={() => handleRemoveTable(index)}
              />
            ))}
          </Box>
        )}

        {/* === Source Mode === */}
        {isSourceMode && (
          <Box>
            <div className="source-mode-container">
              <div className="source-mode-header">
                <span className="source-label">HTML Source Editor</span>
                <Tooltip
                  title={showPreview ? "Ẩn preview" : "Hiện preview"}
                >
                  <button
                    type="button"
                    onClick={() => setShowPreview(!showPreview)}
                    style={{
                      background: "none",
                      border: "1px solid #555",
                      borderRadius: "4px",
                      color: "#e0e0e0",
                      padding: "2px 8px",
                      fontSize: "11px",
                      cursor: "pointer",
                    }}
                  >
                    {showPreview ? "Ẩn Preview" : "Hiện Preview"}
                  </button>
                </Tooltip>
              </div>
              <textarea
                className="source-mode-textarea"
                value={sourceContent}
                onChange={handleSourceChange}
                placeholder="Nhập HTML tại đây..."
                spellCheck={false}
              />
            </div>

            {showPreview && sourceContent && (
              <div className="html-preview-container">
                <div className="html-preview-header">Xem trước (Preview)</div>
                <div
                  className="html-preview-content"
                  dangerouslySetInnerHTML={{ __html: sourceContent }}
                />
              </div>
            )}
          </Box>
        )}
      </Box>

      {/* Table Dialog */}
      <TableDialog
        open={showTableDialog}
        onClose={() => setShowTableDialog(false)}
        onInsert={handleInsertTable}
      />

      {/* Modal phóng to */}
      {enableFullscreen && (
        <Dialog
          open={isModalOpen}
          onClose={handleCancelModal}
          maxWidth="lg"
          fullWidth
          PaperProps={{ sx: { minHeight: "70vh", borderRadius: 3 } }}
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
              <CustomToolbar
                toolbarId={modalToolbarId}
                isSourceMode={isModalSourceMode}
                onToggleSource={handleModalToggleSource}
                onInsertTable={() => setShowTableDialog(true)}
              />

              {!isModalSourceMode && (
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
              )}

              {isModalSourceMode && (
                <Box>
                  <div className="source-mode-container">
                    <div className="source-mode-header">
                      <span className="source-label">
                        HTML Source Editor (Expanded)
                      </span>
                    </div>
                    <textarea
                      className="source-mode-textarea"
                      value={modalSourceContent}
                      onChange={(e) => {
                        setModalSourceContent(e.target.value);
                        setModalContent(e.target.value);
                      }}
                      placeholder="Nhập HTML tại đây..."
                      spellCheck={false}
                      style={{ minHeight: "350px" }}
                    />
                  </div>

                  {modalSourceContent && (
                    <div className="html-preview-container">
                      <div className="html-preview-header">
                        Xem trước (Preview)
                      </div>
                      <div
                        className="html-preview-content"
                        dangerouslySetInnerHTML={{
                          __html: modalSourceContent,
                        }}
                      />
                    </div>
                  )}
                </Box>
              )}
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
                  background:
                    "linear-gradient(45deg, #1565c0, #1976d2)",
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

export default TextEditor;
