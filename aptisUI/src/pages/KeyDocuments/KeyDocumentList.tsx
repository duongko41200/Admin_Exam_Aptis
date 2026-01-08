import CopyButton from "@/components/CopyButton";
import {
  FilterState,
  KeyDocumentResponse,
  TableQuestion,
} from "@/types/keyDocument";
import {
  VolumeUp as AudioIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import {
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { List } from "react-admin";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({
  children,
  value,
  index,
  ...other
}) => (
  <div
    role="tabpanel"
    hidden={value !== index}
    id={`key-tabpanel-${index}`}
    aria-labelledby={`key-tab-${index}`}
    {...other}
  >
    {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
  </div>
);

const KeyDocumentList: React.FC = () => {
  const theme = useTheme();
  const [currentTab, setCurrentTab] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [dataError, setDataError] = useState<string | null>(null);
  const [rawData, setRawData] = useState<{
    listening: KeyDocumentResponse | null;
    reading: KeyDocumentResponse | null;
    writing: KeyDocumentResponse | null;
    speaking: KeyDocumentResponse | null;
  }>({
    listening: null,
    reading: null,
    writing: null,
    speaking: null,
  });
  const [filters, setFilters] = useState<FilterState>({
    skill: "all",
    part: "all",
    search: "",
  });

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        // Fetch JSON files from public folder
        const [
          listeningResponse,
          readingResponse,
          writingResponse,
          speakingResponse,
        ] = await Promise.all([
          fetch("/data/keyListiening.json").then((res) => res.json()),
          fetch("/data/keyReading.json").then((res) => res.json()),
          fetch("/data/keyWriting.json").then((res) => res.json()),
          fetch("/data/speaking.json").then((res) => res.json()),
        ]);

        setRawData({
          listening: listeningResponse as KeyDocumentResponse,
          reading: readingResponse as KeyDocumentResponse,
          writing: writingResponse as KeyDocumentResponse,
          speaking: speakingResponse as KeyDocumentResponse,
        });
      } catch (error) {
        console.error("Error loading data:", error);
        setDataError("Không thể tải dữ liệu");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Convert data to unified format
  const convertToTableData = useCallback(
    (data: KeyDocumentResponse, skillType: string): TableQuestion[] => {
      const questions: TableQuestion[] = [];

      data.data.data.items.forEach((item) => {
        item.questions.forEach((question) => {
          const answerOptions = question.answerList
            .map(
              (answer, index) =>
                `${String.fromCharCode(65 + index)}. ${answer.content}`
            )
            .join(" | ");

          const correctAnswerIndex = question.answerList.findIndex(
            (answer) => answer.id === question.correctAnswer
          );
          const correctAnswerLetter =
            correctAnswerIndex >= 0
              ? String.fromCharCode(65 + correctAnswerIndex)
              : "N/A";

          questions.push({
            id: question.id,
            topic: item.title,
            question: question.content || question.questionTitle,
            answerOptions,
            correctAnswer: correctAnswerLetter,
            suggestion: question.suggestion || "",
            audioFile: question.file || undefined,
            skill: skillType,
            part: question.questionPart,
          });

          // Add sub questions for Writing and Speaking
          if (question.subQuestion && question.subQuestion.length > 0) {
            question.subQuestion.forEach((subQ, index) => {
              if (subQ.content) {
                questions.push({
                  id: question.id * 1000 + index, // Unique ID for sub question
                  topic: item.title,
                  question: subQ.content,
                  answerOptions: "",
                  correctAnswer: "",
                  suggestion: subQ.suggestion || "",
                  audioFile: subQ.file || undefined,
                  skill: skillType,
                  part: question.questionPart,
                });
              }
            });
          }
        });
      });

      return questions;
    },
    []
  );

  // Prepare data for all skills
  const allData = useMemo(() => {
    if (
      !rawData.listening ||
      !rawData.reading ||
      !rawData.writing ||
      !rawData.speaking
    ) {
      return {
        listening: [],
        reading: [],
        writing: [],
        speaking: [],
        all: [],
      };
    }

    const listening = convertToTableData(rawData.listening, "listening");
    const reading = convertToTableData(rawData.reading, "reading");
    const writing = convertToTableData(rawData.writing, "writing");
    const speaking = convertToTableData(rawData.speaking, "speaking");

    return {
      listening,
      reading,
      writing,
      speaking,
      all: [...listening, ...reading, ...writing, ...speaking],
    };
  }, [convertToTableData, rawData]);

  // Get current skill data based on active tab
  const getCurrentSkillData = useCallback(() => {
    const skills = ["listening", "reading", "writing", "speaking"];
    return allData[skills[currentTab] as keyof typeof allData] || [];
  }, [currentTab, allData]);

  // Filter data
  const filteredData = useMemo(() => {
    let data = getCurrentSkillData();

    // Apply filters
    if (filters.part !== "all") {
      data = data.filter((item) => item.part === filters.part);
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      data = data.filter(
        (item) =>
          item.topic.toLowerCase().includes(searchLower) ||
          item.question.toLowerCase().includes(searchLower)
      );
    }

    return data;
  }, [getCurrentSkillData, filters]);

  // Paginated data
  const paginatedData = useMemo(() => {
    const startIndex = page * rowsPerPage;
    return filteredData.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredData, page, rowsPerPage]);

  // Handle copy to clipboard - removed as using CopyButton component

  // Handle tab change
  const handleTabChange = useCallback(
    (_: React.SyntheticEvent, newValue: number) => {
      setCurrentTab(newValue);
      setPage(0); // Reset page when changing tab
    },
    []
  );

  // Handle page change
  const handlePageChange = useCallback((_: unknown, newPage: number) => {
    setPage(newPage);
  }, []);

  // Handle filter change
  const handleFilterChange = useCallback(
    (field: keyof FilterState, value: string) => {
      setFilters((prev) => ({ ...prev, [field]: value }));
      setPage(0);
    },
    []
  );

  // Render HTML content safely with better styling
  const renderHTMLContent = (content: string): React.ReactNode => {
    if (!content) return "";

    // Simple HTML detection and rendering
    if (content.includes("<") && content.includes(">")) {
      return (
        <Box
          dangerouslySetInnerHTML={{ __html: content }}
          sx={{
            "& p": { margin: 0, lineHeight: 1.5 },
            "& strong": { fontWeight: "bold" },
            "& h1, & h2, & h3, & h4, & h5, & h6": {
              margin: "8px 0 4px 0",
              fontWeight: "bold",
            },
            "& ul, & ol": {
              margin: "4px 0",
              paddingLeft: "20px",
            },
            "& li": {
              margin: "2px 0",
            },
          }}
        />
      );
    }
    return content;
  };

  return (
    <List title="Tài liệu KEY" actions={false} pagination={false} sx={{
        maxHeight:'100vh',
        overflow:"auto"
    }}>
      <Card elevation={1}>
        <CardContent>
          {/* Header with Filters */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
              Tài liệu KEY
            </Typography>

            <Box
              sx={{
                display: "flex",
                gap: 2,
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Part</InputLabel>
                <Select
                  value={filters.part}
                  label="Part"
                  onChange={(e) => handleFilterChange("part", e.target.value)}
                >
                  <MenuItem value="all">Tất cả</MenuItem>
                  <MenuItem value="ONE">Part 1</MenuItem>
                  <MenuItem value="TWO">Part 2</MenuItem>
                  <MenuItem value="THREE">Part 3</MenuItem>
                  <MenuItem value="FOUR">Part 4</MenuItem>
                </Select>
              </FormControl>

              <TextField
                size="small"
                placeholder="Tìm kiếm theo tên bài..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                InputProps={{
                  startAdornment: (
                    <SearchIcon sx={{ mr: 1, color: "action.active" }} />
                  ),
                }}
                sx={{ minWidth: 250 }}
              />
            </Box>
          </Box>

          {/* Loading State */}
          {loading && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 2,
                py: 6,
              }}
            >
              <CircularProgress size={24} />
              <Typography>Đang tải dữ liệu...</Typography>
            </Box>
          )}

          {/* Error State */}
          {dataError && (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <Typography color="error">{dataError}</Typography>
            </Box>
          )}

          {/* Main Content */}
          {!loading && !dataError && (
            <>
              {/* Results Info */}
              <Box
                sx={{
                  mb: 2,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Hiển thị {filteredData.length} kết quả
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Trang {page + 1} /{" "}
                  {Math.ceil(filteredData.length / rowsPerPage)}
                </Typography>
              </Box>

              {/* Tabs */}
              <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
                <Tabs
                  value={currentTab}
                  onChange={handleTabChange}
                  variant="fullWidth"
                >
                  <Tab label="Listening" />
                  <Tab label="Reading" />
                  <Tab label="Writing" />
                  <Tab label="Speaking" />
                </Tabs>
              </Box>

              {/* Tab Content */}
              {[0, 1, 2, 3].map((tabIndex) => (
                <TabPanel key={tabIndex} value={currentTab} index={tabIndex}>
                  <TableContainer
                    component={Paper}
                    elevation={0}
                    sx={{ maxHeight: "70vh", overflow: "auto" }}
                  >
                    <Table stickyHeader>
                      <TableHead>
                        <TableRow
                          sx={{
                            "& .MuiTableCell-head": {
                              backgroundColor: theme.palette.grey[100],
                              fontWeight: "bold",
                            },
                          }}
                        >
                          <TableCell sx={{ minWidth: 120 }}>Topic</TableCell>
                          <TableCell sx={{ minWidth: 200 }}>Đề bài</TableCell>
                          <TableCell sx={{ minWidth: 250 }}>Lựa chọn</TableCell>
                          <TableCell sx={{ minWidth: 100 }}>
                            Đáp án đúng
                          </TableCell>
                          <TableCell sx={{ minWidth: 200 }}>Gợi ý</TableCell>
                          {currentTab === 0 && (
                            <TableCell sx={{ minWidth: 120 }}>
                              File nghe
                            </TableCell>
                          )}
                          <TableCell sx={{ minWidth: 80 }}>Part</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {paginatedData.map((row) => (
                          <TableRow key={row.id} hover>
                            {/* Topic */}
                            <TableCell>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "flex-start",
                                  gap: 1,
                                  minHeight: 40,
                                }}
                              >
                                <Box
                                  sx={{ flexGrow: 1, wordBreak: "break-word" }}
                                >
                                  {renderHTMLContent(row.topic)}
                                </Box>
                                <CopyButton
                                  text={row.topic}
                                  tooltip="Copy topic"
                                />
                              </Box>
                            </TableCell>

                            {/* Question */}
                            <TableCell>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "flex-start",
                                  gap: 1,
                                }}
                              >
                                <Box
                                  sx={{
                                    maxWidth: 300,
                                    wordBreak: "break-word",
                                    lineHeight: 1.5,
                                  }}
                                >
                                  {renderHTMLContent(row.question)}
                                </Box>
                                <CopyButton
                                  text={row.question}
                                  tooltip="Copy question"
                                />
                              </Box>
                            </TableCell>

                            {/* Answer Options */}
                            <TableCell>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "flex-start",
                                  gap: 1,
                                }}
                              >
                                <Box
                                  sx={{
                                    maxWidth: 300,
                                    wordBreak: "break-word",
                                    lineHeight: 1.4,
                                  }}
                                >
                                  {renderHTMLContent(row.answerOptions)}
                                </Box>
                                {row.answerOptions && (
                                  <CopyButton
                                    text={row.answerOptions}
                                    tooltip="Copy options"
                                  />
                                )}
                              </Box>
                            </TableCell>

                            {/* Correct Answer */}
                            <TableCell>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                  justifyContent: "center",
                                }}
                              >
                                <Chip
                                  label={row.correctAnswer}
                                  color="success"
                                  size="small"
                                  variant={
                                    row.correctAnswer === "N/A"
                                      ? "outlined"
                                      : "filled"
                                  }
                                  sx={{ minWidth: 40 }}
                                />
                                {row.correctAnswer &&
                                  row.correctAnswer !== "N/A" && (
                                    <CopyButton
                                      text={row.correctAnswer}
                                      tooltip="Copy correct answer"
                                    />
                                  )}
                              </Box>
                            </TableCell>

                            {/* Suggestion */}
                            <TableCell>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "flex-start",
                                  gap: 1,
                                }}
                              >
                                <Box
                                  sx={{
                                    maxWidth: 300,
                                    wordBreak: "break-word",
                                    lineHeight: 1.4,
                                  }}
                                >
                                  {renderHTMLContent(row.suggestion)}
                                </Box>
                                {row.suggestion && (
                                  <CopyButton
                                    text={row.suggestion}
                                    tooltip="Copy suggestion"
                                  />
                                )}
                              </Box>
                            </TableCell>

                            {/* Audio File (only for Listening) */}
                            {currentTab === 0 && (
                              <TableCell>
                                {row.audioFile ? (
                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 1,
                                    }}
                                  >
                                    <IconButton
                                      size="small"
                                      onClick={() =>
                                        window.open(row.audioFile, "_blank")
                                      }
                                      color="primary"
                                    >
                                      <AudioIcon />
                                    </IconButton>
                                    <CopyButton
                                      text={row.audioFile!}
                                      tooltip="Copy audio URL"
                                    />
                                  </Box>
                                ) : (
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    Không có
                                  </Typography>
                                )}
                              </TableCell>
                            )}

                            {/* Part */}
                            <TableCell>
                              <Chip
                                label={`Part ${row.part.toLowerCase()}`}
                                variant="outlined"
                                size="small"
                              />
                            </TableCell>
                          </TableRow>
                        ))}

                        {paginatedData.length === 0 && (
                          <TableRow>
                            <TableCell
                              colSpan={currentTab === 0 ? 7 : 6}
                              align="center"
                              sx={{ py: 4 }}
                            >
                              <Typography color="text.secondary">
                                Không tìm thấy dữ liệu
                              </Typography>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>

                  {/* Pagination */}
                  <TablePagination
                    component="div"
                    count={filteredData.length}
                    page={page}
                    onPageChange={handlePageChange}
                    rowsPerPage={rowsPerPage}
                    rowsPerPageOptions={[10]}
                    labelDisplayedRows={({ from, to, count }) =>
                      `${from}–${to} của ${count !== -1 ? count : `hơn ${to}`}`
                    }
                    labelRowsPerPage="Số dòng mỗi trang:"
                  />
                </TabPanel>
              ))}
            </>
          )}
        </CardContent>
      </Card>
    </List>
  );
};

export default KeyDocumentList;
