import React, { ChangeEvent, useEffect, useState } from "react";
import { useNavigate, NavLink, useParams } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import { useNotify } from "react-admin";
import {
  Stack,
  Box,
  TextField,
  Paper,
  Typography,
  Container,
  Divider,
  Card,
  CardContent,
  Fade,
  Grow,
  LinearProgress,
  Chip,
  Button,
} from "@mui/material";
import {
  Assignment,
  QuestionAnswer,
  Save,
  Cancel,
  CloudUpload,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import dataProvider from "../../../providers/dataProviders/dataProvider";
import baseDataProvider from "../../../providers/dataProviders/baseDataProvider";
import { UPDATED_SUCCESS } from "../../../consts/general";
import { InputFileUpload } from "../../../components/UploadFile/UploadFile";
import { stylesInpection } from "../../../styles/product-inspection";
import TextEditor from "../../../components/TextEditor/TextEditor";
import {
  UPDATE_SPEAKING_MAIN_DATA,
  UPDATE_SUB_QUESTION,
  UPDATE_SUB_QUESTION_SUGGESTION,
  RESET_SPEAKING_DATA,
} from "../../../store/feature/speaking";
import {
  R2FilePreview,
  SimpleR2FilePreview,
} from "../../../components/R2FileUpload";
import r2UploadHelper from "../../../services/r2UploadHelper";

interface ReadingPartOneProps {
  children?: JSX.Element | JSX.Element[];
  showDeleteButton?: boolean;
  showSaveButton?: boolean;
  showCancelButton?: boolean;
  alwaysEnable?: boolean;
  pathTo?: string;
  dataReadingPartTwo?: any;
  statusHandler?: string;
  handleCancel?: () => void;
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
  imgUrl?: string;
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
            mb: 3,
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
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="subtitle2"
            sx={{ mb: 1.5, fontWeight: 600, color: "text.secondary" }}
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
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="subtitle2"
            sx={{ mb: 1.5, fontWeight: 600, color: "text.secondary" }}
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
            sx={{ mb: 1.5, fontWeight: 600, color: "text.secondary" }}
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

const ReadingPartTwo: React.FC<ReadingPartOneProps> = ({
  children,
  pathTo,
  showDeleteButton = true,
  showSaveButton = true,
  showCancelButton = true,
  alwaysEnable = false,
  dataReadingPartTwo = null,
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

  const [imageUpload, setImageUpload] = useState();
  const [images, setImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [rangeUpload, setRangeUpload] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>(Array(3).fill(""));
  const [showDebugPanel, setShowDebugPanel] = useState(false); // State cho debug panel
  const [debugPanelPosition, setDebugPanelPosition] = useState({ x: 0, y: 0 });
  const [isDraggingDebug, setIsDraggingDebug] = useState(false);
  const [debugDragStart, setDebugDragStart] = useState({ x: 0, y: 0 });

  // New states for R2FilePreview
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewImageUrls, setPreviewImageUrls] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // Handler để update Redux khi files được chọn
  const handleFilesChange = (files: File[]) => {
    setSelectedFiles(files);

    // Tạo blob URLs cho preview và update vào Redux
    const blobUrls = files.map((file) => URL.createObjectURL(file));
    setPreviewImageUrls(blobUrls);

    // Update Redux store với blob URLs
    updateMainDataInStore("img", blobUrls);
  };

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

  // Helper functions để update Redux store
  const updateMainDataInStore = (field: string, value: any) => {
    dispatch(UPDATE_SPEAKING_MAIN_DATA({ field, value }));
  };

  const updateSubQuestionInStore = (
    index: number,
    field: string,
    value: any
  ) => {
    dispatch(UPDATE_SUB_QUESTION({ index: index - 1, field, value }));
  };

  // Debug panel drag handlers
  const handleDebugMouseDown = (e: React.MouseEvent) => {
    setIsDraggingDebug(true);
    setDebugDragStart({
      x: e.clientX - debugPanelPosition.x,
      y: e.clientY - debugPanelPosition.y,
    });
  };

  const handleDebugMouseMove = (e: MouseEvent) => {
    if (isDraggingDebug) {
      const newX = e.clientX - debugDragStart.x;
      const newY = e.clientY - debugDragStart.y;

      setDebugPanelPosition({
        x: newX,
        y: newY,
      });
    }
  };

  const handleDebugMouseUp = () => {
    setIsDraggingDebug(false);
  };

  // Effect để update Redux store khi form thay đổi
  useEffect(() => {
    if (watchedValues && Object.keys(watchedValues).length > 0) {
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
            num,
            "content",
            watchedValues[subContentKey] || ""
          );
        }
        if (watchedValues[subFileKey] !== undefined) {
          updateSubQuestionInStore(
            num,
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
      dispatch(RESET_SPEAKING_DATA());
    };
  }, []);

  // Effect cho debug panel drag
  useEffect(() => {
    if (isDraggingDebug) {
      document.addEventListener("mousemove", handleDebugMouseMove);
      document.addEventListener("mouseup", handleDebugMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleDebugMouseMove);
      document.removeEventListener("mouseup", handleDebugMouseUp);
    };
  }, [isDraggingDebug, debugDragStart, debugPanelPosition]); ////////////////////////////////////////////////////////////////////////////

  const onSubmit = async (values: any) => {
    try {
      setIsUploading(true);

      // Upload các file đã select lên R2 trước
      let uploadedImageUrls = [];
      let uploadedImageKeys = [];

      if (selectedFiles.length > 0) {
        const uploadResults = await r2UploadHelper.uploadMultipleFiles(
          selectedFiles,
          "speaking"
        );

        if (uploadResults.success) {
          uploadedImageUrls = uploadResults.successful.map(
            (result) => result.url
          );
          uploadedImageKeys = uploadResults.successful.map(
            (result) => result.key
          );

          // Cập nhật state với URLs đã upload
          setPreviewImageUrls(uploadedImageUrls);
        }
      }

      // Sử dụng data từ Redux store thay vì form values trực tiếp
      const storeData = speakingStore.currentSpeakingData;

      const data = {
        title: storeData.title || values.title,
        timeToDo: 50,
        description: storeData.subTitle || values.subTitle,
        questions: [
          {
            questionTitle: storeData.subTitle || values.subTitle,
            content: storeData.content || values.content,
            answerList: [],
            correctAnswer: "",
            file: storeData.file || values.file,
            subQuestionAnswerList: [],
            suggestion: storeData.suggestion || "",
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
              image: uploadedImageUrls[0] || values[`imgUrl`], // Sử dụng image từ R2
              suggestion: storeData.subQuestions[num - 1]?.suggestion || "",
            })),
            isExample: "",
            image: uploadedImageUrls[0] || null, // Sử dụng image từ R2
            imageKeys: uploadedImageKeys, // Lưu keys để có thể xóa sau này
          },
        ],
        questionType: "SPEAKING",
        questionPart: "TWO",
      };

      console.log({
        dataForm: data,
        storeData,
        uploadedImages: uploadedImageUrls,
      });

      if (statusHandler === "create") {
        const uploadData = new FormData();
        uploadData.append("data", JSON.stringify({ ...data }));
        await createSpeakingPartOne(uploadData);
      }
      if (statusHandler === "edit") {
        console.log("edit");
        await updateReadingPartOne(data);
      }

      // Reset selected files sau khi upload thành công
      setSelectedFiles([]);
    } catch (error) {
      console.error("Error uploading files:", error);
      await notify("Lỗi upload file: " + error, {
        type: "error",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const createSpeakingPartOne = async (data: any) => {
    try {
      const CreateData = await baseDataProvider.createAndUploadImage(
        "speakings",
        { data }
      );

      await notify(UPDATED_SUCCESS, {
        type: "success",
      });
      reset();
      setImages([]);
      // Note: selectedFiles được reset trong onSubmit
    } catch (error) {
      console.log({ error });
      throw error; // Re-throw để onSubmit có thể catch
    }
  };

  //tentisspace
  const updateReadingPartOne = async (values: any) => {
    try {
      await dataProvider.update("speakings", {
        id: dataReadingPartTwo?.id,
        data: values,
        previousData: dataReadingPartTwo,
      });

      await notify(UPDATED_SUCCESS, {
        type: "success",
      });
      navigate("/speakings");
    } catch (error) {
      notify("エラー: 生産管理の更新に失敗しました: " + error, {
        type: "warning",
      });
      throw error; // Re-throw để onSubmit có thể catch
    }
  };
  const handleFileUpload = async (e) => {
    setImageUpload(e.target.files[0]);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files as unknown as File[]);

    // Tạo preview URL
    const newPreviewUrls = files.map((file: File) => URL.createObjectURL(file));
    setPreviewUrls((prev) => [...prev, ...newPreviewUrls]);

    // Lưu file trong state
    setImages((prev) => [...prev, ...files]);
  };

  const handleRemoveImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviewUrls = previewUrls.filter((_, i) => i !== index);
    setImages(newImages);
    setPreviewUrls(newPreviewUrls);
  };

  useEffect(() => {
    console.log({ dataReadingPartTwo });
    if (dataReadingPartTwo) {
      setValue("title", dataReadingPartTwo.title);
      setValue("content", dataReadingPartTwo.questions[0].content);
      setValue("subTitle", dataReadingPartTwo.questions[0].questionTitle);
      setValue("imgUrl", dataReadingPartTwo.questions[0].subQuestion[0].image);

      // Update Redux store với data từ edit
      updateMainDataInStore("title", dataReadingPartTwo.title);
      updateMainDataInStore("content", dataReadingPartTwo.questions[0].content);
      updateMainDataInStore(
        "subTitle",
        dataReadingPartTwo.questions[0].questionTitle
      );
      updateMainDataInStore(
        "suggestion",
        dataReadingPartTwo.questions[0].suggestion || ""
      );
      updateMainDataInStore("file", dataReadingPartTwo.questions[0].file || "");

      [1, 2, 3].map((num) => {
        setValue(
          `subContent${num}` as keyof FormData,
          dataReadingPartTwo.questions[0].subQuestion[num - 1].content
        );

        // Update Redux store cho sub questions
        updateSubQuestionInStore(
          num,
          "content",
          dataReadingPartTwo.questions[0].subQuestion[num - 1].content
        );
        updateSubQuestionInStore(
          num,
          "file",
          dataReadingPartTwo.questions[0].subQuestion[num - 1].file
        );

        handleSuggestionChange(
          num,
          dataReadingPartTwo.questions[0].subQuestion[num - 1].suggestion
        );
        setValue(
          `subFile${num}` as keyof FormData,
          dataReadingPartTwo.questions[0].subQuestion[num - 1].file
        );
      });
    }
  }, [dataReadingPartTwo, setValue]);
  const handleDragOver = (event: any) => {
    if (event.y >= 140 && event.y < 550) {
      setRangeUpload(true);
    } else {
      setRangeUpload(false);
    }
  };
  const handleDrop = () => {
    setRangeUpload(false);
  };

  useEffect(() => {
    document.addEventListener("dragover", handleDragOver);
    return () => {
      document.removeEventListener("dragover", handleDragOver);
    };
  }, []);

  return (
    <Box sx={{ width: "100%", minHeight: "100vh", py: 4 }}>
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

      {/* Debug Panel - Repositioned */}
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
          transform: `translate(${debugPanelPosition.x}px, ${debugPanelPosition.y}px)`,
          cursor: isDraggingDebug ? "grabbing" : "default",
          userSelect: "none",
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
            cursor: "grab",
            "&:active": {
              cursor: "grabbing",
            },
          }}
          onMouseDown={handleDebugMouseDown}
        >
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            🔧 Redux Debug Panel
          </Typography>
          <Button
            size="small"
            onClick={() => setShowDebugPanel(!showDebugPanel)}
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
              {showDebugPanel ? "▼" : "▶"}
            </Typography>
          </Button>
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
            maxWidth: "1200px",
            mx: "auto",
          }}
        >
          {/* Form Header */}
          <Box
            sx={{
              background: "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
              color: "white",
              p:1,
              textAlign: "center",
            }}
          >
         
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                mb: 1,
                textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
              }}
            >
                 <Assignment sx={{ fontSize:35, mb: 2, opacity: 0.9 }} />Speaking Part 2
            </Typography>

  
          </Box>

          {/* Form Content */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ p: 4 }}>
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
                              : "Provide detailed instructions for the speaking exercise"
                          }
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: 2,
                              background: "rgba(255, 255, 255, 0.8)",
                            },
                          }}
                        />
                      </Box>

                      {/* Two Column Layout */}
                      <Box
                        sx={{
                          display: "grid",
                          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                          gap: 3,
                        }}
                      >
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

                        {/* Suggestion */}
                        <Box>
                          <Typography
                            variant="subtitle2"
                            sx={{
                              mb: 1,
                              fontWeight: 600,
                              color: "text.secondary",
                            }}
                          >
                            Answer Suggestion
                          </Typography>
                          <TextField
                            {...register("suggestion")}
                            placeholder="Provide answer hints..."
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

                      {/* Media URLs */}
                      <Box
                        sx={{
                          display: "grid",
                          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                          gap: 3,
                        }}
                      >
                        {/* Audio File */}
                        <Box>
                          <Typography
                            variant="subtitle2"
                            sx={{
                              mb: 1,
                              fontWeight: 600,
                              color: "text.secondary",
                            }}
                          >
                            Audio File URL
                          </Typography>
                          <TextField
                            {...register("file")}
                            placeholder="Enter audio file URL..."
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

                        {/* Image URL */}
                        <Box>
                          <Typography
                            variant="subtitle2"
                            sx={{
                              mb: 1,
                              fontWeight: 600,
                              color: "text.secondary",
                            }}
                          >
                            Image URL
                          </Typography>
                          <TextField
                            {...register("imgUrl")}
                            placeholder="Enter image URL..."
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
                    </Box>
                  </CardContent>
                </Card>
              </Grow>

              {/* Image Upload Section */}
              <Grow in={true} timeout={800}>
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
                        mb: 3,
                        fontWeight: 600,
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <CloudUpload /> Image Upload
                    </Typography>

                    <SimpleR2FilePreview
                      onFilesChange={handleFilesChange}
                      multiple={true}
                      maxFiles={5}
                    />
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
                    <QuestionAnswer /> Sub Questions
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
                    <>
                      {pathTo ? (
                        <NavLink to={pathTo} style={{ textDecoration: "none" }}>
                          <Button
                            variant="outlined"
                            size="large"
                            startIcon={<Cancel />}
                            sx={{
                              px: 4,
                              py: 1.5,
                              borderRadius: 3,
                              borderWidth: 2,
                              "&:hover": {
                                borderWidth: 2,
                                transform: "translateY(-2px)",
                              },
                            }}
                          >
                            <Typography variant="button" component="span">
                              Cancel
                            </Typography>
                          </Button>
                        </NavLink>
                      ) : (
                        <Button
                          variant="outlined"
                          size="large"
                          onClick={handleCancel}
                          startIcon={<Cancel />}
                          sx={{
                            px: 4,
                            py: 1.5,
                            borderRadius: 3,
                            borderWidth: 2,
                            "&:hover": {
                              borderWidth: 2,
                              transform: "translateY(-2px)",
                            },
                          }}
                        >
                          <Typography variant="button" component="span">
                            Cancel
                          </Typography>
                        </Button>
                      )}
                    </>
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

export default ReadingPartTwo;
