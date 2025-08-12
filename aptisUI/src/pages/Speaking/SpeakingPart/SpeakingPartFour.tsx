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
import {
  UPDATE_SPEAKING_MAIN_DATA,
  UPDATE_SUB_QUESTION,
  RESET_SPEAKING_DATA,
} from "../../../store/feature/speaking";

interface ReadingPartOneProps {
  children?: JSX.Element | JSX.Element[];
  showDeleteButton?: boolean;
  showSaveButton?: boolean;
  showCancelButton?: boolean;
  alwaysEnable?: boolean;
  pathTo?: string;
  dataReadingPartFour?: any;
  statusHandler?: string;
  handleCancel?: () => void;
  suggestion?: string;
  file?: string;
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

const SpeakingPartFour: React.FC<ReadingPartOneProps> = ({
  children,
  pathTo,
  showDeleteButton = true,
  showSaveButton = true,
  showCancelButton = true,
  alwaysEnable = false,
  dataReadingPartFour = null,
  statusHandler = "create",
  handleCancel,
  ...props
}) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const notify = useNotify();
  const dispatch = useDispatch();
  const speakingStore = useSelector((state: any) => state.speakingStore);
  const [isDragging, setIsDragging] = useState(false);
  const [isDebugPanelOpen, setIsDebugPanelOpen] = useState(false);
  const [debugPanelPosition, setDebugPanelPosition] = useState({
    x: window.innerWidth - 300,
    y: 140,
  });

  // Debug log to check store structure
  console.log("Speaking Store:", speakingStore);

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

  // Sync form data to Redux store in real-time
  useEffect(() => {
    // Initialize store if currentSpeakingData doesn't exist
    if (!speakingStore?.currentSpeakingData) {
      dispatch(RESET_SPEAKING_DATA());
      return;
    }

    if (watchedFields.title !== undefined) {
      dispatch(
        UPDATE_SPEAKING_MAIN_DATA({
          field: "title",
          value: watchedFields.title || "",
        })
      );
    }
    if (watchedFields.content !== undefined) {
      dispatch(
        UPDATE_SPEAKING_MAIN_DATA({
          field: "content",
          value: watchedFields.content || "",
        })
      );
    }
    if (watchedFields.subTitle !== undefined) {
      dispatch(
        UPDATE_SPEAKING_MAIN_DATA({
          field: "subTitle",
          value: watchedFields.subTitle || "",
        })
      );
    }
    if (watchedFields.suggestion !== undefined) {
      dispatch(
        UPDATE_SPEAKING_MAIN_DATA({
          field: "suggestion",
          value: watchedFields.suggestion || "",
        })
      );
    }
    if (watchedFields.file !== undefined) {
      dispatch(
        UPDATE_SPEAKING_MAIN_DATA({
          field: "file",
          value: watchedFields.file || "",
        })
      );
    }

    // Update sub questions
    [1, 2, 3].forEach((num) => {
      const subContentKey = `subContent${num}` as keyof FormData;
      const subFileKey = `subFile${num}` as keyof FormData;

      if (watchedFields[subContentKey] !== undefined) {
        dispatch(
          UPDATE_SUB_QUESTION({
            index: num - 1,
            field: "content",
            value: watchedFields[subContentKey] || "",
          })
        );
      }
      if (watchedFields[subFileKey] !== undefined) {
        dispatch(
          UPDATE_SUB_QUESTION({
            index: num - 1,
            field: "file",
            value: watchedFields[subFileKey] || "",
          })
        );
      }
    });
  }, [watchedFields, dispatch, speakingStore]);

