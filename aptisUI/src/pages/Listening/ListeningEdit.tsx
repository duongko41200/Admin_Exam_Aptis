import { useNotify, useRecordContext, EditBase, Title } from "react-admin";
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { boxStyles } from "../../styles";
import ListeningPartOne from "./ListeningPart/ListeningPartOne";
import ListeningPartTwo from "./ListeningPart/ListeningPartTwo";
import ListeningPartThree from "./ListeningPart/ListeningPartThree";
import ListeningPartFour from "./ListeningPart/ListeningPartFour";
import { BaseComponentProps } from "../../types/general";

const ListeningEditForm = ({ resource, dataProvider }: BaseComponentProps) => {
  const notify = useNotify();
  const navigate = useNavigate();
  const record = useRecordContext();
  const resourcePath = `/${resource}`;

  const renderListeningPart = () => {
    switch (record?.data.questions.questionPart) {
      case "ONE":
        return <ListeningPartOne dataListeningPartOne={record} statusHandler='edit' />;
      case "TWO":
        return <ListeningPartTwo dataListeningPartTwo={record} statusHandler='edit'  />;
      case "THREE":
        return <ListeningPartThree dataListeningPartThree={record} statusHandler='edit' />;
      case "FOUR":
        return <ListeningPartFour dataListeningPartFour={record} statusHandler='edit' />;
      default:
        return null;
    }
  };

  return (
    <Box sx={boxStyles}>
      <EditBase>
        <Title title="ユーザ登録　編集" />
        <Box sx={{ padding: "20px" }}>{renderListeningPart()}</Box>
      </EditBase>
    </Box>
  );
};

const ListeningEdit = (props: BaseComponentProps) => (
  <Box sx={boxStyles}>
    <EditBase>
      <ListeningEditForm {...props} />
    </EditBase>
  </Box>
);

export default ListeningEdit;
