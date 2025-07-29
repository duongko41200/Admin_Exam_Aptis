import {
  CheckCircle,
  Edit,
  Headphones,
  KeyboardArrowRight,
  MenuBook,
  PlayArrow,
  Schedule,
  ShowChart,
  Star,
  TableChart,
} from "@mui/icons-material";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import {
  Box,
  Card,
  CardContent,
  Chip,
  Collapse,
  Grid,
  ToggleButtonGroup,
  IconButton,
  LinearProgress,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  ToggleButton,
  Typography,
} from "@mui/material";
import { useState } from "react";
import {
  Datagrid,
  DeleteWithConfirmButton,
  EditButton,
  List,
  TextField,
  useRecordContext,
} from "react-admin";
import { CustomButtonByRoleDelete } from "../../components/CustomButtonByRoleDelete";
import { CustomButtonByRoleEdit } from "../../components/CustomButtonByRoleEdit";
import { ListToolBar } from "../../components/ListToolBar";
import { validRole } from "../../core/role/permissions";
import { BaseComponentProps } from "../../types/general";
import { transformCountDetailToTreeData } from "../../utils/tranformTreeData";

// Fake data cho biểu đồ
const generateChartData = (details) => {
  const chartData = [];
  const dates = [
    "2024-01-15",
    "2024-01-18",
    "2024-01-20",
    "2024-01-22",
    "2024-01-25",
    "2024-01-28",
    "2024-01-30",
  ];

  dates.forEach((date, index) => {
    const dataPoint: any = {
      date: new Date(date).toLocaleDateString("vi-VN", {
        month: "short",
        day: "numeric",
      }),
      fullDate: date,
    };

    details.forEach((detail) => {
      if (detail.score) {
        // Tạo progression data giả lập
        const baseScore = detail.score;
        const variation = Math.random() * 20 - 10; // ±10 points variation
        const progressionScore = Math.max(
          0,
          Math.min(100, baseScore + variation - (dates.length - index - 1) * 5)
        );
        dataPoint[`${detail.lessonName}`] = Math.round(progressionScore);
      }
    });

    chartData.push(dataPoint);
  });

  return chartData;
};

function StudyProgressChart({ details }: { details }) {
  const chartData = generateChartData(details);
  const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#00ff00"];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <Card
          sx={{
            p: 2,
            boxShadow: 3,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
            {label}
          </Typography>
          {payload.map((entry: any, index: number) => (
            <Box
              key={index}
              sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}
            >
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  bgcolor: entry.color,
                }}
              />
              <Typography variant="body2">
                {entry.dataKey}: <strong>{entry.value}%</strong>
              </Typography>
            </Box>
          ))}
        </Card>
      );
    }
    return null;
  };

  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        bgcolor: "grey.50",
        p: 3,
      }}
    >
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
        <ShowChart />
        Biểu đồ tiến trình học tập
      </Typography>

      <Box sx={{ width: "100%", height: 400 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <defs>
              {details
                .filter((d) => d.score)
                .map((detail, index) => (
                  <linearGradient
                    key={detail.id}
                    id={`gradient${index}`}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor={colors[index]}
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor={colors[index]}
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12 }}
              tickLine={{ stroke: "#e0e0e0" }}
              axisLine={{ stroke: "#e0e0e0" }}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fontSize: 12 }}
              tickLine={{ stroke: "#e0e0e0" }}
              axisLine={{ stroke: "#e0e0e0" }}
              label={{
                value: "Điểm số (%)",
                angle: -90,
                position: "insideLeft",
              }}
            />
            <RechartsTooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{
                paddingTop: "20px",
                fontSize: "14px",
              }}
            />
            {details
              .filter((detail) => detail.score)
              .map((detail, index) => (
                <Area
                  key={detail.id}
                  type="monotone"
                  dataKey={detail.lessonName}
                  stroke={colors[index]}
                  strokeWidth={3}
                  fill={`url(#gradient${index})`}
                  dot={{ fill: colors[index], strokeWidth: 2, r: 6 }}
                  activeDot={{
                    r: 8,
                    stroke: colors[index],
                    strokeWidth: 2,
                    fill: "#fff",
                  }}
                />
              ))}
          </AreaChart>
        </ResponsiveContainer>
      </Box>

      <Grid container spacing={2} sx={{ mt: 2 }}>
        {details
          .filter((detail) => detail.score)
          .map((detail, index) => (
            <Grid item xs={12} sm={6} md={4} key={detail.id}>
              <Card
                sx={{
                  p: 2,
                  bgcolor: "white",
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
                >
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      bgcolor: colors[index],
                    }}
                  />
                  <Typography variant="body2" fontWeight="medium">
                    {detail.lessonName}
                  </Typography>
                </Box>
                <Typography variant="h6" color="primary.main" fontWeight="bold">
                  {detail.score}%
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Điểm số hiện tại
                </Typography>
              </Card>
            </Grid>
          ))}
      </Grid>
    </Card>
  );
}

//// TRee Item Component

