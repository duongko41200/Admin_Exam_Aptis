import React, { useEffect, useState } from "react";
import { useNavigate, NavLink, useParams } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import { Button, useNotify } from "react-admin";
import { Stack, Box, TextField } from "@mui/material";
import baseDataProvider from "../../../providers/dataProviders/baseDataProvider";
import { UPDATED_SUCCESS } from "../../../consts/general";
import dataProvider from "../../../providers/dataProviders/dataProvider";
import TextEditor from "../../../components/TextEditor/TextEditor";

interface ListeningPartOneProps {
  children?: JSX.Element | JSX.Element[];
  showDeleteButton?: boolean;
  showSaveButton?: boolean;
  showCancelButton?: boolean;
  alwaysEnable?: boolean;
  pathTo?: string;
  handleCancel?: () => void;
  dataListeningPartFour?: any;
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
  optionAnswer1: string;
  optionAnswer2: string;
  optionAnswer3: string;
  optionAnswer4: string;
  optionAnswer5: string;
  optionAnswer6: string;
  optionAnswer7: string;
  optionAnswer8: string;
  suggestion: string;
  file: string;
  [key: `optionAnswer${number}`]: string; // Add this line
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
      minHeight: "160px",
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
          type={`contentPartFour${questionNumber}`}
          {...register(`contentPartFour${questionNumber}`, { required: true })}
          placeholder={`Nội dung câu ${questionNumber}`}
          variant="outlined"
          fullWidth
          error={!!errors[`contentPartFour${questionNumber}`]}
          helperText={
            errors[`contentPartFour${questionNumber}`]
              ? "This field is required"
              : ""
          }
        />
      </div>
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
              sx={{ width: "340px", border: "1px solid black" }}
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
      <div>
        <TextField
          type="text"
          {...register(`answerPartFour${questionNumber}`, { required: true })}
          placeholder={`Đáp án đúng`}
          variant="outlined"
          fullWidth
          inputProps={{ min: 1, max: 5 }} // Added max value here
          error={!!errors[`answerPartFour${questionNumber}`]}
          helperText={
            errors[`answerPartFour${questionNumber}`]
              ? "This field is required"
              : ""
          }
        />
      </div>
    </Box>
  </Box>
);

const ListeningPartFour: React.FC<ListeningPartOneProps> = ({
  children,
  pathTo,
  showDeleteButton = true,
  showSaveButton = true,
  showCancelButton = true,
  alwaysEnable = false,
  dataListeningPartFour = null,
  statusHandler = "create",
  handleCancel,
  ...props
}) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const notify = useNotify();

  const [suggestion, setSuggestion] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    reset,
  } = useForm<FormData>();

  const onSubmit = async (values: any) => {
    const data = {
      title: values.title,
      timeToDo: 35,
      questions: {
        questionTitle: values.subTitle,
        content: values.content,
        answerList: null,
        correctAnswer: "",
        file: values.file,
        subQuestionAnswerList: [],
        suggestion: suggestion,
        subQuestion: [1, 2].map((num) => ({
          content: values[`contentPartFour${num}`],
          correctAnswer: values[`answerPartFour${num}`],
          file: null,
          answerList: [1, 2, 3].map((ansNum) => ({
            content: values[`answer${ansNum}Sub${num}`],
          })),
          image: null,
          suggestion: null,
        })),
        isExample: false,
        image: null,
      },
      questionType: "LISTENING",
      questionPart: "FOUR",
      description: null,
    };
    if (statusHandler === "create") {
      createListeningPartFour(data);
    }
    if (statusHandler === "edit") {
      console.log("edit");
      updateListeningPartFour(data);
    }
  };

  const createListeningPartFour = async (data: any) => {
    try {
      const CreateData = await baseDataProvider.create("Listenings", { data });

      await notify(UPDATED_SUCCESS, {
        type: "success",
      });
      reset();
    } catch (error) {
      console.log({ error });
    }
  };

  //tentisspace
  const updateListeningPartFour = async (values: any) => {
    try {
      await dataProvider.update("Listenings", {
        id: dataListeningPartFour?.id,
        data: values,
        previousData: dataListeningPartFour,
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
    if (dataListeningPartFour) {
      setValue("title", dataListeningPartFour.title);
      setValue("content", dataListeningPartFour.questions[0].content);
      setValue("subTitle", dataListeningPartFour.questions[0].questionTitle);
      setValue("file", dataListeningPartFour.questions[0].file);
      setSuggestion(dataListeningPartFour.questions[0].suggestion);

      [1, 2].map((num) => {
        setValue(
          `contentPartFour${num}` as keyof FormData,
          dataListeningPartFour.questions[0].subQuestion[num - 1].content
        );
        setValue(
          `answerPartFour${num}` as keyof FormData,
          dataListeningPartFour.questions[0].subQuestion[num - 1].correctAnswer
        );
        [1, 2, 3].map((ansNum) => {
          setValue(
            `answer${ansNum}Sub${num}` as keyof FormData,
            dataListeningPartFour.questions[0].subQuestion[num - 1].answerList[
              ansNum - 1
            ].content
          );
        });
      });

      // [1, 2, 3, 4, 5, 6, 7, 8].map((num) => {
      //   setValue(
      //     `optionAnswer${num}` as keyof FormData,
      //     dataListeningPartFour.data.questions.answerList[num - 1].content
      //   );
      // });
    }
  }, [dataListeningPartFour, setValue]);

  return (
    <div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="form sign-up-form relative"
      >
        <h3 className="title">Listening Part 4</h3>
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
          {/* <Box
            sx={{
              width: "100%",
              height: "fit-content",
              background: "#f3f3f3ad !important",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
              boxShadow:
                "0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12)",
              gap: "10px",
              padding: "10px",
              marginTop: "20px",
            }}
          >
            {[...Array(8)].map((_, index) => (
              <TextField
                key={index}
                type={`optionAnswer${index + 1}`}
                {...register(`optionAnswer${index + 1}`, { required: true })}
                placeholder={`Tên người thứ ${index + 1}`}
                variant="outlined"
                fullWidth
                error={!!errors[`optionAnswer${index + 1}`]}
                helperText={
                  errors[`optionAnswer${index + 1}`]
                    ? "This field is required"
                    : ""
                }
              />
            ))}
          </Box> */}
        </Box>

        <Box
          sx={{
            width: "100%",
            height: "fit-content",
            background: "#fff !important",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(550px, 1fr))",
            boxShadow:
              "0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12)",
            gap: "10px",
            padding: "10px",
            marginTop: "20px",
          }}
        >
          {[1, 2].map((num) => (
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

export default ListeningPartFour;
