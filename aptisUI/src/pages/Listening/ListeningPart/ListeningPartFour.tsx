import { Box, Stack, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { SimpleR2FilePreview } from "../../../components/R2FileUpload";
import R2UploadService from "../../../services/API/r2UploadHelper.service";
import { Button, useNotify } from "react-admin";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import TextEditor from "../../../components/TextEditor/TextEditor";
import { UPDATED_SUCCESS } from "../../../consts/general";
import baseDataProvider from "../../../providers/dataProviders/baseDataProvider";
import dataProvider from "../../../providers/dataProviders/dataProvider";
import {
  INIT_LISTENING_SUB_QUESTIONS,
  RESET_LISTENING_DATA,
  UPDATE_LISTENING_MAIN_DATA,
  UPDATE_LISTENING_SUB_QUESTION,
} from "../../../store/feature/listening";

interface ListeningPartOneProps {
  children?: JSX.Element | JSX.Element[];
  showDeleteButton?: boolean;
  showSaveButton?: boolean;
  showCancelButton?: boolean;
  alwaysEnable?: boolean;
  pathTo?: string;
  handleCancel?: () => void;
  dataListeningPartFour?: any;
  statusHandler?: string;
}

interface FormData {
  title: string;
  subTitle: string;
  content: string;
  file: string;
  suggestion: string;
  // Sub questions (2 questions for Part 4)
  contentPartFour1: string;
  contentPartFour2: string;
  answerPartFour1: string;
  answerPartFour2: string;
  // Answer options for each question (3 answers per question, 2 questions)
  answer1Sub1: string;
  answer2Sub1: string;
  answer3Sub1: string;
  answer1Sub2: string;
  answer2Sub2: string;
  answer3Sub2: string;
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
  <Box
    sx={{
      minHeight: "200px",
      height: "fit-content",
      border: "1px solid #ddd",
      borderRadius: "8px",
      padding: "16px",
      backgroundColor: "#fafafa",
    }}
  >
    <Box
      sx={{
        fontSize: "18px",
        fontWeight: "bold",
        marginBottom: "12px",
        color: "#1976d2",
      }}
    >
      Nội Dung Câu {questionNumber}
    </Box>

    {/* Question Content */}
    <Box sx={{ marginBottom: "16px" }}>
      <TextField
        {...register(`contentPartFour${questionNumber}`, { required: true })}
        placeholder={`Nhập nội dung câu hỏi ${questionNumber}`}
        variant="outlined"
        fullWidth
        multiline
        rows={2}
        error={!!errors[`contentPartFour${questionNumber}`]}
        helperText={
          errors[`contentPartFour${questionNumber}`]
            ? "Vui lòng nhập nội dung câu hỏi"
            : ""
        }
        sx={{
          "& .MuiOutlinedInput-root": {
            backgroundColor: "white",
          },
        }}
      />
    </Box>

    {/* Answer Options */}
    <Box sx={{ marginBottom: "16px" }}>
      <Box
        sx={{
          fontSize: "14px",
          fontWeight: "500",
          marginBottom: "8px",
          color: "#666",
        }}
      >
        Các lựa chọn đáp án:
      </Box>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "12px",
        }}
      >
        {[1, 2, 3].map((num) => (
          <TextField
            key={num}
            {...register(`answer${num}Sub${questionNumber}`, {
              required: true,
            })}
            placeholder={`Đáp án ${num}`}
            variant="outlined"
            fullWidth
            error={!!errors[`answer${num}Sub${questionNumber}`]}
            helperText={
              errors[`answer${num}Sub${questionNumber}`] ? "Bắt buộc" : ""
            }
            sx={{
              "& .MuiOutlinedInput-root": {
                backgroundColor: "white",
              },
            }}
          />
        ))}
      </Box>
    </Box>

    {/* Correct Answer */}
    <Box>
      <Box
        sx={{
          fontSize: "14px",
          fontWeight: "500",
          marginBottom: "8px",
          color: "#666",
        }}
      >
        Đáp án đúng:
      </Box>
      <TextField
        {...register(`answerPartFour${questionNumber}`, { required: true })}
        placeholder={`Nhập đáp án đúng cho câu ${questionNumber}`}
        variant="outlined"
        fullWidth
        error={!!errors[`answerPartFour${questionNumber}`]}
        helperText={
          errors[`answerPartFour${questionNumber}`]
            ? "Vui lòng nhập đáp án đúng"
            : "Ví dụ: A, B, C hoặc nội dung đáp án"
        }
        sx={{
          "& .MuiOutlinedInput-root": {
            backgroundColor: "#fff3e0",
            "&:hover": {
              backgroundColor: "#ffe0b2",
            },
          },
        }}
      />
    </Box>
  </Box>
);

