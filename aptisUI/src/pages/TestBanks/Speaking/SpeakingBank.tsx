import dataProvider from "../../../providers/dataProviders/dataProvider";
import { useEffect, useState } from "react";

import { converPartSpeakingSkill } from "../../../utils/convertPartSkill";
import DataTableSpeaking from "../../../components/Table/DataTableSpeaking";

const SpeakingBank = ({ partSkill }) => {
  const handleCallApi = async () => {
    const { data } = await dataProvider.getFiltersRecord("Speakings", {
      partSkill: converPartSpeakingSkill(partSkill),
    });

    console.log("data from SpeakingBank.tsx: ", data);

    let mappedData = data.map((data, index) => {
      data = {
        id: data._id,
        title: data.title,
        subTitle: data.questions[0].questionTitle,
        timeToDo: data.timeToDo,
        questionPart: data.questionPart,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      };

      return data;
    });

    console.log({ firstMappedData: mappedData });
    setValueReading(mappedData);
  };

  useEffect(() => {
    handleCallApi();
  }, []);

  const [valueReading, setValueReading] = useState([]);

  return (
    <>
      <DataTableSpeaking
        rows={valueReading}
        partSkill={partSkill}
      ></DataTableSpeaking>
      {/* <CheckboxList values={valueReading}></CheckboxList> */}
    </>
  );
};

export default SpeakingBank;
