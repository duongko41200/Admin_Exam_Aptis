import { Cancel, QuestionAnswer, Save } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Fade,
  Grow,
  LinearProgress,
  Paper,
  TextField,
  Typography
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNotify } from "react-admin";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { SimpleR2FilePreview } from "../../../components/R2FileUpload";
import TextEditor from "../../../components/TextEditor/TextEditor";
import { UPDATED_SUCCESS } from "../../../consts/general";
import baseDataProvider from "../../../providers/dataProviders/baseDataProvider";
import dataProvider from "../../../providers/dataProviders/dataProvider";
import R2UploadService from "../../../services/API/r2UploadHelper.service";
import {
  RESET_SPEAKING_DATA,
  UPDATE_SPEAKING_MAIN_DATA,
  UPDATE_SUB_QUESTION,
  UPDATE_SUB_QUESTION_SUGGESTION,
} from "../../../store/feature/speaking";

// Styles for old drag and drop (fallback)
const stylesInpection = {
  dropzone: {
    border: "2px dashed #ccc",
    borderRadius: "10px",
    textAlign: "center" as const,
    padding: "20px",
    cursor: "pointer",
    backgroundColor: "#f9f9f9",
    position: "relative" as const,
    minHeight: "200px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  dropzoneContent: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
  },
};

interface ReadingPartThreeProps {
  children?: JSX.Element | JSX.Element[];
  showDeleteButton?: boolean;
  showSaveButton?: boolean;
  showCancelButton?: boolean;
  alwaysEnable?: boolean;
  pathTo?: string;
  dataReadingPartThree?: any;
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
  subFile1?: string;
  subFile2?: string;
  subFile3?: string;
  imgUrl_1?: string;
  imgUrl_2?: string;
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
  <Grow in={true} timeout={600 + num * 150}>
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

        {/* Text Editor Section */}
        <Box sx={{ mb: 2 }}>
          <Typography
            variant="body2"
            sx={{ mb: 1, fontWeight: 500, color: "text.secondary" }}
          >
            Instructions
          </Typography>
          <Box
            sx={{
              border: "1px solid",
              borderColor: "grey.300",
              borderRadius: 1.5,
              p: 1.5,
              backgroundColor: "rgba(248, 250, 252, 0.5)",
              minHeight: "80px",
            }}
          >
            <TextEditor
              placeholder="Write instructions or insert special characters ★"
              suggestion={suggestion}
              setSuggestion={setSuggestion}
              editorId={`editor${num}`}
              enableFullscreen={true}
              modalTitle={`Question ${num} Instructions - Expanded View`}
            />
          </Box>
        </Box>

        {/* Audio File Field */}
        <Box>
          <Typography
            variant="subtitle2"
            sx={{ mb: 1, fontWeight: 600, color: "text.secondary" }}
          >
            Audio File URL
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

const SpeakingPartThree: React.FC<ReadingPartThreeProps> = ({
  children,
  pathTo,
  showDeleteButton = true,
  showSaveButton = true,
  showCancelButton = true,
  alwaysEnable = false,
  dataReadingPartThree = null,
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

  const [images, setImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [rangeUpload, setRangeUpload] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>(Array(3).fill(""));
  const [showDebugPanel, setShowDebugPanel] = useState(false);
  const [debugPanelPosition, setDebugPanelPosition] = useState({ x: 0, y: 0 });
  const [isDraggingDebug, setIsDraggingDebug] = useState(false);
  const [debugDragStart, setDebugDragStart] = useState({ x: 0, y: 0 });

  // New states for R2FilePreview
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewImageUrls, setPreviewImageUrls] = useState<string[]>([]);
  const [existingImageUrls, setExistingImageUrls] = useState<string[]>([]);
  const [removedImageUrls, setRemovedImageUrls] = useState<string[]>([]);
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

  // Handler khi xóa ảnh hiện có
  const handleRemoveExistingImage = (url: string) => {
    console.log("🗑️ Marking existing image for removal:", url);

    // Thêm vào danh sách cần xóa
    setRemovedImageUrls((prev) => [...prev, url]);

    // Xóa khỏi danh sách hiện tại
    setExistingImageUrls((prev) => prev.filter((imgUrl) => imgUrl !== url));
  };

  // Watch form values để update store
  const watchedValues = watch();

  ////////////////////////////////////////////////////////////////////////////

  const onSubmit = async (values: any) => {
    try {
      setIsUploading(true);

      // Xóa các ảnh cũ đã được đánh dấu xóa
      if (removedImageUrls.length > 0) {
        for (const imageUrl of removedImageUrls) {
          try {
            const key = imageUrl
              .split("https://files.aptisacademy.com.vn/")
              .pop();

            if (key) {
              await R2UploadService.deleteFile(key);
            }
          } catch (deleteError) {
            console.error("❌ Failed to delete image:", imageUrl, deleteError);
          }
        }
      }

      // Upload các file đã select lên R2 trước
      let uploadedImageUrls = [...existingImageUrls];
      let uploadedImageKeys = [];

      // Nếu có ảnh cũ, extract keys từ URLs
      if (existingImageUrls.length > 0) {
        uploadedImageKeys = existingImageUrls
          .map((url) => {
            // Extract key từ URL, ví dụ: https://files.aptisacademy.com.vn/speaking/abc.jpg -> speaking/abc.jpg
            return url.split(`https://files.aptisacademy.com.vn/`).pop() || "";
          })
          .filter((key) => key); // Lọc bỏ empty strings
      }

      if (selectedFiles.length > 0) {
        const uploadResults = await R2UploadService.uploadMultipleFiles(
          selectedFiles,
          "speaking"
        );

        console.log({ uploadResults });

        if (uploadResults.metadata.successful) {
          const newImageUrls = uploadResults.metadata.successful.map(
            (result) => `https://files.aptisacademy.com.vn/${result.key}`
          );
          const newImageKeys = uploadResults.metadata.successful.map(
            (result) => result.key
          );

          // Thêm ảnh mới vào danh sách
          uploadedImageUrls = [...uploadedImageUrls, ...newImageUrls];
          uploadedImageKeys = [...uploadedImageKeys, ...newImageKeys];

          // Cập nhật state với URLs đã upload
          setPreviewImageUrls(newImageUrls);
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
              image: null,
              suggestion:
                storeData.subQuestions[num - 1]?.suggestion ||
                suggestions[num - 1] ||
                "",
            })),
            isExample: "",
            image: uploadedImageUrls, // Keys của ảnh mới
          },
        ],
        questionType: "SPEAKING",
        questionPart: "THREE",
      };

