import React, { useEffect, useState } from "react";
import { useNavigate, NavLink, useParams } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import { useNotify } from "react-admin";
import {
  Stack,
  Box,
  TextField,
  Paper,
  Typography,
  Card,
  CardContent,
  Grow,
  Fade,
  Chip,
  Divider,
  LinearProgress,
  Button,
} from "@mui/material";
import { QuestionAnswer, Save, Cancel, Assignment } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import dataProvider from "../../../providers/dataProviders/dataProvider";
import baseDataProvider from "../../../providers/dataProviders/baseDataProvider";
import { UPDATED_SUCCESS } from "../../../consts/general";
import { InputFileUpload } from "../../../components/UploadFile/UploadFile";
import TextEditor from "../../../components/TextEditor/TextEditor";
import {
  UPDATE_SPEAKING_MAIN_DATA,
  UPDATE_SUB_QUESTION,
  UPDATE_SUB_QUESTION_SUGGESTION,
  RESET_SPEAKING_DATA,
} from "../../../store/feature/speaking";

interface ReadingPartOneProps {
  children?: JSX.Element | JSX.Element[];
  showDeleteButton?: boolean;
  showSaveButton?: boolean;
  showCancelButton?: boolean;
  alwaysEnable?: boolean;
  pathTo?: string;
  dataSpeakingPartOne?: any;
  statusHandler?: string;
  handleCancel?: () => void;
  suggestion?: string;
}

interface FormData {
  title: string;
  subTitle: string;
  content: string;
  subContent1: string;
  correctAnswer1: string;
  answerOneSub1: string;
  answerTwoSub1: string;
  answerThreeSub1: string;
  subContent2: string;
  correctAnswer2: string;
  answerOneSub2: string;
  answerTwoSub2: string;
  answerThreeSub2: string;
  subContent3: string;
  correctAnswer3: string;
  answerOneSub3: string;
  answerTwoSub3: string;
  answerThreeSub3: string;
  suggestion?: string;
  file?: string;
}

const QuestionBox = ({
  questionNumber,
  register,
  errors,
  suggestion,
  setSuggestion,
  num,
}: {
  questionNumber: number;
  register: any;
  errors: any;
  suggestion: any;
  setSuggestion: any;
  num: number;
}) => (
  <Grow in={true} timeout={800 + num * 200}>
    <Card
      elevation={4}
      sx={{
        borderRadius: 3,
        background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
        border: "1px solid",
        borderColor: "grey.200",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 12px 30px rgba(0, 0, 0, 0.12)",
          borderColor: "primary.main",
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        {/* Question Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",

            pb: 2,
            borderBottom: "2px solid",
            borderColor: "grey.100",
          }}
        >
          <QuestionAnswer
            sx={{
              color: "primary.main",
              fontSize: 28,
              mr: 2,
            }}
          />
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              background: "linear-gradient(45deg, #1976d2, #42a5f5)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Question {questionNumber}
          </Typography>
          <Chip
            label={`Part ${questionNumber}`}
            color="primary"
            size="small"
            sx={{ ml: "auto", fontWeight: 600 }}
          />
        </Box>

        {/* Question Content Field */}
        <Box sx={{ mb: 1 }}>
          <Typography
            variant="subtitle2"
            sx={{ mb: 1, fontWeight: 600, color: "text.secondary" }}
          >
            Question Content
          </Typography>
          <TextField
            {...register(`subContent${questionNumber}`, { required: true })}
            placeholder={`Enter question ${questionNumber} content...`}
            variant="outlined"
            fullWidth
            multiline
            rows={3}
            error={!!errors[`subContent${questionNumber}`]}
            helperText={
              errors[`subContent${questionNumber}`]
                ? "This field is required"
                : "Provide clear and detailed question content"
            }
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                background: "rgba(255, 255, 255, 0.8)",
                "&:hover": {
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "primary.main",
                  },
                },
                "&.Mui-focused": {
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderWidth: 2,
                  },
                },
              },
            }}
          />
        </Box>

        {/* Text Editor Section */}
        <Box sx={{ mb: 1 }}>
          <Typography
            variant="subtitle2"
            sx={{ mb: 1, fontWeight: 600, color: "text.secondary" }}
          >
            Additional Instructions
          </Typography>
          <Box
            sx={{
              border: "1px solid",
              borderColor: "grey.300",
              borderRadius: 2,
              p: 2,
              backgroundColor: "rgba(248, 250, 252, 0.5)",
            }}
          >
            <TextEditor
              placeholder="Write additional instructions or insert special characters ★"
              suggestion={suggestion}
              setSuggestion={setSuggestion}
              editorId={`editor${num}`}
            />
          </Box>
        </Box>

        {/* Audio File Field */}
        <Box>
          <Typography
            variant="subtitle2"
            sx={{ fontWeight: 600, color: "text.secondary" }}
          >
            Audio File URL
          </Typography>
          <TextField
            {...register(`subFile${questionNumber}`)}
            placeholder="Enter audio file URL for this question..."
            variant="outlined"
            fullWidth
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                background: "rgba(255, 255, 255, 0.8)",
                "&:hover": {
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "primary.main",
                  },
                },
              },
            }}
          />
        </Box>
      </CardContent>
    </Card>
  </Grow>
);

