import {
  Assignment,
  Audiotrack,
  Cancel,
  QuestionAnswer,
  Save,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Fade,
  Grid,
  Grow,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState, useCallback } from "react";
import { useNotify } from "react-admin";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import TextEditor from "../../../components/TextEditor/TextEditor";
import { UPDATED_SUCCESS } from "../../../consts/general";
import baseDataProvider from "../../../providers/dataProviders/baseDataProvider";
import dataProvider from "../../../providers/dataProviders/dataProvider";
import {
  RESET_SPEAKING_DATA,
  UPDATE_SPEAKING_MAIN_DATA,
  UPDATE_SUB_QUESTION,
} from "../../../store/feature/speaking";

interface ReadingPartOneProps {
  children?: JSX.Element | JSX.Element[];
  showDeleteButton?: boolean;
  showSaveButton?: boolean;
  showCancelButton?: boolean;
  alwaysEnable?: boolean;
  pathTo?: string;
  dataReadingPartFour?: any;
  statusHandler?: string;
  handleCancel?: () => void;
  suggestion?: string;
  file?: string;
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
}: {
  questionNumber: number;
  register: any;
  errors: any;
}) => (
  <Grow in={true} timeout={600 + questionNumber * 150}>
    <Card
      elevation={3}
      sx={{
        borderRadius: 2,
        background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
        border: "1px solid",
        borderColor: "grey.200",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 8px 25px rgba(0, 0, 0, 0.1)",
          borderColor: "primary.main",
        },
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        {/* Question Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 2,
            pb: 1.5,
            borderBottom: "1px solid",
            borderColor: "grey.100",
          }}
        >
          <QuestionAnswer
            sx={{
              color: "primary.main",
              fontSize: 24,
              mr: 1.5,
            }}
          />
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 600,
              background: "linear-gradient(45deg, #1976d2, #42a5f5)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Question {questionNumber}
          </Typography>
          <Chip
            label={`Q${questionNumber}`}
            color="primary"
            size="small"
            sx={{ ml: "auto", fontWeight: 500 }}
          />
        </Box>

        {/* Question Content Field */}
        <Box sx={{ mb: 2 }}>
          <Typography
            variant="body2"
            sx={{ mb: 1, fontWeight: 500, color: "text.secondary" }}
          >
            Content
          </Typography>
          <TextField
            {...register(`subContent${questionNumber}`, { required: true })}
            placeholder={`Enter question ${questionNumber} content...`}
            variant="outlined"
            fullWidth
            multiline
            rows={2}
            error={!!errors[`subContent${questionNumber}`]}
            helperText={
              errors[`subContent${questionNumber}`]
                ? "Required"
                : "Question content"
            }
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 1.5,
                fontSize: "0.875rem",
                background: "rgba(255, 255, 255, 0.8)",
              },
            }}
          />
        </Box>

        {/* Audio File Field */}
        <Box>
          <Typography
            variant="body2"
            sx={{ mb: 1, fontWeight: 500, color: "text.secondary" }}
          >
            <Audiotrack
              sx={{ fontSize: 16, mr: 0.5, verticalAlign: "middle" }}
            />
            Audio File
          </Typography>
          <TextField
            {...register(`subFile${questionNumber}`)}
            placeholder="Audio file URL..."
            variant="outlined"
            fullWidth
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 1.5,
                fontSize: "0.875rem",
                background: "rgba(255, 255, 255, 0.8)",
              },
            }}
          />
        </Box>
      </CardContent>
    </Card>
  </Grow>
);

