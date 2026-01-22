import CopyButton from "@/components/CopyButton";
import {
  VolumeUp as AudioIcon,
  FirstPage,
  Image as ImageIcon,
  LastPage,
  NavigateBefore,
  NavigateNext,
  Search as SearchIcon,
} from "@mui/icons-material";
import {
  Box,
  Card,
  CardContent,
  Checkbox,
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
  TableRow,
  Tabs,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { List } from "react-admin";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface CustomPaginationProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => void;
}

const CustomPagination: React.FC<CustomPaginationProps> = ({
  count,
  page,
  rowsPerPage,
  onPageChange,
}) => {
  const totalPages = Math.ceil(count / rowsPerPage);

  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    const pages: (number | string)[] = [];
    const currentPage = page + 1; // Convert to 1-based indexing

    // Always show first page
    pages.push(1);

    if (totalPages <= 7) {
      // Show all pages if total is 7 or less
      for (let i = 2; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show first 3 and last 3 with ellipsis if needed
      if (currentPage <= 4) {
        // Show pages 1,2,3,4, ..., totalPages-1, totalPages
        for (let i = 2; i <= 4; i++) {
          pages.push(i);
        }
        if (totalPages > 5) {
          pages.push("...");
          pages.push(totalPages - 1);
        }
        pages.push(totalPages);
      } else if (currentPage > totalPages - 4) {
        // Show pages 1, 2, ..., totalPages-3, totalPages-2, totalPages-1, totalPages
        if (totalPages > 5) {
          pages.push(2);
          pages.push("...");
        }
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Show pages 1, 2, ..., currentPage-1, currentPage, currentPage+1, ..., totalPages-1, totalPages
        pages.push(2);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages - 1);
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 1,
        mt: 2,
        position: "absolute",
        top: 50,
        right: 100,
        backgroundColor: "background.paper",
        border: 10,
        borderColor: "divider",
        borderRadius: 1,
       borderShadow: 1,
        py: 1,
      }}
    >
      <IconButton
        onClick={(e) => onPageChange(e, 0)}
        disabled={page === 0}
        size="small"
      >
        <FirstPage />
      </IconButton>

      <IconButton
        onClick={(e) => onPageChange(e, page - 1)}
        disabled={page === 0}
        size="small"
      >
        <NavigateBefore />
      </IconButton>

      {visiblePages.map((pageNum, index) =>
        typeof pageNum === "number" ? (
          <IconButton
            key={index}
            onClick={(e) => onPageChange(e, pageNum - 1)}
            sx={{
              minWidth: 32,
              height: 32,
              backgroundColor:
                page + 1 === pageNum ? "primary.main" : "transparent",
              color: page + 1 === pageNum ? "primary.contrastText" : "inherit",
              "&:hover": {
                backgroundColor:
                  page + 1 === pageNum ? "primary.dark" : "rgba(0, 0, 0, 0.04)",
              },
            }}
            size="small"
          >
            {pageNum}
          </IconButton>
        ) : (
          <Box key={index} sx={{ px: 1 }}>
            ...
          </Box>
        )
      )}

      <IconButton
        onClick={(e) => onPageChange(e, page + 1)}
        disabled={page >= totalPages - 1}
        size="small"
      >
        <NavigateNext />
      </IconButton>

      <IconButton
        onClick={(e) => onPageChange(e, totalPages - 1)}
        disabled={page >= totalPages - 1}
        size="small"
      >
        <LastPage />
      </IconButton>
    </Box>
  );
};

interface SubQuestion {
  id: string;
  title: string;
  imageUrl?: string | null;
  audioUrl?: string | null;
  options?: Record<string, string>;
  correctAnswer?: string | null;
  suggestion?: string | null;
  listOptions?: unknown | null;
  listeningScript?: string | null;
  example: boolean;
}

interface GeneralQuestionSchema {
  // Thông tin cơ bản
  id: string;
  topic: string;
  debai: string;
  skill:
    | "READING"
    | "LISTENING"
    | "WRITING"
    | "SPEAKING"
    | "GRAMMAR_AND_VOCABULARY";
  part?: string;
  timeToDo?: number;

  // Dữ liệu câu hỏi chính
  optionAnswer?: { id: string; content: string }[];
  correctAnswer?: string;
  suggestion?: string | null;

  // Dữ liệu câu hỏi phụ
  subDebai?: SubQuestion[] | null;

  // Media files
  file?: string | null;
  image?: string | string[] | null;
  audioUrl?: string | null;
  listeningScript?: string | null;

  // Metadata
  isExample?: boolean;
  questionType?: string;
  questionName?: string;
}

interface FilterState {
  skill: string;
  part: string;
  search: string;
}

interface AddedQuestionsState {
  [questionId: string]: boolean;
}

