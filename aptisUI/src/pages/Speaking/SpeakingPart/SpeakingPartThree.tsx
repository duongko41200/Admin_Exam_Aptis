import React, { ChangeEvent, useEffect, useState } from "react";
import { useNavigate, NavLink, useParams } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import { Button, useNotify } from "react-admin";
import { Stack, Box, TextField } from "@mui/material";
import dataProvider from "../../../providers/dataProviders/dataProvider";
import baseDataProvider from "../../../providers/dataProviders/baseDataProvider";
import { UPDATED_SUCCESS } from "../../../consts/general";
import { InputFileUpload } from "../../../components/UploadFile/UploadFile";
import { stylesInpection } from "../../../styles/product-inspection";

interface ReadingPartOneProps {
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

const SpeakingPartThree: React.FC<ReadingPartOneProps> = ({
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
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    reset,
  } = useForm<FormData>();

  const [imageUpload, setImageUpload] = useState();

  const [images, setImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [rangeUpload, setRangeUpload] = useState(false);

  ////////////////////////////////////////////////////////////////////////////

  const onSubmit = async (values: any) => {
    const data = {
      title: values.title,
      timeToDo: 50,
      description: values.subTitle,
      questions: [
        {
          questionTitle: values.subTitle,
          content: values.content,
          answerList: [],
          correctAnswer: "",
          file: null,
          subQuestionAnswerList: [],
          suggestion: "",
          subQuestion: [1, 2, 3].map((num) => ({
            content: values[`subContent${num}`],
            correctAnswer: null,
            file: null,
            answerList: null,
            image: null,
            suggestion: null,
          })),
          isExample: "",
          image: [],
        },
      ],
      questionType: "SPEAKING",
      questionPart: "THREE",
    };

    console.log({ data });

    console.log({ images });

    const uploadData = new FormData();

    for (let i = 0; i < images.length; i++) {
      uploadData.append("files", images[i]);
    }
    uploadData.append("data", JSON.stringify({ ...data }));

    if (statusHandler === "create") {
      createSpeakingPartOne(uploadData);
    }
    if (statusHandler === "edit") {
      console.log("edit");
      updateReadingPartOne(uploadData);
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
      // reset();
      // setImages([]);
    } catch (error) {
      console.log({ error });
    }
  };

  //tentisspace
  const updateReadingPartOne = async (values: any) => {
    try {
      await dataProvider.update("readings", {
        id: dataReadingPartThree?.id,
        data: values,
        previousData: dataReadingPartThree,
      });

      await notify(UPDATED_SUCCESS, {
        type: "success",
      });
      navigate("/readings");
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
     console.log({ dataReadingPartThree });
     if (dataReadingPartThree) {
       setValue("title", dataReadingPartThree.title);
       setValue("content", dataReadingPartThree.questions[0].content);
       setValue("subTitle", dataReadingPartThree.questions[0].questionTitle);
 
       [1, 2, 3].map((num) => {
         setValue(
           `subContent${num}` as keyof FormData,
           dataReadingPartThree.questions[0].subQuestion[num - 1].content
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
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="form sign-up-form relative"
      >
        <h2 className="title">Speaking Part 3</h2>
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

        {/* ////////////////////// INUPT DRAG AND DROP ////////////////////// */}

        <Box
          sx={{
            ...stylesInpection.dropzone,
          }}
        >
          <Box
            sx={{
              ...stylesInpection.dropzoneContent,
              gap: "10px",
            }}
          >
            <Box fontSize="large">DRAG AND DROP TO UPLOAD YOUR IMAGES</Box>
            <Box fontSize="small"> (Upload ít nhất 2 cái ảnh)</Box>
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

export default SpeakingPartThree;
