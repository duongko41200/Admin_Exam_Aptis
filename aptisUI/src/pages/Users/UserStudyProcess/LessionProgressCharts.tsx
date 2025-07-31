import { ShowChart, ZoomIn } from "@mui/icons-material";

import {
  Box,
  Card,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Modal,
  Box as MuiBox,
  Select,
  Typography,
} from "@mui/material";
import { useMemo, useState } from "react";
import {
  Brush,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

import CustomChartTooltip from "./CustomChartTooltip";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

export default function LessonProgressCharts({ detail }: { detail: any }) {
  if (!detail || detail.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        Không có dữ liệu để hiển thị biểu đồ.
      </Typography>
    );
  }

  const [openAttemptsChart, setOpenAttemptsChart] = useState(false);
  const [openScoreChart, setOpenScoreChart] = useState(false);

  const [timeRange, setTimeRange] = useState("all");

  const lastDate = useMemo(() => {
    return dayjs(detail[detail.length - 1].date.trim(), "DD/MM/YYYY");
  }, [detail]);

  const filteredDetail = useMemo(() => {
    return detail.filter((item) => {
      const itemDate = dayjs(item.date, "DD/MM/YYYY");

      if (timeRange === "7days") {
        return itemDate.isAfter(lastDate.subtract(7, "day"));
      }
      if (timeRange === "30days") {
        return itemDate.isAfter(lastDate.subtract(30, "day"));
      }
      return true;
    });
  }, [detail, timeRange, lastDate]);

  const avgScorePerDay = useMemo(() => {
    return filteredDetail.map((item) => {
      const scores = item.children.map((entry: string) => {
        const [_, scorePart] = entry.split(" - điểm:");
        const [scoreStr] = scorePart.trim().split("/");
        return parseInt(scoreStr, 10);
      });
      const average = scores.reduce((a, b) => a + b, 0) / scores.length;

      return {
        date: dayjs(item.date, "DD/MM/YYYY").format("DD/MM"),
        dailyAverageScore: average,
        children: item.children,
      };
    });
  }, [filteredDetail]);

  const attemptsPerDay = useMemo(() => {
    return filteredDetail.map((item) => {
      const match = item.name.match(/số lượt làm:\s*(\d+)/);
      const count = match ? parseInt(match[1], 10) : item.children.length;

      return {
        date: dayjs(item.date, "DD/MM/YYYY").format("DD/MM"),
        attempts: count,
      };
    });
  }, [filteredDetail]);
  return (
    <Card
      variant="outlined"
      sx={{
        // borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        bgcolor: "grey.50",
        p: 3,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
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
            m: 0, // Remove default margin
          }}
        >
          <ShowChart />
          Biểu đồ tiến trình: {detail.lessonName}
        </Typography>
        <FormControl size="small" sx={{ width: 120 }}>
          <InputLabel id="time-range-select-label">Thời gian</InputLabel>
          <Select
            labelId="time-range-select-label"
            value={timeRange}
            label="Thời gian"
            onChange={(e) => setTimeRange(e.target.value as string)}
            sx={{ borderRadius: 2 }}
          >
            <MenuItem value="7days">7 ngày qua</MenuItem>
            <MenuItem value="30days">30 ngày qua</MenuItem>
            <MenuItem value="all">Tất cả</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={2} alignItems="stretch">
        {/* 🔹 Biểu đồ lượt làm theo ngày */}
        <Grid item xs={12} md={6} display="flex">
          <Card
            sx={{
              p: 2,
              borderRadius: 2,
              flex: 1,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
            >
              <Typography variant="subtitle1" fontWeight="bold">
                Số lượt làm theo ngày
              </Typography>
              <IconButton onClick={() => setOpenAttemptsChart(true)}>
                <ZoomIn fontSize="small" />
              </IconButton>
            </Box>
            <Box sx={{ flex: 1, width: "100%" }}>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart
                  data={attemptsPerDay}
                  margin={{ top: 5, right: 30, left: 0, bottom: 40 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    interval={4}
                    tick={{
                      fontSize: 12,
                      textAnchor: "middle",
                      dy: 10,
                    }}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis allowDecimals={false} />
                  <RechartsTooltip />
                  <Line
                    type="monotone"
                    dataKey="attempts"
                    stroke="#1976d2"
                    name="Lượt làm"
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Brush
                    dataKey="date"
                    height={20}
                    stroke="#1976d2"
                    startIndex={0}
                    endIndex={attemptsPerDay.length - 1}
                    y={300}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Card>
        </Grid>

        {/* 🔹 Biểu đồ: Điểm trung bình theo ngày với chi tiết khi hover */}
        <Grid item xs={12} md={6} display="flex" paddingBottom={0}>
          <Card
            sx={{
              px: 2,
              pt: 2,
              borderRadius: 2,
              flex: 1,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
            >
              <Typography variant="subtitle1" fontWeight="bold">
                Điểm trung bình theo ngày
              </Typography>
              <IconButton onClick={() => setOpenScoreChart(true)}>
                <ZoomIn fontSize="small" />
              </IconButton>
            </Box>
            <Box sx={{ flex: 1, width: "100%" }}>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart
                  data={avgScorePerDay}
                  margin={{ top: 5, right: 30, left: 0, bottom: 40 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    interval={4}
                    tick={{
                      fontSize: 12,
                      textAnchor: "middle",
                      dy: 10,
                    }}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis domain={[0, 5]} />
                  <RechartsTooltip content={<CustomChartTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="dailyAverageScore"
                    stroke="#2e7d32"
                    name="Điểm trung bình"
                    dot={{ fill: "#2e7d32" }}
                    activeDot={{ r: 6 }}
                  />
                  <Brush
                    dataKey="date"
                    height={20}
                    stroke="#2e7d32"
                    // travellerWidth={20}
                    startIndex={0}
                    endIndex={avgScorePerDay.length - 1}
                    y={300}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* 📈 Modal phóng to lượt làm */}
      <Modal
        open={openAttemptsChart}
        onClose={() => setOpenAttemptsChart(false)}
      >
        <MuiBox
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "80vw",
            height: "80vh",
            bgcolor: "background.paper",
            boxShadow: 24,
            borderRadius: 2,
            p: 3,
          }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography variant="h6" fontWeight="bold">
              Số lượt làm theo ngày (Chi tiết)
            </Typography>
            <IconButton onClick={() => setOpenAttemptsChart(false)}>
              ✕
            </IconButton>
          </Box>
          <ResponsiveContainer width="100%" height="90%">
            <LineChart
              data={attemptsPerDay}
              margin={{ top: 5, right: 30, left: 20, bottom: 40 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                interval={4}
                tick={{ fontSize: 12 }}
                angle={-35}
                textAnchor="end"
                height={60}
              />
              <YAxis allowDecimals={false} />
              <RechartsTooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="attempts"
                stroke="#1976d2"
                name="Lượt làm"
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </MuiBox>
      </Modal>

      {/* 📊 Modal phóng to điểm trung bình */}
      <Modal open={openScoreChart} onClose={() => setOpenScoreChart(false)}>
        <MuiBox
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "80vw",
            height: "80vh",
            bgcolor: "background.paper",
            boxShadow: 24,
            borderRadius: 2,
            p: 3,
          }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography variant="h6" fontWeight="bold">
              Điểm trung bình theo ngày (Chi tiết)
            </Typography>
            <IconButton onClick={() => setOpenScoreChart(false)}>✕</IconButton>
          </Box>
          <ResponsiveContainer width="100%" height="90%">
            <LineChart
              data={avgScorePerDay}
              margin={{ top: 5, right: 30, left: 20, bottom: 40 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                interval={4}
                tick={{ fontSize: 12 }}
                angle={-35}
                textAnchor="end"
                height={60}
              />
              <YAxis domain={[0, 5]} />
              <RechartsTooltip content={<CustomChartTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="dailyAverageScore"
                stroke="#2e7d32"
                name="Điểm trung bình"
                dot={{ fill: "#2e7d32" }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </MuiBox>
      </Modal>
    </Card>
  );
}
