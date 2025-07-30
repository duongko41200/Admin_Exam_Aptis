export function checkStudyProgress(data: any) {
  const dateSet = new Set();
  let totalAttempts = 0;
  let notMaxScore = false;

  const parseDateOnly = (str) => {
    const [datePart] = str.split(" ");
    const [d, m, y] = datePart.split("/").map(Number);
    return new Date(y, m - 1, d); // month: 0-indexed
  };

  const parseScore = (scoreStr) => {
    const match = scoreStr.match(/^(\d+)\s*\/\s*(\d+)$/);
    if (match) {
      return [parseInt(match[0]), parseInt(match[1])];
    }
    return [0, 1]; // fallback
  };

  // 1. Duyệt từng item
  for (const item of data) {
    const details = item.countDetail || [];
    let maxX = -1;
    let maxY = -1;

    for (const detail of details) {
      // Lưu lại ngày
      if (detail.dateStart) {
        const dateOnly = detail.dateStart.split(" ")[0];
        dateSet.add(dateOnly);
      }

      // Parse score từng lượt
      if (detail.score) {
        const [x, y] = detail.score.split("/").map((s) => parseInt(s.trim()));
        if (!isNaN(x) && !isNaN(y)) {
          if (y > maxY) {
            maxY = y;
            maxX = x;
          } else if (y === maxY && x > maxX) {
            maxX = x;
          }
        }
      }
    }

    // 2. Cộng tổng số lượt làm
    totalAttempts += item.count || 0;

    // 3. Kiểm tra đạt điểm tối đa chưa
    if (maxX < maxY) {
      notMaxScore = true;
    }
  }

  // Không có ngày nào
  if (dateSet.size === 0)
    return { code: -1, message: "Không có ngày hợp lệ trong countDetail" };

  // 4. Tính ngày thiếu
  const sortedDates = Array.from(dateSet)
    .map(parseDateOnly)
    .sort((a, b) => a.getTime() - b.getTime());

  const startDate = sortedDates[0];
  const endDate = sortedDates[sortedDates.length - 1];

  const totalDays =
    Math.floor(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    ) + 1;
  const missingDays = totalDays - dateSet.size;

  // 5. Trả kết quả theo yêu cầu
  if (missingDays >= 5) {
    return { code: 1, missingDays };
  }
  if (totalAttempts < 10) {
    return { code: 2 };
  }
  if (notMaxScore) {
    return { code: 3 };
  }

  return { code: 0 };
}
