import { useEffect, useState } from "react";
import DataTableReading from "../../../components/Table/DataTableReading";
import dataProvider from "../../../providers/dataProviders/dataProvider";
import { ApiResponseItem, TestBankQuestion } from "../../../types/testBank";
import { converPartReadingSkill } from "../../../utils/convertPartSkill";

interface ReadingBankProps {
  partSkill: number;
}

const ReadingBank = ({ partSkill }: ReadingBankProps) => {
  const [valueReading, setValueReading] = useState<TestBankQuestion[]>([]);

  const handleCallApi = async () => {
    try {
      const { data } = await dataProvider.getFiltersRecord("readings", {
        partSkill: converPartReadingSkill(partSkill),
      });

      console.log("data from ReadingBank.tsx: ", data);

      const mappedData: TestBankQuestion[] = (data as ApiResponseItem[]).map(
        (item: ApiResponseItem) => ({
          _id: item._id,
          id: item._id,
          title: item.data?.title || item.title || "",
          subTitle: item.data?.questions?.questionTitle || "",
          timeToDo: item.data?.timeToDo || item.timeToDo || "",
          questionPart:
            item.data?.questions?.questionPart || item.questionPart || "",
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
          questions: item.data?.questions
            ? [item.data.questions]
            : item.questions,
        })
      );

      console.log({ firstMappedData: mappedData });
      setValueReading(mappedData);
    } catch (error) {
      console.error("Error fetching reading data:", error);
      setValueReading([]);
    }
  };

  useEffect(() => {
    handleCallApi();
  }, [partSkill]);

  return (
    <>
      <DataTableReading rows={valueReading} partSkill={partSkill} />
    </>
  );
};

export default ReadingBank;
