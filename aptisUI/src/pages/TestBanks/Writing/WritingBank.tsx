import { useEffect, useState } from "react";
import DataTableWriting from "../../../components/Table/DataTableWriting";
import dataProvider from "../../../providers/dataProviders/dataProvider";
import { ApiResponseItem, TestBankQuestion } from "../../../types/testBank";
import { converPartWritingSkill } from "../../../utils/convertPartSkill";

interface WritingBankProps {
  partSkill: number;
}

const WritingBank = ({ partSkill }: WritingBankProps) => {
  const handleCallApi = async () => {
    try {
      const { data } = await dataProvider.getFiltersRecord("writings", {
        partSkill: converPartWritingSkill(partSkill),
      });

      console.log("data from WritingBank.tsx: ", data);

      const mappedData: TestBankQuestion[] = (data as ApiResponseItem[]).map(
        (item: ApiResponseItem) => ({
          _id: item._id,
          id: item._id,
          title: item.title,
          subTitle: item.questions?.[0]?.questionTitle || "",
          timeToDo: item.timeToDo,
          questionPart: item.questionPart,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
          questions: item.questions,
        })
      );

      console.log({ firstMappedData: mappedData });
      setValueReading(mappedData);
    } catch (error) {
      console.error("Error fetching writing data:", error);
      setValueReading([]);
    }
  };

  useEffect(() => {
    handleCallApi();
  }, [partSkill]);

  const [valueReading, setValueReading] = useState<TestBankQuestion[]>([]);

  return (
    <>
      <DataTableWriting
        rows={valueReading}
        partSkill={partSkill}
      ></DataTableWriting>
      {/* <CheckboxList values={valueReading}></CheckboxList> */}
    </>
  );
};

export default WritingBank;