type TabType = "not-added" | "added";
type MainTabType =
  | "listening"
  | "reading"
  | "writing"
  | "speaking"
  | "vocabulary";

interface KeyDocumentResponse {
  timestamp: string;
  path: string;
  success: boolean;
  code: number;
  message: string;
  data: {
    totalPages: number;
    totalElements: number;
    currentPage: number;
    pageSize: number;
    content: {
      id: string;
      title?: string;
      imageUrl?: string;
      audioUrl?: string;
      questionType: string;
      examType: string;
      subQuestions: SubQuestion[];
      questionName: string;
      questionPart: string;
      listeningScript?: string;
    }[];
    sortBy?: unknown;
  };
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
  const [currentSubTab, setCurrentSubTab] = useState<TabType>("not-added");
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [dataError, setDataError] = useState<string | null>(null);
  const [rawData, setRawData] = useState<{
    listening: KeyDocumentResponse | null;
    reading: KeyDocumentResponse | null;
    writing: KeyDocumentResponse | null;
    speaking: KeyDocumentResponse | null;
    vocabulary: KeyDocumentResponse | null;
  }>({
    listening: null,
    reading: null,
    writing: null,
    speaking: null,
    vocabulary: null,
  });
  const [filters, setFilters] = useState<FilterState>({
    skill: "all",
    part: "all",
    search: "",
  });

  // LocalStorage helpers
  const getStorageKey = useCallback((skill: MainTabType): string => {
    return `key-documents-added-${skill}`;
  }, []);

  const loadAddedQuestions = useCallback(
    (skill: MainTabType): Set<string> => {
      try {
        const stored = localStorage.getItem(getStorageKey(skill));
        if (stored) {
          const parsed = JSON.parse(stored) as string[];
          return new Set(parsed);
        }
      } catch (error) {
        console.error("Error loading added questions:", error);
      }
      return new Set();
    },
    [getStorageKey]
  );

  const saveAddedQuestions = useCallback(
    (skill: MainTabType, addedQuestions: Set<string>): void => {
      try {
        localStorage.setItem(
          getStorageKey(skill),
          JSON.stringify(Array.from(addedQuestions))
        );
      } catch (error) {
        console.error("Error saving added questions:", error);
      }
    },
    [getStorageKey]
  );

  const [addedQuestions, setAddedQuestions] = useState<{
    listening: Set<string>;
    reading: Set<string>;
    writing: Set<string>;
    speaking: Set<string>;
    vocabulary: Set<string>;
  }>({
    listening: new Set(),
    reading: new Set(),
    writing: new Set(),
    speaking: new Set(),
    vocabulary: new Set(),
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
          vocabularyResponse,
        ] = await Promise.all([
          fetch("/data/keyListiening.json").then((res) => res.json()),
          fetch("/data/keyReading.json").then((res) => res.json()),
          fetch("/data/keyWriting.json").then((res) => res.json()),
          fetch("/data/speaking.json").then((res) => res.json()),
          fetch("/data/keyVocab.json").then((res) => res.json()),
        ]);

        setRawData({
          listening: listeningResponse as KeyDocumentResponse,
          reading: readingResponse as KeyDocumentResponse,
          writing: writingResponse as KeyDocumentResponse,
          speaking: speakingResponse as KeyDocumentResponse,
          vocabulary: vocabularyResponse as KeyDocumentResponse,
        });

        // Load added questions from localStorage
        setAddedQuestions({
          listening: loadAddedQuestions("listening"),
          reading: loadAddedQuestions("reading"),
          writing: loadAddedQuestions("writing"),
          speaking: loadAddedQuestions("speaking"),
          vocabulary: loadAddedQuestions("vocabulary"),
        });
      } catch (error) {
        console.error("Error loading data:", error);
        setDataError("Không thể tải dữ liệu");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [loadAddedQuestions]);

