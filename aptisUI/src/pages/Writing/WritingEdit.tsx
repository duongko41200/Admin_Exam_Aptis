import { useNotify, useRecordContext, EditBase, Title } from "react-admin";
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { boxStyles } from "../../styles";
import WritingPartOne from "./WritingPart/WritingPartOne";
import WritingPartTwo from "./WritingPart/WritingPartTwo";
import WritingPartThree from "./WritingPart/WritingPartThree";
import WritingPartFour from "./WritingPart/WritingPartFour";
import { BaseComponentProps } from "../../types/general";

const WritingEditForm = ({ resource, dataProvider }: BaseComponentProps) => {
  const notify = useNotify();
  const navigate = useNavigate();
  const record = useRecordContext();
  const resourcePath = `/${resource}`;

  const renderWritingPart = () => {
    switch (record?.questionPart) {
      case "ONE":
        return <WritingPartOne dataWritingPartOne={record} statusHandler='edit' />;
      case "TWO":
        return <WritingPartTwo dataWritingPartTwo={record} statusHandler='edit'  />;
      case "THREE":
        return <WritingPartThree dataWritingPartThree={record} statusHandler='edit' />;
      case "FOUR":
        return <WritingPartFour dataWritingPartFour={record} statusHandler='edit' />;
      default:
        return null;
    }
  };

  return (
    <Box sx={boxStyles}>
      <EditBase>
        <Title title="ユーザ登録　編集" />
        <Box sx={{ padding: "20px" }}>{renderWritingPart()}</Box>
      </EditBase>
    </Box>
  );
};

const WritingEdit = (props: BaseComponentProps) => (
  <Box sx={{ ...boxStyles, maxHeight: "calc(100vh - 50px)" }}>
    <EditBase>
      <WritingEditForm {...props} />
    </EditBase>
  </Box>
);

export default WritingEdit;
