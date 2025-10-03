import React, { useEffect, useState, useCallback } from "react";
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

interface WritingPartThree {
  children?: JSX.Element | JSX.Element[];
  showDeleteButton?: boolean;
  showSaveButton?: boolean;
  showCancelButton?: boolean;
  alwaysEnable?: boolean;
  pathTo?: string;
  dataWritingPartOne?: any;
  statusHandler?: string;
  handleCancel?: () => void;
}

interface FormData {
  title: string;
  subTitle: string;
  content: string;
  suggestion: string;
  subContent1: string;
  subContent2: string;
  subContent3: string;
  subContent4: string;
  subContent5: string;
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
      Question {questionNumber}
    </Box>
    <Box>
      <div>
        <TextField
          type={`subContent${questionNumber}`}
          {...register(`subContent${questionNumber}`, { required: true })}
          placeholder={`Question ${questionNumber} content`}
          variant="outlined"
          fullWidth
          error={!!errors[`subContent${questionNumber}`]}
          helperText={
            errors[`subContent${questionNumber}`]
              ? "This field is required"
              : ""
          }
        />
      </div>
    </Box>
  </Box>
);

const WritingPartOne: React.FC<WritingPartThree> = ({
  children,
  pathTo,
  showDeleteButton = true,
  showSaveButton = true,
  showCancelButton = true,
  alwaysEnable = false,
  dataWritingPartOne = null,
  statusHandler = "create",
  handleCancel,
  ...props
}) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const notify = useNotify();
  const dispatch = useDispatch();
  const writingStore = useSelector((state: any) => state.writingStore);
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
      subContent4: "",
      subContent5: "",
      suggestion: "",
    });

    // Reset local states
    setSuggestion("");

    // Reset Redux store
    dispatch(RESET_WRITING_DATA());
    dispatch(INIT_SUB_QUESTIONS({ count: 5 }));

    // Reset TextEditor
    const editorElement = document.querySelector("#writing-part-one-editor");
    if (editorElement) {
      const event = new CustomEvent("resetEditor", {
        detail: { editorId: "writing-part-one-editor" },
      });
      editorElement.dispatchEvent(event);
    }
  }, [reset, dispatch]);

  // Sync form data to Redux store in real-time
  useEffect(() => {
    // Initialize store with 5 sub questions for Writing Part 1
    if (!writingStore?.currentWritingData) {
      dispatch(RESET_WRITING_DATA());
      dispatch(INIT_SUB_QUESTIONS({ count: 5 }));
      return;
    }

    // Ensure we have 5 sub questions
    if (writingStore.currentWritingData.subQuestions.length !== 5) {
      dispatch(INIT_SUB_QUESTIONS({ count: 5 }));
    }

    if (watchedFields.title !== undefined) {
      dispatch(
        UPDATE_WRITING_MAIN_DATA({
          field: "title",
          value: watchedFields.title || "",
        })
      );
    }
    if (watchedFields.content !== undefined) {
      dispatch(
        UPDATE_WRITING_MAIN_DATA({
          field: "content",
          value: watchedFields.content || "",
        })
      );
    }
    if (watchedFields.subTitle !== undefined) {
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

    // Update sub questions (5 questions for Writing Part 1)
    [1, 2, 3, 4, 5].forEach((num) => {
      const subContentKey = `subContent${num}` as keyof FormData;

      if (watchedFields[subContentKey] !== undefined) {
        dispatch(
          UPDATE_WRITING_SUB_QUESTION({
            index: num - 1,
            field: "content",
            value: watchedFields[subContentKey] || "",
          })
        );
      }
    });
  }, [watchedFields, suggestion, dispatch, writingStore]);

  // Debug panel drag handlers (like SpeakingPartThree)
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

  const onSubmit = async (values: FormData) => {
    // Use data from Redux store instead of form values
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
          subQuestion: [1, 2, 3, 4, 5].map((num) => ({
            content:
              writingStore?.currentWritingData?.subQuestions?.[num - 1]
                ?.content ||
              values[`subContent${num}`] ||
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
      questionPart: "ONE",
      image: null,
    };

    if (statusHandler === "create") {
      createWritingPartOne(data);
    }
    if (statusHandler === "edit") {
      console.log("edit");
      updateWritingPartOne(data);
    }
  };

  const createWritingPartOne = async (data: any) => {
    console.log({ testDate: data });
    try {
      const CreateData = await baseDataProvider.create("writings", { data });

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
  const updateWritingPartOne = async (values: any) => {
    console.log({ values });
    try {
      await dataProvider.update("writings", {
        id: dataWritingPartOne?.id,
        data: values,
        previousData: dataWritingPartOne,
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
    console.log({ dataWritingPartOne });
    if (dataWritingPartOne) {
      setValue("title", dataWritingPartOne.title);
      setValue("content", dataWritingPartOne.questions[0].content);
      setValue("subTitle", dataWritingPartOne.questions[0].questionTitle);
      setSuggestion(dataWritingPartOne.questions[0].suggestion);

      // Also update Redux store
      dispatch(
        UPDATE_WRITING_MAIN_DATA({
          field: "title",
          value: dataWritingPartOne.title,
        })
      );
      dispatch(
        UPDATE_WRITING_MAIN_DATA({
          field: "content",
          value: dataWritingPartOne.questions[0].content,
        })
      );
      dispatch(
        UPDATE_WRITING_MAIN_DATA({
          field: "subTitle",
          value: dataWritingPartOne.questions[0].questionTitle,
        })
      );
      dispatch(
        UPDATE_WRITING_MAIN_DATA({
          field: "suggestion",
          value: dataWritingPartOne.questions[0].suggestion || "",
        })
      );

      [1, 2, 3, 4, 5].map((num) => {
        const subContent =
          dataWritingPartOne.questions[0].subQuestion[num - 1]?.content || "";
        setValue(`subContent${num}` as keyof FormData, subContent);

        // Update Redux store
        dispatch(
          UPDATE_WRITING_SUB_QUESTION({
            index: num - 1,
            field: "content",
            value: subContent,
          })
        );
      });
    }
  }, [dataWritingPartOne, setValue, dispatch]);

  useEffect(() => {}, []);

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      style={{ position: "relative", height: "100vh" }}
    >
      {/* Draggable Debug Panel - JSON Format like SpeakingPartThree */}
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
              {JSON.stringify(writingStore?.currentWritingData || {}, null, 2)}
            </pre>
          </Box>
        )}
      </Box>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="form sign-up-form relative"
      >
        <h2 className="title">Writing Part 1</h2>
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
            setSuggestion={setSuggestion}
            editorId="writing-part-one-editor"
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
          {[1, 2, 3, 4, 5].map((num) => (
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

export default WritingPartOne;