const ListeningPartFour: React.FC<ListeningPartOneProps> = ({
  children,
  pathTo,
  showDeleteButton = true,
  showSaveButton = true,
  showCancelButton = true,
  alwaysEnable = false,
  dataListeningPartFour = null,
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
  // Audio upload states (copied from Part Two)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [existingAudioUrls, setExistingAudioUrls] = useState<string[]>([]);
  const [removedAudioUrls, setRemovedAudioUrls] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  // Handler to update Redux when audio files are selected
  const handleFilesChange = (files: File[]) => {
    setSelectedFiles(files);
    dispatch(
      UPDATE_LISTENING_MAIN_DATA({
        field: "selectedAudioFiles",
        value: files.map((f) => f.name),
      })
    );
  };

  // Handler to remove existing audio
  const handleRemoveExistingAudio = (url: string) => {
    setRemovedAudioUrls((prev) => [...prev, url]);
    setExistingAudioUrls((prev) => prev.filter((audioUrl) => audioUrl !== url));
  };
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
    // Initialize store with 2 sub questions for Listening Part 4
    if (!listeningStore?.currentListeningData) {
      dispatch(RESET_LISTENING_DATA());
      dispatch(INIT_LISTENING_SUB_QUESTIONS({ count: 2 }));
      return;
    }

    // Ensure we have 2 sub questions
    if (listeningStore.currentListeningData.subQuestions.length !== 2) {
      dispatch(INIT_LISTENING_SUB_QUESTIONS({ count: 2 }));
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
      listeningStore.currentListeningData.subQuestions.length !== 2
    )
      return;

    [1, 2].forEach((num) => {
      const contentKey = `contentPartFour${num}` as keyof FormData;
      const answerKey = `answerPartFour${num}` as keyof FormData;

      const currentSubQuestion =
        listeningStore.currentListeningData.subQuestions[num - 1];

      if (
        watchedFields[contentKey] !== undefined &&
        watchedFields[contentKey] !== currentSubQuestion?.content
      ) {
        dispatch(
          UPDATE_LISTENING_SUB_QUESTION({
            index: num - 1,
            field: "content",
            value: watchedFields[contentKey] || "",
          })
        );
      }

      if (
        watchedFields[answerKey] !== undefined &&
        watchedFields[answerKey] !== currentSubQuestion?.correctAnswer
      ) {
        dispatch(
          UPDATE_LISTENING_SUB_QUESTION({
            index: num - 1,
            field: "correctAnswer",
            value: watchedFields[answerKey] || "",
          })
        );
      }
    });
  }, [
    watchedFields.contentPartFour1,
    watchedFields.contentPartFour2,
    watchedFields.answerPartFour1,
    watchedFields.answerPartFour2,
    dispatch,
    listeningStore?.currentListeningData?.subQuestions,
  ]);

  // Separate useEffect for answer options
  useEffect(() => {
    if (
      !listeningStore?.currentListeningData?.subQuestions ||
      listeningStore.currentListeningData.subQuestions.length !== 2
    )
      return;

    [1, 2].forEach((num) => {
      const currentSubQuestion =
        listeningStore.currentListeningData.subQuestions[num - 1];
      if (!currentSubQuestion?.answerList) return;

      // Check if any answer options have changed
      [1, 2, 3].forEach((ansNum) => {
        const answerOptionKey = `answer${ansNum}Sub${num}` as keyof FormData;
        const currentAnswer =
          currentSubQuestion.answerList[ansNum - 1]?.content;

        if (
          watchedFields[answerOptionKey] !== undefined &&
          watchedFields[answerOptionKey] !== currentAnswer
        ) {
          // Update answer in answerList array
          const currentAnswerList = [...currentSubQuestion.answerList];
          currentAnswerList[ansNum - 1] = {
            content: watchedFields[answerOptionKey] || "",
          };

          dispatch(
            UPDATE_LISTENING_SUB_QUESTION({
              index: num - 1,
              field: "answerList",
              value: currentAnswerList,
            })
          );
        }
      });
    });
  }, [
    watchedFields.answer1Sub1,
    watchedFields.answer2Sub1,
    watchedFields.answer3Sub1,
    watchedFields.answer1Sub2,
    watchedFields.answer2Sub2,
    watchedFields.answer3Sub2,
    dispatch,
    listeningStore?.currentListeningData?.subQuestions,
  ]);

  const onSubmit = async (values: any) => {
    try {
      setIsUploading(true);

      // Delete removed audio files (if any)
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

      // Upload selected audio file (only 1 file for Part Four)
      let uploadedAudioUrl = existingAudioUrls[0] || "";
      if (selectedFiles.length > 0) {
        const uploadResults = await R2UploadService.uploadMultipleFiles(
          selectedFiles,
          "listening"
        );
        if (
          uploadResults.metadata.successful &&
          uploadResults.metadata.successful.length > 0
        ) {
          uploadedAudioUrl = `${import.meta.env.VITE_BASE_URL_FILE}/${
            uploadResults.metadata.successful[0].key
          }`;
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
          answerList: null,
          correctAnswer: "",
          file:
            uploadedAudioUrl ||
            listeningStore?.currentListeningData?.file ||
            values.file,
          subQuestionAnswerList: [],
          suggestion:
            listeningStore?.currentListeningData?.suggestion || suggestion,
          subQuestion: [1, 2].map((num) => ({
            content:
              listeningStore?.currentListeningData?.subQuestions?.[num - 1]
                ?.content ||
              values[`contentPartFour${num}`] ||
              "",
            correctAnswer:
              listeningStore?.currentListeningData?.subQuestions?.[num - 1]
                ?.correctAnswer ||
              values[`answerPartFour${num}`] ||
              "",
            file: null,
            answerList:
              listeningStore?.currentListeningData?.subQuestions?.[num - 1]
                ?.answerList ||
              [1, 2, 3].map((ansNum) => ({
                content: values[`answer${ansNum}Sub${num}`] || "",
              })),
            image: null,
            suggestion: null,
          })),
          isExample: false,
          image: null,
        },
        questionType: "LISTENING",
        questionPart: "FOUR",
        description: null,
      };

      if (statusHandler === "create") {
        await createListeningPartFour(data);
      }
      if (statusHandler === "edit") {
        await updateListeningPartFour(data);
      }

      // Reset upload states after submit
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

  const createListeningPartFour = async (data: any) => {
    try {
      const CreateData = await baseDataProvider.create("Listenings", { data });

      await notify(UPDATED_SUCCESS, {
        type: "success",
      });
      reset();
    } catch (error) {
      console.log({ error });
    }
  };

  //tentisspace
  const updateListeningPartFour = async (values: any) => {
    try {
      await dataProvider.update("Listenings", {
        id: dataListeningPartFour?.id,
        data: values,
        previousData: dataListeningPartFour,
      });

      await notify(UPDATED_SUCCESS, {
        type: "success",
      });
      navigate("/Listenings");
    } catch (error) {
      notify("エラー: 生産管理の更新に失敗しました: " + error, {
        type: "warning",
      });
    }
  };

  useEffect(() => {
    if (dataListeningPartFour) {
      setValue("title", dataListeningPartFour.title);
      setValue("content", dataListeningPartFour.questions[0].content);
      setValue("subTitle", dataListeningPartFour.questions[0].questionTitle);
      setValue("file", dataListeningPartFour.questions[0].file);
      setSuggestion(dataListeningPartFour.questions[0].suggestion);

      // Set existing audio file
      const existingAudio = [];
      if (dataListeningPartFour.questions[0].file) {
        existingAudio.push(dataListeningPartFour.questions[0].file);
      }
      setExistingAudioUrls(existingAudio);

      // Also update Redux store
      dispatch(
        UPDATE_LISTENING_MAIN_DATA({
          field: "title",
          value: dataListeningPartFour.title,
        })
      );
      dispatch(
        UPDATE_LISTENING_MAIN_DATA({
          field: "content",
          value: dataListeningPartFour.questions[0].content,
        })
      );
      dispatch(
        UPDATE_LISTENING_MAIN_DATA({
          field: "subTitle",
          value: dataListeningPartFour.questions[0].questionTitle,
        })
      );
      dispatch(
        UPDATE_LISTENING_MAIN_DATA({
          field: "file",
          value: dataListeningPartFour.questions[0].file,
        })
      );
      dispatch(
        UPDATE_LISTENING_MAIN_DATA({
          field: "suggestion",
          value: dataListeningPartFour.questions[0].suggestion || "",
        })
      );

      [1, 2].map((num) => {
        const contentPartFour =
          dataListeningPartFour.questions[0].subQuestion[num - 1]?.content ||
          "";
        const answerPartFour =
          dataListeningPartFour.questions[0].subQuestion[num - 1]
            ?.correctAnswer || "";

        // Update Redux store
        dispatch(
          UPDATE_LISTENING_SUB_QUESTION({
            index: num - 1,
            field: "content",
            value: contentPartFour,
          })
        );
        dispatch(
          UPDATE_LISTENING_SUB_QUESTION({
            index: num - 1,
            field: "correctAnswer",
            value: answerPartFour,
          })
        );

        // Collect all answers for this question first
        const answerList = [1, 2, 3].map((ansNum) => {
          const answerContent =
            dataListeningPartFour.questions[0].subQuestion[num - 1]
              ?.answerList?.[ansNum - 1]?.content || "";
          const answerKey = `answer${ansNum}Sub${num}` as keyof FormData;

          setValue(answerKey, answerContent);

          return { content: answerContent };
        });

        // Update Redux store with complete answerList for this question
        dispatch(
          UPDATE_LISTENING_SUB_QUESTION({
            index: num - 1,
            field: "answerList",
            value: answerList,
          })
        );
      });
    }
  }, [dataListeningPartFour, setValue, dispatch]);

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      style={{ position: "relative", height: "100vh" }}
    >
      {/* Draggable Debug Panel - JSON Format */}
      <Box
        sx={{
          position: "fixed",
          top: "140px",
          right: "20px",
          width: isDebugPanelOpen ? "400px" : "auto",
          maxHeight: "100vh",
          backgroundColor: "rgba(0, 0, 0, 0.75)",
          color: "white",
          borderRadius: "8px",
          zIndex: 1000,
          border: "1px solid #333",
          transform: `translate(${debugPanelPosition.x}px, ${debugPanelPosition.y}px)`,
          cursor: isDragging ? "grabbing" : "default",
          userSelect: "none",
        }}
      >
        {/* Header luôn hiển thị */}
        <Box
          sx={{
            padding: "8px 12px",
            borderBottom: isDebugPanelOpen ? "1px solid #333" : "none",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            borderRadius: isDebugPanelOpen ? "8px 8px 0 0" : "8px",
            cursor: "grab",
            "&:active": {
              cursor: "grabbing",
            },
          }}
          onMouseDown={handleMouseDown}
        >
          <span style={{ fontSize: "12px", fontWeight: "bold" }}>
            Redux Store Debug 🖱️ (Part 4)
          </span>
          <button
            onClick={() => setIsDebugPanelOpen(!isDebugPanelOpen)}
            style={{
              background: "none",
              border: "1px solid #666",
              color: "white",
              borderRadius: "4px",
              padding: "4px 8px",
              cursor: "pointer",
              fontSize: "12px",
            }}
          >
            <span>{isDebugPanelOpen ? "▼" : "▶"}</span>
          </button>
        </Box>

        {/* Nội dung JSON chỉ hiển thị khi expanded */}
        {isDebugPanelOpen && (
          <Box
            sx={{
              padding: "12px",
              maxHeight: "350px",
              overflow: "auto",
            }}
          >
            <pre
              style={{
                margin: 0,
                fontSize: "10px",
                lineHeight: "1.2",
                wordWrap: "break-word",
                whiteSpace: "pre-wrap",
              }}
            >
              {JSON.stringify(
                listeningStore?.currentListeningData || {},
                null,
                2
              )}
            </pre>
          </Box>
        )}
      </Box>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="form sign-up-form relative  max-h-[calc(100vh-200px)] overflow-auto"
      >
        <h3 className="title">Listening Part 4</h3>
        <div>
          <TextField
            type="title"
            {...register("title", { required: true })}
            placeholder="Title"
            variant="outlined"
            fullWidth
            error={!!errors.title}
            helperText={errors.title ? "This field is required" : ""}
          />
        </div>
        <div>
          <TextField
            type="subTitle"
            {...register("subTitle", { required: true })}
            placeholder="Sub Title"
            variant="outlined"
            fullWidth
            error={!!errors.subTitle}
            helperText={errors.subTitle ? "This field is required" : ""}
          />
        </div>
        <div>
          <TextField
            type="content"
            {...register("content", { required: true })}
            placeholder="Content"
            variant="outlined"
            fullWidth
            error={!!errors.content}
            helperText={errors.content ? "This field is required" : ""}
          />
        </div>

        {/* Audio Upload UI (copied from Part Two) */}
        <div style={{ margin: "16px 0" }}>
          <SimpleR2FilePreview
            fileTypeLabel="Audio File (mp3) *"
            onFilesChange={handleFilesChange}
            initialImageUrls={existingAudioUrls}
            onRemoveExistingImage={handleRemoveExistingAudio}
            acceptedFileTypes={["audio/mp3", "audio/mpeg"]}
            multiple={false}
            maxFiles={1}
            // isUploading is not a prop in SimpleR2FilePreview, so we omit it
          />
        </div>

        <div>
          <TextEditor
            placeholder="Write something or insert a star ★"
            suggestion={suggestion}
            setSuggestion={setSuggestion}
          />
        </div>
        <Box
          sx={{
            width: "100%",
            height: "fit-content",
            background: "#fff !important",
            display: "flex",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          {/* <Box
            sx={{
              width: "100%",
              height: "fit-content",
              background: "#f3f3f3ad !important",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
              boxShadow:
                "0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12)",
              gap: "10px",
              padding: "10px",
              marginTop: "20px",
            }}
          >
            {[...Array(8)].map((_, index) => (
              <TextField
                key={index}
                type={`optionAnswer${index + 1}`}
                {...register(`optionAnswer${index + 1}`, { required: true })}
                placeholder={`Tên người thứ ${index + 1}`}
                variant="outlined"
                fullWidth
                error={!!errors[`optionAnswer${index + 1}`]}
                helperText={
                  errors[`optionAnswer${index + 1}`]
                    ? "This field is required"
                    : ""
                }
              />
            ))}
          </Box> */}
        </Box>

        <Box
          sx={{
            width: "100%",
            height: "fit-content",
            background: "#fff !important",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(600px, 1fr))",
            boxShadow:
              "0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12)",
            gap: "20px",
            padding: "20px",
            marginTop: "20px",
            borderRadius: "8px",
          }}
        >
          {[1, 2].map((num) => (
            <QuestionBox
              key={num}
              questionNumber={num}
              register={register}
              errors={errors}
            />
          ))}
        </Box>

        <Box
          sx={{
            width: "100%",
            minHeight: "100px",
            position: "relative",
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
              position: "absolute",
              bottom: 0,
              left: 0,
            }}
            {...props}
          >
            <Button type="submit" variant="contained" color="info">
              <span>Submit</span>
            </Button>

            {showCancelButton && pathTo ? (
              <NavLink to={pathTo}>
                <Button type="button" variant="contained" color="error">
                  <span>Cancel</span>
                </Button>
              </NavLink>
            ) : (
              <Button
                type="button"
                variant="contained"
                color="error"
                onClick={handleCancel}
              >
                <span>Cancel</span>
              </Button>
            )}
          </Stack>
        </Box>
      </form>
    </div>
  );
};

export default ListeningPartFour;
