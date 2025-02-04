import React, { useEffect, useState } from "react";
import { useNavigate, NavLink, useParams } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import { Button, useNotify } from "react-admin";
import { Stack, Box, TextField } from "@mui/material";
import dataProvider from "../../../providers/dataProviders/dataProvider";
import baseDataProvider from "../../../providers/dataProviders/baseDataProvider";
import { UPDATED_SUCCESS } from "../../../consts/general";

interface ListeningPartOneProps {
  children?: JSX.Element | JSX.Element[];
  showDeleteButton?: boolean;
  showSaveButton?: boolean;
  showCancelButton?: boolean;
  alwaysEnable?: boolean;
  pathTo?: string;
  handleCancel?: () => void;
  dataListeningPartTwo?: any;
  statusHandler?:string
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
          type="text"
          {...register(`numberOrder${questionNumber}`, { required: true })}
          placeholder={`Số thứ tự nguoi noi`}
          variant="outlined"
          fullWidth
          inputProps={{ min: 1, max: 5 }} // Added max value here
          error={!!errors[`numberOrder${questionNumber}`]}
          helperText={
            errors[`numberOrder${questionNumber}`]
              ? "This field is required"
              : ""
          }
        />
      </div>
      <div>
        <TextField
          type={`contentAnswer${questionNumber}`}
          {...register(`correctAnswer${questionNumber}`, { required: true })}
          placeholder={`Nội dung câu ${questionNumber}`}
          variant="outlined"
          fullWidth
          error={!!errors[`correctAnswer${questionNumber}`]}
          helperText={
            errors[`correctAnswer${questionNumber}`]
              ? "This field is required"
              : ""
          }
        />
      </div>
    </Box>
  </Box>
);

const ListeningPartTwo: React.FC<ListeningPartOneProps> = ({
  children,
  pathTo,
  showDeleteButton = true,
  showSaveButton = true,
  showCancelButton = true,
  alwaysEnable = false,
  dataListeningPartTwo = null,
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
  const [isShow, setIsShow] = useState(false);

  const onSubmit = async (values: any) => {
    const data = {
      title: values.title,
      timeToDo: 35,
      questions: {
        questionTitle: values.subTitle,
        content: values.content,
        answerList: [1, 2, 3, 4,5,6].map((num, idx) => ({
          id: idx + 1,
          content: values[`optionAnswer${num}`],
        })),
        correctAnswer: null,
        file: null,
        subQuestionAnswerList: [],
        suggestion:values.suggestion,
        subQuestion: [1, 2, 3, 4].map((num) => ({
          content: values[`numberOrder${num}`],
          correctAnswer: values[`correctAnswer${num}`],
          file: null,
          answerList: null,
          image: null,
          suggestion: null,
        })),
        isExample: false,
        image: null,
      },

      questionType: "LISTENING",
      questionPart:'TWO' ,
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
  const updateListeningPartOne = async (values: any) => {
    try {
      await dataProvider.update("Listenings", {
        id: dataListeningPartTwo?.id,
        data: values,
        previousData: dataListeningPartTwo,
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
    if (dataListeningPartTwo) {
      setValue("title", dataListeningPartTwo.title);
      setValue("content", dataListeningPartTwo.questions[0].content);
      setValue("subTitle", dataListeningPartTwo.questions[0].questionTitle);

      [1, 2, 3, 4].map((num) => {
        setValue(
          `correctAnswer${num}` as keyof FormData,
          dataListeningPartTwo.questions[0].subQuestion[num - 1].correctAnswer
        );
        setValue(
          `numberOrder${num}` as keyof FormData,
          dataListeningPartTwo.questions[0].subQuestion[num - 1].content
        );
      });

      [1, 2, 3, 4,5,6].map((num, idx) => {
        setValue(
          `optionAnswer${num}` as keyof FormData,
          dataListeningPartTwo.questions[0].answerList[num - 1].content
   )
      })
    }
  }, [dataListeningPartTwo, setValue]);

  return (
    <div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="form sign-up-form relative"
      >
        <h2 className="title">Listening Part 2</h2>
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
            type="suggestion"
            {...register("suggestion", { required: true })}
            placeholder="suggestion"
            variant="outlined"
            fullWidth
            error={!!errors.content}
            helperText={errors.content ? "This field is required" : ""}
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
                  <Box
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
                    {[...Array(6)].map((_, index) => (
                      <TextField
                        key={index}
                        type={`optionAnswer${index + 1}`}
                        {...register(`optionAnswer${index + 1}`, { required: true })}
                        placeholder={`dap an so ${index + 1}`}
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
                  </Box>
                </Box>

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

export default ListeningPartTwo;
