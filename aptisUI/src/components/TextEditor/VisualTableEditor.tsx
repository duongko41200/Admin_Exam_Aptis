import {
  Add,
  Delete,
  DragIndicator,
  TableChart,
} from "@mui/icons-material";
import {
  Box,
  IconButton,
  Paper,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useCallback, useEffect, useRef, useState } from "react";
import "./VisualTableEditor.css";

interface TableData {
  headers: string[];
  rows: string[][];
  headerColor: string;
  hasHeader: boolean;
}

interface VisualTableEditorProps {
  initialData?: TableData;
  initialHtml?: string;
  onChange: (html: string) => void;
  onRemove?: () => void;
}

/**
 * Parse HTML bảng thành TableData
 */
const parseTableHtml = (html: string): TableData | null => {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const table = doc.querySelector("table");
    if (!table) return null;

    const allRows = table.querySelectorAll("tr");
    if (allRows.length === 0) return null;

    // Detect header
    const firstRow = allRows[0];
    const thCells = firstRow.querySelectorAll("th");
    const hasHeader = thCells.length > 0;

    let headerColor = "#2196F3";
    if (hasHeader && thCells[0]) {
      const bgColor = (thCells[0] as HTMLElement).style.backgroundColor;
      if (bgColor) {
        headerColor = bgColor;
      }
    }

    let headers: string[] = [];
    let dataStartIndex = 0;

    if (hasHeader) {
      headers = Array.from(thCells).map(
        (th) => (th as HTMLElement).innerHTML || ""
      );
      dataStartIndex = 1;
    } else {
      // Tạo header rỗng
      const firstRowCells = firstRow.querySelectorAll("td");
      headers = Array.from(firstRowCells).map(() => "");
    }

    const rows: string[][] = [];
    for (let i = dataStartIndex; i < allRows.length; i++) {
      const cells = allRows[i].querySelectorAll("td, th");
      const row = Array.from(cells).map(
        (cell) => (cell as HTMLElement).innerHTML || ""
      );
      rows.push(row);
    }

    return { headers, rows, headerColor, hasHeader };
  } catch {
    return null;
  }
};

/**
 * Convert TableData thành HTML string
 */
const tableDataToHtml = (data: TableData): string => {
  const { headers, rows, headerColor, hasHeader } = data;
  const cols = headers.length;

  let html = `<table style="width:100%;border-collapse:collapse;margin:20px 0;font-family:Arial,sans-serif;">\n`;

  if (hasHeader) {
    html += `  <thead>\n    <tr>\n`;
    for (let c = 0; c < cols; c++) {
      html += `      <th style="border:1px solid #333;padding:12px;text-align:center;background-color:${headerColor};color:white;font-weight:bold;">${headers[c] || ""}</th>\n`;
    }
    html += `    </tr>\n  </thead>\n`;
  }

  html += `  <tbody>\n`;
  for (let r = 0; r < rows.length; r++) {
    const bgStyle = r % 2 === 1 ? ` style="background-color:#f9f9f9;"` : "";
    html += `    <tr${bgStyle}>\n`;
    for (let c = 0; c < cols; c++) {
      html += `      <td style="border:1px solid #333;padding:12px;text-align:left;vertical-align:top;">${rows[r]?.[c] || ""}</td>\n`;
    }
    html += `    </tr>\n`;
  }
  html += `  </tbody>\n</table>`;

  return html;
};

/**
 * VisualTableEditor – WYSIWYG table editor (Google Docs style)
 */
