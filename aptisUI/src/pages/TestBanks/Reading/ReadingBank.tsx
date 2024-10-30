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

const ReadingBank = ({partSkill}) => {


  const handleCallApi = async () => { 

    const {data} = await dataProvider.getFiltersRecord("readings", {

      partSkill:"FOUR"
    })
    setValueReading(data)

    console.log({data})
  }
  useEffect(() => {
    // getUserLogin()
    // refresh()
    handleCallApi()
    // fetchapi()
  }, [])

  const [valueReading, setValueReading] = useState();

  return (
    <>
      <CheckboxList values={valueReading}></CheckboxList>
    </>
  );
};

export default ReadingBank;
