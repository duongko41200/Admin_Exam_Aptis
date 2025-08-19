import React, { useEffect, useState, useRef } from "react";
import { useNavigate, NavLink, useParams } from "react-router-dom";
import { useForm, SubmitHandler, set } from "react-hook-form";
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
  dataListeningPartOne?: any;
  statusHandler?: string;
  handleCancel?: () => void;
}

interface FormData {
  title: string;
  subTitle: string;
  content: string;
  // Sub content fields for 13 questions
  subContent1: string;
  subContent2: string;
  subContent3: string;
  subContent4: string;
  subContent5: string;
  subContent6: string;
  subContent7: string;
  subContent8: string;
  subContent9: string;
  subContent10: string;
  subContent11: string;
  subContent12: string;
  subContent13: string;
  // Correct answers for 13 questions
  correctAnswer1: string;
  correctAnswer2: string;
  correctAnswer3: string;
  correctAnswer4: string;
  correctAnswer5: string;
  correctAnswer6: string;
  correctAnswer7: string;
  correctAnswer8: string;
  correctAnswer9: string;
  correctAnswer10: string;
  correctAnswer11: string;
  correctAnswer12: string;
  correctAnswer13: string;
  // File fields for 13 questions
  subFile1: string;
  subFile2: string;
  subFile3: string;
  subFile4: string;
  subFile5: string;
  subFile6: string;
  subFile7: string;
  subFile8: string;
  subFile9: string;
  subFile10: string;
  subFile11: string;
  subFile12: string;
  subFile13: string;
  // Answer fields for each question (3 answers per question, 13 questions)
  answer1Sub1: string;
  answer2Sub1: string;
  answer3Sub1: string;
  answer1Sub2: string;
  answer2Sub2: string;
  answer3Sub2: string;
  answer1Sub3: string;
  answer2Sub3: string;
  answer3Sub3: string;
  answer1Sub4: string;
  answer2Sub4: string;
  answer3Sub4: string;
  answer1Sub5: string;
  answer2Sub5: string;
  answer3Sub5: string;
  answer1Sub6: string;
  answer2Sub6: string;
  answer3Sub6: string;
  answer1Sub7: string;
  answer2Sub7: string;
  answer3Sub7: string;
  answer1Sub8: string;
  answer2Sub8: string;
  answer3Sub8: string;
  answer1Sub9: string;
  answer2Sub9: string;
  answer3Sub9: string;
  answer1Sub10: string;
  answer2Sub10: string;
  answer3Sub10: string;
  answer1Sub11: string;
  answer2Sub11: string;
  answer3Sub11: string;
  answer1Sub12: string;
  answer2Sub12: string;
  answer3Sub12: string;
  answer1Sub13: string;
  answer2Sub13: string;
  answer3Sub13: string;
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
          type={`correctAnswer${questionNumber}`}
          {...register(`correctAnswer${questionNumber}`, { required: true })}
          placeholder="Đán án đúng"
          variant="outlined"
          fullWidth
          error={!!errors[`correctAnswer${questionNumber}`]}
          helperText={
            errors[`correctAnswer${questionNumber}`]
              ? "This field is required"
              : ""
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
      {/* <div>
        <TextField
          type="suggestion"
          {...register(`suggestion${questionNumber}`)}
          placeholder="Gợi ý câu trả lời"
          variant="outlined"
          fullWidth
          error={!!errors.subTitle}
          helperText={errors.subTitle ? "This field is required" : ""}
        />
      </div> */}
      <div>
        <TextEditor
          placeholder="gợi ý câu trả lời"
          suggestion={suggestion}
          setSuggestion={setSuggestion}
          editorId={`editor${num}`}
        />
      </div>

      <div>
        <TextField
          // type="file âm thanh câu hỏi "
          {...register(`subFile${questionNumber}`)}
          placeholder="file âm thanh câu hỏi"
          variant="outlined"
          fullWidth
          error={!!errors.subTitle}
          helperText={errors.subTitle ? "This field is required" : ""}
          sx={{
            "& .MuiOutlinedInput-root": {
              backgroundColor: "white",
            },
          }}
        />
      </div>
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
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 1,
          }}
        >
          {[1, 2, 3].map((num) => (
            <div key={num}>
              <TextField
                type={`answer${num}Sub${questionNumber}`}
                {...register(`answer${num}Sub${questionNumber}`, {
                  required: true,
                })}
                placeholder={`Đáp án ${num}`}
                variant="outlined"
                fullWidth
                error={!!errors[`answer${num}Sub${questionNumber}`]}
                helperText={
                  errors[`answer${num}Sub${questionNumber}`]
                    ? "This field is required"
                    : ""
                }
              />
            </div>
          ))}
        </Box>
      </Box>
    </Box>
  </Box>
);

