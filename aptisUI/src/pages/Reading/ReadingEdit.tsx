import { useNotify, useRecordContext, EditBase, Title } from "react-admin";
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { boxStyles } from "../../styles";
import ReadingPartOne from "./ReadingPart/ReadingPartOne";
import ReadingPartTwo from "./ReadingPart/ReadingPartTwo";
import ReadingPartThree from "./ReadingPart/ReadingPartThree";
import ReadingPartFour from "./ReadingPart/ReadingPartFour";
import { BaseComponentProps } from "../../types/general";

const ReadingEditForm = ({ resource, dataProvider }: BaseComponentProps) => {
  const notify = useNotify();
  const navigate = useNavigate();
  const record = useRecordContext();
  const resourcePath = `/${resource}`;

  const renderReadingPart = () => {
    switch (record?.data.questions.questionPart) {
      case "ONE":
        return <ReadingPartOne dataReadingPartOne={record} statusHandler='edit' />;
      case "TWO":
        return <ReadingPartTwo dataReadingPartTwo={record} statusHandler='edit'  />;
      case "THREE":
        return <ReadingPartThree dataReadingPartThree={record} statusHandler='edit' />;
      case "FOUR":
        return <ReadingPartFour dataReadingPartFour={record} statusHandler='edit' />;
      default:
        return null;
    }
  };

  return (
    <Box sx={boxStyles}>
      <EditBase>
        <Title title="ユーザ登録　編集" />
        <Box sx={{ padding: "20px" }}>{renderReadingPart()}</Box>
      </EditBase>
    </Box>
  );
};

const ReadingEdit = (props: BaseComponentProps) => (
  <Box sx={boxStyles}>
    <EditBase>
      <ReadingEditForm {...props} />
    </EditBase>
  </Box>
);

export default ReadingEdit;
