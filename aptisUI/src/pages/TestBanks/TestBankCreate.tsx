import { Create, useNotify } from "react-admin";
import { BaseComponentProps } from "../../types/general";
import { Box, Typography, Button, Stack } from "@mui/material";
import { styled } from "@mui/system";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ModalFrame from "../../components/ModalBase/ModalFrame";
import ReadingBank from "./Reading/ReadingBank";
import WritingBank from "./Writing/WritingBank";
import dataProvider from "../../providers/dataProviders/baseDataProvider";
import { UPDATED_SUCCESS } from "../../consts/general";
import {
  RESET_TESTBANK_DATA,
  SET_TESTBANK_DATA_EDIT,
} from "../../store/feature/testBank";
import ReadingIcon from "../../assets/img/reading-icon.svg";
import ListeningIcon from "../../assets/img/listening-icon.svg";
import SpeakingIcon from "../../assets/img/speaking-icon.svg";
import WritingIcon from "../../assets/img/writing-icon.svg";

const ModuleContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: "#f3f3f3",
  borderBottom: "1px solid #d5d5d5",
  display: "flex",
  alignItems: "center",
}));

const ModuleItem = styled(Box)(({ color }) => ({
  width: "16.42%",
  textAlign: "center",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "13px",
}));

const TestContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2, 2),
  display: "flex",
  gap: 4,
  backgroundColor: "#fff",
  "&:nth-of-type(odd)": {
    backgroundColor: "#f3f3f3",
  },
}));

const TestTitle = styled(Typography)(({ theme }) => ({
  color: "#284664",
  fontSize: "1.3rem",
  textTransform: "uppercase",
  letterSpacing: "0.17px",
  width: "fit-content",
  paddingTop: theme.spacing(1.25),
  paddingLeft: theme.spacing(2.5),
  paddingRight: theme.spacing(2.5),
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
}));

const TestButton = styled(Button)({
  height: "32px",
  width: "100px",
  margin: "0 auto",
  marginBottom: "14px",
  fontSize: "0.875rem",
  fontWeight: "bold",
  letterSpacing: "0.5px",
  color: "#fff",
  "&:hover": {
    opacity: 0.9,
  },
});

const tests = [
  {
    partId: 1,
    title: "PART 1",
    colors: ["#d1e077", "#32b4c8", "#327844", "#faab5a", "#c86478"],
  },
  {
    partId: 2,
    title: "PART 2",
    colors: ["#d1e077", "#32b4c8", "#327844", "#faab5a", "#c86478"],
  },
  {
    partId: 3,
    title: "PART 3",
    colors: ["#d1e077", "#32b4c8", "#327844", "#faab5a", "#c86478"],
  },
  {
    partId: 4,
    title: "PART 4",
    colors: ["#d1e077", "#32b4c8", "#327844", "#faab5a", "#c86478"],
  },
  {
    partId: 5,
    title: "PART 5",
    colors: ["#d1e077", "#32b4c8", "#327844", "#faab5a", "#c86478"],
  },
];

const skillLabels = ["Grammar", "Listening", "Writing", "Reading", "Speaking"];

