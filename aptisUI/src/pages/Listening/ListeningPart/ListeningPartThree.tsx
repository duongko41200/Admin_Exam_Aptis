import React, { useEffect, useState } from "react";
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
  dataListeningPartThree?: any;
  statusHandler?: string;
}

interface FormData {
  title: string;
  subTitle: string;
  content: string;
  file: string;
  suggestion: string;
  // Person options (3 persons for Part 3)
  optionPerson1: string;
  optionPerson2: string;
  optionPerson3: string;
  // Sub questions (4 questions for Part 3)
  questionPerson1: string;
  questionPerson2: string;
  questionPerson3: string;
  questionPerson4: string;
  personMatch1: string;
  personMatch2: string;
  personMatch3: string;
  personMatch4: string;
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
    <Box>
      <div>
        <TextField
          type={`questionPerson${questionNumber}`}
          {...register(`questionPerson${questionNumber}`, { required: true })}
          placeholder={`Nội dung câu ${questionNumber}`}
          variant="outlined"
          fullWidth
          error={!!errors[`questionPerson${questionNumber}`]}
          helperText={
            errors[`questionPerson${questionNumber}`]
              ? "This field is required"
              : ""
          }
          sx={{
            "& .MuiOutlinedInput-root": {
              backgroundColor: "white",
            },
          }}
        />
      </div>
      <Box>
        <Box
          sx={{
            fontSize: "14px",
            fontWeight: "500",
            marginBottom: "8px",
            color: "#666",
            marginTop: "12px",
          }}
        >
          Đáp án đúng:
        </Box>
        <TextField
          type="text"
          {...register(`personMatch${questionNumber}`, { required: true })}
          placeholder={`Đáp án đúng`}
          variant="outlined"
          fullWidth
          inputProps={{ min: 1, max: 5 }} // Added max value here
          error={!!errors[`personMatch${questionNumber}`]}
          helperText={
            errors[`personMatch${questionNumber}`]
              ? "This field is required"
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
  </Box>
);

const ListeningPartThree: React.FC<ListeningPartOneProps> = ({
  children,
  pathTo,
  showDeleteButton = true,
  showSaveButton = true,
  showCancelButton = true,
  alwaysEnable = false,
  dataListeningPartThree = null,
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
    // Initialize store with 4 sub questions for Listening Part 3
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
      const questionPersonKey = `questionPerson${num}` as keyof FormData;
      const personMatchKey = `personMatch${num}` as keyof FormData;

      const currentSubQuestion =
        listeningStore.currentListeningData.subQuestions[num - 1];

      if (
        watchedFields[questionPersonKey] !== undefined &&
        watchedFields[questionPersonKey] !== currentSubQuestion?.content
      ) {
        dispatch(
          UPDATE_LISTENING_SUB_QUESTION({
            index: num - 1,
            field: "content",
            value: watchedFields[questionPersonKey] || "",
          })
        );
      }

      if (
        watchedFields[personMatchKey] !== undefined &&
        watchedFields[personMatchKey] !== currentSubQuestion?.correctAnswer
      ) {
        dispatch(
          UPDATE_LISTENING_SUB_QUESTION({
            index: num - 1,
            field: "correctAnswer",
            value: watchedFields[personMatchKey] || "",
          })
        );
      }
    });
  }, [
    watchedFields.questionPerson1,
    watchedFields.questionPerson2,
    watchedFields.questionPerson3,
    watchedFields.questionPerson4,
    watchedFields.personMatch1,
    watchedFields.personMatch2,
    watchedFields.personMatch3,
    watchedFields.personMatch4,
    dispatch,
    listeningStore?.currentListeningData?.subQuestions,
  ]);

  // Separate useEffect for person options
  useEffect(() => {
    if (!listeningStore?.currentListeningData) return;

    const currentAnswerList =
      listeningStore.currentListeningData.answerList || [];
    const newPersonOptions = [1, 2, 3].map((num) => {
      const personKey = `optionPerson${num}` as keyof FormData;
      return {
        content: watchedFields[personKey] || "",
      };
    });

    // Only update if the content has actually changed
    const hasChanged = newPersonOptions.some((option, index) => {
      const currentOption = currentAnswerList[index];
      return !currentOption || currentOption.content !== option.content;
    });

    if (hasChanged) {
      dispatch(
        UPDATE_LISTENING_MAIN_DATA({
          field: "answerList",
          value: newPersonOptions,
        })
      );
    }
  }, [
    watchedFields.optionPerson1,
    watchedFields.optionPerson2,
    watchedFields.optionPerson3,
    dispatch,
    listeningStore?.currentListeningData?.answerList,
  ]);

  const onSubmit = async (values: any) => {
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
          [1, 2, 3].map((num) => ({
            content: values[`optionPerson${num}`] || "",
          })),
        correctAnswer: "",
        file: listeningStore?.currentListeningData?.file || values.file,
        subQuestionAnswerList: [],
        suggestion:
          listeningStore?.currentListeningData?.suggestion || suggestion,
        subQuestion: [1, 2, 3, 4].map((num) => ({
          content:
            listeningStore?.currentListeningData?.subQuestions?.[num - 1]
              ?.content ||
            values[`questionPerson${num}`] ||
            "",
          correctAnswer:
            listeningStore?.currentListeningData?.subQuestions?.[num - 1]
              ?.correctAnswer ||
            values[`personMatch${num}`] ||
            "",
          file: null,
          answerList: null,
          image: null,
          suggestion: null,
        })),
        isExample: false,
        image: null,
      },

      questionType: "LISTENING", // Note: Was "READING" in original, changed to "LISTENING"
      questionPart: "THREE",
      description: null,
    };

    if (statusHandler === "create") {
      createListeningPartThree(data);
    }
    if (statusHandler === "edit") {
      console.log("edit");
      updateListeningPartThree(data);
    }
  };

  const createListeningPartThree = async (data: any) => {
    try {
      const CreateData = await baseDataProvider.create("Listenings", { data });

      await notify(UPDATED_SUCCESS, {
        type: "success",
      });
      // reset();
    } catch (error) {
      console.log({ error });
    }
  };

  //tentisspace
  const updateListeningPartThree = async (values: any) => {
    try {
      await dataProvider.update("Listenings", {
        id: dataListeningPartThree?.id,
        data: values,
        previousData: dataListeningPartThree,
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
    if (dataListeningPartThree) {
      setValue("title", dataListeningPartThree.title);
      setValue("content", dataListeningPartThree.questions[0].content);
      setValue("subTitle", dataListeningPartThree.questions[0].questionTitle);
      setValue("file", dataListeningPartThree.questions[0].file);
      setSuggestion(dataListeningPartThree.questions[0].suggestion);

      // Also update Redux store
      dispatch(
        UPDATE_LISTENING_MAIN_DATA({
          field: "title",
          value: dataListeningPartThree.title,
        })
      );
      dispatch(
        UPDATE_LISTENING_MAIN_DATA({
          field: "content",
          value: dataListeningPartThree.questions[0].content,
        })
      );
      dispatch(
        UPDATE_LISTENING_MAIN_DATA({
          field: "subTitle",
          value: dataListeningPartThree.questions[0].questionTitle,
        })
      );
      dispatch(
        UPDATE_LISTENING_MAIN_DATA({
          field: "file",
          value: dataListeningPartThree.questions[0].file,
        })
      );
      dispatch(
        UPDATE_LISTENING_MAIN_DATA({
          field: "suggestion",
          value: dataListeningPartThree.questions[0].suggestion || "",
        })
      );

      [1, 2, 3, 4].map((num) => {
        const questionContent =
          dataListeningPartThree.questions[0].subQuestion[num - 1]?.content ||
          "";
        const correctAnswer =
          dataListeningPartThree.questions[0].subQuestion[num - 1]
            ?.correctAnswer || "";

        setValue(`questionPerson${num}` as keyof FormData, questionContent);
        setValue(`personMatch${num}` as keyof FormData, correctAnswer);

        // Update Redux store
        dispatch(
          UPDATE_LISTENING_SUB_QUESTION({
            index: num - 1,
            field: "content",
            value: questionContent,
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

      // Update person options
      [1, 2, 3].map((num) => {
        const personContent =
          dataListeningPartThree.questions[0].answerList[num - 1]?.content ||
          "";
        setValue(`optionPerson${num}` as keyof FormData, personContent);
      });

      // Update Redux store with answerList
      const answerList = [1, 2, 3].map((num) => ({
        content:
          dataListeningPartThree.questions[0].answerList[num - 1]?.content ||
          "",
      }));
      dispatch(
        UPDATE_LISTENING_MAIN_DATA({
          field: "answerList",
          value: answerList,
        })
      );
    }
  }, [dataListeningPartThree, setValue, dispatch]);

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
            Redux Store Debug 🖱️ (Part 3)
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
        <h2 className="title">Listening Part 3</h2>
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
        <div>
          <TextField
            type="mp3"
            {...register("file", { required: true })}
            placeholder="file am thanh"
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
          <TextField
            type="optionPerson1"
            {...register("optionPerson1", { required: true })}
            placeholder="Tên người thứ nhất"
            variant="outlined"
            defaultValue="Woman"
            fullWidth
            error={!!errors.optionPerson1}
            helperText={errors.optionPerson1 ? "This field is required" : ""}
          />

          <TextField
            type="optionPerson2"
            {...register("optionPerson2", { required: true })}
            placeholder="Tên người thứ hai"
            variant="outlined"
            defaultValue="Man"
            fullWidth
            error={!!errors.optionPerson2}
            helperText={errors.optionPerson2 ? "This field is required" : ""}
          />

          <TextField
            type="optionPerson3"
            {...register("optionPerson3", { required: true })}
            placeholder="Tên người thứ ba"
            variant="outlined"
            defaultValue="Both"
            fullWidth
            error={!!errors.optionPerson3}
            helperText={errors.optionPerson3 ? "This field is required" : ""}
          />
        </Box>

        <Box
          sx={{
            width: "100%",
            height: "fit-content",
            background: "#fff !important",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
            boxShadow:
              "0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12)",
            gap: "10px",
            padding: "10px",
            marginTop: "20px",
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

export default ListeningPartThree;