  const onSubmit = async (values: FormData) => {
    // Use data from Redux store instead of form values
    const data = {
      title: speakingStore?.currentSpeakingData?.title || "",
      timeToDo: 50,
      description: speakingStore?.currentSpeakingData?.subTitle || "",
      questions: [
        {
          questionTitle: speakingStore?.currentSpeakingData?.subTitle || "",
          content: speakingStore?.currentSpeakingData?.content || "",
          answerList: [],
          correctAnswer: "",
          file: speakingStore?.currentSpeakingData?.file || "",
          subQuestionAnswerList: [],
          suggestion: speakingStore?.currentSpeakingData?.suggestion || "",
          subQuestion: [1, 2, 3].map((num) => ({
            content:
              speakingStore?.currentSpeakingData?.subQuestions?.[num - 1]
                ?.content || "",
            correctAnswer: null,
            file:
              speakingStore?.currentSpeakingData?.subQuestions?.[num - 1]
                ?.file || "",
            answerList: null,
            image: null,
            suggestion: null,
          })),
          isExample: "",
          image: null,
        },
      ],
      questionType: "SPEAKING",
      questionPart: "FOUR",
    };

    console.log({ data });

    if (statusHandler === "create") {
      createWritingPartOne(data);
    }
    if (statusHandler === "edit") {
      console.log("edit");
      updateSpeakingPartOne(data);
    }
  };

  const createWritingPartOne = async (data: any) => {
    console.log({ testDate: data });
    try {
      const CreateData = await baseDataProvider.create("speakings", { data });
      console.log("CreateData", CreateData);

      await notify(UPDATED_SUCCESS, {
        type: "success",
      });
      reset();
    } catch (error) {
      console.log({ error });
    }
  };