const ListeningPartOne: React.FC<ListeningPartOneProps> = ({
  children,
  pathTo,
  showDeleteButton = true,
  showSaveButton = true,
  showCancelButton = true,
  alwaysEnable = false,
  dataListeningPartOne = null,
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

  const [suggestions, setSuggestions] = useState<string[]>(Array(14).fill(""));

  const handleSuggestionChange = (index: number, value: string) => {
    setSuggestions((prev) => {
      const newSuggestions = [...prev];
      newSuggestions[index] = value;
      return newSuggestions;
    });

    // Update Redux store for suggestion
    if (index > 0 && index <= 13) {
      dispatch(
        UPDATE_LISTENING_SUB_QUESTION_SUGGESTION({
          index: index - 1,
          value: value,
        })
      );
    }
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

  const [idTele, setIdTele] = useState("");
  const [isShow, setIsShow] = useState(false);

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

  // Sync form data to Redux store in real-time, but avoid infinite update loop
  // Only dispatch when values actually change
  const prevFieldsRef = React.useRef<any>({});
  const prevSubQuestionsRef = React.useRef<any[]>([]);

  useEffect(() => {
    // Only initialize store if not ready
    if (!listeningStore?.currentListeningData) {
      dispatch(RESET_LISTENING_DATA());
      dispatch(INIT_LISTENING_SUB_QUESTIONS({ count: 13 }));
      return;
    }
    if (listeningStore.currentListeningData.subQuestions.length !== 13) {
      dispatch(INIT_LISTENING_SUB_QUESTIONS({ count: 13 }));
      return;
    }

    // Only update main fields if changed
    [
      { key: "title", action: UPDATE_LISTENING_MAIN_DATA },
      { key: "content", action: UPDATE_LISTENING_MAIN_DATA },
      { key: "subTitle", action: UPDATE_LISTENING_MAIN_DATA },
    ].forEach(({ key, action }) => {
      if (
        watchedFields[key] !== undefined &&
        prevFieldsRef.current[key] !== watchedFields[key]
      ) {
        dispatch(
          action({
            field: key,
            value: watchedFields[key] || "",
          })
        );
      }
    });

    // Update sub questions only if changed
    for (let i = 0; i < 13; i++) {
      const num = i + 1;
      const subContentKey = `subContent${num}` as keyof FormData;
      const correctAnswerKey = `correctAnswer${num}` as keyof FormData;
      const subFileKey = `subFile${num}` as keyof FormData;
      const subQ = listeningStore.currentListeningData.subQuestions[i] || {};
      const prevSubQ = prevSubQuestionsRef.current[i] || {};

      [
        { key: subContentKey, field: "content" },
        { key: correctAnswerKey, field: "correctAnswer" },
        { key: subFileKey, field: "file" },
      ].forEach(({ key, field }) => {
        if (
          watchedFields[key] !== undefined &&
          prevSubQ[field] !== watchedFields[key]
        ) {
          dispatch(
            UPDATE_LISTENING_SUB_QUESTION({
              index: i,
              field,
              value: watchedFields[key] || "",
            })
          );
        }
      });

      // Update answer options only if changed
      if (subQ?.answerList) {
        const currentAnswerList = [...subQ.answerList];
        let changed = false;
        [1, 2, 3].forEach((ansNum) => {
          const answerKey = `answer${ansNum}Sub${num}` as keyof FormData;
          if (
            watchedFields[answerKey] !== undefined &&
            currentAnswerList[ansNum - 1]?.content !== watchedFields[answerKey]
          ) {
            currentAnswerList[ansNum - 1] = {
              content: watchedFields[answerKey] || "",
            };
            changed = true;
          }
        });
        if (changed) {
          dispatch(
            UPDATE_LISTENING_SUB_QUESTION({
              index: i,
              field: "answerList",
              value: currentAnswerList,
            })
          );
        }
      }
    }

    // Save current fields and subQuestions for next comparison
    prevFieldsRef.current = { ...watchedFields };
    prevSubQuestionsRef.current =
      listeningStore.currentListeningData.subQuestions.map((q: any) => ({
        content: q.content,
        correctAnswer: q.correctAnswer,
        file: q.file,
        answerList: q.answerList
          ? q.answerList.map((a: any) => ({ ...a }))
          : [],
      }));
  }, [watchedFields, dispatch, listeningStore]);

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
        answerList: [],
        correctAnswer: "",
        file: null,
        subQuestionAnswerList: [],
        suggestion: null,
        subQuestion: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map((num) => ({
          content:
            listeningStore?.currentListeningData?.subQuestions?.[num - 1]
              ?.content ||
            values[`subContent${num}`] ||
            "",
          correctAnswer:
            listeningStore?.currentListeningData?.subQuestions?.[num - 1]
              ?.correctAnswer ||
            values[`correctAnswer${num}`] ||
            "",
          file:
            listeningStore?.currentListeningData?.subQuestions?.[num - 1]
              ?.file ||
            values[`subFile${num}`] ||
            "",
          answerList:
            listeningStore?.currentListeningData?.subQuestions?.[num - 1]
              ?.answerList ||
            [1, 2, 3].map((ansNum) => ({
              content: values[`answer${ansNum}Sub${num}`] || "",
            })),
          image: null,
          suggestion: suggestions[num] || "",
        })),
        isExample: false,
        image: null,
      },
      questionType: "LISTENING",
      questionPart: "ONE",
      description: null,
    };

    if (statusHandler === "create") {
      createListeningPartOne(data);
    }
    if (statusHandler === "edit") {
      console.log("edit");
      updateListeningPartOne(data);
    }
  };

  const createListeningPartOne = async (data: any) => {
    try {
      const CreateData = await baseDataProvider.create("listenings", { data });

      await notify(UPDATED_SUCCESS, {
        type: "success",
      });
      reset();
    } catch (error) {
      console.log({ error });
    }
  };

  //tentisspace
  const updateListeningPartOne = async (values: any) => {
    try {
      await dataProvider.update("listenings", {
        id: dataListeningPartOne?.id,
        data: values,
        previousData: dataListeningPartOne,
      });

      await notify(UPDATED_SUCCESS, {
        type: "success",
      });
      navigate("/listenings");
    } catch (error) {
      notify("エラー: 生産管理の更新に失敗しました: " + error, {
        type: "warning",
      });
    }
  };

  useEffect(() => {
    console.log({ dataListeningPartOne });
    if (dataListeningPartOne) {
      console.log("Loading edit data...");
      console.log("Data structure:", {
        questions: dataListeningPartOne.questions,
        subQuestions: dataListeningPartOne.questions[0]?.subQuestion,
        firstSubQuestion: dataListeningPartOne.questions[0]?.subQuestion[0],
        firstAnswerList:
          dataListeningPartOne.questions[0]?.subQuestion[0]?.answerList,
      });

      setValue("title", dataListeningPartOne.title);
      setValue("content", dataListeningPartOne.questions[0].content);
      setValue("subTitle", dataListeningPartOne.questions[0].questionTitle);

      // Also update Redux store
      dispatch(
        UPDATE_LISTENING_MAIN_DATA({
          field: "title",
          value: dataListeningPartOne.title,
        })
      );
      dispatch(
        UPDATE_LISTENING_MAIN_DATA({
          field: "content",
          value: dataListeningPartOne.questions[0].content,
        })
      );
      dispatch(
        UPDATE_LISTENING_MAIN_DATA({
          field: "subTitle",
          value: dataListeningPartOne.questions[0].questionTitle,
        })
      );

      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map((num) => {
        const subContent =
          dataListeningPartOne.questions[0].subQuestion[num - 1]?.content || "";
        const correctAnswer =
          dataListeningPartOne.questions[0].subQuestion[num - 1]
            ?.correctAnswer || "";
        const file =
          dataListeningPartOne.questions[0].subQuestion[num - 1]?.file || "";
        const suggestion =
          dataListeningPartOne.questions[0].subQuestion[num - 1]?.suggestion ||
          "";

        setValue(`subContent${num}` as keyof FormData, subContent);
        setValue(`correctAnswer${num}` as keyof FormData, correctAnswer);
        setValue(`subFile${num}` as keyof FormData, file);

        // Update Redux store
        dispatch(
          UPDATE_LISTENING_SUB_QUESTION({
            index: num - 1,
            field: "content",
            value: subContent,
          })
        );
        dispatch(
          UPDATE_LISTENING_SUB_QUESTION({
            index: num - 1,
            field: "correctAnswer",
            value: correctAnswer,
          })
        );
        dispatch(
          UPDATE_LISTENING_SUB_QUESTION({
            index: num - 1,
            field: "file",
            value: file,
          })
        );

        handleSuggestionChange(num, suggestion);

        // Collect all answers for this question first
        const answerList = [1, 2, 3].map((ansNum) => {
          const answerContent =
            dataListeningPartOne.questions[0].subQuestion[num - 1]
              ?.answerList?.[ansNum - 1]?.content || "";
          const answerKey = `answer${ansNum}Sub${num}` as keyof FormData;

          console.log(`Setting ${answerKey} = "${answerContent}"`);
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
  }, [dataListeningPartOne, setValue, dispatch]);

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
        className="form sign-up-form relative max-h-[calc(100vh-200px)] overflow-auto"
      >
        <h2 className="title">Listening Part 1</h2>
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
            type="subTitle"
            {...register("subTitle", { required: true })}
            placeholder="Sub Title"
            variant="outlined"
            fullWidth
            error={!!errors.subTitle}
            helperText={errors.subTitle ? "This field is required" : ""}
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
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map((num) => (
            <>
              <QuestionBox
                key={num}
                questionNumber={num}
                register={register}
                errors={errors}
                suggestion={suggestions[num]}
                setSuggestion={(value: any) =>
                  handleSuggestionChange(num, value)
                }
                num={num}
              />
            </>
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

export default ListeningPartOne;
