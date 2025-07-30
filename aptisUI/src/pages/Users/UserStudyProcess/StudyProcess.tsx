import {
  CheckCircle,
  ChevronRight,
  Edit,
  Headphones,
  Info,
  KeyboardArrowRight,
  MenuBook,
  PlayArrow,
  Schedule,
  ShowChart,
  Star,
} from "@mui/icons-material";

import { Box, Card, IconButton, Typography } from "@mui/material";
import { useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

import {
  CardContent,
  Chip,
  Collapse,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { GridExpandMoreIcon } from "@mui/x-data-grid";
import { useRecordContext } from "react-admin";
import { transformCountDetailToTreeData } from "../../../utils/tranformTreeData";

import { checkStudyProgress } from "../../../utils/checkStudyProgress";
import LessonProgressCharts from "./LessionProgressCharts";

// các thành phần con để hiển thị chi tiết bài học
const TreeItem = ({ item, isLast }) => {
  const [expanded, setExpanded] = useState(false);
  const hasChildren = item.children && item.children.length > 0;

  return (
    <Box sx={{ pl: 2, pb: 1, position: "relative" }}>
      <Box
        display="flex"
        alignItems="center"
        sx={{ cursor: hasChildren ? "pointer" : "default" }}
        onClick={() => hasChildren && setExpanded(!expanded)}
      >
        {hasChildren ? (
          <IconButton size="small" sx={{ mr: 1 }}>
            {expanded ? <GridExpandMoreIcon /> : <ChevronRight />}
          </IconButton>
        ) : (
          <Box width={32} /> // placeholder để canh dòng
        )}

        <Typography variant="body2" fontWeight="bold" color="primary" mr={1}>
          {item.date}:
        </Typography>
        <Typography variant="body2">{item.name}</Typography>
      </Box>

      {expanded && hasChildren && (
        <Box sx={{ pl: 4, mt: 0.5 }}>
          {item.children.map((child, index) =>
            typeof child === "string" ? (
              <Box
                key={index}
                display="flex"
                alignItems="center"
                sx={{ pl: 2, position: "relative" }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    left: 0,
                    top: "12px",
                    width: 10,
                    height: "1px",
                    bgcolor: "grey.400",
                  }}
                />
                <Typography variant="body2" color="text.secondary">
                  {child}
                </Typography>
              </Box>
            ) : (
              <TreeItem
                key={child.id}
                item={child}
                isLast={index === item.children.length - 1}
              />
            )
          )}
        </Box>
      )}
    </Box>
  );
};

function StudyDetailRow({ detail }: { detail: any }) {
  if (!detail) {
    throw new TypeError("Expected detail to be defined");
  }
  const [open, setOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"details" | "charts">("details");
  const treeData = detail
    ? transformCountDetailToTreeData(detail.countDetail)
    : [];
  console.log("Transformed Tree Data:", treeData);

  const result = checkStudyProgress([detail]);
  console.log({ result });

  const getSkillConfig = (skill: string) => {
    switch (skill) {
      case "listening":
        return {
          color: "success" as const,
          icon: <Headphones fontSize="small" />,
          label: "Listening",
        };
      case "reading":
        return {
          color: "secondary" as const,
          icon: <MenuBook fontSize="small" />,
          label: "Reading",
        };
      case "writing":
        return {
          color: "error" as const,
          icon: <Edit fontSize="small" />,
          label: "Writing",
        };
      case "speaking":
        return {
          color: "warning" as const,
          icon: <PlayArrow fontSize="small" />,
          label: "Speaking",
        };
      default:
        return {
          color: "default" as const,
          icon: null,
          label: skill,
        };
    }
  };

  const getStatusConfig = (status: any) => {
    switch (status.code) {
      case 0:
        return {
          color: "success" as const,
          label: "Đạt",
          icon: <CheckCircle fontSize="small" />,
        };
      case 1:
        return {
          color: "warning" as const,
          label: "1. cần học đều đặn",
          icon: <Info fontSize="small" />,
        };
      case 2:
        return {
          color: "warning" as const,
          label: "2. Làm ít nhất 10 lượt",
          icon: <Info fontSize="small" />,
        };

      case 3:
        return {
          color: "warning" as const,
          label: "3. Chưa đạt điểm tối đa",
          icon: <Info fontSize="small" />,
        };
      default:
        return {
          color: "default" as const,
          label: "Chưa bắt đầu",
          icon: <Schedule fontSize="small" />,
        };
    }
  };

  const handleViewModeChange = (
    event: React.MouseEvent<HTMLElement>,
    newViewMode: "details" | "charts"
  ) => {
    if (newViewMode !== null) {
      setViewMode(newViewMode);
    }
  };

  const avgScorePerDay = treeData.map((item) => {
    const scores = item.children.map((entry: string) => {
      const [_, scorePart] = entry.split(" - điểm:");
      const [scoreStr, maxStr] = scorePart.trim().split("/");
      return parseInt(scoreStr, 10);
    });
    const average = scores.reduce((a, b) => a + b, 0) / scores.length;

    return {
      date: item.date,
      dailyAverageScore: average,
      children: item.children,
    };
  });

  return (
    <>
      <TableRow
        sx={{
          "&:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.02)",
          },
          cursor: "pointer",
        }}
        onClick={() => setOpen(!open)}
      >
        <TableCell sx={{ width: 40 }}>
          <IconButton
            size="small"
            sx={{
              transition: "transform 0.2s ease",
              transform: open ? "rotate(90deg)" : "rotate(0deg)",
            }}
          >
            <KeyboardArrowRight fontSize="small" />
          </IconButton>
        </TableCell>
        <TableCell>
          <Typography variant="body2" fontWeight="medium">
            {detail.name}
          </Typography>
        </TableCell>
        <TableCell>
          <Chip
            {...getSkillConfig(detail.skill)}
            label={getSkillConfig(detail.skill).label}
            size="small"
            variant="outlined"
            icon={getSkillConfig(detail.skill).icon}
          />
        </TableCell>
        <TableCell>
          <Chip
            label={`Part ${detail.numberPart}`}
            size="small"
            variant="filled"
            color="info"
          />
        </TableCell>
        <TableCell>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="body2" fontWeight="medium">
              {detail.count}
            </Typography>
          </Box>
        </TableCell>
        {/* <TableCell>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="body2" fontWeight="medium">
              {detail.score.split("/")[0]}/{detail.score.split("/")[1]}
            </Typography>
            <LinearProgress
              variant="determinate"
              value={
                (detail.score.split("/")[0] / detail.score.split("/")[1]) * 100
              }
              sx={{
                width: 60,
                height: 6,
                borderRadius: 3,
              }}
            />
          </Box>
        </TableCell> */}
        <TableCell>
          <Chip
            {...getStatusConfig(result)}
            label={getStatusConfig(result).label}
            size="small"
            variant="filled"
            icon={getStatusConfig(result).icon}
          />
        </TableCell>

        <TableCell>
          <Box
            sx={{
              width: 80,
              height: 28,
              bgcolor: "grey.100",
              borderRadius: 2,
              paddingBottom: 0.5,
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={avgScorePerDay}>
                <XAxis dataKey="date" hide />
                <YAxis hide domain={[0, 5]} />
                <Line
                  type="monotone"
                  dataKey="dailyAverageScore"
                  stroke="#2e7d32"
                  strokeWidth={1}
                  dot={{ r: 0.5 }}
                  activeDot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 2 }}>
              <Card
                variant="outlined"
                sx={{
                  borderRadius: 2,
                  bgcolor: `${viewMode === "details" ? "grey.50" : "white"}`,
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Box sx={{ display: "flex", justifyContent: "center", m: 3 }}>
                  <ToggleButtonGroup
                    value={viewMode}
                    exclusive
                    onChange={handleViewModeChange}
                    aria-label="view mode"
                    sx={{
                      bgcolor: "white",
                      borderRadius: 3,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                      "& .MuiToggleButton-root": {
                        border: "none",
                        borderRadius: "12px !important",
                        px: 3,
                        py: 1,
                        textTransform: "none",
                        fontWeight: "medium",
                        "&.Mui-selected": {
                          bgcolor: "primary.main",
                          color: "white",
                          "&:hover": {
                            bgcolor: "primary.dark",
                          },
                        },
                        "&:hover": {
                          bgcolor: "grey.100",
                        },
                      },
                    }}
                  >
                    <ToggleButton value="details" aria-label="details view">
                      <Info sx={{ mr: 1 }} fontSize="small" />
                      Chi tiết
                    </ToggleButton>
                    <ToggleButton value="charts" aria-label="charts view">
                      <ShowChart sx={{ mr: 1 }} fontSize="small" />
                      Biểu đồ
                    </ToggleButton>
                  </ToggleButtonGroup>
                </Box>

                {viewMode === "details" ? (
                  <CardContent sx={{ p: 3 }}>
                    <Typography
                      variant="subtitle1"
                      fontWeight="bold"
                      color="primary.main"
                      sx={{ mb: 2 }}
                    >
                      Chi tiết bài học: {detail.name}
                    </Typography>

                    {treeData.length > 0 ? (
                      <>
                        <div className="py-2 bg-white max-h-[calc(100vh-400px)] overflow-y-auto">
                          {treeData &&
                            treeData.map((item, index) => (
                              <TreeItem
                                key={item.id}
                                item={item}
                                isLast={index === treeData.length - 1}
                              />
                            ))}
                        </div>
                      </>
                    ) : (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        fontStyle="italic"
                      >
                        Chưa có dữ liệu chi tiết cho bài học này.
                      </Typography>
                    )}
                  </CardContent>
                ) : (
                  <LessonProgressCharts detail={treeData} />
                )}
              </Card>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

const StudyProcess = () => {
  const record = useRecordContext();
  const [open, setOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"table" | "chart">("table");

  if (!record) return null;
  console.log("Study Process Record:", record?.studyProcess?.processData);
  if (!record.studyProcess || !record.studyProcess.processData)
    return <div>No study process data available</div>;

  const processDatas = record.studyProcess.processData;

  const handleViewModeChange = (
    event: React.MouseEvent<HTMLElement>,
    newViewMode: "table" | "chart"
  ) => {
    if (newViewMode !== null) {
      setViewMode(newViewMode);
    }
  };
  return (
    <>
      {/* Add your study process details here */}

      <TableRow sx={{ width: "100% !important" }}>
        <TableCell
          style={{ paddingBottom: 0, paddingTop: 0, width: "100vw" }}
          colSpan={8}
        >
          <Collapse
            in={true}
            timeout="auto"
            unmountOnExit
            sx={{ width: "100%" }}
          >
            <Box sx={{ margin: 2 }} width="100%">
              <Card
                variant="outlined"
                sx={{
                  borderRadius: 3,
                  border: "1px solid",
                  borderColor: "divider",
                  bgcolor: "grey.50",
                  width: "100%",
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      color: "primary.main",
                      fontWeight: "bold",
                      mb: 3,
                    }}
                  >
                    <MenuBook />
                    Chi tiết tiến trình học tập
                  </Typography>

                  <Paper
                    elevation={0}
                    sx={{
                      borderRadius: 2,
                      overflow: "hidden",
                      border: "1px solid",
                      borderColor: "divider",
                    }}
                  >
                    <Box
                      sx={{ display: "flex", justifyContent: "center", mb: 3 }}
                    ></Box>
                    <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow sx={{ bgcolor: "primary.50" }}>
                            <TableCell
                              sx={{
                                fontWeight: "bold",
                                color: "primary.main",
                              }}
                            ></TableCell>
                            <TableCell
                              sx={{
                                fontWeight: "bold",
                                color: "primary.main",
                              }}
                            >
                              Tên bài
                            </TableCell>
                            <TableCell
                              sx={{
                                fontWeight: "bold",
                                color: "primary.main",
                              }}
                            >
                              Kỹ năng
                            </TableCell>
                            <TableCell
                              sx={{
                                fontWeight: "bold",
                                color: "primary.main",
                              }}
                            >
                              Part
                            </TableCell>
                            <TableCell
                              sx={{
                                fontWeight: "bold",
                                color: "primary.main",
                              }}
                            >
                              Số lượt làm
                            </TableCell>
                            {/* <TableCell
                              sx={{
                                fontWeight: "bold",
                                color: "primary.main",
                              }}
                            >
                              Điểm số
                            </TableCell> */}
                            <TableCell
                              sx={{
                                fontWeight: "bold",
                                color: "primary.main",
                              }}
                            >
                              Trạng thái
                            </TableCell>
                            <TableCell
                              sx={{
                                fontWeight: "bold",
                                color: "primary.main",
                              }}
                            >
                              Tiến độ
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          <>
                            {processDatas.map((processData, index) => (
                              <StudyDetailRow
                                detail={processData}
                                key={index}
                              />
                            ))}
                          </>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Paper>
                </CardContent>
              </Card>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

export default StudyProcess;
