import dayjs from "dayjs";

export const convertDate = (date: string) => {
  return dayjs(date).format("DD/MM/YYYY  HH:mm:ss");
};
