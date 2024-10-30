import CheckboxList from "../../../components/ListBox/LIstBox";
import { useState } from "react";
import {
  Datagrid,
  DeleteWithConfirmButton,
  EditButton,
  List,
  TextField,
  useRefresh,
} from "react-admin";

const ReadingBank = () => {
  // useEffect(() => {
  //   // getUserLogin()
  //   // refresh()

  //   fetchapi()
  // }, [])

  const [valueReading, setValueReading] = useState([
    {id: 1, value: "Reading 1"},
    {id: 2, value: "Reading 2"},
  ]);

  return (
    <>
      <CheckboxList values={valueReading}></CheckboxList>
    </>
  );
};

export default ReadingBank;
