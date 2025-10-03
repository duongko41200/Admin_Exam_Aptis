import React, { useEffect, useState } from "react";
import { useNavigate, NavLink, useParams } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import { useNotify } from "react-admin";
import {
  Stack,
  Box,
  TextField,
  Card,
  CardContent,
  Typography,
  Chip,
  Divider,
  Fade,
  Grow,
  LinearProgress,
  Paper,
  Button,
} from "@mui/material";
import { Cancel, QuestionAnswer, Save, Headphones } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import dataProvider from "../../../providers/dataProviders/dataProvider";
import baseDataProvider from "../../../providers/dataProviders/baseDataProvider";
import { UPDATED_SUCCESS } from "../../../consts/general";
import TextEditor from "../../../components/TextEditor/TextEditor";
import { SimpleR2FilePreview } from "../../../components/R2FileUpload";
import R2UploadService from "../../../services/API/r2UploadHelper.service";
import {
  UPDATE_LISTENING_MAIN_DATA,
  UPDATE_LISTENING_SUB_QUESTION,
  UPDATE_LISTENING_SUB_QUESTION_SUGGESTION,
  RESET_LISTENING_DATA,
  INIT_LISTENING_SUB_QUESTIONS,
} from "../../../store/feature/listening";

interface ListeningPartOneProps {
  children?: JSX.Element | JSX.Element[];
  showDeleteButton?: boolean;
  showSaveButton?: boolean;
  showCancelButton?: boolean;
  alwaysEnable?: boolean;
  pathTo?: string;
  handleCancel?: () => void;
  dataListeningPartTwo?: any;
  statusHandler?: string;
}

interface FormData {
  title: string;
  subTitle: string;
  content: string;
  file: string;
  suggestion: string;
  // Option answers (6 options for Part 2)
  optionAnswer1: string;
  optionAnswer2: string;
  optionAnswer3: string;
  optionAnswer4: string;
  optionAnswer5: string;
  optionAnswer6: string;
  // Sub questions (4 questions for Part 2)
  numberOrder1: string;
  numberOrder2: string;
  numberOrder3: string;
  numberOrder4: string;
  correctAnswer1: string;
  correctAnswer2: string;
  correctAnswer3: string;
  correctAnswer4: string;
  [key: `optionAnswer${number}`]: string;
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
  <Grow in={true} timeout={800 + questionNumber * 200}>
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
            mb: 2,
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