  //tentisspace
  const updateSpeakingPartOne = async (values: any) => {
    try {
      await dataProvider.update("speakings", {
        id: dataReadingPartFour?.id,
        data: values,
        previousData: dataReadingPartFour,
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
    console.log({ dataReadingPartFour });
    if (dataReadingPartFour) {
      setValue("title", dataReadingPartFour.title);
      setValue("content", dataReadingPartFour.questions[0].content);
      setValue("subTitle", dataReadingPartFour.questions[0].questionTitle);
      setValue("file", dataReadingPartFour.questions[0].file);
      setValue("suggestion", dataReadingPartFour.questions[0].suggestion || "");

      // Also update Redux store
      dispatch(
        UPDATE_SPEAKING_MAIN_DATA({
          field: "title",
          value: dataReadingPartFour.title,
        })
      );
      dispatch(
        UPDATE_SPEAKING_MAIN_DATA({
          field: "content",
          value: dataReadingPartFour.questions[0].content,
        })
      );
      dispatch(
        UPDATE_SPEAKING_MAIN_DATA({
          field: "subTitle",
          value: dataReadingPartFour.questions[0].questionTitle,
        })
      );
      dispatch(
        UPDATE_SPEAKING_MAIN_DATA({
          field: "file",
          value: dataReadingPartFour.questions[0].file,
        })
      );
      dispatch(
        UPDATE_SPEAKING_MAIN_DATA({
          field: "suggestion",
          value: dataReadingPartFour.questions[0].suggestion || "",
        })
      );

      [1, 2, 3].map((num) => {
        const subContent =
          dataReadingPartFour.questions[0].subQuestion[num - 1]?.content || "";
        const subFile =
          dataReadingPartFour.questions[0].subQuestion[num - 1]?.file || "";

        setValue(`subContent${num}` as keyof FormData, subContent);
        setValue(`subFile${num}` as keyof FormData, subFile);

        // Update Redux store
        dispatch(
          UPDATE_SUB_QUESTION({
            index: num - 1,
            field: "content",
            value: subContent,
          })
        );
        dispatch(
          UPDATE_SUB_QUESTION({ index: num - 1, field: "file", value: subFile })
        );
      });
    }
  }, [dataReadingPartFour, setValue, dispatch]);

  // Drag handlers for debug panel
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setDebugPanelPosition({
        x: e.clientX - 150,
        y: e.clientY - 25,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      style={{ position: "relative", height: "100vh" }}
    >
      {/* Draggable Debug Panel */}
      <div
        style={{
          position: "fixed",
          top: debugPanelPosition.y,
          left: debugPanelPosition.x,
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          color: "white",
          padding: "10px",
          borderRadius: "5px",
          fontSize: "12px",
          zIndex: 1000,
          maxWidth: "300px",
          cursor: isDragging ? "grabbing" : "grab",
          userSelect: "none",
        }}
        onMouseDown={handleMouseDown}
      >
        <div
          style={{
            marginBottom: "8px",
            fontWeight: "bold",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          🐛 Redux Store Debug (Draggable)
          <button
            onClick={() => setIsDebugPanelOpen(!isDebugPanelOpen)}
            style={{
              background: "none",
              border: "none",
              color: "white",
              fontSize: "14px",
              cursor: "pointer",
              padding: "0 4px",
            }}
          >
            {isDebugPanelOpen ? "−" : "+"}
          </button>
        </div>

        {isDebugPanelOpen && (
          <>
            <div>
              <strong>Title:</strong>{" "}
              {(speakingStore?.currentSpeakingData?.title || "N/A").length > 20
                ? (
                    speakingStore?.currentSpeakingData?.title || "N/A"
                  ).substring(0, 20) + "..."
                : speakingStore?.currentSpeakingData?.title || "N/A"}
            </div>
            <div>
              <strong>Content:</strong>{" "}
              {(speakingStore?.currentSpeakingData?.content || "N/A").length >
              20
                ? (
                    speakingStore?.currentSpeakingData?.content || "N/A"
                  ).substring(0, 20) + "..."
                : speakingStore?.currentSpeakingData?.content || "N/A"}
            </div>
            <div>
              <strong>SubTitle:</strong>{" "}
              {(speakingStore?.currentSpeakingData?.subTitle || "N/A").length >
              20
                ? (
                    speakingStore?.currentSpeakingData?.subTitle || "N/A"
                  ).substring(0, 20) + "..."
                : speakingStore?.currentSpeakingData?.subTitle || "N/A"}
            </div>
            <div>
              <strong>Suggestion:</strong>{" "}
              {(speakingStore?.currentSpeakingData?.suggestion || "N/A")
                .length > 20
                ? (
                    speakingStore?.currentSpeakingData?.suggestion || "N/A"
                  ).substring(0, 20) + "..."
                : speakingStore?.currentSpeakingData?.suggestion || "N/A"}
            </div>
            <div>
              <strong>File:</strong>{" "}
              {(speakingStore?.currentSpeakingData?.file || "N/A").length > 25
                ? (speakingStore?.currentSpeakingData?.file || "N/A").substring(
                    0,
                    25
                  ) + "..."
                : speakingStore?.currentSpeakingData?.file || "N/A"}
            </div>
            <div>
              <strong>Sub Questions:</strong>
            </div>
            {speakingStore?.currentSpeakingData?.subQuestions?.map(
              (subQ, index) => (
                <div
                  key={index}
                  style={{
                    marginLeft: "10px",
                    fontSize: "11px",
                    marginTop: "4px",
                  }}
                >
                  <div>
                    Q{index + 1} Content:{" "}
                    {(subQ?.content || "N/A").length > 15
                      ? (subQ?.content || "N/A").substring(0, 15) + "..."
                      : subQ?.content || "N/A"}
                  </div>
                  <div>
                    Q{index + 1} File:{" "}
                    {(subQ?.file || "N/A").length > 18
                      ? (subQ?.file || "N/A").substring(0, 18) + "..."
                      : subQ?.file || "N/A"}
                  </div>
                </div>
              )
            ) || (
              <div style={{ marginLeft: "10px", fontSize: "11px" }}>
                No sub questions
              </div>
            )}
          </>
        )}
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="form sign-up-form relative"
      >
        <h2 className="title">Speaking Part 4</h2>
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
            {...register("subTitle")}
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

export default SpeakingPartFour;
