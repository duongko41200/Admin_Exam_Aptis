import {
  Box,
  Button,
  Checkbox,
  Divider,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
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
import { UPDATED_SUCCESS } from "../../consts/general";
import dataProvider from "../../providers/dataProviders/baseDataProvider";
import {
  RESET_TESTBANK_DATA,
  SET_RAW_TESTBANK_DATA,
} from "../../store/feature/testBank";
import { RootState } from "../../types/testBank";
import {
  convertDataListeningBank,
  convertDataReadingBank,
  convertDataSpeakingBank,
  convertDataWritingBank,
} from "../../utils/convertDataTestBank";
import {
  converPartListeningSkill,
  converPartReadingSkill,
} from "../../utils/convertPartSkill";

const ModuleContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: "#f3f3f3",
  borderBottom: "1px solid #d5d5d5",
  display: "flex",
  alignItems: "center",
}));

const ContentArea = styled(Box)(() => ({
  display: "flex",
  height: "calc(100vh - 300px)",
  gap: 16,
}));

const Sidebar = styled(Paper)(({ theme }) => ({
  width: 250,
  padding: theme.spacing(1),
  backgroundColor: "#f8f9fa",
  borderRadius: theme.spacing(1),
}));

const MainContent = styled(Box)(() => ({
  flex: 1,
  display: "flex",
  gap: 16,
}));

const QuestionSection = styled(Paper)(({ theme }) => ({
  flex: 1,
  padding: theme.spacing(2),
  maxHeight: "100%",
  overflow: "auto",
}));

const SelectedSection = styled(Paper)(({ theme }) => ({
  width: 300,
  padding: theme.spacing(2),
  maxHeight: "100%",
  overflow: "auto",
  backgroundColor: "#f8f9fa",
}));

const PartButton = styled(ListItemButton)(({ theme, selected }) => ({
  borderRadius: theme.spacing(1),
  marginBottom: theme.spacing(0.5),
  backgroundColor: selected ? theme.palette.primary.light : "transparent",
  "&:hover": {
    backgroundColor: selected
      ? theme.palette.primary.light
      : theme.palette.action.hover,
  },
}));

const QuestionItem = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "flex-start",
  gap: theme.spacing(2),
  padding: theme.spacing(2),
  border: "1px solid #e0e0e0",
  borderRadius: theme.spacing(1),
  marginBottom: theme.spacing(2),
  backgroundColor: "#fff",
}));

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

const skillTabs = [
  // { color: "#d1e077", icon: ReadingIcon, label: "Grammar" },
  { color: "#32b4c8", icon: ListeningIcon, label: "Listening" },
  { color: "#faab5a", icon: ReadingIcon, label: "Reading" },
  { color: "#327844", icon: WritingIcon, label: "Writing" },
  { color: "#c86478", icon: SpeakingIcon, label: "Speaking" },
];

interface Classroom {
  id: string;
  name: string;
}

interface Question {
  id: string;
  text: string;
  options?: string[];
  type: string;
  skill: string;
  part: number;
}

interface TestBankCreateProps {
  recordEdit?: any;
  statusHandler?: string;
}

const classFreeId = "6947ef32828590b958c6fed5";

