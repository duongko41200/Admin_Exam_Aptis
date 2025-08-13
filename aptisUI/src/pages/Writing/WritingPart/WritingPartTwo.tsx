import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, NavLink, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Button, useNotify } from "react-admin";
import { Stack, Box, TextField } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import dataProvider from "../../../providers/dataProviders/dataProvider";
import baseDataProvider from "../../../providers/dataProviders/baseDataProvider";
import { UPDATED_SUCCESS } from "../../../consts/general";
import TextEditor from "../../../components/TextEditor/TextEditor";
import {
  UPDATE_WRITING_MAIN_DATA,
  UPDATE_WRITING_SUB_QUESTION,
  RESET_WRITING_DATA,
  INIT_SUB_QUESTIONS,
} from "../../../store/feature/writing";

interface WritingPartTwoProps {
  children?: JSX.Element | JSX.Element[];
  showDeleteButton?: boolean;
  showSaveButton?: boolean;
  showCancelButton?: boolean;
  alwaysEnable?: boolean;
  pathTo?: string;
  handleCancel?: () => void;
  dataWritingPartTwo?: any;
  statusHandler?: string;
}

interface FormData {
  title: string;
  subTitle: string;
  content: string;
  suggestion: string;
  question: string;
  [key: string]: any;
}

const WritingPartTwo: React.FC<WritingPartTwoProps> = ({
  children,
  pathTo,
  showDeleteButton = true,
  showSaveButton = true,
  showCancelButton = true,
  alwaysEnable = false,
  dataWritingPartTwo = null,
  statusHandler = "create",
  handleCancel,
  ...props
}) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const notify = useNotify();
  const dispatch = useDispatch();
  const writingStore = useSelector((state: any) => state.writingStore);

  // State for debug panel
  const [isDragging, setIsDragging] = useState(false);
  const [isDebugPanelOpen, setIsDebugPanelOpen] = useState(false);
  const [debugPanelPosition, setDebugPanelPosition] = useState({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

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
  const [suggestion, setSuggestion] = useState("");
  const [isTypingTimeOut, setIsTypingTimeOut] = useState<any>(null);

  // Sync form data to Redux store in real-time
  useEffect(() => {
    // Initialize store with 1 sub question for Writing Part 2
    if (!writingStore?.currentWritingData) {
      dispatch(RESET_WRITING_DATA());
      dispatch(INIT_SUB_QUESTIONS({ count: 1 }));
      return;
    }

    // Ensure we have 1 sub question
    if (writingStore.currentWritingData.subQuestions.length !== 1) {
      dispatch(INIT_SUB_QUESTIONS({ count: 1 }));
    }

    // Update Redux when form fields change
    if (
      watchedFields.title !== undefined &&
      watchedFields.title !== writingStore.currentWritingData.title
    ) {
      dispatch(
        UPDATE_WRITING_MAIN_DATA({
          field: "title",
          value: watchedFields.title || "",
        })
      );
    }
    if (
      watchedFields.content !== undefined &&
      watchedFields.content !== writingStore.currentWritingData.content
    ) {
      dispatch(
        UPDATE_WRITING_MAIN_DATA({
          field: "content",
          value: watchedFields.content || "",
        })
      );
    }
    if (
      watchedFields.subTitle !== undefined &&
      watchedFields.subTitle !== writingStore.currentWritingData.subTitle
    ) {
      dispatch(
        UPDATE_WRITING_MAIN_DATA({
          field: "subTitle",
          value: watchedFields.subTitle || "",
        })
      );
    }
    if (
      watchedFields.question !== undefined &&
      watchedFields.question !== writingStore.currentWritingData.question
    ) {
      dispatch(
        UPDATE_WRITING_MAIN_DATA({
          field: "question",
          value: watchedFields.question || "",
        })
      );
      // Also update to subQuestions[0]
      dispatch(
        UPDATE_WRITING_SUB_QUESTION({
          index: 0,
          field: "content",
          value: watchedFields.question || "",
        })
      );
    }

    // Update suggestion from state (not form field)
    if (suggestion !== writingStore?.currentWritingData?.suggestion) {
      dispatch(
        UPDATE_WRITING_MAIN_DATA({
          field: "suggestion",
          value: suggestion || "",
        })
      );
    }
  }, [watchedFields, suggestion, dispatch, writingStore?.currentWritingData]);

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

  const debouncedUpdate = useCallback(
    (value: string) => {
      if (isTypingTimeOut) {
        clearTimeout(isTypingTimeOut);
      }
      setIsTypingTimeOut(
        setTimeout(() => {
          setSuggestion(value);
        }, 10)
      );
    },
    [isTypingTimeOut]
  );

  const onSubmit = async (values: FormData) => {
    // Use data from Redux store instead of form values directly
    const data = {
      title: writingStore?.currentWritingData?.title || values.title,
      timeToDo: 20,
      questions: [
        {
          questionTitle:
            writingStore?.currentWritingData?.subTitle || values.subTitle,
          content: writingStore?.currentWritingData?.content || values.content,
          answerList: [],
          correctAnswer: "",
          file: null,
          subQuestionAnswerList: [],
          suggestion:
            writingStore?.currentWritingData?.suggestion || suggestion,
          // Writing Part 2 chỉ có 1 subQuestion
          subQuestion: [
            {
              content:
                writingStore?.currentWritingData?.question || values.question,
              correctAnswer: null,
              file: null,
              answerList: null,
              image: null,
              suggestion: null,
            },
          ],
        },
      ],
      questionType: "WRITING",
      questionPart: "TWO",
      image: null,
    };

    console.log("data", data);

    if (statusHandler === "create") {
      createWritingPart(data);
    } else if (statusHandler === "edit") {
      updateWritingPart(data);
    }
  };

  const createWritingPart = async (data: any) => {
    try {
      await baseDataProvider.create("Writings", { data });
      notify(UPDATED_SUCCESS, { type: "success" });
      reset();
    } catch (error) {
      console.error(error);
    }
  };

  const updateWritingPart = async (data: any) => {
    try {
      await dataProvider.update("writings", {
        id: dataWritingPartTwo?.id,
        data,
        previousData: dataWritingPartTwo,
      });
      notify(UPDATED_SUCCESS, { type: "success" });
      navigate("/Writings");
    } catch (error) {
      notify(`Error: Failed to update writing part: ${error}`, {
        type: "warning",
      });
    }
  };

  useEffect(() => {
    console.log({ dataWritingPartTwo });
    if (dataWritingPartTwo) {
      setValue("title", dataWritingPartTwo.title);
      setValue("content", dataWritingPartTwo.questions[0].content);
      setValue("subTitle", dataWritingPartTwo.questions[0].questionTitle);
      setSuggestion(dataWritingPartTwo.questions[0].suggestion);
      setValue(
        "question",
        dataWritingPartTwo.questions[0].subQuestion[0].content
      );

      // Also update Redux store
      dispatch(
        UPDATE_WRITING_MAIN_DATA({
          field: "title",
          value: dataWritingPartTwo.title,
        })
      );
      dispatch(
        UPDATE_WRITING_MAIN_DATA({
          field: "content",
          value: dataWritingPartTwo.questions[0].content,
        })
      );
      dispatch(
        UPDATE_WRITING_MAIN_DATA({
          field: "subTitle",
          value: dataWritingPartTwo.questions[0].questionTitle,
        })
      );
      dispatch(
        UPDATE_WRITING_MAIN_DATA({
          field: "suggestion",
          value: dataWritingPartTwo.questions[0].suggestion || "",
        })
      );
      dispatch(
        UPDATE_WRITING_MAIN_DATA({
          field: "question",
          value: dataWritingPartTwo.questions[0].subQuestion[0].content || "",
        })
      );
    }
  }, [dataWritingPartTwo, setValue, dispatch]);

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
            Redux Store Debug 🖱️
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
                {
                  title: writingStore?.currentWritingData?.title || "",
                  timeToDo: 20,
                  questions: [
                    {
                      questionTitle:
                        writingStore?.currentWritingData?.subTitle || "",
                      content: writingStore?.currentWritingData?.content || "",
                      answerList: [],
                      correctAnswer: "",
                      file: null,
                      subQuestionAnswerList: [],
                      suggestion:
                        writingStore?.currentWritingData?.suggestion || "",
                      subQuestion: [
                        {
                          content:
                            writingStore?.currentWritingData?.question || "",
                          correctAnswer: null,
                          file: null,
                          answerList: null,
                          image: null,
                          suggestion: null,
                        },
                      ],
                    },
                  ],
                  questionType: "WRITING",
                  questionPart: "TWO",
                  image: null,
                },
                null,
                2
              )}
            </pre>
          </Box>
        )}
      </Box>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="form sign-up-form relative"
      >
        <h2 className="title">Writing Part 2</h2>
        <TextField
          type="title"
          {...register("title", { required: true })}
          placeholder="Title"
          variant="outlined"
          fullWidth
          error={!!errors.title}
          helperText={errors.title ? "This field is required" : ""}
        />
        <TextField
          type="subTitle"
          {...register("subTitle", { required: true })}
          placeholder="Sub Title"
          variant="outlined"
          fullWidth
          error={!!errors.subTitle}
          helperText={errors.subTitle ? "This field is required" : ""}
        />
        <TextField
          type="content"
          {...register("content", { required: true })}
          placeholder="Đề bài"
          variant="outlined"
          fullWidth
          error={!!errors.content}
          helperText={errors.content ? "This field is required" : ""}
        />


        <div>
          <TextEditor
            placeholder="Write something or insert a star ★"
            suggestion={suggestion}
            setSuggestion={(value: string) => debouncedUpdate(value)}
          />
        </div>
        <TextField
          type="question"
          {...register("question", { required: true })}
          placeholder="Câu hỏi"
          variant="outlined"
          fullWidth
          error={!!errors.question}
          helperText={errors.question ? "This field is required" : ""}
        />
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

export default WritingPartTwo;