const SpeakingPartFour: React.FC<ReadingPartOneProps> = ({
  children,
  pathTo,
  showDeleteButton = true,
  showSaveButton = true,
  showCancelButton = true,
  alwaysEnable = false,
  dataReadingPartFour = null,
  statusHandler = "create",
  handleCancel,
  ...props
}) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const notify = useNotify();
  const dispatch = useDispatch();
  const speakingStore = useSelector((state: any) => state.speakingStore);
  const [isDragging, setIsDragging] = useState(false);
  const [isDebugPanelOpen, setIsDebugPanelOpen] = useState(false);
  const [debugPanelPosition, setDebugPanelPosition] = useState({
    x: window.innerWidth - 300,
    y: 140,
  });

  // State cho suggestion và modal
  const [suggestion, setSuggestion] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    reset,
    watch,
  } = useForm<FormData>();

  // Reset function để clear toàn bộ form và state
  const resetAllData = useCallback(() => {
    // Reset react-hook-form
    reset({
      title: "",
      subTitle: "",
      content: "",
      subContent1: "",
      subContent2: "",
      subContent3: "",
      correctAnswer1: "",
      correctAnswer2: "",
      correctAnswer3: "",
      answerOneSub1: "",
      answerTwoSub1: "",
      answerThreeSub1: "",
      answerOneSub2: "",
      answerTwoSub2: "",
      answerThreeSub2: "",
      answerOneSub3: "",
      answerTwoSub3: "",
      answerThreeSub3: "",
      suggestion: "",
      file: "",
    });

    // Reset local states
    setSuggestion("");

    // Reset Redux store
    dispatch(RESET_SPEAKING_DATA());

    // Reset TextEditor
    const editorElement = document.querySelector("#speaking-part-four-editor");
    if (editorElement) {
      const event = new CustomEvent("resetEditor", {
        detail: { editorId: "speaking-part-four-editor" },
      });
      editorElement.dispatchEvent(event);
    }
  }, [reset, dispatch]);

  // Debug log to check store structure
  console.log("Speaking Store:", speakingStore);

  // Watch all form fields for real-time Redux sync
  const watchedFields = watch();

  // Sync form data to Redux store in real-time
  useEffect(() => {
    // Initialize store if currentSpeakingData doesn't exist
    if (!speakingStore?.currentSpeakingData) {
      dispatch(RESET_SPEAKING_DATA());
      return;
    }

    if (watchedFields.title !== undefined) {
      dispatch(
        UPDATE_SPEAKING_MAIN_DATA({
          field: "title",
          value: watchedFields.title || "",
        })
      );
    }
    if (watchedFields.content !== undefined) {
      dispatch(
        UPDATE_SPEAKING_MAIN_DATA({
          field: "content",
          value: watchedFields.content || "",
        })
      );
    }
    if (watchedFields.subTitle !== undefined) {
      dispatch(
        UPDATE_SPEAKING_MAIN_DATA({
          field: "subTitle",
          value: watchedFields.subTitle || "",
        })
      );
    }
    if (watchedFields.suggestion !== undefined) {
      dispatch(
        UPDATE_SPEAKING_MAIN_DATA({
          field: "suggestion",
          value: watchedFields.suggestion || "",
        })
      );
    }
    if (watchedFields.file !== undefined) {
      dispatch(
        UPDATE_SPEAKING_MAIN_DATA({
          field: "file",
          value: watchedFields.file || "",
        })
      );
    }

    // Update sub questions
    [1, 2, 3].forEach((num) => {
      const subContentKey = `subContent${num}` as keyof FormData;
      const subFileKey = `subFile${num}` as keyof FormData;

      if (watchedFields[subContentKey] !== undefined) {
        dispatch(
          UPDATE_SUB_QUESTION({
            index: num - 1,
            field: "content",
            value: watchedFields[subContentKey] || "",
          })
        );
      }
      if (watchedFields[subFileKey] !== undefined) {
        dispatch(
          UPDATE_SUB_QUESTION({
            index: num - 1,
            field: "file",
            value: watchedFields[subFileKey] || "",
          })
        );
      }
    });
  }, [watchedFields, dispatch, speakingStore]);

  // Sync suggestion với Redux store
  useEffect(() => {
    if (suggestion !== undefined) {
      dispatch(
        UPDATE_SPEAKING_MAIN_DATA({
          field: "suggestion",
          value: suggestion,
        })
      );
      // Cũng update form value để đồng bộ
      setValue("suggestion", suggestion);
    }
  }, [suggestion, dispatch, setValue]);

  const onSubmit = async (values: FormData) => {
    // Use data from Redux store instead of form values
    const data = {
      title: speakingStore?.currentSpeakingData?.title || "",
      timeToDo: 50,
      description: speakingStore?.currentSpeakingData?.subTitle || "",
      questions: [
        {
          questionTitle: speakingStore?.currentSpeakingData?.subTitle || "",
          content: speakingStore?.currentSpeakingData?.content || "",
          answerList: [],
          correctAnswer: "",
          file: speakingStore?.currentSpeakingData?.file || "",
          subQuestionAnswerList: [],
          suggestion: speakingStore?.currentSpeakingData?.suggestion || "",
          subQuestion: [1, 2, 3].map((num) => ({
            content:
              speakingStore?.currentSpeakingData?.subQuestions?.[num - 1]
                ?.content || "",
            correctAnswer: null,
            file:
              speakingStore?.currentSpeakingData?.subQuestions?.[num - 1]
                ?.file || "",
            answerList: null,
            image: null,
            suggestion: null,
          })),
          isExample: "",
          image: null,
        },
      ],
      questionType: "SPEAKING",
      questionPart: "FOUR",
    };

    console.log({ data });

    if (statusHandler === "create") {
      createWritingPartOne(data);
    }
    if (statusHandler === "edit") {
      console.log("edit");
      updateSpeakingPartOne(data);
    }
  };

  const createWritingPartOne = async (data: any) => {
    console.log({ testDate: data });
    try {
      const CreateData = await baseDataProvider.create("speakings", { data });
      console.log("CreateData", CreateData);

      await notify(UPDATED_SUCCESS, {
        type: "success",
      });

      // Reset toàn bộ form và state sau khi submit thành công
      resetAllData();
    } catch (error) {
      console.log({ error });
      notify("Có lỗi xảy ra khi tạo bài thi!", { type: "error" });
    }
  };

  //tentisspace
  const updateSpeakingPartOne = async (values: any) => {
    try {
      await dataProvider.update("speakings", {
        id: dataReadingPartFour?.id,
        data: values,
        previousData: dataReadingPartFour,
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
    console.log({ dataReadingPartFour });
    if (dataReadingPartFour) {
      setValue("title", dataReadingPartFour.title);
      setValue("content", dataReadingPartFour.questions[0].content);
      setValue("subTitle", dataReadingPartFour.questions[0].questionTitle);
      setValue("file", dataReadingPartFour.questions[0].file);
      setValue("suggestion", dataReadingPartFour.questions[0].suggestion || "");

      // Set suggestion state
      setSuggestion(dataReadingPartFour.questions[0].suggestion || "");

      // Also update Redux store
      dispatch(
        UPDATE_SPEAKING_MAIN_DATA({
          field: "title",
          value: dataReadingPartFour.title,
        })
      );
      dispatch(
        UPDATE_SPEAKING_MAIN_DATA({
          field: "content",
          value: dataReadingPartFour.questions[0].content,
        })
      );
      dispatch(
        UPDATE_SPEAKING_MAIN_DATA({
          field: "subTitle",
          value: dataReadingPartFour.questions[0].questionTitle,
        })
      );
      dispatch(
        UPDATE_SPEAKING_MAIN_DATA({
          field: "file",
          value: dataReadingPartFour.questions[0].file,
        })
      );
      dispatch(
        UPDATE_SPEAKING_MAIN_DATA({
          field: "suggestion",
          value: dataReadingPartFour.questions[0].suggestion || "",
        })
      );

      [1, 2, 3].map((num) => {
        const subContent =
          dataReadingPartFour.questions[0].subQuestion[num - 1]?.content || "";
        const subFile =
          dataReadingPartFour.questions[0].subQuestion[num - 1]?.file || "";

        setValue(`subContent${num}` as keyof FormData, subContent);
        setValue(`subFile${num}` as keyof FormData, subFile);

        // Update Redux store
        dispatch(
          UPDATE_SUB_QUESTION({
            index: num - 1,
            field: "content",
            value: subContent,
          })
        );
        dispatch(
          UPDATE_SUB_QUESTION({ index: num - 1, field: "file", value: subFile })
        );
      });
    }
  }, [dataReadingPartFour, setValue, dispatch]);

  // Drag handlers for debug panel
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setDebugPanelPosition({
        x: e.clientX - 150,
        y: e.clientY - 25,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <Box sx={{ width: "100%", minHeight: "100vh" }}>
      {/* Debug Panel - Compact and Modern */}
      <Box
        sx={{
          position: "fixed",
          top: "20px",
          right: "20px",
          width: isDebugPanelOpen ? "300px" : "auto",
          maxHeight: "50vh",
          backgroundColor: "rgba(0, 0, 0, 0.9)",
          color: "white",
          borderRadius: 2,
          zIndex: 1000,
          border: "1px solid rgba(255, 255, 255, 0.1)",
          transform: `translate(${debugPanelPosition.x}px, ${debugPanelPosition.y}px)`,
          cursor: isDragging ? "grabbing" : "default",
          backdropFilter: "blur(10px)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
        }}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <Box
          sx={{
            padding: "8px 12px",
            borderBottom: isDebugPanelOpen
              ? "1px solid rgba(255, 255, 255, 0.1)"
              : "none",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background:
              "linear-gradient(135deg, rgba(25, 118, 210, 0.8), rgba(66, 165, 245, 0.6))",
            borderRadius: isDebugPanelOpen ? "8px 8px 0 0" : "8px",
            cursor: "grab",
          }}
          onMouseDown={handleMouseDown}
        >
          <Typography variant="caption" sx={{ fontWeight: 600 }}>
            � Redux Debug
          </Typography>
          <button
            onClick={() => setIsDebugPanelOpen(!isDebugPanelOpen)}
            style={{
              background: "none",
              border: "none",
              color: "white",
              fontSize: "12px",
              cursor: "pointer",
            }}
          >
            {isDebugPanelOpen ? "−" : "+"}
          </button>
        </Box>

        {isDebugPanelOpen && (
          <Box
            sx={{
              padding: "12px",
              maxHeight: "300px",
              overflow: "auto",
              fontSize: "10px",
            }}
          >
            <pre
              style={{
                margin: 0,
                lineHeight: "1.2",
                wordWrap: "break-word",
                whiteSpace: "pre-wrap",
              }}
            >
              {JSON.stringify(
                speakingStore?.currentSpeakingData || {},
                null,
                2
              )}
            </pre>
          </Box>
        )}
      </Box>

      {/* Main Form Container */}
      <Fade in={true} timeout={800}>
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
            Speaking Part 4
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ p: 3 }}>
              {/* Main Information Section - Compact Grid Layout */}
              <Grow in={true} timeout={600}>
                <Card elevation={2} sx={{ mb: 3, borderRadius: 2 }}>
                  <CardContent sx={{ p: 2.5 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        mb: 2,
                        fontWeight: 600,
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <Assignment sx={{ color: "primary.main" }} />
                      Basic Information
                    </Typography>

                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <Typography
                          variant="body2"
                          sx={{ mb: 1, fontWeight: 500 }}
                        >
                          Title
                        </Typography>
                        <TextField
                          {...register("title", { required: true })}
                          placeholder="Exercise title..."
                          variant="outlined"
                          fullWidth
                          size="small"
                          error={!!errors.title}
                          helperText={errors.title ? "Required" : ""}
                          sx={{
                            "& .MuiOutlinedInput-root": { borderRadius: 1.5 },
                          }}
                        />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <Typography
                          variant="body2"
                          sx={{ mb: 1, fontWeight: 500 }}
                        >
                          Sub Title
                        </Typography>
                        <TextField
                          {...register("subTitle")}
                          placeholder="Subtitle..."
                          variant="outlined"
                          fullWidth
                          size="small"
                          sx={{
                            "& .MuiOutlinedInput-root": { borderRadius: 1.5 },
                          }}
                        />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <Typography
                          variant="body2"
                          sx={{ mb: 1, fontWeight: 500 }}
                        >
                          Content
                        </Typography>
                        <TextField
                          {...register("content", { required: true })}
                          placeholder="Main content..."
                          variant="outlined"
                          fullWidth
                          multiline
                          rows={2}
                          error={!!errors.content}
                          helperText={errors.content ? "Required" : ""}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: 1.5,
                            },
                          }}
                        />

                        <Typography
                          variant="body2"
                          sx={{ mb: 1, fontWeight: 500 }}
                        >
                          Audio File URL
                        </Typography>
                        <TextField
                          {...register("file")}
                          placeholder="Main audio file URL..."
                          variant="outlined"
                          fullWidth
                          size="small"
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: 1.5,
                            },
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography
                          variant="body2"
                          sx={{ mb: 1, fontWeight: 500 }}
                        >
                          Suggestion
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
                            placeholder="Write answer suggestions or insert special characters ★"
                            suggestion={suggestion}
                            setSuggestion={setSuggestion}
                            editorId="suggestionEditor"
                            enableFullscreen={true}
                            modalTitle="Suggestion Editor - Expanded View"
                          />
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grow>

              {/* Questions Section - Horizontal Layout */}
              <Grow in={true} timeout={800}>
                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      mb: 2,
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

                  <Grid container spacing={2}>
                    {[1, 2, 3].map((num) => (
                      <Grid item xs={12} md={4} key={num}>
                        <QuestionBox
                          questionNumber={num}
                          register={register}
                          errors={errors}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              </Grow>

              <Divider sx={{ my: 2 }} />

              {/* Action Buttons */}
              <Fade in={true} timeout={1000}>
                <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    startIcon={<Save />}
                    sx={{
                      px: 4,
                      borderRadius: 2,
                      background: "linear-gradient(45deg, #1976d2, #42a5f5)",
                      "&:hover": {
                        background: "linear-gradient(45deg, #1565c0, #1976d2)",
                        transform: "translateY(-1px)",
                      },
                    }}
                  >
                    Submit
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

export default SpeakingPartFour;
