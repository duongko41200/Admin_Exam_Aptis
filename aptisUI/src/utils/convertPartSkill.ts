export const converPartReadingSkill = (part: number) => {
  switch (part) {
    case 1:
      return "ONE";
    case 2:
    case 3:
      return "TWO";
    case 4:
      return "THREE";
    case 5:
      return "FOUR";
    default:
      return "NULL";
  }
};