import React, { ChangeEvent, useEffect, useState } from "react";
import { useNavigate, NavLink, useParams } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import { Button, useNotify } from "react-admin";
import { Stack, Box, TextField } from "@mui/material";
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
            image: values[`imgUrl`],
            suggestion: storeData.subQuestions[num - 1]?.suggestion || "",
          })),
          isExample: "",
          image: null,
        },
      ],
      questionType: "SPEAKING",
      questionPart: "TWO",
    };

    console.log({ dataForm: data, storeData });

    if (statusHandler === "create") {
      const uploadData = new FormData();
      // for (let i = 0; i < images.length; i++) {
      //   uploadData.append("files", images[i]);
      // }
      uploadData.append("data", JSON.stringify({ ...data }));
      createSpeakingPartOne(uploadData);
    }
    if (statusHandler === "edit") {
      console.log("edit");
      updateReadingPartOne(data);
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
    } catch (error) {
      console.log({ error });
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
    <div>
      <Box
        sx={{
          position: "fixed",
          top: "140px",
          right: "20px",
          width: showDebugPanel ? "400px" : "auto",
          maxHeight: "100vh",
          backgroundColor: "rgba(0, 0, 0, 0.75)",
          color: "white",
          borderRadius: "8px",
          zIndex: 1000,
          border: "1px solid #333",
          transform: `translate(${debugPanelPosition.x}px, ${debugPanelPosition.y}px)`,
          cursor: isDraggingDebug ? "grabbing" : "default",
          userSelect: "none",
        }}
      >
        {/* Header luôn hiển thị */}
        <Box
          sx={{
            padding: "8px 12px",
            borderBottom: showDebugPanel ? "1px solid #333" : "none",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            borderRadius: showDebugPanel ? "8px 8px 0 0" : "8px",
            cursor: "grab",
            "&:active": {
              cursor: "grabbing",
            },
          }}
          onMouseDown={handleDebugMouseDown}
        >
          <span style={{ fontSize: "12px", fontWeight: "bold" }}>
            Redux Store Debug 🖱️
          </span>
          <button
            onClick={() => setShowDebugPanel(!showDebugPanel)}
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
            <span>{showDebugPanel ? "▼" : "▶"}</span>
          </button>
        </Box>

        {/* Nội dung JSON chỉ hiển thị khi expanded */}
        {showDebugPanel && (
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
              {JSON.stringify(speakingStore.currentSpeakingData, null, 2)}
            </pre>
          </Box>
        )}
      </Box>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="form sign-up-form relative"
      >
        <h2 className="title">Speaking Part 2</h2>
        {/* Debug Panel */}

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

        <div>
          <TextField
            // type="file"
            {...register("imgUrl")}
            placeholder="link img nghe de bai"
            variant="outlined"
            fullWidth
            error={!!errors.subTitle}
            helperText={errors.subTitle ? "This field is required" : ""}
          />
        </div>

        {/* ////////////////////// INUPT DRAG AND DROP ////////////////////// */}

        <Box
          sx={{
            ...stylesInpection.dropzone,
          }}
        >
          <Box
            sx={{
              ...stylesInpection.dropzoneContent,
            }}
          >
            <Box fontSize="large">DRAG AND DROP TO UPLOAD YOUR IMAGES</Box>
          </Box>
          <input
            type="file"
            multiple
            value=""
            onChange={handleFileChange}
            onDrop={handleDrop}
            style={{
              opacity: "0",
              width: "100%",
              position: "absolute",
              top: "0",
              left: "0",
              border: "1px solid",
              cursor: "pointer",
              backgroundColor: "red",
              height: !rangeUpload ? "100%" : "370%",
            }}
          />
        </Box>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(8, 1fr)", // Cố định 5 cột
            gap: "10px",
          }}
        >
          {previewUrls.map((url, index) => (
            <div
              key={index}
              style={{
                position: "relative",
                width: "100%",
                height: "150px",
                border: "1px solid",
              }}
            >
              <img
                src={url}
                alt={`Preview ${index}`}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  borderRadius: "4px",
                }}
              />
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                style={{
                  position: "absolute",
                  top: "5px",
                  right: "5px",
                  background: "red",
                  color: "white",
                  border: "none",
                  borderRadius: "50%",
                  width: "20px",
                  height: "20px",
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                X
              </button>
            </div>
          ))}
        </div>

        {/* ////////////////////// INUPT DRAG AND DROP ////////////////////// */}

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
              suggestion={suggestions[num - 1]}
              setSuggestion={(value: any) =>
                handleSuggestionChange(num - 1, value)
              }
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

export default ReadingPartTwo;
