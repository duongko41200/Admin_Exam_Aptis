import { useEffect, useState } from "react";
import DataTableSpeaking from "../../../components/Table/DataTableSpeaking";
import dataProvider from "../../../providers/dataProviders/dataProvider";
import { ApiResponseItem, TestBankQuestion } from "../../../types/testBank";
import { converPartSpeakingSkill } from "../../../utils/convertPartSkill";

interface SpeakingBankProps {
  partSkill: number;
}

const SpeakingBank = ({ partSkill }: SpeakingBankProps) => {
  const [valueReading, setValueReading] = useState<TestBankQuestion[]>([]);

  const handleCallApi = async () => {
    try {
      const { data } = await dataProvider.getFiltersRecord("Speakings", {
        partSkill: converPartSpeakingSkill(partSkill),
      });

      console.log("data from SpeakingBank.tsx: ", data);

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
      console.error("Error fetching speaking data:", error);
      setValueReading([]);
    }
  };

  useEffect(() => {
    handleCallApi();
  }, [partSkill]);

  return (
    <>
      <DataTableSpeaking rows={valueReading} partSkill={partSkill} />
    </>
  );
};

export default SpeakingBank;