      console.log({
        dataForm: data,
        storeData,
        uploadedImages: uploadedImageUrls,
        uploadedImageKeys,
        removedImages: removedImageUrls,
        currentSuggestions: suggestions,
        existingImageUrls,
        selectedFiles: selectedFiles.map((f) => f.name),
      });

      if (statusHandler === "create") {
        await createSpeakingPartOne({ data });
      }
      if (statusHandler === "edit") {
        console.log("edit");
        await updateReadingPartOne(data);
      }

      // Reset selected files và removed images sau khi upload thành công
      setSelectedFiles([]);
      setRemovedImageUrls([]);
    } catch (error) {
      console.error("Error uploading files:", error);
      await notify("Lỗi upload file: " + error, {
        type: "error",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const createSpeakingPartOne = async ({ data }) => {
    try {
      const CreateData = await baseDataProvider.create("speakings", { data });

      console.log({ CreateData });

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
        id: dataReadingPartThree?.id,
        data: values,
        previousData: dataReadingPartThree,
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

  const handleRemoveImage = (index: any) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviewUrls = previewUrls.filter((_, i) => i !== index);
    setImages(newImages);
    setPreviewUrls(newPreviewUrls);
  };
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

  // Effect để sync suggestions với Redux khi suggestions thay đổi
  useEffect(() => {
    suggestions.forEach((suggestion, index) => {
      if (suggestion) {
        updateSubQuestionInStore(index + 1, "suggestion", suggestion);
      }
    });
  }, [suggestions]);

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

        // Sync suggestion từ local state vào Redux
        if (suggestions[num - 1] !== undefined) {
          updateSubQuestionInStore(
            num,
            "suggestion",
            suggestions[num - 1] || ""
          );
        }
      });
    }
  }, [watchedValues, suggestions]);

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
  }, [isDraggingDebug, debugDragStart, debugPanelPosition]);

  useEffect(() => {
    console.log({ dataReadingPartThree });
    if (dataReadingPartThree) {
      setValue("title", dataReadingPartThree.title);
      setValue("content", dataReadingPartThree.questions[0].content);
      setValue("subTitle", dataReadingPartThree.questions[0].questionTitle);

      // Set existing images từ data
      const existingImages = [];
      if (
        dataReadingPartThree.questions[0].image &&
        dataReadingPartThree.questions[0].image.length > 0
      ) {
        dataReadingPartThree.questions[0].image.forEach((img) => {
          if (img) existingImages.push(`${img}`);
        });
      }

      console.log("📸 Setting existing images:", existingImages);
      setExistingImageUrls(existingImages);
      setValue("imgUrl_1", existingImages[0] || "");
      setValue("imgUrl_2", existingImages[1] || "");

      // Update Redux store với data từ edit
      updateMainDataInStore("title", dataReadingPartThree.title);
      updateMainDataInStore(
        "content",
        dataReadingPartThree.questions[0].content
      );
      updateMainDataInStore(
        "subTitle",
        dataReadingPartThree.questions[0].questionTitle
      );
      updateMainDataInStore(
        "suggestion",
        dataReadingPartThree.questions[0].suggestion || ""
      );
      updateMainDataInStore(
        "file",
        dataReadingPartThree.questions[0].file || ""
      );
      updateMainDataInStore("img", existingImages);

      [1, 2, 3].map((num) => {
        setValue(
          `subContent${num}` as keyof FormData,
          dataReadingPartThree.questions[0].subQuestion[num - 1].content
        );

        // Update Redux store cho sub questions
        updateSubQuestionInStore(
          num,
          "content",
          dataReadingPartThree.questions[0].subQuestion[num - 1].content
        );
        updateSubQuestionInStore(
          num,
          "file",
          dataReadingPartThree.questions[0].subQuestion[num - 1].file
        );

        handleSuggestionChange(
          num - 1,
          dataReadingPartThree.questions[0].subQuestion[num - 1].suggestion
        );
        setValue(
          `subFile${num}` as keyof FormData,
          dataReadingPartThree.questions[0].subQuestion[num - 1].file
        );
      });
    }
  }, [dataReadingPartThree, setValue]);
  const handleDragOver = (event: any) => {
    if (event.y >= 140 && event.y < 550) {
      setRangeUpload(true);
    } else {
      setRangeUpload(false);
    }
  };

  useEffect(() => {
    document.addEventListener("dragover", handleDragOver);
    return () => {
      document.removeEventListener("dragover", handleDragOver);
    };
  }, []);

  return (
    <Box sx={{ width: "100%", minHeight: "100vh" }}>
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

      {/* Debug Panel */}
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
              {JSON.stringify(
                {
                  redux: speakingStore.currentSpeakingData,
                  imageState: {
                    existingImages: existingImageUrls,
                    selectedFiles: selectedFiles.map((f) => f.name),
                    removedImages: removedImageUrls,
                    previewUrls: previewImageUrls,
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
            }}
          >
            Speaking Part 3
          </Typography>

          {/* Form Content */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ p: 2 }}>
              {/* Basic Information và Image Upload Section - Cùng hàng */}
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" },
                  gap: 3,
                  mb: 4,
                  minHeight: "450px",
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
                        <QuestionAnswer /> Basic Information
                      </Typography>

                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 3,
                        }}
                      >
                        <TextField
                          {...register("title", { required: true })}
                          label="Title"
                          placeholder="Enter exam title..."
                          variant="outlined"
                          fullWidth
                          error={!!errors.title}
                          helperText={
                            errors.title ? "This field is required" : ""
                          }
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: 2,
                            },
                          }}
                        />

                        <TextField
                          {...register("subTitle", { required: true })}
                          label="Sub Title"
                          placeholder="Enter exam subtitle..."
                          variant="outlined"
                          fullWidth
                          error={!!errors.subTitle}
                          helperText={
                            errors.subTitle ? "This field is required" : ""
                          }
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: 2,
                            },
                          }}
                        />

                        <TextField
                          {...register("content", { required: true })}
                          label="Content"
                          placeholder="Enter main content..."
                          variant="outlined"
                          fullWidth
                          multiline
                          rows={3}
                          error={!!errors.content}
                          helperText={
                            errors.content ? "This field is required" : ""
                          }
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: 2,
                            },
                          }}
                        />

                        <TextField
                          {...register("suggestion")}
                          label="Suggestion"
                          placeholder="Enter suggestion..."
                          variant="outlined"
                          fullWidth
                          multiline
                          rows={2}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: 2,
                            },
                          }}
                        />

                        <TextField
                          {...register("file")}
                          label="Audio File URL"
                          placeholder="Enter audio file URL..."
                          variant="outlined"
                          fullWidth
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: 2,
                            },
                          }}
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Grow>

                {/* Image Upload Section */}
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
                        onRemoveExistingImage={handleRemoveExistingImage}
                        initialImageUrls={existingImageUrls}
                        multiple={true}
                        maxFiles={2}
                      />
                    </CardContent>
                  </Card>
                </Grow>
              </Box>

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
                        lg: "repeat(auto-fit, minmax(350px, 1fr))",
                      },
                      gap: 2,
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
                    {isUploading ? "Uploading..." : "Submit"}
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

export default SpeakingPartThree;