const TreeItem = ({ item, isLast }) => {
	const [expanded, setExpanded] = useState(false);

	return (
		<div className="relative pl-2 pb-4">
			{/* Vertical connector from parent */}
			{/* {!isLast && (
        <div className="absolute top-0 left-[10px] bottom-0 w-px bg-gray-400"></div>
      )} */}

			<div
				className="flex items-center cursor-pointer relative"
				onClick={() => item.children.length && setExpanded(!expanded)}
			>
				{/* Horizontal line to circle */}
				<div className="absolute left-0 top-1/2 w-[10px] h-px bg-gray-400"></div>

				{/* Circle icon */}
				<div
					className={`w-4 h-4 rounded-full text-white text-xs font-bold flex items-center justify-center ${
						item.children.length
							? expanded
								? 'bg-blue-500'
								: 'bg-purple-500'
							: 'bg-gray-400'
					}`}
				>
					{item.children.length ? (expanded ? '-' : '+') : ''}
				</div>

				<div className="flex gap-2 items-center ml-2">
					<div className="font-bold text-blue-800">{item.date}:</div>
					<div>{item.name}</div>
				</div>

				{/* <span className="ml-2">{item.name}</span> */}
			</div>

			{expanded && item.children.length > 0 && (
				<ul className="pl-4 mt-1">
					{item.children.map((child, index) => (
						<li key={index} className="relative pl-6">
							{/* vertical line before text */}
							{index !== item.children.length - 1 && (
								<div className="absolute top-0 left-[0] bottom-0 w-px bg-gray-300"></div>
							)}
							{/* horizontal line to item */}
							<div className="absolute left-[5px] top-2 w-[10px] h-px bg-gray-300"></div>

							<span className="ml-2 text-gray-500">{child}</span>
						</li>
					))}
				</ul>
			)}
		</div>
	);
};

function StudyDetailRow({ detail }: { detail: any }) {
  const [open, setOpen] = useState(false);
  const treeData = detail
    ? transformCountDetailToTreeData(detail.countDetail)
    : [];
  console.log("Transformed Tree Data:", treeData);

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
          icon: <Edit fontSize="small" />, // Or use another icon for writing
          label: "Writing",
        };
      case "speaking":
        return {
          color: "warning" as const,
          icon: <PlayArrow fontSize="small" />, // Or use another icon for speaking
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

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "completed":
        return {
          color: "success" as const,
          label: "Hoàn thành",
          icon: <CheckCircle fontSize="small" />,
        };
      case "in-progress":
        return {
          color: "warning" as const,
          label: "Đang học",
          icon: <PlayArrow fontSize="small" />,
        };
      default:
        return {
          color: "default" as const,
          label: "Chưa bắt đầu",
          icon: <Schedule fontSize="small" />,
        };
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "success";
      case "medium":
        return "warning";
      case "hard":
        return "error";
      default:
        return "default";
    }
  };

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
            {...getStatusConfig(detail.status)}
            label={getStatusConfig(detail.status).label}
            size="small"
            variant="filled"
            icon={getStatusConfig(detail.status).icon}
          />
        </TableCell>
        <TableCell>
          {detail.score ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Star fontSize="small" color="warning" />
              <Typography
                variant="body2"
                fontWeight="bold"
                color="warning.main"
              >
                {detail.score}%
              </Typography>
            </Box>
          ) : (
            <Typography variant="body2" color="text.secondary">
              --
            </Typography>
          )}
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
                  bgcolor: "grey.50",
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
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
          style={{ paddingBottom: 0, paddingTop: 0, width: "100%" }}
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
                  <ToggleButton value="table" aria-label="table view">
                    <TableChart sx={{ mr: 1 }} fontSize="small" />
                    Bảng
                  </ToggleButton>
                  <ToggleButton value="chart" aria-label="chart view">
                    <ShowChart sx={{ mr: 1 }} fontSize="small" />
                    Biểu đồ
                  </ToggleButton>
                </ToggleButtonGroup>
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
                          {viewMode === "table" ? (
                            <>
                              {processDatas.map((processData, index) => (
                                <StudyDetailRow
                                  detail={processData}
                                  key={index}
                                />
                              ))}
                            </>
                          ) : (
                            <StudyProgressChart details={processData} />
                          )}
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

const UserList = ({ actions, resource, dataProvider }: BaseComponentProps) => {
  return (
    <List
      title="管理ユーザー　一覧"
      actions={
        <ListToolBar
          resource={resource}
          isShowCreate={validRole("create", actions)}
        />
      }
    >
      <Datagrid
        rowClick="show"
        bulkActionButtons={false}
        expand={<StudyProcess />}
      >
        <TextField source="no" label="NO" />
        <TextField source="name" label="User" />
        <TextField source="email" label="Email" />
        <TextField source="phone" label="Số điện thoại" />
        <TextField source="roles" label="Role" />

        {validRole("delete", actions) && (
          <CustomButtonByRoleDelete source="role" label="Xóa">
            <DeleteWithConfirmButton
              confirmContent="よろしいですか?"
              confirmTitle="削除"
              label="Xóa"
              confirmColor="warning"
            ></DeleteWithConfirmButton>
          </CustomButtonByRoleDelete>
        )}

        {validRole("edit", actions) && (
          <CustomButtonByRoleEdit
            source="role"
            label="Chỉnh Sửa"
            // userLogin={userLogin}
          >
            <EditButton label="Edit"></EditButton>
          </CustomButtonByRoleEdit>
        )}
      </Datagrid>
    </List>
  );
};

export default UserList;
