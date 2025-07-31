import { Box, Card, Typography } from "@mui/material";

export default function CustomChartTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    const dataPoint = payload[0].payload;
    const date = dataPoint.date;

    return (
      <Card
        sx={{ p: 2, boxShadow: 3, border: "1px solid", borderColor: "divider" }}
      >
        <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
          Ngày: {date}
        </Typography>

        {dataPoint.dailyAverageScore !== undefined && (
          <Typography variant="body2" sx={{ mb: 1 }}>
            Điểm trung bình:{" "}
            <strong>{Math.round(dataPoint.dailyAverageScore)}%</strong>
          </Typography>
        )}

        {dataPoint.children && dataPoint.children.length > 0 && (
          <Box>
            <Typography variant="body2" fontWeight="bold" sx={{ mb: 0.5 }}>
              Chi tiết từng lượt làm
            </Typography>

            <Typography
              variant="body2"
              sx={{ mb: 0.5, textDecorationLine: "underline" }}
            >
              Tổng số lượt làm: {dataPoint.children.length}
            </Typography>
            {dataPoint.children.map((entry: string, index: number) => (
              <Typography variant="body2" key={index}>
                - {entry}
              </Typography>
            ))}
          </Box>
        )}
      </Card>
    );
  }
  return null;
}