const TestBankCreate = ({
  recordEdit = null,
  statusHandler = "create",
}: {
  recordEdit?: any;
  statusHandler?: string;
}) => {
  const navigate = useNavigate();
  const notify = useNotify();
  const [isOpenModalFrame, setIsOpenModalFrame] = useState(false);
  const [partSkill, setPartSkill] = useState<number | null>(null);
  const [typeSkill, setTypeSkill] = useState<string | null>(null);

  const testBankData = useSelector(
    (state: any) => state.testBankStore.testBankData
  );
  const dispatch = useDispatch();

  const handleChooseTest = (partId: number, index: number) => {
    setPartSkill(partId);
    setTypeSkill(skillLabels[index]);
    setIsOpenModalFrame(true);
  };

  const createWritingPartOne = async () => {
    try {
      await dataProvider.create("test-banks", { data: testBankData });
      notify(UPDATED_SUCCESS, { type: "success" });
    } catch (error) {
      console.error(error);
    }
  };
  const updateWritingPartOne = async () => {

    console.log("testBankData: ", testBankData);
    try {
      await dataProvider.update("test-banks", {
        id: recordEdit?.id,
        data: testBankData,
        previousData: testBankData,
      });

      await notify(UPDATED_SUCCESS, {
        type: "success",
      });
    } catch (error) {
      notify("エラー: 生産管理の更新に失敗しました: " + error, {
        type: "warning",
      });
    }
  };

  const handleSaveTestBank = async () => {
    try {
      if (statusHandler === "create") {
        createWritingPartOne();
      }
      if (statusHandler === "edit") {
        console.log("edit");
        updateWritingPartOne();
      }
      navigate("/test-banks");
      dispatch(RESET_TESTBANK_DATA());
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!recordEdit) return;

    const { title, listening, reading, writing, speaking } = recordEdit;

    const testBankData = { title, listening, reading, writing, speaking };
    dispatch(SET_TESTBANK_DATA_EDIT(testBankData));
  }, [recordEdit]);

  return (
    <Create redirect="list" title="管理ユーザー管理　新規作成">
      <Box>
        <ModuleContainer>
          <Box sx={{ width: "150px" }}>
            <Typography
              variant="h6"
              component="div"
              sx={{
                color: "#284664",
                fontWeight: "bold",
                textTransform: "uppercase",
                letterSpacing: "1.6px",
              }}
            >
              Bộ đề thi
            </Typography>
          </Box>
          <Box sx={{ display: "flex", flexGrow: 1, gap: 4 }}>
            {[
              { color: "#d1e077", icon: ReadingIcon, label: "Grammar" },
              { color: "#32b4c8", icon: ListeningIcon, label: "Listening" },
              { color: "#327844", icon: WritingIcon, label: "Writing" },
              { color: "#faab5a", icon: ReadingIcon, label: "Reading" },
              { color: "#c86478", icon: SpeakingIcon, label: "Speaking" },
            ].map((module, index) => (
              <ModuleItem key={index} color={module.color}>
                <img
                  alt={module.label.toLowerCase()}
                  loading="lazy"
                  width="38"
                  height="30"
                  src={module.icon}
                />
                <Typography
                  variant="caption"
                  component="div"
                  sx={{
                    color: module.color,
                    fontWeight: "bold",
                    textTransform: "uppercase",
                    letterSpacing: "2.75px",
                  }}
                >
                  {module.label}
                </Typography>
              </ModuleItem>
            ))}
          </Box>
        </ModuleContainer>
        <Box>
          {tests.map((test) => (
            <TestContainer key={test.partId}>
              <Box sx={{ width: "140px" }}>
                <TestTitle>{test.title}</TestTitle>
              </Box>
              {test.colors.map((color, index) => (
                <Box
                  key={index}
                  sx={{ width: "16.42%", textAlign: "center", paddingX: 1 }}
                >
                  {!(skillLabels[index] === "Writing" && test.partId === 5) &&
                    !(
                      skillLabels[index] === "Speaking" && test.partId === 5
                    ) && (
                      <TestButton
                        variant="contained"
                        sx={{ width: "fit-content", backgroundColor: color }}
                        onClick={() => handleChooseTest(test.partId, index)}
                      >
                        Check Test
                      </TestButton>
                    )}
                </Box>
              ))}
            </TestContainer>
          ))}
        </Box>
        <ModalFrame
          open={isOpenModalFrame}
          closeModalEdit={() => setIsOpenModalFrame(false)}
          label={`${typeSkill} - Part ${partSkill}`}
        >
          {typeSkill === "Reading" && <ReadingBank partSkill={partSkill} />}
          {typeSkill === "Writing" && <WritingBank partSkill={partSkill} />}
        </ModalFrame>
      </Box>
      <Box sx={{ width: "100%", minHeight: "100px", position: "relative" }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
          width="100%"
          sx={{
            backgroundColor: "#f1f1f1",
            padding: "1rem",
            borderRadius: "4px",
            marginTop: "1rem",
            position: "absolute",
            bottom: 0,
            left: 0,
          }}
        >
          <Button variant="contained" color="info" onClick={handleSaveTestBank}>
            <span>Submit</span>
          </Button>
          <Button type="button" variant="contained" color="error">
            <span>Cancel</span>
          </Button>
        </Stack>
      </Box>
    </Create>
  );
};

export default TestBankCreate;
