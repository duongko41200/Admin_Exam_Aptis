import React, { useEffect, useState } from "react";
import { useNavigate, NavLink, useParams } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import { Button, useNotify } from "react-admin";
import { Stack, Box, TextField } from "@mui/material";
import dataProvider from "../../../providers/dataProviders/dataProvider";
import baseDataProvider from "../../../providers/dataProviders/baseDataProvider";
import { UPDATED_SUCCESS } from "../../../consts/general";
import { InputFileUpload } from "../../../components/UploadFile/UploadFile";

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
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    reset,
  } = useForm<FormData>();

  const onSubmit = async (values: FormData) => {
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
      // updateWritingPartOne(data);
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
  // const updateWritingPartOne = async (values: any) => {
  //   try {
  //     await dataProvider.update("Writings", {
  //       id: dataWritingPartOne?.id,
  //       data: values,
  //       previousData: dataWritingPartOne,
  //     });

  //     await notify(UPDATED_SUCCESS, {
  //       type: "success",
  //     });
  //     navigate("/Writings");
  //   } catch (error) {
  //     notify("エラー: 生産管理の更新に失敗しました: " + error, {
  //       type: "warning",
  //     });
  //   }
  // };

   useEffect(() => {
     console.log({ dataReadingPartFour });
     if (dataReadingPartFour) {
       setValue("title", dataReadingPartFour.title);
       setValue("content", dataReadingPartFour.questions[0].content);
       setValue("subTitle", dataReadingPartFour.questions[0].questionTitle);
 
       [1, 2, 3].map((num) => {
         setValue(
           `subContent${num}` as keyof FormData,
           dataReadingPartFour.questions[0].subQuestion[num - 1].content
         );
 
 
       });
     }
   }, [dataReadingPartFour, setValue]);

  return (
    <div>
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
            type="suggestion"
            {...register("suggestion")}
            placeholder="Gợi ý câu trả lời"
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
