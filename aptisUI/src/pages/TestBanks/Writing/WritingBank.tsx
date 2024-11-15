import dataProvider from "../../../providers/dataProviders/dataProvider";
import CheckboxList from "../../../components/ListBox/LIstBox";
import { useEffect, useState } from "react";
import {
  Datagrid,
  DeleteWithConfirmButton,
  EditButton,
  List,
  TextField,
  useRefresh,
} from "react-admin";
import { converPartReadingSkill } from "../../../utils/convertPartSkill";
import DataTable from "../../../components/Table/DataTable";
import DataTableWriting from "../../../components/Table/DataTableWriting";

const WritingBank = ({ partSkill }) => {
  const handleCallApi = async () => {
    const { data } = await dataProvider.getFiltersRecord("writings", {
      partSkill: converPartReadingSkill(partSkill),
    });

    console.log(
      "data from WritingBank.tsx: ",
      data  
    );

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

    // const params = { id: data._id, title: data.title, timeToDo: data.timeToDo, questionPart: data.questions.questionPart },
console.log({firstMappedData: mappedData})
    setValueReading(mappedData);
  };

  useEffect(() => {
    // getUserLogin()
    // refresh()
    handleCallApi();
    // fetchapi()
  }, []);

  const [valueReading, setValueReading] = useState([]);

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