const VisualTableEditor: React.FC<VisualTableEditorProps> = ({
  initialData,
  initialHtml,
  onChange,
  onRemove,
}) => {
  const [tableData, setTableData] = useState<TableData>(() => {
    if (initialData) return initialData;
    if (initialHtml) {
      const parsed = parseTableHtml(initialHtml);
      if (parsed) return parsed;
    }
    return {
      headers: ["Tiêu đề 1", "Tiêu đề 2", "Tiêu đề 3"],
      rows: [
        ["", "", ""],
        ["", "", ""],
      ],
      headerColor: "#2196F3",
      hasHeader: true,
    };
  });

  const [selectedCell, setSelectedCell] = useState<{
    row: number;
    col: number;
    isHeader: boolean;
  } | null>(null);

  const tableRef = useRef<HTMLTableElement>(null);

  // Emit HTML khi tableData thay đổi
  useEffect(() => {
    const html = tableDataToHtml(tableData);
    onChange(html);
  }, [tableData]);

  // ===== Cell Editing =====
  const handleCellBlur = useCallback(
    (
      e: React.FocusEvent<HTMLTableCellElement>,
      rowIndex: number,
      colIndex: number,
      isHeader: boolean
    ) => {
      const newValue = e.currentTarget.innerHTML;
      setTableData((prev) => {
        if (isHeader) {
          const newHeaders = [...prev.headers];
          newHeaders[colIndex] = newValue;
          return { ...prev, headers: newHeaders };
        } else {
          const newRows = prev.rows.map((r) => [...r]);
          if (!newRows[rowIndex]) newRows[rowIndex] = [];
          newRows[rowIndex][colIndex] = newValue;
          return { ...prev, rows: newRows };
        }
      });
      setSelectedCell(null);
    },
    []
  );

  // ===== Add/Remove Rows =====
  const addRow = (atIndex?: number) => {
    setTableData((prev) => {
      const cols = prev.headers.length;
      const newRow = Array(cols).fill("");
      const newRows = [...prev.rows];
      if (atIndex !== undefined) {
        newRows.splice(atIndex + 1, 0, newRow);
      } else {
        newRows.push(newRow);
      }
      return { ...prev, rows: newRows };
    });
  };

  const removeRow = (index: number) => {
    setTableData((prev) => {
      if (prev.rows.length <= 1) return prev;
      const newRows = prev.rows.filter((_, i) => i !== index);
      return { ...prev, rows: newRows };
    });
  };

  // ===== Add/Remove Columns =====
  const addColumn = (atIndex?: number) => {
    setTableData((prev) => {
      const insertAt =
        atIndex !== undefined ? atIndex + 1 : prev.headers.length;
      const newHeaders = [...prev.headers];
      newHeaders.splice(insertAt, 0, `Cột ${prev.headers.length + 1}`);

      const newRows = prev.rows.map((row) => {
        const newRow = [...row];
        newRow.splice(insertAt, 0, "");
        return newRow;
      });

      return { ...prev, headers: newHeaders, rows: newRows };
    });
  };

  const removeColumn = (index: number) => {
    setTableData((prev) => {
      if (prev.headers.length <= 1) return prev;
      const newHeaders = prev.headers.filter((_, i) => i !== index);
      const newRows = prev.rows.map((row) => row.filter((_, i) => i !== index));
      return { ...prev, headers: newHeaders, rows: newRows };
    });
  };

  // ===== Header Color =====
  const headerColors = [
    "#2196F3",
    "#4CAF50",
    "#FF9800",
    "#f44336",
    "#9C27B0",
    "#424242",
  ];

  return (
    <Paper
      elevation={2}
      className="visual-table-editor"
      sx={{
        mt: 1,
        borderRadius: 2,
        overflow: "hidden",
        border: "1px solid #e0e0e0",
      }}
    >
      {/* Toolbar */}
      <Box className="vte-toolbar">
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <TableChart sx={{ fontSize: 16, color: "#1976d2" }} />
          <Typography variant="caption" sx={{ fontWeight: 600, color: "#333" }}>
            Bảng ({tableData.rows.length} × {tableData.headers.length})
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          {/* Color picker */}
          {tableData.hasHeader && (
            <Box sx={{ display: "flex", gap: "3px", mr: 1 }}>
              {headerColors.map((c) => (
                <Tooltip key={c} title="Đổi màu tiêu đề">
                  <Box
                    onClick={() =>
                      setTableData((prev) => ({ ...prev, headerColor: c }))
                    }
                    sx={{
                      width: 16,
                      height: 16,
                      borderRadius: "50%",
                      bgcolor: c,
                      cursor: "pointer",
                      border:
                        tableData.headerColor === c
                          ? "2px solid #000"
                          : "1px solid #ccc",
                      "&:hover": { transform: "scale(1.2)" },
                      transition: "all 0.15s",
                    }}
                  />
                </Tooltip>
              ))}
            </Box>
          )}

          <Tooltip title="Thêm hàng">
            <IconButton size="small" onClick={() => addRow()}>
              <Add sx={{ fontSize: 16 }} />
              <Typography variant="caption" sx={{ fontSize: 10 }}>
                Hàng
              </Typography>
            </IconButton>
          </Tooltip>

          <Tooltip title="Thêm cột">
            <IconButton size="small" onClick={() => addColumn()}>
              <Add sx={{ fontSize: 16 }} />
              <Typography variant="caption" sx={{ fontSize: 10 }}>
                Cột
              </Typography>
            </IconButton>
          </Tooltip>

          {onRemove && (
            <Tooltip title="Xóa bảng">
              <IconButton size="small" color="error" onClick={onRemove}>
                <Delete sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Box>

      {/* Table */}
      <Box className="vte-table-wrapper">
        <table ref={tableRef} className="vte-table">
          {/* Column controls */}
          <colgroup>
            {tableData.headers.map((_, ci) => (
              <col key={ci} />
            ))}
          </colgroup>

          {/* Column action row */}
          <thead>
            {/* Column buttons row */}
            <tr className="vte-col-actions-row">
              {tableData.headers.map((_, ci) => (
                <th key={ci} className="vte-col-action-cell">
                  <Box className="vte-col-actions">
                    <Tooltip title="Thêm cột phải">
                      <IconButton
                        size="small"
                        onClick={() => addColumn(ci)}
                        sx={{ p: "2px" }}
                      >
                        <Add sx={{ fontSize: 12 }} />
                      </IconButton>
                    </Tooltip>
                    {tableData.headers.length > 1 && (
                      <Tooltip title="Xóa cột">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => removeColumn(ci)}
                          sx={{ p: "2px" }}
                        >
                          <Delete sx={{ fontSize: 12 }} />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                </th>
              ))}
            </tr>

            {/* Header row */}
            {tableData.hasHeader && (
              <tr>
                {tableData.headers.map((header, ci) => (
                  <th
                    key={ci}
                    contentEditable
                    suppressContentEditableWarning
                    className={`vte-cell vte-header-cell ${
                      selectedCell?.isHeader && selectedCell.col === ci
                        ? "vte-cell-selected"
                        : ""
                    }`}
                    style={{ backgroundColor: tableData.headerColor }}
                    onFocus={() =>
                      setSelectedCell({ row: -1, col: ci, isHeader: true })
                    }
                    onBlur={(e) => handleCellBlur(e, -1, ci, true)}
                    dangerouslySetInnerHTML={{ __html: header }}
                  />
                ))}
              </tr>
            )}
          </thead>

          {/* Body */}
          <tbody>
            {tableData.rows.map((row, ri) => (
              <tr
                key={ri}
                className={ri % 2 === 1 ? "vte-row-even" : ""}
              >
                {tableData.headers.map((_, ci) => (
                  <td
                    key={ci}
                    contentEditable
                    suppressContentEditableWarning
                    className={`vte-cell ${
                      selectedCell &&
                      !selectedCell.isHeader &&
                      selectedCell.row === ri &&
                      selectedCell.col === ci
                        ? "vte-cell-selected"
                        : ""
                    }`}
                    onFocus={() =>
                      setSelectedCell({ row: ri, col: ci, isHeader: false })
                    }
                    onBlur={(e) => handleCellBlur(e, ri, ci, false)}
                    dangerouslySetInnerHTML={{ __html: row[ci] || "" }}
                  />
                ))}

                {/* Row actions */}
                <td className="vte-row-action-cell">
                  <Box className="vte-row-actions">
                    <Tooltip title="Thêm hàng dưới">
                      <IconButton
                        size="small"
                        onClick={() => addRow(ri)}
                        sx={{ p: "2px" }}
                      >
                        <Add sx={{ fontSize: 12 }} />
                      </IconButton>
                    </Tooltip>
                    {tableData.rows.length > 1 && (
                      <Tooltip title="Xóa hàng">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => removeRow(ri)}
                          sx={{ p: "2px" }}
                        >
                          <Delete sx={{ fontSize: 12 }} />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Box>
    </Paper>
  );
};

export { parseTableHtml, tableDataToHtml };
export type { TableData };
export default VisualTableEditor;
