import { useEffect, useState } from "react";
import DataTableListening from "../../../components/Table/DataTableListening";
import dataProvider from "../../../providers/dataProviders/dataProvider";
import { ApiResponseItem, TestBankQuestion } from "../../../types/testBank";
import { converPartListeningSkill } from "../../../utils/convertPartSkill";

interface ListeningBankProps {
  partSkill: number;
}

const ListeningBank = ({ partSkill }: ListeningBankProps) => {
  const [valueReading, setValueReading] = useState<TestBankQuestion[]>([]);

  const handleCallApi = async () => {
    try {
      const { data } = await dataProvider.getFiltersRecord("listenings", {
        partSkill: converPartListeningSkill(partSkill),
      });

      console.log("data from ListeningBank.tsx: ", data);

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
      console.error("Error fetching listening data:", error);
      setValueReading([]);
    }
  };

  useEffect(() => {
    handleCallApi();
  }, [partSkill]);

  return (
    <>
      <DataTableListening rows={valueReading} partSkill={partSkill} />
    </>
  );
};

export default ListeningBank;