const ReadingPartOne: React.FC<ReadingPartOneProps> = ({
  children,
  pathTo,
  showDeleteButton = true,
  showSaveButton = true,
  showCancelButton = true,
  alwaysEnable = false,
  dataSpeakingPartOne = null,
  statusHandler = "create",
  handleCancel,
  ...props
}) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const notify = useNotify();
  const dispatch = useDispatch();
  const speakingStore = useSelector((state: any) => state.speakingStore);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    reset,
    watch,
  } = useForm<FormData>();

  const [idTele, setIdTele] = useState("");
  const [isShow, setIsShow] = useState(false);
  const [imageUpload, setImageUpload] = useState();
  const [suggestions, setSuggestions] = useState<string[]>(Array(3).fill(""));
  const [showDebugPanel, setShowDebugPanel] = useState(false); // State cho debug panel

  // Watch form values để update store
  const watchedValues = watch();

  const handleSuggestionChange = (index: number, value: string) => {
    setSuggestions((prev) => {
      const newSuggestions = [...prev];
      newSuggestions[index] = value;
      return newSuggestions;
    });
    // Update Redux store khi suggestion thay đổi
    dispatch(UPDATE_SUB_QUESTION_SUGGESTION({ index: index, value }));
  };

  // Function to update main form data in store
  const updateMainDataInStore = (field: string, value: string) => {
    dispatch(
      UPDATE_SPEAKING_MAIN_DATA({
        field,
        value,
      })
    );
  };

  // Function to update sub question data in store
  const updateSubQuestionInStore = (
    index: number,
    field: string,
    value: string
  ) => {
    dispatch(
      UPDATE_SUB_QUESTION({
        index: index,
        field,
        value,
      })
    );
  };

  const onSubmit = async (values: FormData) => {
    // Sử dụng dữ liệu từ store để đảm bảo đồng bộ
    const storeData = speakingStore.currentSpeakingData;

    const data = {
      title: storeData.title || values.title,
      timeToDo: 50,
      description: storeData.subTitle || values.subTitle,
      questions: [
        {
          questionTitle:
            storeData.subTitle || values.subTitle || "không có tiêu đề",
          content: storeData.content || values.content || "không có content",
          answerList: [],
          correctAnswer: "",
          file: storeData.file || values.file,
          subQuestionAnswerList: [],
          suggestion: storeData.suggestion || values.suggestion || "",
          subQuestion: [1, 2, 3].map((num) => ({
            content:
              storeData.subQuestions[num - 1]?.content ||
              values[`subContent${num}`] ||
              "",
            correctAnswer: null,
            file:
              storeData.subQuestions[num - 1]?.file ||
              values[`subFile${num}`] ||
              "",
            answerList: null,
            image: null,
            suggestion:
              storeData.subQuestions[num - 1]?.suggestion ||
              suggestions[num - 1] ||
              "",
          })),
          isExample: "",
          image: null,
        },
      ],
      questionType: "SPEAKING",
      questionPart: "ONE",
    };

    console.log("Data from store:", storeData);
    console.log("Final submit data:", data);

    if (statusHandler === "create") {
      createWritingPartOne(data);
    }
    if (statusHandler === "edit") {
      updateWritingPartOne(data);
    }
  };

  const createWritingPartOne = async (data: any) => {
    console.log({ testDate: data });
    try {
      const CreateData = await baseDataProvider.create("speakings", { data });

      await notify(UPDATED_SUCCESS, {
        type: "success",
      });
      reset();
    } catch (error) {
      console.log({ error });
    }
  };

  //tentisspace
  const updateWritingPartOne = async (values: any) => {
    try {
      await dataProvider.update("speakings", {
        id: dataSpeakingPartOne?.id,
        data: values,
        previousData: dataSpeakingPartOne,
      });

      await notify(UPDATED_SUCCESS, {
        type: "success",
      });
      navigate("/speakings");
    } catch (error) {
      notify("エラー: 生産管理の更新に失敗しました: " + error, {
        type: "warning",
      });
    }
  };

  useEffect(() => {
    console.log({ dataSpeakingPartOne });
    if (dataSpeakingPartOne) {
      setValue("title", dataSpeakingPartOne.title);
      setValue("content", dataSpeakingPartOne.questions[0].content);
      setValue("subTitle", dataSpeakingPartOne.questions[0].questionTitle);

      // Update Redux store với data từ edit
      updateMainDataInStore("title", dataSpeakingPartOne.title);
      updateMainDataInStore(
        "content",
        dataSpeakingPartOne.questions[0].content
      );
      updateMainDataInStore(
        "subTitle",
        dataSpeakingPartOne.questions[0].questionTitle
      );
      updateMainDataInStore(
        "suggestion",
        dataSpeakingPartOne.questions[0].suggestion || ""
      );
      updateMainDataInStore(
        "file",
        dataSpeakingPartOne.questions[0].file || ""
      );

      [1, 2, 3].map((num) => {
        setValue(
          `subContent${num}` as keyof FormData,
          dataSpeakingPartOne.questions[0].subQuestion[num - 1].content
        );

        // Update Redux store cho sub questions
        updateSubQuestionInStore(
          num - 1,
          "content",
          dataSpeakingPartOne.questions[0].subQuestion[num - 1].content
        );
        updateSubQuestionInStore(
          num - 1,
          "file",
          dataSpeakingPartOne.questions[0].subQuestion[num - 1].file
        );

        handleSuggestionChange(
          num - 1,
          dataSpeakingPartOne.questions[0].subQuestion[num - 1].suggestion
        );
        setValue(
          `subFile${num}` as keyof FormData,
          dataSpeakingPartOne.questions[0].subQuestion[num - 1].file
        );
      });
    }
  }, [dataSpeakingPartOne, setValue]);

  // Effect để theo dõi thay đổi form và update store
  useEffect(() => {
    if (watchedValues) {
      // Update main data
      if (watchedValues.title !== undefined) {
        updateMainDataInStore("title", watchedValues.title || "");
      }
      if (watchedValues.subTitle !== undefined) {
        updateMainDataInStore("subTitle", watchedValues.subTitle || "");
      }
      if (watchedValues.content !== undefined) {
        updateMainDataInStore("content", watchedValues.content || "");
      }
      if (watchedValues.suggestion !== undefined) {
        updateMainDataInStore("suggestion", watchedValues.suggestion || "");
      }
      if (watchedValues.file !== undefined) {
        updateMainDataInStore("file", watchedValues.file || "");
      }

      // Update sub questions
      [1, 2, 3].forEach((num) => {
        const subContentKey = `subContent${num}` as keyof FormData;
        const subFileKey = `subFile${num}` as keyof FormData;

        if (watchedValues[subContentKey] !== undefined) {
          updateSubQuestionInStore(
            num - 1,
            "content",
            watchedValues[subContentKey] || ""
          );
        }
        if (watchedValues[subFileKey] !== undefined) {
          updateSubQuestionInStore(
            num - 1,
            "file",
            watchedValues[subFileKey] || ""
          );
        }
      });
    }
  }, [watchedValues]);

  // Effect để reset store khi component unmount
  useEffect(() => {
    return () => {
      if (statusHandler === "create") {
        dispatch(RESET_SPEAKING_DATA());
      }
    };
  }, [statusHandler, dispatch]);

  return (
    <Box sx={{ width: "100%"}}>
      {/* Debug Panel - Modern style */}
      <Box
        sx={{
          position: "fixed",
          top: "120px",
          right: "20px",
          width: showDebugPanel ? "350px" : "auto",
          maxHeight: "70vh",
          backgroundColor: "rgba(0, 0, 0, 0.85)",
          color: "white",
          borderRadius: 3,
          zIndex: 1000,
          border: "1px solid rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
        }}
      >
        {/* Debug Header */}
        <Box
          sx={{
            padding: "12px 16px",
            borderBottom: showDebugPanel
              ? "1px solid rgba(255, 255, 255, 0.1)"
              : "none",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background:
              "linear-gradient(135deg, rgba(25, 118, 210, 0.8), rgba(66, 165, 245, 0.6))",
            borderRadius: showDebugPanel ? "12px 12px 0 0" : "12px",
            cursor: "pointer",
          }}
          onClick={() => setShowDebugPanel(!showDebugPanel)}
        >
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            🔧 Redux Debug Panel
          </Typography>
          <Typography variant="body2">{showDebugPanel ? "▼" : "▶"}</Typography>
        </Box>

        {/* Debug Content */}
        {showDebugPanel && (
          <Box
            sx={{
              padding: "16px",
              maxHeight: "400px",
              overflow: "auto",
              fontSize: "11px",
              fontFamily: "monospace",
            }}
          >
            <pre
              style={{
                margin: 0,
                lineHeight: "1.4",
                wordWrap: "break-word",
                whiteSpace: "pre-wrap",
                color: "#e0e0e0",
              }}
            >
              {JSON.stringify(speakingStore.currentSpeakingData, null, 2)}
            </pre>
          </Box>
        )}
      </Box>

      {/* Main Form Container */}
      <Fade in={true} timeout={1000}>
        <Paper
          elevation={8}
          sx={{
            borderRadius: 4,
            background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
            boxShadow: "0 16px 40px rgba(0, 0, 0, 0.1)",
            overflow: "hidden",
            width: "100%",
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              ml: 4,
              p: 2,
              textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
            }}
          >
            Speaking Part 1
          </Typography>

          {/* Form Content */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ p: 2 }}>
              {/* Basic Information Section */}
              <Grow in={true} timeout={600}>
                <Card
                  elevation={2}
                  sx={{
                    mb: 4,
                    borderRadius: 3,
                    border: "1px solid",
                    borderColor: "grey.200",
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <Assignment sx={{ color: "primary.main" }} />
                      Basic Information
                    </Typography>

                    <Box
                      sx={{
                        display: "grid",
                        gap: 3,
                        gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                      }}
                    >
                      <Box>
                        <Typography
                          variant="subtitle2"
                          sx={{ fontWeight: 600, color: "text.secondary" }}
                        >
                          Title
                        </Typography>
                        <TextField
                          {...register("title", { required: true })}
                          placeholder="Enter speaking exercise title..."
                          variant="outlined"
                          fullWidth
                          error={!!errors.title}
                          helperText={
                            errors.title
                              ? "Title is required"
                              : "Give your exercise a clear, descriptive title"
                          }
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: 2,
                              background: "rgba(255, 255, 255, 0.8)",
                            },
                          }}
                        />
                      </Box>

                      <Box>
                        <Typography
                          variant="subtitle2"
                          sx={{ fontWeight: 600, color: "text.secondary" }}
                        >
                          Audio File URL
                        </Typography>
                        <TextField
                          {...register("file")}
                          placeholder="Enter listening audio file URL..."
                          variant="outlined"
                          fullWidth
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: 2,
                              background: "rgba(255, 255, 255, 0.8)",
                            },
                          }}
                        />
                      </Box>

                      <Box>
                        <Typography
                          variant="subtitle2"
                          sx={{ fontWeight: 600, color: "text.secondary" }}
                        >
                          Content
                        </Typography>
                        <TextField
                          {...register("content", { required: true })}
                          placeholder="Enter main content..."
                          variant="outlined"
                          fullWidth
                          multiline
                          rows={3}
                          error={!!errors.content}
                          helperText={
                            errors.content
                              ? "Content is required"
                              : "Provide clear instructions for the speaking exercise"
                          }
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: 2,
                              background: "rgba(255, 255, 255, 0.8)",
                            },
                          }}
                        />
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grow>

              {/* Questions Section */}
              <Grow in={true} timeout={1000}>
                <Box sx={{ mb: 4 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      mb: 3,
                      fontWeight: 600,
                      textAlign: "center",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 1,
                    }}
                  >
                    <QuestionAnswer sx={{ color: "primary.main" }} />
                    Sub Questions
                  </Typography>

                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: {
                        xs: "1fr",
                        lg: "repeat(auto-fit, minmax(450px, 1fr))",
                      },
                      gap: 4,
                    }}
                  >
                    {[1, 2, 3].map((num) => (
                      <QuestionBox
                        key={num}
                        questionNumber={num}
                        register={register}
                        errors={errors}
                        suggestion={suggestions[num - 1]}
                        setSuggestion={(value: any) =>
                          handleSuggestionChange(num - 1, value)
                        }
                        num={num}
                      />
                    ))}
                  </Box>
                </Box>
              </Grow>

              <Divider sx={{ my: 4 }} />

              {/* Action Buttons */}
              <Fade in={true} timeout={1200}>
                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                    justifyContent: "center",
                    flexWrap: "wrap",
                  }}
                >
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    startIcon={<Save />}
                    sx={{
                      px: 4,
                      py: 1.5,
                      borderRadius: 3,
                      background: "linear-gradient(45deg, #1976d2, #42a5f5)",
                      boxShadow: "0 4px 15px rgba(25, 118, 210, 0.3)",
                      "&:hover": {
                        background: "linear-gradient(45deg, #1565c0, #1976d2)",
                        transform: "translateY(-2px)",
                        boxShadow: "0 6px 20px rgba(25, 118, 210, 0.4)",
                      },
                    }}
                  >
                    <Typography variant="button" component="span">
                      Submit
                    </Typography>
                  </Button>

                  {showCancelButton && (
                    <Button
                      type="button"
                      variant="contained"
                      color="error"
                      size="large"
                      onClick={() => navigate("/speakings")}
                      startIcon={<Cancel />}
                      sx={{
                        px: 4,
                        py: 1.5,
                        borderRadius: 3,
                        boxShadow: "0 4px 15px rgba(211, 47, 47, 0.3)",
                        "&:hover": {
                          transform: "translateY(-2px)",
                          boxShadow: "0 6px 20px rgba(211, 47, 47, 0.4)",
                        },
                      }}
                    >
                      Cancel
                    </Button>
                  )}
                </Box>
              </Fade>
            </Box>
          </form>
        </Paper>
      </Fade>
    </Box>
  );
};

export default ReadingPartOne;
