import React, { useEffect, useState } from "react";
import { useNavigate, NavLink, useParams } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import { Button, useNotify } from "react-admin";
import { Stack, Box, TextField } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import dataProvider from "../../../providers/dataProviders/dataProvider";
import baseDataProvider from "../../../providers/dataProviders/baseDataProvider";
import { UPDATED_SUCCESS } from "../../../consts/general";
import { InputFileUpload } from "../../../components/UploadFile/UploadFile";
import TextEditor from "../../../components/TextEditor/TextEditor";
import {
  UPDATE_SPEAKING_MAIN_DATA,
  UPDATE_SUB_QUESTION,
  UPDATE_SUB_QUESTION_SUGGESTION,
  RESET_SPEAKING_DATA,
} from "../../../store/feature/speaking";

interface ReadingPartOneProps {
  children?: JSX.Element | JSX.Element[];
  showDeleteButton?: boolean;
  showSaveButton?: boolean;
  showCancelButton?: boolean;
  alwaysEnable?: boolean;
  pathTo?: string;
  dataSpeakingPartOne?: any;
  statusHandler?: string;
  handleCancel?: () => void;
  suggestion?: string;
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

      <div>
        <TextEditor
          placeholder="Write something or insert a star ★"
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
        />
      </div>
    </Box>
  </Box>
);

const ReadingPartOne: React.FC<ReadingPartOneProps> = ({
  children,
  pathTo,
  showDeleteButton = true,
  showSaveButton = true,
  showCancelButton = true,
  alwaysEnable = false,
  dataSpeakingPartOne = null,
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

  const [idTele, setIdTele] = useState("");
  const [isShow, setIsShow] = useState(false);
  const [imageUpload, setImageUpload] = useState();
  const [suggestions, setSuggestions] = useState<string[]>(Array(3).fill(""));
  const [showDebugPanel, setShowDebugPanel] = useState(false); // State cho debug panel

  // Watch form values để update store
  const watchedValues = watch();

  const handleSuggestionChange = (index: number, value: string) => {
    setSuggestions((prev) => {
      const newSuggestions = [...prev];
      newSuggestions[index] = value;
      return newSuggestions;
    });

    // Update store
    dispatch(
      UPDATE_SUB_QUESTION_SUGGESTION({
        index: index - 1, // Convert to 0-based index
        value: value,
      })
    );
  };

  // Function to update main form data in store
  const updateMainDataInStore = (field: string, value: string) => {
    dispatch(
      UPDATE_SPEAKING_MAIN_DATA({
        field,
        value,
      })
    );
  };

  // Function to update sub question data in store
  const updateSubQuestionInStore = (
    index: number,
    field: string,
    value: string
  ) => {
    dispatch(
      UPDATE_SUB_QUESTION({
        index: index - 1, // Convert to 0-based index
        field,
        value,
      })
    );
  };

  const onSubmit = async (values: FormData) => {
    // Sử dụng dữ liệu từ store để đảm bảo đồng bộ
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
          suggestion: storeData.suggestion || values.suggestion,
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
          image: null,
        },
      ],
      questionType: "SPEAKING",
      questionPart: "ONE",
    };

    console.log("Data from store:", storeData);
    console.log("Final submit data:", data);

    if (statusHandler === "create") {
      createWritingPartOne(data);
    }
    if (statusHandler === "edit") {
      updateWritingPartOne(data);
    }
  };

  const createWritingPartOne = async (data: any) => {
    console.log({ testDate: data });
    try {
      const CreateData = await baseDataProvider.create("speakings", { data });

      await notify(UPDATED_SUCCESS, {
        type: "success",
      });
      reset();
    } catch (error) {
      console.log({ error });
    }
  };

  //tentisspace
  const updateWritingPartOne = async (values: any) => {
    try {
      await dataProvider.update("speakings", {
        id: dataSpeakingPartOne?.id,
        data: values,
        previousData: dataSpeakingPartOne,
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
    console.log({ dataSpeakingPartOne });
    if (dataSpeakingPartOne) {
      setValue("title", dataSpeakingPartOne.title);
      setValue("content", dataSpeakingPartOne.questions[0].content);
      setValue("subTitle", dataSpeakingPartOne.questions[0].questionTitle);

      [1, 2, 3].map((num) => {
        setValue(
          `subContent${num}` as keyof FormData,
          dataSpeakingPartOne.questions[0].subQuestion[num - 1].content
        );

        handleSuggestionChange(
          num,
          dataSpeakingPartOne.questions[0].subQuestion[num - 1].suggestion
        );
        setValue(
          `subFile${num}` as keyof FormData,
          dataSpeakingPartOne.questions[0].subQuestion[num - 1].file
        );
      });
    }
  }, [dataSpeakingPartOne, setValue]);

  // Effect để theo dõi thay đổi form và update store
  useEffect(() => {
    if (watchedValues) {
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
      if (statusHandler === "create") {
        dispatch(RESET_SPEAKING_DATA());
      }
    };
  }, [statusHandler, dispatch]);

  return (
    <div>
      {/* Debug panel - luôn hiển thị nhưng nội dung thay đổi theo state */}
      <Box
        sx={{
          background: "#f0f0f0",
          padding: "10px",
          marginBottom: "20px",
          borderRadius: "4px",
          fontSize: "12px",
          border: "2px solid #ddd",
          position: "relative",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: showDebugPanel ? "10px" : "0px",
          }}
        >
          <h4 style={{ margin: 0 }}>Store Data (Real-time):</h4>
          <button
            onClick={() => setShowDebugPanel(!showDebugPanel)}
            color="primary"
            className="hover:bg-gray-200 p-1"
          >
            <span>{showDebugPanel ? "🔼 Thu gọn" : "🔽 Xem chi tiết"}</span>
          </button>
        </Box>

        {/* Nội dung JSON chỉ hiển thị khi showDebugPanel = true */}
        {showDebugPanel && (
          <Box
            sx={{
              maxHeight: "300px",
              overflow: "auto",
              background: "#fff",
              padding: "8px",
              borderRadius: "4px",
            }}
          >
            <pre>
              {JSON.stringify(speakingStore.currentSpeakingData, null, 2)}
            </pre>
          </Box>
        )}
      </Box>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="form sign-up-form relative overflow-auto"
      >
        <h2 className="title">Speaking Part 1</h2>
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
        <div>
          <TextField
            type="suggestion"
            {...register("suggestion")}
            placeholder="Gợi ý câu trả lời"
            variant="outlined"
            fullWidth
            error={!!errors.subTitle}
            helperText={errors.subTitle ? "This field is required" : ""}
          />
        </div>
        <div>
          <TextField
            // type="file"
            {...register("file")}
            placeholder="link file nghe de bai"
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
          {[1, 2, 3].map((num) => (
            <QuestionBox
              key={num}
              questionNumber={num}
              register={register}
              errors={errors}
              suggestion={suggestions[num]}
              setSuggestion={(value: any) => handleSuggestionChange(num, value)}
              num={num}
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

export default ReadingPartOne;
