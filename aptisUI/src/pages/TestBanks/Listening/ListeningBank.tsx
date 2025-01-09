import dataProvider from "../../../providers/dataProviders/dataProvider";
import { useEffect, useState } from "react";

import { converPartReadingSkill } from "../../../utils/convertPartSkill";
import DataTableListening from "../../../components/Table/DataTableListening";

const ListeningBank = ({ partSkill }) => {

	console.error("ListeningBank: ", partSkill);
  const handleCallApi = async () => {
    const { data } = await dataProvider.getFiltersRecord("listenings", {
      partSkill: converPartReadingSkill(partSkill),
    });

    console.log({ data });

    let mappedData = data.map((data, index) => {
      data = {
        id: data._id,
        title: data.data.title,
        subTitle: data.data.questions.questionTitle,
        timeToDo: data.data.timeToDo,
        questionPart: data.data.questions.questionPart,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      };

      return data;
    });

    setValueReading(mappedData);
  };

  useEffect(() => {
    handleCallApi();
  }, []);

  const [valueReading, setValueReading] = useState([]);

  return (
    <>
      <DataTableListening rows={valueReading} partSkill={partSkill}></DataTableListening>
      {/* <CheckboxList values={valueReading}></CheckboxList> */}
    </>
  );
};

export default ListeningBank;
