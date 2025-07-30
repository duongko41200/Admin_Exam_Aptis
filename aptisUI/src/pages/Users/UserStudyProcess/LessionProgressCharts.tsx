import {
    ShowChart,
    ZoomIn
} from "@mui/icons-material";

import {
    Box,
    Card, Grid,
    IconButton, Modal, Box as MuiBox, Typography
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
  detail = [
    {
      id: 1,
      name: "số lượt làm: 3 - Max score: 0 / 1",
      children: [
        "14:41 - điểm: 0 / 1",
        "16:27 - điểm: 0 / 1",
        "16:27 - điểm: 0 / 1",
      ],
      date: "29/07/2025",
    },
    {
      id: 1,
      name: "số lượt làm: 3 - Max score: 1 / 1",
      children: [
        "14:41 - điểm: 1 / 1",
        "16:27 - điểm: 0 / 1",
        "16:27 - điểm: 0 / 1",
      ],
      date: "30/07/2025",
    },
    {
      id: 1,
      name: "số lượt làm: 10 - Max score: 0 / 1",
      children: [
        "14:41 - điểm: 0 / 1",
        "16:27 - điểm: 0 / 1",
        "16:27 - điểm: 0 / 1",
      ],
      date: "1/08/2025",
    },
    {
      id: 1,
      name: "số lượt làm: 6 - Max score: 1 / 1",
      children: [
        "14:41 - điểm: 1 / 5",
        "16:27 - điểm: 2 / 5",
        "16:27 - điểm: 4 / 5",
        "17:27 - điểm: 1 / 5",
      ],
      date: "3/08/2025",
    },
    {
      id: 1,
      name: "số lượt làm: 10 - Max score: 0 / 1",
      children: [
        "14:41 - điểm: 0 / 1",
        "16:27 - điểm: 0 / 1",
        "16:27 - điểm: 0 / 1",
      ],
      date: "4/08/2025",
    },
    {
      id: 1,
      name: "số lượt làm: 6 - Max score: 1 / 1",
      children: [
        "14:41 - điểm: 1 / 5",
        "16:27 - điểm: 2 / 5",
        "16:27 - điểm: 4 / 5",
        "17:27 - điểm: 1 / 5",
      ],
      date: "5/08/2025",
    },
    {
      id: 1,
      name: "số lượt làm: 10 - Max score: 0 / 1",
      children: [
        "14:41 - điểm: 0 / 1",
        "16:27 - điểm: 0 / 1",
        "16:27 - điểm: 0 / 1",
      ],
      date: "6/08/2025",
    },
    {
      id: 1,
      name: "số lượt làm: 6 - Max score: 1 / 1",
      children: [
        "14:41 - điểm: 1 / 5",
        "16:27 - điểm: 2 / 5",
        "16:27 - điểm: 4 / 5",
        "17:27 - điểm: 1 / 5",
      ],
      date: "7/08/2025",
    },
    {
      id: 1,
      name: "số lượt làm: 10 - Max score: 0 / 1",
      children: [
        "14:41 - điểm: 0 / 1",
        "16:27 - điểm: 0 / 1",
        "16:27 - điểm: 0 / 1",
      ],
      date: "8/08/2025",
    },
    {
      id: 1,
      name: "số lượt làm: 6 - Max score: 1 / 1",
      children: [
        "14:41 - điểm: 1 / 5",
        "16:27 - điểm: 2 / 5",
        "16:27 - điểm: 4 / 5",
        "17:27 - điểm: 1 / 5",
      ],
      date: "9/08/2025",
    },
    {
      id: 1,
      name: "số lượt làm: 10 - Max score: 0 / 1",
      children: [
        "14:41 - điểm: 0 / 1",
        "16:27 - điểm: 0 / 1",
        "16:27 - điểm: 0 / 1",
      ],
      date: "10/08/2025",
    },
    {
      id: 1,
      name: "số lượt làm: 6 - Max score: 1 / 1",
      children: [
        "14:41 - điểm: 1 / 5",
        "16:27 - điểm: 2 / 5",
        "16:27 - điểm: 4 / 5",
        "17:27 - điểm: 1 / 5",
      ],
      date: "11/08/2025",
    },

    // Các phần tử tự động thêm từ ngày 12/08 đến 31/08
    // Copy bên dưới vào trong mảng nếu bạn đang dùng JSON hoặc JS

    {
      id: 100,
      name: "số lượt làm: 6 - Max score: 1 / 1",
      children: [
        "14:41 - điểm: 1 / 5",
        "16:27 - điểm: 2 / 5",
        "16:27 - điểm: 4 / 5",
        "17:27 - điểm: 1 / 5",
      ],
      date: "12/08/2025",
    },
    {
      id: 101,
      name: "số lượt làm: 10 - Max score: 0 / 1",
      children: [
        "14:41 - điểm: 0 / 1",
        "16:27 - điểm: 0 / 1",
        "16:27 - điểm: 0 / 1",
      ],
      date: "13/08/2025",
    },
    {
      id: 102,
      name: "số lượt làm: 6 - Max score: 1 / 1",
      children: [
        "14:41 - điểm: 1 / 5",
        "16:27 - điểm: 2 / 5",
        "16:27 - điểm: 4 / 5",
        "17:27 - điểm: 1 / 5",
      ],
      date: "14/08/2025",
    },
    {
      id: 103,
      name: "số lượt làm: 10 - Max score: 0 / 1",
      children: [
        "14:41 - điểm: 0 / 1",
        "16:27 - điểm: 0 / 1",
        "16:27 - điểm: 0 / 1",
      ],
      date: "15/08/2025",
    },
    {
      id: 104,
      name: "số lượt làm: 6 - Max score: 1 / 1",
      children: [
        "14:41 - điểm: 1 / 5",
        "16:27 - điểm: 2 / 5",
        "16:27 - điểm: 4 / 5",
        "17:27 - điểm: 1 / 5",
      ],
      date: "16/08/2025",
    },
    {
      id: 105,
      name: "số lượt làm: 10 - Max score: 0 / 1",
      children: [
        "14:41 - điểm: 0 / 1",
        "16:27 - điểm: 0 / 1",
        "16:27 - điểm: 0 / 1",
      ],
      date: "17/08/2025",
    },
    {
      id: 106,
      name: "số lượt làm: 6 - Max score: 1 / 1",
      children: [
        "14:41 - điểm: 1 / 5",
        "16:27 - điểm: 2 / 5",
        "16:27 - điểm: 4 / 5",
        "17:27 - điểm: 1 / 5",
      ],
      date: "18/08/2025",
    },
    {
      id: 107,
      name: "số lượt làm: 10 - Max score: 0 / 1",
      children: [
        "14:41 - điểm: 0 / 1",
        "16:27 - điểm: 0 / 1",
        "16:27 - điểm: 0 / 1",
      ],
      date: "19/08/2025",
    },
    {
      id: 108,
      name: "số lượt làm: 6 - Max score: 1 / 1",
      children: [
        "14:41 - điểm: 1 / 5",
        "16:27 - điểm: 2 / 5",
        "16:27 - điểm: 4 / 5",
        "17:27 - điểm: 1 / 5",
      ],
      date: "20/08/2025",
    },
    {
      id: 109,
      name: "số lượt làm: 10 - Max score: 0 / 1",
      children: [
        "14:41 - điểm: 0 / 1",
        "16:27 - điểm: 0 / 1",
        "16:27 - điểm: 0 / 1",
      ],
      date: "21/08/2025",
    },
    {
      id: 110,
      name: "số lượt làm: 6 - Max score: 1 / 1",
      children: [
        "14:41 - điểm: 1 / 5",
        "16:27 - điểm: 2 / 5",
        "16:27 - điểm: 4 / 5",
        "17:27 - điểm: 1 / 5",
      ],
      date: "22/08/2025",
    },
    {
      id: 111,
      name: "số lượt làm: 10 - Max score: 0 / 1",
      children: [
        "14:41 - điểm: 0 / 1",
        "16:27 - điểm: 0 / 1",
        "16:27 - điểm: 0 / 1",
      ],
      date: "23/08/2025",
    },
    {
      id: 112,
      name: "số lượt làm: 6 - Max score: 1 / 1",
      children: [
        "14:41 - điểm: 1 / 5",
        "16:27 - điểm: 2 / 5",
        "16:27 - điểm: 4 / 5",
        "17:27 - điểm: 1 / 5",
      ],
      date: "24/08/2025",
    },
    {
      id: 113,
      name: "số lượt làm: 10 - Max score: 0 / 1",
      children: [
        "14:41 - điểm: 0 / 1",
        "16:27 - điểm: 0 / 1",
        "16:27 - điểm: 0 / 1",
      ],
      date: "25/08/2025",
    },
    {
      id: 114,
      name: "số lượt làm: 6 - Max score: 1 / 1",
      children: [
        "14:41 - điểm: 1 / 5",
        "16:27 - điểm: 2 / 5",
        "16:27 - điểm: 4 / 5",
        "17:27 - điểm: 1 / 5",
      ],
      date: "26/08/2025",
    },
    {
      id: 115,
      name: "số lượt làm: 10 - Max score: 0 / 1",
      children: [
        "14:41 - điểm: 0 / 1",
        "16:27 - điểm: 0 / 1",
        "16:27 - điểm: 0 / 1",
      ],
      date: "27/08/2025",
    },
    {
      id: 116,
      name: "số lượt làm: 6 - Max score: 1 / 1",
      children: [
        "14:41 - điểm: 1 / 5",
        "16:27 - điểm: 2 / 5",
        "16:27 - điểm: 4 / 5",
        "17:27 - điểm: 1 / 5",
      ],
      date: "28/08/2025",
    },
    {
      id: 117,
      name: "số lượt làm: 10 - Max score: 0 / 1",
      children: [
        "14:41 - điểm: 0 / 1",
        "16:27 - điểm: 0 / 1",
        "16:27 - điểm: 0 / 1",
      ],
      date: "29/08/2025",
    },
    {
      id: 118,
      name: "số lượt làm: 6 - Max score: 1 / 1",
      children: [
        "14:41 - điểm: 1 / 5",
        "16:27 - điểm: 2 / 5",
        "16:27 - điểm: 4 / 5",
        "17:27 - điểm: 1 / 5",
      ],
      date: "30/08/2025",
    },
    {
      id: 119,
      name: "số lượt làm: 10 - Max score: 0 / 1",
      children: [
        "14:41 - điểm: 0 / 1",
        "16:27 - điểm: 0 / 1",
        "16:27 - điểm: 0 / 1",
      ],
      date: "31/08/2025",
    },
  ];

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
