export const transformCountDetailToTreeData = (countDetails) => {
  const groupByDate = new Map();
  // Nhóm theo ngày
  countDetails.forEach((item) => {
    const [date, time] = item.dateStart.split(" ");
    if (!groupByDate.has(date)) {
      groupByDate.set(date, []);
    }
    groupByDate.get(date).push(item);
  });

  // Tạo treeData
  let idCounter = 1;
  const treeData = Array.from(groupByDate.entries()).map(([date, items]) => {
    const children = items.map((i) => {
      const time = i.dateStart.split(" ")[1];
      return `${time} - điểm: ${i.score}`;
    });

    const maxScore = items.reduce((max, item) => {
      const curScore =
        typeof item.score === "string" ? Number(item.score.split(" / ")[0]) : 0;
      return Math.max(max, curScore);
    }, 0);

    const total =
      typeof items[0].score === "string" ? items[0].score.split(" / ")[1] : 0;

    return {
      id: idCounter++,
      name: `số lần: ${items.length} - Max score: ${maxScore} / ${total}`,
      children,
      date,
    };
  });

  return treeData;
};