  // Convert data to unified format
  const convertToTableData = useCallback(
    (
      data: KeyDocumentResponse,
      skillType:
        | "READING"
        | "LISTENING"
        | "WRITING"
        | "SPEAKING"
        | "GRAMMAR_AND_VOCABULARY"
    ): GeneralQuestionSchema[] => {
      const questions: GeneralQuestionSchema[] = [];

      data.data.content.forEach((item) => {
        const question: GeneralQuestionSchema = {
          id: item.id,
          topic: item.questionName || "",
          debai: item.title || "",
          skill: skillType,
          part: item.questionPart,
          questionType: item.questionType,
          questionName: item.questionName,
          file: item.audioUrl || null,
          audioUrl: item.audioUrl || null,
          image: item.imageUrl ? item.imageUrl.split(",") : null,
          listeningScript: item.listeningScript || null,
          subDebai: item.subQuestions || null,
          isExample: item.subQuestions?.some((sub) => sub.example) || false,
          // For main question level data
          suggestion:
            item.subQuestions?.length > 0
              ? item.subQuestions[0].suggestion
              : null,
          correctAnswer:
            item.subQuestions?.length > 0
              ? item.subQuestions[0].correctAnswer
              : null,
          optionAnswer:
            item.subQuestions?.length > 0 && item.subQuestions[0].options
              ? Object.entries(item.subQuestions[0].options).map(
                  ([id, content]) => ({
                    id,
                    content: content as string,
                  })
                )
              : undefined,
        };

        questions.push(question);
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
      !rawData.speaking ||
      !rawData.vocabulary
    ) {
      return {
        listening: [],
        reading: [],
        writing: [],
        speaking: [],
        vocabulary: [],
        all: [],
      };
    }

    const listening = convertToTableData(rawData.listening, "LISTENING");
    const reading = convertToTableData(rawData.reading, "READING");
    const writing = convertToTableData(rawData.writing, "WRITING");
    const speaking = convertToTableData(rawData.speaking, "SPEAKING");
    const vocabulary = convertToTableData(
      rawData.vocabulary,
      "GRAMMAR_AND_VOCABULARY"
    );

    return {
      listening,
      reading,
      writing,
      speaking,
      vocabulary,
      all: [...listening, ...reading, ...writing, ...speaking, ...vocabulary],
    };
  }, [convertToTableData, rawData]);

  // Get current skill data based on active tab
  const getCurrentSkillData = useCallback(() => {
    const skills: MainTabType[] = [
      "listening",
      "reading",
      "writing",
      "speaking",
      "vocabulary",
    ];
    const currentSkill = skills[currentTab];
    const skillData = allData[currentSkill] || [];

    if (currentSubTab === "added") {
      return skillData.filter((item) =>
        addedQuestions[currentSkill].has(item.id)
      );
    } else {
      return skillData.filter(
        (item) => !addedQuestions[currentSkill].has(item.id)
      );
    }
  }, [currentTab, currentSubTab, allData, addedQuestions]);

  // Handle question checkbox toggle
  const handleQuestionToggle = useCallback(
    (questionId: string, isChecked: boolean) => {
      const skills: MainTabType[] = [
        "listening",
        "reading",
        "writing",
        "speaking",
        "vocabulary",
      ];
      const currentSkill = skills[currentTab];

      setAddedQuestions((prev) => {
        const newAddedQuestions = {
          ...prev,
          [currentSkill]: new Set(prev[currentSkill]),
        };

        if (isChecked) {
          newAddedQuestions[currentSkill].add(questionId);
        } else {
          newAddedQuestions[currentSkill].delete(questionId);
        }

        // Save to localStorage
        saveAddedQuestions(currentSkill, newAddedQuestions[currentSkill]);

        return newAddedQuestions;
      });
    },
    [currentTab, saveAddedQuestions]
  );

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
          item.debai.toLowerCase().includes(searchLower)
      );
    }

    return data;
  }, [getCurrentSkillData, filters]);

  // Paginated data
  const paginatedData = useMemo(() => {
    const startIndex = page * rowsPerPage;
    return filteredData.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredData, page, rowsPerPage]);

  // Helper function to handle Part 2 comma-separated correct answers
  const getPart2CorrectAnswers = useCallback(
    (
      correctAnswer: string,
      optionAnswers?: { id: string; content: string }[]
    ): string[] => {
      if (!correctAnswer || !optionAnswers || optionAnswers.length === 0) {
        return [];
      }

      // Split by comma and get content in order
      const answerIds = correctAnswer.split(",").map((id) => id.trim());
      return answerIds
        .map((id) => {
          const matchedOption = optionAnswers.find((opt) => opt.id === id);
          return matchedOption ? matchedOption.content : null;
        })
        .filter(Boolean) as string[];
    },
    []
  );

  // Helper function to get correct answer text from ID
  const getCorrectAnswerText = useCallback(
    (
      correctAnswer: string,
      optionAnswers?: { id: string; content: string }[]
    ): string => {
      if (!correctAnswer || !optionAnswers || optionAnswers.length === 0) {
        return correctAnswer || "";
      }

      // Find option with matching ID
      const matchedOption = optionAnswers.find(
        (opt) => opt.id === correctAnswer
      );
      return matchedOption ? matchedOption.content : correctAnswer;
    },
    []
  );

  // Helper function to get correct answers for questions with subQuestions
  const getSubQuestionCorrectAnswers = useCallback(
    (subQuestions?: SubQuestion[]): string[] => {
      if (!subQuestions || subQuestions.length === 0) {
        return [];
      }

      return subQuestions
        .filter((sub) => sub.correctAnswer && sub.correctAnswer.trim() !== "")
        .map((sub) => {
          if (sub.options && sub.correctAnswer) {
            const foundAnswer = Object.entries(sub.options).find(
              ([key]) => key === sub.correctAnswer
            );
            return foundAnswer ? foundAnswer[1] : sub.correctAnswer;
          }
          return sub.correctAnswer;
        })
        .filter(Boolean) as string[];
    },
    []
  );

  // Helper function to get suggestion for questions (handles Part 3 special cases)
  const getQuestionSuggestion = useCallback(
    (row: GeneralQuestionSchema): string | null => {
      // For Part 3 (THREE), always prioritize main question suggestion
      if (row.part === "THREE" && row.suggestion) {
        return row.suggestion;
      }

      // If main question has suggestion, use it
      if (row.suggestion) {
        return row.suggestion;
      }

      // For non-Part 3 questions, check subQuestion suggestions as fallback
      if (row.part !== "THREE" && row.subDebai && row.subDebai.length > 0) {
        // Get all non-empty suggestions from subQuestions
        const suggestions = row.subDebai
          .map((sub) => sub.suggestion)
          .filter(Boolean);

        // Return the first valid suggestion found
        return suggestions.length > 0 ? suggestions[0] : null;
      }

      return null;
    },
    []
  );

  // Handle copy to clipboard - removed as using CopyButton component

  // Handle tab change
  const handleTabChange = useCallback(
    (_: React.SyntheticEvent, newValue: number) => {
      setCurrentTab(newValue);
      setPage(0); // Reset page when changing tab
    },
    []
  );

  // Handle sub tab change
  const handleSubTabChange = useCallback(
    (_: React.SyntheticEvent, newValue: TabType) => {
      setCurrentSubTab(newValue);
      setPage(0); // Reset page when changing sub tab
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
    <List
      title="Tài liệu KEY"
      actions={false}
      pagination={false}
      sx={{
        maxHeight: "100vh",
        overflow: "auto",
        position: "relative",
      }}
    >
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
              <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
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
              </Box>

              <Box>
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
              <Box sx={{ borderBottom: 2, borderColor: "divider", mb: 2 }}>
                <Tabs
                  value={currentTab}
                  onChange={handleTabChange}
                  variant="fullWidth"
                >
                  <Tab label="Listening" />
                  <Tab label="Reading" />
                  <Tab label="Writing" />
                  <Tab label="Speaking" />
                  <Tab label="Vocabulary" />
                </Tabs>
              </Box>

              {/* Sub Tabs */}
              <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
                <Tabs
                  value={currentSubTab === "not-added" ? 0 : 1}
                  onChange={(_, newValue) =>
                    handleSubTabChange(
                      _,
                      newValue === 0 ? "not-added" : "added"
                    )
                  }
                  variant="fullWidth"
                  sx={{
                    "& .MuiTab-root": {
                      minHeight: 40,
                      fontSize: "0.9rem",
                    },
                  }}
                >
                  <Tab
                    label="Chưa thêm"
                    sx={{
                      color:
                        currentSubTab === "not-added"
                          ? "primary.main"
                          : "text.secondary",
                    }}
                  />
                  <Tab
                    label="Đã thêm"
                    sx={{
                      color:
                        currentSubTab === "added"
                          ? "primary.main"
                          : "text.secondary",
                    }}
                  />
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
                          <TableCell padding="checkbox">
                            {currentSubTab === "not-added" ? "Thêm" : "Xóa"}
                          </TableCell>
                          <TableCell sx={{ minWidth: 80 }}>ID</TableCell>
                          <TableCell sx={{ minWidth: 100 }}>Topic</TableCell>
                          <TableCell sx={{ minWidth: 250 }}>Đề bài</TableCell>
                          <TableCell sx={{ minWidth: 150 }}>Lựa chọn</TableCell>
                          <TableCell sx={{ minWidth: 100 }}>
                            Đáp án đúng
                          </TableCell>
                          <TableCell sx={{ minWidth: 300 }}>
                            Sub Questions
                          </TableCell>
                          <TableCell sx={{ minWidth: 180 }}>Gợi ý</TableCell>
                          <TableCell sx={{ minWidth: 120 }}>Media</TableCell>
                          <TableCell sx={{ minWidth: 80 }}>Part</TableCell>
                          <TableCell sx={{ minWidth: 100 }}>Time</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {paginatedData.map((row: GeneralQuestionSchema) => {
                          const skills: MainTabType[] = [
                            "listening",
                            "reading",
                            "writing",
                            "speaking",
                            "vocabulary",
                          ];
                          const currentSkill = skills[currentTab];
                          const isAdded = addedQuestions[currentSkill].has(
                            row.id
                          );

                          return (
                            <TableRow
                              key={row.id}
                              hover
                              sx={{
                                "&:hover": {
                                  backgroundColor: theme.palette.action.hover,
                                },
                              }}
                            >
                              {/* Add/Remove Checkbox */}
                              <TableCell padding="checkbox">
                                <Checkbox
                                  checked={
                                    currentSubTab === "added" ? isAdded : false
                                  }
                                  onChange={(e) => {
                                    e.stopPropagation();
                                    if (currentSubTab === "added") {
                                      // In "Đã thêm" tab, uncheck removes from added
                                      handleQuestionToggle(row.id, false);
                                    } else {
                                      // In "Chưa thêm" tab, check adds to added
                                      handleQuestionToggle(
                                        row.id,
                                        e.target.checked
                                      );
                                    }
                                  }}
                                  color="primary"
                                  disabled={
                                    currentSubTab === "added" ? false : isAdded
                                  }
                                  sx={{
                                    "&.Mui-disabled": {
                                      color: theme.palette.action.disabled,
                                    },
                                  }}
                                />
                              </TableCell>
                              {/* ID */}
                              <TableCell>
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                  }}
                                >
                                  <Typography
                                    variant="body2"
                                    sx={{ fontWeight: "bold" }}
                                  >
                                    #{row.id}
                                  </Typography>
                                  <CopyButton
                                    text={String(row.id)}
                                    tooltip="Copy ID"
                                  />
                                </Box>
                              </TableCell>

                              {/* Topic */}
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
                                      flexGrow: 1,
                                      wordBreak: "break-word",
                                    }}
                                  >
                                    {renderHTMLContent(row.topic)}
                                  </Box>
                                  <CopyButton
                                    text={row.topic}
                                    tooltip="Copy topic"
                                  />
                                </Box>
                              </TableCell>

                              {/* Đề bài */}
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
                                    {renderHTMLContent(row.debai)}
                                  </Box>
                                  <CopyButton
                                    text={row.debai}
                                    tooltip="Copy đề bài"
                                  />
                                </Box>
                              </TableCell>

                              {/* Lựa chọn */}
                              <TableCell>
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "flex-start",
                                    gap: 1,
                                  }}
                                >
                                  {row.optionAnswer &&
                                  row.optionAnswer.length > 0 ? (
                                    <Box sx={{ maxWidth: 300 }}>
                                      {row.optionAnswer.map((answer, index) => (
                                        <Box
                                          key={answer.id}
                                          sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 1,
                                            mb: 0.5,
                                          }}
                                        >
                                          <Typography variant="body2">
                                            {String.fromCharCode(65 + index)}.{" "}
                                            {answer.content}
                                          </Typography>
                                          <CopyButton
                                            text={answer.content}
                                            tooltip={`Copy option ${String.fromCharCode(
                                              65 + index
                                            )}`}
                                          />
                                        </Box>
                                      ))}
                                    </Box>
                                  ) : (
                                    <Typography
                                      variant="body2"
                                      color="text.secondary"
                                    >
                                      -
                                    </Typography>
                                  )}
                                </Box>
                              </TableCell>

                              {/* Đáp án đúng */}
                              <TableCell>
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                    justifyContent: "center",
                                  }}
                                >
                                  {(() => {
                                    // Check if this question has subQuestions with correct answers
                                    const hasSubQuestionAnswers =
                                      row.subDebai &&
                                      row.subDebai.length > 0 &&
                                      row.subDebai.some(
                                        (sub) =>
                                          sub.correctAnswer &&
                                          sub.correctAnswer.trim() !== ""
                                      );

                                    // If it has subQuestion answers and no main correctAnswer, show subQuestion answers
                                    if (
                                      hasSubQuestionAnswers &&
                                      (!row.correctAnswer ||
                                        row.correctAnswer.trim() === "")
                                    ) {
                                      const subQuestionAnswers =
                                        getSubQuestionCorrectAnswers(
                                          row.subDebai
                                        );
                                      return subQuestionAnswers.length > 0 ? (
                                        <Box
                                          sx={{
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: 0.5,
                                            alignItems: "center",
                                          }}
                                        >
                                          {subQuestionAnswers.map(
                                            (answer, index) => (
                                              <Box
                                                key={index}
                                                sx={{
                                                  display: "flex",
                                                  alignItems: "center",
                                                  gap: 0.5,
                                                }}
                                              >
                                                <Chip
                                                  label={
                                                    row.optionAnswer
                                                      ? (() => {
                                                          const optIndex =
                                                            row.optionAnswer.findIndex(
                                                              (opt) =>
                                                                opt.content ===
                                                                answer
                                                            );
                                                          if (optIndex >= 0) {
                                                            const letter =
                                                              String.fromCharCode(
                                                                65 + optIndex
                                                              );
                                                            return answer.length >
                                                              20
                                                              ? `${letter}. ${answer.slice(
                                                                  0,
                                                                  17
                                                                )}...`
                                                              : `${letter}. ${answer}`;
                                                          }
                                                          return answer.length >
                                                            23
                                                            ? `${answer.slice(
                                                                0,
                                                                20
                                                              )}...`
                                                            : answer;
                                                        })()
                                                      : answer.length > 23
                                                      ? `${answer.slice(
                                                          0,
                                                          20
                                                        )}...`
                                                      : answer
                                                  }
                                                  color="success"
                                                  size="small"
                                                  variant="filled"
                                                  sx={{
                                                    minWidth: 40,
                                                    maxWidth: 200,
                                                    fontSize: "0.7rem",
                                                    "& .MuiChip-label": {
                                                      overflow: "hidden",
                                                      textOverflow: "ellipsis",
                                                      whiteSpace: "nowrap",
                                                    },
                                                  }}
                                                />
                                                <CopyButton
                                                  text={answer}
                                                  tooltip={`Copy correct answer ${
                                                    index + 1
                                                  }`}
                                                />
                                              </Box>
                                            )
                                          )}
                                        </Box>
                                      ) : (
                                        <Typography
                                          variant="body2"
                                          color="text.secondary"
                                        >
                                          -
                                        </Typography>
                                      );
                                    }

                                    // Handle Part 2 comma-separated correct answers
                                    if (
                                      row.part === "TWO" &&
                                      row.correctAnswer &&
                                      row.correctAnswer.includes(",")
                                    ) {
                                      const part2Answers =
                                        getPart2CorrectAnswers(
                                          row.correctAnswer,
                                          row.optionAnswer
                                        );

                                      return part2Answers.length > 0 ? (
                                        <Box
                                          sx={{
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: 0.5,
                                            alignItems: "center",
                                          }}
                                        >
                                          {part2Answers.map((answer, index) => (
                                            <Box
                                              key={index}
                                              sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 0.5,
                                              }}
                                            >
                                              <Chip
                                                label={`${index + 1}. ${
                                                  answer.length > 20
                                                    ? `${answer.slice(
                                                        0,
                                                        17
                                                      )}...`
                                                    : answer
                                                }`}
                                                color="success"
                                                size="small"
                                                variant="filled"
                                                sx={{
                                                  minWidth: 40,
                                                  maxWidth: 200,
                                                  fontSize: "0.7rem",
                                                  "& .MuiChip-label": {
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                    whiteSpace: "nowrap",
                                                  },
                                                }}
                                              />
                                              <CopyButton
                                                text={answer}
                                                tooltip={`Copy correct answer ${
                                                  index + 1
                                                }`}
                                              />
                                            </Box>
                                          ))}
                                        </Box>
                                      ) : (
                                        <Typography
                                          variant="body2"
                                          color="text.secondary"
                                        >
                                          -
                                        </Typography>
                                      );
                                    }

                                    // Handle regular questions with single correct answer
                                    if (
                                      row.correctAnswer &&
                                      row.correctAnswer.trim() !== ""
                                    ) {
                                      return (
                                        <>
                                          <Chip
                                            label={
                                              row.optionAnswer
                                                ? (() => {
                                                    const optIndex =
                                                      row.optionAnswer.findIndex(
                                                        (opt) =>
                                                          opt.id ===
                                                          row.correctAnswer
                                                      );
                                                    if (optIndex >= 0) {
                                                      const letter =
                                                        String.fromCharCode(
                                                          65 + optIndex
                                                        );
                                                      const text =
                                                        row.optionAnswer[
                                                          optIndex
                                                        ].content;
                                                      return text.length > 20
                                                        ? `${letter}. ${text.slice(
                                                            0,
                                                            17
                                                          )}...`
                                                        : `${letter}. ${text}`;
                                                    }
                                                    return row.correctAnswer;
                                                  })()
                                                : row.correctAnswer
                                            }
                                            color="success"
                                            size="small"
                                            variant="filled"
                                            sx={{
                                              minWidth: 40,
                                              maxWidth: 200,
                                              "& .MuiChip-label": {
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                whiteSpace: "nowrap",
                                              },
                                            }}
                                          />
                                          <CopyButton
                                            text={getCorrectAnswerText(
                                              row.correctAnswer,
                                              row.optionAnswer
                                            )}
                                            tooltip="Copy correct answer"
                                          />
                                        </>
                                      );
                                    }

                                    // No correct answers found
                                    return (
                                      <Typography
                                        variant="body2"
                                        color="text.secondary"
                                      >
                                        -
                                      </Typography>
                                    );
                                  })()}
                                </Box>
                              </TableCell>

                              {/* Sub Questions */}
                              <TableCell>
                                <Box sx={{ maxWidth: 350 }}>
                                  {row.subDebai && row.subDebai.length > 0 ? (
                                    <Box>
                                      {row.subDebai
                                        .filter(
                                          (sub, index) =>
                                            // Show sub questions that have title OR correct answer OR suggestion
                                            sub.title?.trim() !== "" ||
                                            sub.correctAnswer ||
                                            sub.suggestion
                                        )
                                        .map((sub, filteredIndex) => {
                                          // Get original index for display
                                          const originalIndex =
                                            row.subDebai!.indexOf(sub);

                                          return (
                                            <Box
                                              key={sub.id || originalIndex}
                                              sx={{
                                                mb: 1,
                                                p: 1,
                                                border: "1px solid",
                                                borderColor: "divider",
                                                lineClamp: 1,
                                                display: "-webkit-box",
                                                WebkitBoxOrient: "vertical",
                                                swapGap: 1,
                                                // overflow: "hidden",
                                                borderRadius: 1,
                                                maxWidth: "300px",
                                              }}
                                            >
                                              {sub.title?.trim() !== "" && (
                                                <Box
                                                  sx={{
                                                    display: "flex",
                                                    alignItems: "flex-start",
                                                    gap: 1,
                                                    mb: 0.5,
                                                  }}
                                                >
                                                  <Typography
                                                    variant="body2"
                                                    sx={{
                                                      fontWeight: "bold",
                                                      minWidth: 20,
                                                      flexShrink: 0,
                                                    }}
                                                  >
                                                    {originalIndex + 1}.
                                                  </Typography>
                                                  <Typography
                                                    variant="body2"
                                                    sx={{
                                                      flexGrow: 1,
                                                      wordBreak: "break-word",
                                                      whiteSpace: "normal",
                                                      lineHeight: 1.4,
                                                      maxWidth: "200px",
                                                    }}
                                                  >
                                                    {renderHTMLContent(
                                                      sub.title
                                                    )}
                                                  </Typography>
                                                  <Box sx={{ flexShrink: 0 }}>
                                                    <CopyButton
                                                      text={sub.title}
                                                      tooltip={`Copy sub question ${
                                                        originalIndex + 1
                                                      }`}
                                                    />
                                                  </Box>
                                                </Box>
                                              )}

                                              {sub.correctAnswer && (
                                                <Box
                                                  sx={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: 1,
                                                    mt: 0.5,
                                                    ml: 2,
                                                  }}
                                                >
                                                  <Typography
                                                    variant="caption"
                                                    color="success.main"
                                                    sx={{
                                                      fontWeight: "bold",
                                                      maxWidth: 250,
                                                      overflow: "hidden",
                                                      textOverflow: "ellipsis",
                                                      whiteSpace: "nowrap",
                                                    }}
                                                  >
                                                    Correct:{" "}
                                                    {sub.options
                                                      ? (() => {
                                                          const optEntry =
                                                            Object.entries(
                                                              sub.options
                                                            ).find(
                                                              ([key]) =>
                                                                key ===
                                                                sub.correctAnswer
                                                            );
                                                          if (optEntry) {
                                                            const optEntries =
                                                              Object.entries(
                                                                sub.options
                                                              );
                                                            const optIndex =
                                                              optEntries.findIndex(
                                                                ([key]) =>
                                                                  key ===
                                                                  sub.correctAnswer
                                                              );
                                                            if (optIndex >= 0) {
                                                              const letter =
                                                                String.fromCharCode(
                                                                  65 + optIndex
                                                                );
                                                              const text =
                                                                optEntry[1];
                                                              return text.length >
                                                                30
                                                                ? `${letter}. ${text.slice(
                                                                    0,
                                                                    27
                                                                  )}...`
                                                                : `${letter}. ${text}`;
                                                            }
                                                          }
                                                          return sub.correctAnswer;
                                                        })()
                                                      : sub.correctAnswer}
                                                  </Typography>
                                                  <CopyButton
                                                    text={
                                                      sub.options &&
                                                      sub.correctAnswer
                                                        ? Object.entries(
                                                            sub.options
                                                          ).find(
                                                            ([key]) =>
                                                              key ===
                                                              sub.correctAnswer
                                                          )?.[1] ||
                                                          sub.correctAnswer
                                                        : sub.correctAnswer ||
                                                          ""
                                                    }
                                                    tooltip="Copy sub correct answer"
                                                  />
                                                </Box>
                                              )}

                                              {sub.suggestion && (
                                                <Box
                                                  sx={{
                                                    display: "flex",
                                                    alignItems: "flex-start",
                                                    gap: 1,
                                                    mt: 0.5,
                                                    ml: 2,
                                                  }}
                                                >
                                                  <Typography
                                                    variant="caption"
                                                    color="text.secondary"
                                                  >
                                                    Hint:{" "}
                                                    {renderHTMLContent(
                                                      sub.suggestion
                                                    )}
                                                  </Typography>
                                                  <CopyButton
                                                    text={sub.suggestion}
                                                    tooltip="Copy sub suggestion"
                                                  />
                                                </Box>
                                              )}
                                            </Box>
                                          );
                                        })}
                                    </Box>
                                  ) : (
                                    <Typography
                                      variant="body2"
                                      color="text.secondary"
                                    >
                                      -
                                    </Typography>
                                  )}
                                </Box>
                              </TableCell>

                              {/* Gợi ý */}
                              <TableCell>
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "flex-start",
                                    gap: 1,
                                  }}
                                >
                                  {(() => {
                                    const suggestion =
                                      getQuestionSuggestion(row);
                                    return suggestion ? (
                                      <>
                                        <Box
                                          sx={{
                                            maxWidth: 250,
                                            wordBreak: "break-word",
                                            lineHeight: 1.4,
                                          }}
                                        >
                                          {renderHTMLContent(suggestion)}
                                        </Box>
                                        <CopyButton
                                          text={suggestion}
                                          tooltip="Copy suggestion"
                                        />
                                      </>
                                    ) : (
                                      <Typography
                                        variant="body2"
                                        color="text.secondary"
                                      >
                                        -
                                      </Typography>
                                    );
                                  })()}
                                </Box>
                              </TableCell>

                              {/* Media */}
                              <TableCell>
                                <Box
                                  sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 1,
                                  }}
                                >
                                  {(row.file || row.audioUrl) && (
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
                                          window.open(
                                            (row.audioUrl || row.file)!,
                                            "_blank"
                                          )
                                        }
                                        color="primary"
                                      >
                                        <AudioIcon />
                                      </IconButton>
                                      <CopyButton
                                        text={row.audioUrl || row.file || ""}
                                        tooltip="Copy audio file URL"
                                      />
                                    </Box>
                                  )}

                                  {row.image && (
                                    <Box>
                                      {Array.isArray(row.image) ? (
                                        row.image.map((img, index) => (
                                          <Box
                                            key={index}
                                            sx={{
                                              display: "flex",
                                              alignItems: "center",
                                              gap: 1,
                                              mb: 0.5,
                                            }}
                                          >
                                            <IconButton
                                              size="small"
                                              onClick={() =>
                                                window.open(img, "_blank")
                                              }
                                              color="secondary"
                                            >
                                              <ImageIcon />
                                            </IconButton>
                                            <Typography variant="caption">
                                              #{index + 1}
                                            </Typography>
                                            <CopyButton
                                              text={img}
                                              tooltip={`Copy image ${
                                                index + 1
                                              } URL`}
                                            />
                                          </Box>
                                        ))
                                      ) : (
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
                                              window.open(
                                                row.image as string,
                                                "_blank"
                                              )
                                            }
                                            color="secondary"
                                          >
                                            <ImageIcon />
                                          </IconButton>
                                          <CopyButton
                                            text={row.image}
                                            tooltip="Copy image URL"
                                          />
                                        </Box>
                                      )}
                                    </Box>
                                  )}

                                  {row.listeningScript && (
                                    <Box
                                      sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1,
                                      }}
                                    >
                                      <Typography
                                        variant="caption"
                                        color="info.main"
                                      >
                                        Script
                                      </Typography>
                                      <CopyButton
                                        text={row.listeningScript}
                                        tooltip="Copy listening script"
                                      />
                                    </Box>
                                  )}

                                  {!row.file &&
                                    !row.audioUrl &&
                                    !row.image &&
                                    !row.listeningScript && (
                                      <Typography
                                        variant="body2"
                                        color="text.secondary"
                                      >
                                        -
                                      </Typography>
                                    )}
                                </Box>
                              </TableCell>

                              {/* Part */}
                              <TableCell>
                                <Chip
                                  label={row.part || "N/A"}
                                  color="info"
                                  size="small"
                                  variant="outlined"
                                />
                              </TableCell>

                              {/* Time */}
                              <TableCell>
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                  }}
                                >
                                  <Typography variant="body2">
                                    {row.timeToDo ? `${row.timeToDo}min` : "-"}
                                  </Typography>
                                  {row.timeToDo && (
                                    <CopyButton
                                      text={String(row.timeToDo)}
                                      tooltip="Copy time"
                                    />
                                  )}
                                </Box>
                              </TableCell>
                            </TableRow>
                          );
                        })}

                        {paginatedData.length === 0 && (
                          <TableRow>
                            <TableCell
                              colSpan={12}
                              align="center"
                              sx={{ py: 4 }}
                            >
                              <Typography color="text.secondary">
                                {currentSubTab === "added"
                                  ? "Chưa có câu hỏi nào được thêm"
                                  : "Không tìm thấy dữ liệu"}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>

                  {/* Custom Pagination */}
                  <CustomPagination
                    count={filteredData.length}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    onPageChange={handlePageChange}
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
