import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, NavLink, useParams } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
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

interface WritingPartOneProps {
  children?: JSX.Element | JSX.Element[];
  showDeleteButton?: boolean;
  showSaveButton?: boolean;
  showCancelButton?: boolean;
  alwaysEnable?: boolean;
  pathTo?: string;
  handleCancel?: () => void;
  dataWritingPartThree?: any;
  statusHandler?: string;
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
  optionPerson1: string;
  optionPerson2: string;
  optionPerson3: string;
  optionPerson4: string;
  suggestion: string;
  question: string;
  [key: `question${number}`]: string;
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
      minHeight: "100px",
      height: "fit-content",
      border: "1px solid",
      padding: "10px",
    }}
  >
    <Box sx={{ fontSize: "18px", fontWeight: "bold" }}>
      Nội Dung Câu {questionNumber}
    </Box>
    <Box>
      <div>
        <TextField
          type={`question${questionNumber}`}
          {...register(`question${questionNumber}`, { required: true })}
          placeholder={`Nội dung câu ${questionNumber}`}
          variant="outlined"
          fullWidth
          error={!!errors[`question${questionNumber}`]}
          helperText={
            errors[`question${questionNumber}`] ? "This field is required" : ""
          }
        />
      </div>
    </Box>
  </Box>
);

const WritingPartThree: React.FC<WritingPartOneProps> = ({
  children,
  pathTo,
  showDeleteButton = true,
  showSaveButton = true,
  showCancelButton = true,
  alwaysEnable = false,
  dataWritingPartThree = null,
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
  const [idTele, setIdTele] = useState("");
  const [isShow, setIsShow] = useState(false);
  const [suggestion, setSuggestion] = useState("");
  const [isTypingTimeOut, setIsTypingTimeOut] = useState<any>(null);

  // Sync form data to Redux store in real-time
  useEffect(() => {
    // Initialize store with 3 sub questions for Writing Part 3
    if (!writingStore?.currentWritingData) {
      dispatch(RESET_WRITING_DATA());
      dispatch(INIT_SUB_QUESTIONS({ count: 3 }));
      return;
    }

    // Ensure we have 3 sub questions
    if (writingStore.currentWritingData.subQuestions.length !== 3) {
      dispatch(INIT_SUB_QUESTIONS({ count: 3 }));
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

    // Update suggestion from state (not form field)
    if (suggestion !== writingStore?.currentWritingData?.suggestion) {
      dispatch(
        UPDATE_WRITING_MAIN_DATA({
          field: "suggestion",
          value: suggestion || "",
        })
      );
    }

    // Update sub questions (3 questions for Writing Part 3)
    [1, 2, 3].forEach((num) => {
      const questionKey = `question${num}` as keyof FormData;
      if (watchedFields[questionKey] !== undefined) {
        dispatch(
          UPDATE_WRITING_SUB_QUESTION({
            index: num - 1,
            field: "content",
            value: watchedFields[questionKey] || "",
          })
        );
      }
    });
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

const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

const debouncedUpdate = useCallback((value: string) => {
  if (typingTimeoutRef.current) {
    clearTimeout(typingTimeoutRef.current);
  }
  typingTimeoutRef.current = setTimeout(() => {
    setSuggestion(value || "");
  }, 300);
}, []);

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  const onSubmit = async (values: any) => {
    // Use data from Redux store instead of form values directly
    const data = {
      title: writingStore?.currentWritingData?.title || values.title,
      timeToDo: 50,
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
          // Writing Part 3 có đúng 3 subQuestion
          subQuestion: [1, 2, 3].map((num) => ({
            content:
              writingStore?.currentWritingData?.subQuestions?.[num - 1]
                ?.content ||
              values[`question${num}`] ||
              "",
            correctAnswer: null,
            file: null,
            answerList: null,
            image: null,
            suggestion: null,
          })),
        },
      ],
      questionType: "WRITING",
      questionPart: "THREE",
      image: null,
    };
    if (statusHandler === "create") {
      createWritingPartThree(data);
    }
    if (statusHandler === "edit") {
      console.log("edit");
      updateWritingPartThree(data);
    }
  };

  const createWritingPartThree = async (data: any) => {
    try {
      const CreateData = await baseDataProvider.create("Writings", { data });

      await notify(UPDATED_SUCCESS, {
        type: "success",
      });
      reset();
    } catch (error) {
      console.log({ error });
    }
  };

  //tentisspace
  const updateWritingPartThree = async (values: any) => {
    try {
      await dataProvider.update("writings", {
        id: dataWritingPartThree?.id,
        data: values,
        previousData: dataWritingPartThree,
      });

      await notify(UPDATED_SUCCESS, {
        type: "success",
      });
      navigate("/Writings");
    } catch (error) {
      notify("エラー: 生産管理の更新に失敗しました: " + error, {
        type: "warning",
      });
    }
  };
  useEffect(() => {
    if (dataWritingPartThree) {
      setValue("title", dataWritingPartThree.title);
      setValue("subTitle", dataWritingPartThree.questions[0].questionTitle);
      setValue("content", dataWritingPartThree.questions[0].content);
      setSuggestion(dataWritingPartThree.questions[0].suggestion);

      // Also update Redux store
      dispatch(
        UPDATE_WRITING_MAIN_DATA({
          field: "title",
          value: dataWritingPartThree.title,
        })
      );
      dispatch(
        UPDATE_WRITING_MAIN_DATA({
          field: "subTitle",
          value: dataWritingPartThree.questions[0].questionTitle,
        })
      );
      dispatch(
        UPDATE_WRITING_MAIN_DATA({
          field: "content",
          value: dataWritingPartThree.questions[0].content,
        })
      );
      dispatch(
        UPDATE_WRITING_MAIN_DATA({
          field: "suggestion",
          value: dataWritingPartThree.questions[0].suggestion || "",
        })
      );

      dataWritingPartThree.questions[0].subQuestion.forEach(
        (subQuestion: any, index: number) => {
          setValue(`question${index + 1}`, subQuestion.content);

          // Update Redux store for sub questions
          dispatch(
            UPDATE_WRITING_SUB_QUESTION({
              index: index,
              field: "content",
              value: subQuestion.content,
            })
          );
        }
      );
    }
  }, [dataWritingPartThree, setValue, dispatch]);

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
                  timeToDo: 50,
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
                      subQuestion: [1, 2, 3].map((num) => ({
                        content:
                          writingStore?.currentWritingData?.subQuestions?.[
                            num - 1
                          ]?.content || "",
                        correctAnswer: null,
                        file: null,
                        answerList: null,
                        image: null,
                        suggestion: null,
                      })),
                    },
                  ],
                  questionType: "WRITING",
                  questionPart: "THREE",
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
        <h2 className="title">Writing Part 3</h2>
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
            placeholder="Đề bài"
            variant="outlined"
            fullWidth
            error={!!errors.content}
            helperText={errors.content ? "This field is required" : ""}
          />
        </div>
        <div>
          <TextEditor
            placeholder="Write something or insert a star ★"
            suggestion={suggestion}
            setSuggestion={(value: string) => debouncedUpdate(value)}
          />
        </div>

        <Box
          sx={{
            width: "100%",
            height: "fit-content",
            background: "#fff !important",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(450px, 1fr))",
            boxShadow:
              "0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12)",
            gap: "10px",
            padding: "10px",
            marginTop: "20px",
          }}
        >
          {[1, 2, 3].map((num) => (
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

export default WritingPartThree;
