import { ShowChart, ZoomIn } from "@mui/icons-material";

import {
  Box,
  Card,
  Grid,
  IconButton,
  Modal,
  Box as MuiBox,
  Typography,
} from "@mui/material";
import { useState } from "react";
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

  const avgScorePerDay = detail.map((item) => {
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

  const attemptsPerDay = detail.map((item) => {
    const match = item.name.match(/số lượt làm:\s*(\d+)/);
    const count = match ? parseInt(match[1], 10) : item.children.length;

    return {
      date: item.date,
      attempts: count,
    };
  });

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
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography
          variant="h6"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            color: "primary.main",
            fontWeight: "bold",
          }}
        >
          <ShowChart /> Biểu đồ tiến trình bài học
        </Typography>
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
                  <Brush
                    dataKey="date"
                    height={20}
                    stroke="#1976d2"
                    startIndex={0}
                    endIndex={attemptsPerDay.length - 1}
                    y={330}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Card>
        </Grid>

        {/* 🔹 Biểu đồ: Điểm trung bình theo ngày với chi tiết khi hover */}
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
                  <Brush
                    dataKey="date"
                    height={20}
                    stroke="#2e7d32"
                    // travellerWidth={20}
                    startIndex={0}
                    endIndex={avgScorePerDay.length - 1}
                    y={330}
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
