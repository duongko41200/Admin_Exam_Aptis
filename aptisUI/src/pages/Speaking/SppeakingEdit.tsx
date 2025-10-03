import {
  useNotify,
  useRecordContext,
  EditBase,
  Title,
  RaRecord,
  Identifier,
} from "react-admin";
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { boxStyles } from "../../styles";
import ReadingPartOne from "./SpeakingPart/ReadingPartOne";
import ReadingPartTwo from "./SpeakingPart/ReadingPartTwo";
import ReadingPartThree from "./SpeakingPart/SpeakingPartThree";
import ReadingPartFour from "./SpeakingPart/SpeakingPartFour";
import { BaseComponentProps } from "../../types/general";

// Type definitions for Speaking data structure
interface SubQuestion {
  content: string;
  file: string;
  suggestion: string;
  image?: string;
}

interface Question {
  content: string;
  questionTitle: string;
  suggestion?: string;
  file?: string;
  subQuestion: SubQuestion[];
}

interface SpeakingData {
  id: string;
  title: string;
  questionPart: string;
  questions: Question[];
}

const SpeakingEditForm = ({ resource, dataProvider }: BaseComponentProps) => {
  const notify = useNotify();
  const navigate = useNavigate();
  const record = useRecordContext<SpeakingData>();
  const resourcePath = `/${resource}`;

  const renderReadingPart = () => {
    if (!record) return null;

    switch (record.questionPart) {
      case "ONE":
        return (
          <ReadingPartOne dataSpeakingPartOne={record} statusHandler="edit" />
        );
      case "TWO":
        return (
          <ReadingPartTwo dataReadingPartTwo={record} statusHandler="edit" />
        );
      case "THREE":
        return (
          <ReadingPartThree
            dataReadingPartThree={record}
            statusHandler="edit"
          />
        );
      case "FOUR":
        return (
          <ReadingPartFour dataReadingPartFour={record} statusHandler="edit" />
        );
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

const SpeakingEdit = (props: BaseComponentProps) => (
  <Box sx={{ ...boxStyles, maxHeight: "calc(100vh - 50px)" }}>
    <EditBase>
      <SpeakingEditForm {...props} />
    </EditBase>
  </Box>
);

export default SpeakingEdit;