const TestBankCreate = ({
  recordEdit = null,
  statusHandler = "create",
}: TestBankCreateProps) => {
  const navigate = useNavigate();
  const notify = useNotify();
  const [activeTab, setActiveTab] = useState<number>(0);
  const [selectedPart, setSelectedPart] = useState<number | null>(null);
  const [nameTestBank, setNameTestBank] = useState<string>("");
  const [selectedQuestions, setSelectedQuestions] = useState<Set<string>>(
    new Set()
  );

  const [questionList, setQuestionList] = useState<Question[]>([]);

  const [classrooms, setClassrooms] = useState<Classroom[]>([
    {
      id: "",
      name: "Không có lớp học",
    },
  ]);

  const [selectedClassId, setSelectedClassId] = useState<string>("");

  // Mock data cho questions - trong thực tế sẽ fetch từ API
  const mockQuestions: Question[] = [
    {
      id: "q1",
      text: "What is the capital of France?",
      options: ["London", "Berlin", "Paris", "Madrid"],
      type: "multiple-choice",
      skill: skillTabs[activeTab]?.label || "Grammar",
      part: selectedPart || 1,
    },
    {
      id: "q2",
      text: "Choose the correct answer: She _____ to the store yesterday.",
      options: ["go", "goes", "went", "going"],
      type: "multiple-choice",
      skill: skillTabs[activeTab]?.label || "Grammar",
      part: selectedPart || 1,
    },
    {
      id: "q3",
      text: "Fill in the blank: I have _____ finished my homework.",
      options: ["already", "yet", "just", "never"],
      type: "multiple-choice",
      skill: skillTabs[activeTab]?.label || "Grammar",
      part: selectedPart || 1,
    },
  ];

  const handleChange = (event: SelectChangeEvent) => {
    setSelectedClassId(event.target.value);
  };

  const testBankData = useSelector(
    (state: RootState) => state.testBankStore.testBankData
  );
  const dispatch = useDispatch();

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    setSelectedPart(null); // Reset selected part when changing tabs
    setQuestionList([]); // Clear question list when changing tabs
  };

  const handlePartSelect = async (partId: number) => {
    setSelectedPart(partId);

    if (skillTabs[activeTab]?.label === "Reading") {
      const { data } = await dataProvider.getFiltersRecord("readings", {
        partSkill: converPartReadingSkill(partId),
      });

      const result = convertDataReadingBank(data, partId);

      setQuestionList(result);
    }
    if (skillTabs[activeTab]?.label === "Listening") {
      const { data } = await dataProvider.getFiltersRecord("listenings", {
        partSkill: converPartListeningSkill(partId),
      });

      const result = convertDataListeningBank(data, partId);
      setQuestionList(result);
    }
    if (skillTabs[activeTab]?.label === "Writing") {
      const { data } = await dataProvider.getFiltersRecord("writings", {
        partSkill: converPartListeningSkill(partId),
      });
      const result = convertDataWritingBank(data, partId);
      setQuestionList(result);
    }

    if (skillTabs[activeTab]?.label === "Speaking") {
      const { data } = await dataProvider.getFiltersRecord("Speakings", {
        partSkill: converPartListeningSkill(partId),
      });
      const result = convertDataSpeakingBank(data, partId);
      setQuestionList(result);
    }
  };

  const handleQuestionToggle = (questionId: string) => {
    const newSelected = new Set(selectedQuestions);
    if (newSelected.has(questionId)) {
      newSelected.delete(questionId);
    } else {
      newSelected.add(questionId);
    }
    setSelectedQuestions(newSelected);
  };

  const getPartsForCurrentTab = () => {
    const currentSkill = skillTabs[activeTab]?.label;
    if (currentSkill === "Reading" || currentSkill === "Grammar") {
      return tests; // 5 parts
    }
    return tests.slice(0, 4); // 4 parts for other skills
  };

  const getQuestionsForCurrentSelection = () => {
    if (!selectedPart) return [];

    console.log("selectedPart", selectedPart);
    return mockQuestions.filter(
      (q) => q.skill === skillTabs[activeTab]?.label && q.part === selectedPart
    );
  };

  const getSelectedQuestionsList = () => {
    return questionList.filter((q) => selectedQuestions.has(q.id));
  };

  const createWritingPartOne = async () => {
    const testBankDataClone = { ...testBankData };
    testBankDataClone.classRoomId =
      selectedClassId === "free" ? classFreeId : selectedClassId;
    testBankDataClone.title = nameTestBank;
    testBankDataClone.status =
      selectedClassId === classFreeId ? "free" : "premium";

    try {
      await dataProvider.create("test-banks", { data: testBankDataClone });
      notify(UPDATED_SUCCESS, { type: "success" });
    } catch (error) {
      console.error(error);
    }
  };
  const updateWritingPartOne = async () => {
    const testBankDataClone = { ...testBankData };
    testBankDataClone.classRoomId =
      selectedClassId === "free" ? classFreeId : selectedClassId;
    testBankDataClone.title = nameTestBank;
    testBankDataClone.status =
      selectedClassId === classFreeId ? "free" : "premium";

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
              value={
                selectedClassId === null || selectedClassId === ""
                  ? "free"
                  : selectedClassId
              }
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
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ flexGrow: 1, minHeight: 60 }}
          >
            {skillTabs.map((tab, idx) => (
              <Tab
                key={tab.label}
                label={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <img
                      alt={tab.label.toLowerCase()}
                      loading="lazy"
                      width="24"
                      height="24"
                      src={tab.icon}
                    />
                    <Typography
                      variant="caption"
                      component="div"
                      sx={{
                        color: tab.color,
                        fontWeight: "bold",
                        textTransform: "uppercase",
                        letterSpacing: "2.75px",
                      }}
                    >
                      {tab.label}
                    </Typography>
                  </Box>
                }
                sx={{ minWidth: 120 }}
              />
            ))}
          </Tabs>
        </ModuleContainer>

        <ContentArea
          sx={{
            maxHeight: "calc(100vh - 430px)",
            overflow: "auto",
          }}
        >
          <Sidebar>
            <Typography variant="h6" gutterBottom>
              Parts
            </Typography>
            <List>
              {getPartsForCurrentTab().map((test) => (
                <PartButton
                  key={test.partId}
                  selected={selectedPart === test.partId}
                  onClick={() => handlePartSelect(test.partId)}
                >
                  <ListItemText
                    primary={test.title}
                    primaryTypographyProps={{
                      fontWeight:
                        selectedPart === test.partId ? "bold" : "normal",
                      color:
                        selectedPart === test.partId
                          ? "primary"
                          : "textPrimary",
                    }}
                  />
                </PartButton>
              ))}
            </List>
          </Sidebar>

          <MainContent
            sx={{
              maxHeight: "100%",
              overflow: "auto",
              maxWidth: "calc(100% - 280px)",
            }}
          >
            <QuestionSection>
              <Typography variant="h6" gutterBottom>
                Questions {selectedPart ? `- Part ${selectedPart}` : ""}
              </Typography>
              {selectedPart ? (
                <Box>
                  {questionList.length > 0 ? (
                    questionList.map((question) => (
                      <QuestionItem key={question.id}>
                        <Checkbox
                          checked={selectedQuestions.has(question.id)}
                          onChange={() => handleQuestionToggle(question.id)}
                          color="primary"
                        />
                        <Box flex={1}>
                          <Box sx={{ width: "100%" }}>
                            <Typography
                              variant="body1"
                              gutterBottom
                              sx={{
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                maxWidth: "850px",
                                cursor: "pointer",
                                display: "inline-block",
                              }}
                              title={question.text}
                            >
                              {question.text}
                            </Typography>
                          </Box>

                          {question.options && (
                            <Box ml={2}>
                              {question.options.map((option, index) => (
                                <Typography
                                  key={index}
                                  variant="body2"
                                  color="textSecondary"
                                  component="div"
                                  sx={{
                                    display: "-webkit-box",
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: "vertical",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    maxWidth: "100%",
                                    cursor: "pointer",
                                  }}
                                  title={question.text}
                                >
                                  {String.fromCharCode(65 + index)}. {option}
                                </Typography>
                              ))}
                            </Box>
                          )}
                        </Box>
                      </QuestionItem>
                    ))
                  ) : (
                    <Typography color="textSecondary" align="center" mt={4}>
                      Chưa có câu hỏi cho Part {selectedPart}
                    </Typography>
                  )}
                </Box>
              ) : (
                <Typography color="textSecondary" align="center" mt={4}>
                  Vui lòng chọn một Part để xem câu hỏi
                </Typography>
              )}
            </QuestionSection>

            {/* phần câu hỏi đã chọn */}
            <SelectedSection
              sx={{
                width: "300px",
              }}
            >
              <Typography variant="h6" gutterBottom>
                Selected Questions ({selectedQuestions.size})
              </Typography>
              <Divider sx={{ mb: 2 }} />
              {getSelectedQuestionsList().length > 0 ? (
                <Box>
                  {getSelectedQuestionsList().map((question, index) => (
                    <Box key={question.id} mb={2}>
                      <Typography variant="body2" color="primary" gutterBottom>
                        {question.skill} - Part {question.part} - Q{index + 1}
                      </Typography>
                      <Typography
                        variant="body2"
                        gutterBottom
                        sx={{
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          maxWidth: "100%",
                          cursor: "pointer",
                        }}
                      >
                        {question.text}
                      </Typography>
                      <Button
                        size="small"
                        color="error"
                        onClick={() => handleQuestionToggle(question.id)}
                      >
                        Remove
                      </Button>
                      <Divider sx={{ mt: 1 }} />
                    </Box>
                  ))}
                </Box>
              ) : (
                <Typography color="textSecondary" align="center">
                  Chưa có câu hỏi nào được chọn
                </Typography>
              )}
            </SelectedSection>
          </MainContent>
        </ContentArea>
      </Box>
      <Box
        sx={{
          width: "100%",
          minHeight: "100px",
          position: "relative",
          zIndex: 100000,
          marginTop: 2,
        }}
      >
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
            position: "relative",
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
