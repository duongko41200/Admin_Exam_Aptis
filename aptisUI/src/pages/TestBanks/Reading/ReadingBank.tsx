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

const ReadingBank = ({ partSkill }) => {
  const handleCallApi = async () => {
    const { data } = await dataProvider.getFiltersRecord("readings", {
      partSkill: converPartReadingSkill(partSkill),
    });

    let mappedData = data.map((data, index) => {
      data = {
        id: data._id,
        title: data.data.title,
        timeToDo: data.data.timeToDo,
        questionPart: data.data.questions.questionPart,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      };

      return data;
    });


    // const params = { id: data._id, title: data.title, timeToDo: data.timeToDo, questionPart: data.questions.questionPart },

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
      <DataTable rows={valueReading} partSkill={partSkill}></DataTable>
      {/* <CheckboxList values={valueReading}></CheckboxList> */}
    </>
  );
};

export default ReadingBank;