        {/* Number Order Field */}
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="subtitle2"
            sx={{ mb: 1.5, fontWeight: 600, color: "text.secondary" }}
          >
            Speaker Order Number
          </Typography>
          <TextField
            type="number"
            {...register(`numberOrder${questionNumber}`, { required: true })}
            placeholder={`Enter speaker order number...`}
            variant="outlined"
            fullWidth
            inputProps={{ min: 1, max: 5 }}
            error={!!errors[`numberOrder${questionNumber}`]}
            helperText={
              errors[`numberOrder${questionNumber}`]
                ? "This field is required"
                : "Enter the order number of the speaker (1-5)"
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

        {/* Correct Answer Field */}
        <Box>
          <Typography
            variant="subtitle2"
            sx={{ mb: 1.5, fontWeight: 600, color: "text.secondary" }}
          >
            Answer Content
          </Typography>
          <TextField
            {...register(`correctAnswer${questionNumber}`, { required: true })}
            placeholder={`Enter answer content for question ${questionNumber}...`}
            variant="outlined"
            fullWidth
            multiline
            rows={3}
            error={!!errors[`correctAnswer${questionNumber}`]}
            helperText={
              errors[`correctAnswer${questionNumber}`]
                ? "This field is required"
                : "Provide the correct answer content"
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
      </CardContent>
    </Card>
  </Grow>
);

const ListeningPartTwo: React.FC<ListeningPartOneProps> = ({
  children,
  pathTo,
  showDeleteButton = true,
  showSaveButton = true,
  showCancelButton = true,
  alwaysEnable = false,
  dataListeningPartTwo = null,
  statusHandler = "create",
  handleCancel,
  ...props
}) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const notify = useNotify();
  const dispatch = useDispatch();
  const listeningStore = useSelector((state: any) => state.listeningStore);

  // Debug panel states
  const [isDragging, setIsDragging] = useState(false);
  const [isDebugPanelOpen, setIsDebugPanelOpen] = useState(false);
  const [debugPanelPosition, setDebugPanelPosition] = useState({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const [suggestion, setSuggestion] = useState("");

  // New states for audio file upload
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [existingAudioUrls, setExistingAudioUrls] = useState<string[]>([]);
  const [removedAudioUrls, setRemovedAudioUrls] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    reset,
    watch,
  } = useForm<FormData>();

  // Watch all form fields for real-time Redux sync
  const watchedFields = watch();
  const [isShow, setIsShow] = useState(false);

  // Handler để update Redux khi audio files được chọn
  const handleFilesChange = (files: File[]) => {
    setSelectedFiles(files);

    // Update Redux store
    dispatch(
      UPDATE_LISTENING_MAIN_DATA({
        field: "selectedAudioFiles",
        value: files.map((f) => f.name),
      })
    );
  };

  // Handler khi xóa audio file hiện có
  const handleRemoveExistingAudio = (url: string) => {
    setRemovedAudioUrls((prev) => [...prev, url]);
    setExistingAudioUrls((prev) => prev.filter((audioUrl) => audioUrl !== url));
  };

  // Debug panel drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - debugPanelPosition.x,
      y: e.clientY - debugPanelPosition.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setDebugPanelPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Sync form data to Redux store in real-time
  useEffect(() => {
    // Initialize store with 4 sub questions for Listening Part 2
    if (!listeningStore?.currentListeningData) {
      dispatch(RESET_LISTENING_DATA());
      dispatch(INIT_LISTENING_SUB_QUESTIONS({ count: 4 }));
      return;
    }

    // Ensure we have 4 sub questions
    if (listeningStore.currentListeningData.subQuestions.length !== 4) {
      dispatch(INIT_LISTENING_SUB_QUESTIONS({ count: 4 }));
      return;
    }
  }, [dispatch, listeningStore?.currentListeningData]);

  // Separate useEffect for form field sync to avoid infinite loops
  useEffect(() => {
    if (!listeningStore?.currentListeningData) return;

    // Update main data fields only if they're different
    if (
      watchedFields.title !== undefined &&
      watchedFields.title !== listeningStore.currentListeningData.title
    ) {
      dispatch(
        UPDATE_LISTENING_MAIN_DATA({
          field: "title",
          value: watchedFields.title || "",
        })
      );
    }
    if (
      watchedFields.content !== undefined &&
      watchedFields.content !== listeningStore.currentListeningData.content
    ) {
      dispatch(
        UPDATE_LISTENING_MAIN_DATA({
          field: "content",
          value: watchedFields.content || "",
        })
      );
    }
    if (
      watchedFields.subTitle !== undefined &&
      watchedFields.subTitle !== listeningStore.currentListeningData.subTitle
    ) {
      dispatch(
        UPDATE_LISTENING_MAIN_DATA({
          field: "subTitle",
          value: watchedFields.subTitle || "",
        })
      );
    }
    if (
      watchedFields.file !== undefined &&
      watchedFields.file !== listeningStore.currentListeningData.file
    ) {
      dispatch(
        UPDATE_LISTENING_MAIN_DATA({
          field: "file",
          value: watchedFields.file || "",
        })
      );
    }
  }, [
    watchedFields.title,
    watchedFields.content,
    watchedFields.subTitle,
    watchedFields.file,
    dispatch,
    listeningStore?.currentListeningData,
  ]);

  // Separate useEffect for suggestion
  useEffect(() => {
    if (suggestion !== listeningStore?.currentListeningData?.suggestion) {
      dispatch(
        UPDATE_LISTENING_MAIN_DATA({
          field: "suggestion",
          value: suggestion || "",
        })
      );
    }
  }, [suggestion, dispatch, listeningStore?.currentListeningData?.suggestion]);

  // Separate useEffect for sub questions
  useEffect(() => {
    if (
      !listeningStore?.currentListeningData?.subQuestions ||
      listeningStore.currentListeningData.subQuestions.length !== 4
    )
      return;

    [1, 2, 3, 4].forEach((num) => {
      const numberOrderKey = `numberOrder${num}` as keyof FormData;
      const correctAnswerKey = `correctAnswer${num}` as keyof FormData;

      const currentSubQuestion =
        listeningStore.currentListeningData.subQuestions[num - 1];

      if (
        watchedFields[numberOrderKey] !== undefined &&
        watchedFields[numberOrderKey] !== currentSubQuestion?.content
      ) {
        dispatch(
          UPDATE_LISTENING_SUB_QUESTION({
            index: num - 1,
            field: "content",
            value: watchedFields[numberOrderKey] || "",
          })
        );
      }

      if (
        watchedFields[correctAnswerKey] !== undefined &&
        watchedFields[correctAnswerKey] !== currentSubQuestion?.correctAnswer
      ) {
        dispatch(
          UPDATE_LISTENING_SUB_QUESTION({
            index: num - 1,
            field: "correctAnswer",
            value: watchedFields[correctAnswerKey] || "",
          })
        );
      }
    });
  }, [
    watchedFields.numberOrder1,
    watchedFields.numberOrder2,
    watchedFields.numberOrder3,
    watchedFields.numberOrder4,
    watchedFields.correctAnswer1,
    watchedFields.correctAnswer2,
    watchedFields.correctAnswer3,
    watchedFields.correctAnswer4,
    dispatch,
    listeningStore?.currentListeningData?.subQuestions,
  ]);

  // Separate useEffect for option answers
  useEffect(() => {
    if (!listeningStore?.currentListeningData) return;

    const currentAnswerList =
      listeningStore.currentListeningData.answerList || [];
    const newOptionAnswers = [1, 2, 3, 4, 5, 6].map((num) => {
      const optionKey = `optionAnswer${num}` as keyof FormData;
      return {
        id: num,
        content: watchedFields[optionKey] || "",
      };
    });

    // Only update if the content has actually changed
    const hasChanged = newOptionAnswers.some((option, index) => {
      const currentOption = currentAnswerList[index];
      return !currentOption || currentOption.content !== option.content;
    });

    if (hasChanged) {
      dispatch(
        UPDATE_LISTENING_MAIN_DATA({
          field: "answerList",
          value: newOptionAnswers,
        })
      );
    }
  }, [
    watchedFields.optionAnswer1,
    watchedFields.optionAnswer2,
    watchedFields.optionAnswer3,
    watchedFields.optionAnswer4,
    watchedFields.optionAnswer5,
    watchedFields.optionAnswer6,
    dispatch,
    listeningStore?.currentListeningData?.answerList,
  ]);

  const onSubmit = async (values: any) => {
    try {
      setIsUploading(true);

      // Xóa các audio files cũ đã được đánh dấu xóa
      if (removedAudioUrls.length > 0) {
        for (const audioUrl of removedAudioUrls) {
          try {
            const key = audioUrl
              .split("https://files.aptisacademy.com.vn/")
              .pop();

            if (key) {
              await R2UploadService.deleteFile(key);
            }
          } catch (deleteError) {
            console.error("❌ Failed to delete audio:", audioUrl, deleteError);
          }
        }
      }

      // Upload các audio files đã select lên R2 trước
      let uploadedAudioUrl = existingAudioUrls[0] || ""; // Chỉ lấy 1 file audio

      if (selectedFiles.length > 0) {
        const uploadResults = await R2UploadService.uploadMultipleFiles(
          selectedFiles,
          "listening"
        );

        if (
          uploadResults.metadata.successful &&
          uploadResults.metadata.successful.length > 0
        ) {
          uploadedAudioUrl = `https://files.aptisacademy.com.vn/${uploadResults.metadata.successful[0].key}`;
        }
      }

      // Use data from Redux store instead of form values
      const data = {
        title: listeningStore?.currentListeningData?.title || values.title,
        timeToDo: 35,
        questions: {
          questionTitle:
            listeningStore?.currentListeningData?.subTitle || values.subTitle,
          content:
            listeningStore?.currentListeningData?.content || values.content,
          answerList:
            listeningStore?.currentListeningData?.answerList ||
            [1, 2, 3, 4, 5, 6].map((num, idx) => ({
              id: idx + 1,
              content: values[`optionAnswer${num}`] || "",
            })),
          correctAnswer: null,
          file:
            uploadedAudioUrl ||
            listeningStore?.currentListeningData?.file ||
            values.file,
          subQuestionAnswerList: [],
          suggestion:
            listeningStore?.currentListeningData?.suggestion || suggestion,
          subQuestion: [1, 2, 3, 4].map((num) => ({
            content:
              listeningStore?.currentListeningData?.subQuestions?.[num - 1]
                ?.content ||
              values[`numberOrder${num}`] ||
              "",
            correctAnswer:
              listeningStore?.currentListeningData?.subQuestions?.[num - 1]
                ?.correctAnswer ||
              values[`correctAnswer${num}`] ||
              "",
            file: null,
            answerList: null,
            image: null,
            suggestion: null,
          })),
          isExample: false,
          image: null,
        },

        questionType: "LISTENING",
        questionPart: "TWO",
        description: null,
      };

      if (statusHandler === "create") {
        await createListeningPartOne(data);
      }
      if (statusHandler === "edit") {
        console.log("edit");
        await updateListeningPartOne(data);
      }

      // Reset selected files và removed audio sau khi upload thành công
      setSelectedFiles([]);
      setRemovedAudioUrls([]);
    } catch (error) {
      console.error("Error uploading files:", error);
      await notify("Lỗi upload file: " + error, {
        type: "error",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const createListeningPartOne = async (data: any) => {
    try {
      const CreateData = await baseDataProvider.create("Listenings", { data });

      await notify(UPDATED_SUCCESS, {
        type: "success",
      });
      reset();
    } catch (error) {
      console.log({ error });
      throw error;
    }
  };

  const updateListeningPartOne = async (values: any) => {
    try {
      await dataProvider.update("Listenings", {
        id: dataListeningPartTwo?.id,
        data: values,
        previousData: dataListeningPartTwo,
      });

      await notify(UPDATED_SUCCESS, {
        type: "success",
      });
      navigate("/Listenings");
    } catch (error) {
      notify("エラー: 生産管理の更新に失敗しました: " + error, {
        type: "warning",
      });
      throw error;
    }
  };

  useEffect(() => {
    if (dataListeningPartTwo) {
      setValue("title", dataListeningPartTwo.title);
      setValue("content", dataListeningPartTwo.questions[0].content);
      setValue("subTitle", dataListeningPartTwo.questions[0].questionTitle);
      setValue("file", dataListeningPartTwo.questions[0].file);
      setSuggestion(dataListeningPartTwo.questions[0].suggestion);

      // Set existing audio file
      const existingAudio = [];
      if (dataListeningPartTwo.questions[0].file) {
        existingAudio.push(dataListeningPartTwo.questions[0].file);
      }
      setExistingAudioUrls(existingAudio);

      // Also update Redux store
      dispatch(
        UPDATE_LISTENING_MAIN_DATA({
          field: "title",
          value: dataListeningPartTwo.title,
        })
      );
      dispatch(
        UPDATE_LISTENING_MAIN_DATA({
          field: "content",
          value: dataListeningPartTwo.questions[0].content,
        })
      );
      dispatch(
        UPDATE_LISTENING_MAIN_DATA({
          field: "subTitle",
          value: dataListeningPartTwo.questions[0].questionTitle,
        })
      );
      dispatch(
        UPDATE_LISTENING_MAIN_DATA({
          field: "file",
          value: dataListeningPartTwo.questions[0].file,
        })
      );
      dispatch(
        UPDATE_LISTENING_MAIN_DATA({
          field: "suggestion",
          value: dataListeningPartTwo.questions[0].suggestion || "",
        })
      );

      [1, 2, 3, 4].map((num) => {
        const numberOrder =
          dataListeningPartTwo.questions[0].subQuestion[num - 1]?.content || "";
        const correctAnswer =
          dataListeningPartTwo.questions[0].subQuestion[num - 1]
            ?.correctAnswer || "";

        setValue(`numberOrder${num}` as keyof FormData, numberOrder);
        setValue(`correctAnswer${num}` as keyof FormData, correctAnswer);

        // Update Redux store
        dispatch(
          UPDATE_LISTENING_SUB_QUESTION({
            index: num - 1,
            field: "content",
            value: numberOrder,
          })
        );
        dispatch(
          UPDATE_LISTENING_SUB_QUESTION({
            index: num - 1,
            field: "correctAnswer",
            value: correctAnswer,
          })
        );
      });

      [1, 2, 3, 4, 5, 6].map((num, idx) => {
        const optionContent =
          dataListeningPartTwo.questions[0].answerList[num - 1]?.content || "";
        setValue(`optionAnswer${num}` as keyof FormData, optionContent);
      });

      // Update Redux store with answerList
      const answerList = [1, 2, 3, 4, 5, 6].map((num) => ({
        id: num,
        content:
          dataListeningPartTwo.questions[0].answerList[num - 1]?.content || "",
      }));
      dispatch(
        UPDATE_LISTENING_MAIN_DATA({
          field: "answerList",
          value: answerList,
        })
      );
    }
  }, [dataListeningPartTwo, setValue, dispatch]);

  return (
    <Box sx={{ width: "100%", maxHeight: "90vh", overflowY: "auto", pb: 5 }}>
      {/* Loading Progress Bar */}
      {isUploading && (
        <Box
          sx={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 9999 }}
        >
          <LinearProgress
            color="primary"
            sx={{
              height: 4,
              background: "linear-gradient(90deg, #1976d2, #42a5f5)",
            }}
          />
        </Box>
      )}

      {/* Draggable Debug Panel - JSON Format */}
      <Box
        sx={{
          position: "fixed",
          top: "120px",
          right: "20px",
          width: isDebugPanelOpen ? "350px" : "auto",
          maxHeight: "70vh",
          backgroundColor: "rgba(0, 0, 0, 0.85)",
          color: "white",
          borderRadius: 3,
          zIndex: 1000,
          border: "1px solid rgba(255, 255, 255, 0.1)",
          transform: `translate(${debugPanelPosition.x}px, ${debugPanelPosition.y}px)`,
          cursor: isDragging ? "grabbing" : "default",
          userSelect: "none",
          backdropFilter: "blur(10px)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
        }}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        {/* Header luôn hiển thị */}
        <Box
          sx={{
            padding: "12px 16px",
            borderBottom: isDebugPanelOpen
              ? "1px solid rgba(255, 255, 255, 0.1)"
              : "none",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background:
              "linear-gradient(135deg, rgba(25, 118, 210, 0.8), rgba(66, 165, 245, 0.6))",
            borderRadius: isDebugPanelOpen ? "12px 12px 0 0" : "12px",
            cursor: "grab",
            "&:active": {
              cursor: "grabbing",
            },
          }}
          onMouseDown={handleMouseDown}
        >
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            🔧 Redux Debug Panel (Part 2)
          </Typography>
          <Button
            size="small"
            onClick={() => setIsDebugPanelOpen(!isDebugPanelOpen)}
            sx={{
              minWidth: "auto",
              p: 0.5,
              color: "white",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.1)",
              },
            }}
          >
            <Typography variant="body2">
              {isDebugPanelOpen ? "▼" : "▶"}
            </Typography>
          </Button>
        </Box>

        {/* Nội dung JSON chỉ hiển thị khi expanded */}
        {isDebugPanelOpen && (
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
              {JSON.stringify(
                {
                  redux: listeningStore?.currentListeningData || {},
                  audioState: {
                    existingAudio: existingAudioUrls,
                    selectedFiles: selectedFiles.map((f) => f.name),
                    removedAudio: removedAudioUrls,
                  },
                },
                null,
                2
              )}
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
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Headphones sx={{ fontSize: 32, color: "primary.main" }} />
            Listening Part 2
          </Typography>

          {/* Form Content */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ p: 3 }}>
              {/* Basic Information và Audio Upload Section - Cùng hàng */}
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" },
                  gap: 3,
                  mb: 4,
                  minHeight: "650px",
                }}
              >
                {/* Basic Information Section */}
                <Grow in={true} timeout={600}>
                  <Card
                    elevation={2}
                    sx={{
                      borderRadius: 3,
                      border: "1px solid",
                      borderColor: "grey.200",
                      height: "100%",
                    }}
                  >
                    <CardContent sx={{ p: 3, height: "100%" }}>
                      <Typography
                        variant="h6"
                        sx={{
                          mb: 3,
                          fontWeight: 600,
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        📝 Basic Information
                      </Typography>

                      <Box sx={{ display: "grid", gap: 3 }}>
                        {/* Title Field */}
                        <Box>
                          <Typography
                            variant="subtitle2"
                            sx={{
                              mb: 1,
                              fontWeight: 600,
                              color: "text.secondary",
                            }}
                          >
                            Title *
                          </Typography>
                          <TextField
                            {...register("title", { required: true })}
                            placeholder="Enter listening exercise title..."
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

                        {/* Sub Title */}
                        <Box>
                          <Typography
                            variant="subtitle2"
                            sx={{
                              mb: 1,
                              fontWeight: 600,
                              color: "text.secondary",
                            }}
                          >
                            Sub Title *
                          </Typography>
                          <TextField
                            {...register("subTitle", { required: true })}
                            placeholder="Enter sub title..."
                            variant="outlined"
                            fullWidth
                            error={!!errors.subTitle}
                            helperText={
                              errors.subTitle ? "Sub title is required" : ""
                            }
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                borderRadius: 2,
                                background: "rgba(255, 255, 255, 0.8)",
                              },
                            }}
                          />
                        </Box>

                        {/* Content Field */}
                        <Box>
                          <Typography
                            variant="subtitle2"
                            sx={{
                              mb: 1,
                              fontWeight: 600,
                              color: "text.secondary",
                            }}
                          >
                            Main Content *
                          </Typography>
                          <TextField
                            {...register("content", { required: true })}
                            placeholder="Enter the main content or instructions..."
                            variant="outlined"
                            fullWidth
                            multiline
                            rows={4}
                            error={!!errors.content}
                            helperText={
                              errors.content
                                ? "Content is required"
                                : "Provide detailed instructions for the listening exercise"
                            }
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                borderRadius: 2,
                                background: "rgba(255, 255, 255, 0.8)",
                              },
                            }}
                          />
                        </Box>

                        {/* Audio File URL (fallback) */}
                        <Box>
                          <Typography
                            variant="subtitle2"
                            sx={{
                              mb: 1,
                              fontWeight: 600,
                              color: "text.secondary",
                            }}
                          >
                            Audio File URL (Optional)
                          </Typography>
                          <TextField
                            {...register("file")}
                            placeholder="Enter audio file URL (if not uploading)..."
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
                      </Box>
                    </CardContent>
                  </Card>
                </Grow>

                {/* Audio Upload Section */}
                <Grow in={true} timeout={800}>
                  <Card
                    elevation={2}
                    sx={{
                      borderRadius: 3,
                      border: "1px solid",
                      borderColor: "grey.200",
                      height: "fit-content",
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <SimpleR2FilePreview
                        onFilesChange={handleFilesChange}
                        onRemoveExistingImage={handleRemoveExistingAudio}
                        initialImageUrls={existingAudioUrls}
                        multiple={false}
                        maxFiles={1}
                        acceptedFileTypes={[
                          "audio/mp3",
                          "audio/mpeg",
                          "audio/wav",
                          "audio/mp4",
                          "audio/x-m4a",
                        ]}
                        fileTypeLabel="Audio File"
                        icon="🎵"
                      />
                    </CardContent>
                  </Card>
                </Grow>
              </Box>

              {/* Text Editor Section */}
              <Grow in={true} timeout={900}>
                <Card
                  elevation={2}
                  sx={{
                    borderRadius: 3,
                    border: "1px solid",
                    borderColor: "grey.200",
                    mb: 4,
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        mb: 3,
                        fontWeight: 600,
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      ✨ Additional Instructions
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
                        editorId="listeningPart2Editor"
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grow>

              {/* Answer Options Section */}
              <Grow in={true} timeout={1000}>
                <Card
                  elevation={2}
                  sx={{
                    borderRadius: 3,
                    border: "1px solid",
                    borderColor: "grey.200",
                    mb: 4,
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        mb: 3,
                        fontWeight: 600,
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      📋 Answer Options
                    </Typography>

                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fit, minmax(300px, 1fr))",
                        gap: 2,
                      }}
                    >
                      {[1, 2, 3, 4, 5, 6].map((num) => (
                        <TextField
                          key={num}
                          {...register(`optionAnswer${num}`, {
                            required: true,
                          })}
                          placeholder={`Option ${num}`}
                          variant="outlined"
                          fullWidth
                          error={!!errors[`optionAnswer${num}`]}
                          helperText={
                            errors[`optionAnswer${num}`]
                              ? "This field is required"
                              : ""
                          }
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: 2,
                              background: "rgba(255, 255, 255, 0.8)",
                            },
                          }}
                        />
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grow>

              {/* Questions Section */}
              <Grow in={true} timeout={1100}>
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
                    <QuestionAnswer /> Sub Questions
                  </Typography>

                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: {
                        xs: "1fr",
                        lg: "repeat(auto-fit, minmax(350px, 1fr))",
                      },
                      gap: 3,
                    }}
                  >
                    {[1, 2, 3, 4].map((num) => (
                      <QuestionBox
                        key={num}
                        questionNumber={num}
                        register={register}
                        errors={errors}
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
                    gap: 3,
                    justifyContent: "center",
                    flexWrap: "wrap",
                  }}
                >
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={isUploading}
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
                      "&:disabled": {
                        background: "linear-gradient(45deg, #bdbdbd, #e0e0e0)",
                      },
                    }}
                  >
                    <Typography variant="button" component="span">
                      {isUploading ? "Submitting..." : "Submit Exercise"}
                    </Typography>
                  </Button>

                  {showCancelButton && (
                    <Button
                      type="button"
                      variant="contained"
                      color="error"
                      size="large"
                      onClick={() => navigate("/Listenings")}
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

export default ListeningPartTwo;
