import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { styled } from "@mui/system";
import { useEffect, useState } from "react";
import { Create, useNotify } from "react-admin";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ListeningIcon from "../../assets/img/listening-icon.svg";
import ReadingIcon from "../../assets/img/reading-icon.svg";
import SpeakingIcon from "../../assets/img/speaking-icon.svg";
import WritingIcon from "../../assets/img/writing-icon.svg";
import ModalFrame from "../../components/ModalBase/ModalFrame";
import { UPDATED_SUCCESS } from "../../consts/general";
import dataProvider from "../../providers/dataProviders/baseDataProvider";
import {
  RESET_TESTBANK_DATA,
  SET_RAW_TESTBANK_DATA,
} from "../../store/feature/testBank";
import { RootState } from "../../types/testBank";
import ListeningBank from "./Listening/ListeningBank";
import ReadingBank from "./Reading/ReadingBank";
import SpeakingBank from "./Speaking/SpeakingBank";
import WritingBank from "./Writing/WritingBank";

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

interface Classroom {
  id: string;
  name: string;
}

interface TestBankCreateProps {
  recordEdit?: any;
  statusHandler?: string;
}

const TestBankCreate = ({
  recordEdit = null,
  statusHandler = "create",
}: TestBankCreateProps) => {
  const navigate = useNavigate();
  const notify = useNotify();
  const [isOpenModalFrame, setIsOpenModalFrame] = useState(false);
  const [partSkill, setPartSkill] = useState<number | null>(null);
  const [typeSkill, setTypeSkill] = useState<string | null>(null);
  const [nameTestBank, setNameTestBank] = useState<string>("");

  const [classrooms, setClassrooms] = useState<Classroom[]>([
    {
      id: "",
      name: "Không có lớp học",
    },
  ]);

  const [selectedClassId, setSelectedClassId] = useState<string>("");

  const handleChange = (event: SelectChangeEvent) => {
    setSelectedClassId(event.target.value);
  };

  const testBankData = useSelector(
    (state: RootState) => state.testBankStore.testBankData
  );
  const dispatch = useDispatch();

  const handleChooseTest = (partId: number, index: number) => {
    setPartSkill(partId);
    setTypeSkill(skillLabels[index]);
    setIsOpenModalFrame(true);
  };

  const createWritingPartOne = async () => {
    const testBankDataClone = { ...testBankData };
    testBankDataClone.classRoomId = selectedClassId;
    testBankDataClone.title = nameTestBank;
    try {
      await dataProvider.create("test-banks", { data: testBankDataClone });
      notify(UPDATED_SUCCESS, { type: "success" });
    } catch (error) {
      console.error(error);
    }
  };
  const updateWritingPartOne = async () => {
    const testBankDataClone = { ...testBankData };
    testBankDataClone.classRoomId = selectedClassId;
    testBankDataClone.title = nameTestBank;

    try {
      await dataProvider.update("test-banks", {
        id: recordEdit?.id,
        data: testBankDataClone,
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
        updateWritingPartOne();
      }
      navigate("/test-banks");
      dispatch(RESET_TESTBANK_DATA());
    } catch (error) {
      console.error(error);
    }
  };

  const handleCancel = () => {
    navigate("/test-banks");
  };

  const fetchClassrooms = async () => {
    try {
      const response = await dataProvider.getAll("classrooms");

      const classroomList = response.data ?? [];

      const formattedClassrooms: Classroom[] = classroomList.map(
        (classroom: { _id: string; nameRoom: string }) => ({
          id: classroom._id,
          name: classroom.nameRoom,
        })
      );

      setClassrooms(formattedClassrooms);
    } catch (error) {
      console.error("Error fetching classrooms:", error);
      notify("Call api class room lỗi", { type: "error" });
    }
  };

  useEffect(() => {
    if (!recordEdit) return;

    const { title, listening, reading, writing, speaking, classRoomId } =
      recordEdit;

    console.log("recordEdit khi edit là: ", recordEdit);

    setSelectedClassId(classRoomId || "");
    setNameTestBank(title || "");

    // Đảm bảo structure đầy đủ cho testBankData
    const testBankDataForEdit = {
      title: title || "đề mẫu",
      listening: listening || {
        part1: [],
        part2: [],
        part3: [],
        part4: [],
      },
      reading: reading || {
        part1: [],
        part2: [],
        part3: [],
        part4: [],
        part5: [],
      },
      writing: writing || {
        part1: [],
        part2: [],
        part3: [],
        part4: [],
      },
      speaking: speaking || {
        part1: [],
        part2: [],
        part3: [],
        part4: [],
      },
    };

    dispatch(SET_RAW_TESTBANK_DATA(testBankDataForEdit));
  }, [recordEdit, dispatch]);

  useEffect(() => {
    fetchClassrooms();
  }, []);

  return (
    <Create redirect="list" title="管理ユーザー管理　新規作成">
      <Box>
        <Box sx={{ minWidth: 120, marginBottom: 1 }}>
          <TextField
            id="filled-basic"
            label="Tên Bộ Đề"
            variant="filled"
            value={nameTestBank}
            onChange={(event) => setNameTestBank(event.target.value)}
          />
        </Box>

        <Box sx={{ minWidth: 120, marginBottom: 2 }}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Tên lớp học</InputLabel>
            <Select
              labelId="classroom-select-label"
              id="classroom-select"
              value={selectedClassId}
              label="Age"
              onChange={handleChange}
            >
              {classrooms.map((cls, idx) => (
                <MenuItem key={cls.id} value={cls.id}>
                  {cls.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

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
                    !(skillLabels[index] === "Speaking" && test.partId === 5) &&
                    !(
                      skillLabels[index] === "Listening" && test.partId === 5
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
          {typeSkill === "Speaking" && <SpeakingBank partSkill={partSkill} />}
          {typeSkill === "Reading" && <ReadingBank partSkill={partSkill} />}
          {typeSkill === "Writing" && <WritingBank partSkill={partSkill} />}
          {typeSkill === "Listening" && <ListeningBank partSkill={partSkill} />}
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
          <Button
            type="button"
            variant="contained"
            color="error"
            onClick={handleCancel}
          >
            <span>Cancel</span>
          </Button>
        </Stack>
      </Box>
    </Create>
  );
};

export default TestBankCreate;
