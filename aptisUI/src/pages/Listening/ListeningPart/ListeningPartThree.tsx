import React, { useEffect, useState } from "react";
import { useNavigate, NavLink, useParams } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import { Button, useNotify } from "react-admin";
import { Stack, Box, TextField } from "@mui/material";
import dataProvider from "../../../providers/dataProviders/dataProvider";
import baseDataProvider from "../../../providers/dataProviders/baseDataProvider";
import { UPDATED_SUCCESS } from "../../../consts/general";
import TextEditor from "../../../components/TextEditor/TextEditor";

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
  optionPerson1: string;
  optionPerson2: string;
  optionPerson3: string;
  optionPerson4: string;
  suggestion: string;
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
        />
      </div>
      <div>
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
              : ""
          }
        />
      </div>
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
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    reset,
  } = useForm<FormData>();
  const [idTele, setIdTele] = useState("");
  const [isShow, setIsShow] = useState(false);
  const [suggestion, setSuggestion] = useState("");

  const onSubmit = async (values: any) => {
    const data = {
      title: values.title,
      timeToDo: 35,
      questions: {
        questionTitle: values.subTitle,
        content: values.content,
        answerList: [1, 2, 3].map((num) => ({
          content: values[`optionPerson${num}`],
        })),
        correctAnswer: "",
        file: null,
        subQuestionAnswerList: [],
        suggestion:suggestion,
        subQuestion: [1, 2, 3, 4].map((num) => ({
          content: values[`questionPerson${num}`],
          correctAnswer: values[`personMatch${num}`],
          file: null,
          answerList: null,
          image: null,
          suggestion: null,
        })),
        isExample: false,
        image: null,
      },

      questionType: "READING",
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
      setSuggestion(dataListeningPartThree.questions[0].suggestion);

      // [1, 2, 3, 4, 5, 6, 7].map((num) => {
      //   setValue(
      //     `questionPerson${num}` as keyof FormData,
      //     dataListeningPartThree.data.questions.subQuestion[num - 1].content
      //   );
      //   setValue(
      //     `personMatch${num}` as keyof FormData,
      //     dataListeningPartThree.data.questions.subQuestion[num - 1].correctAnswer
      //   );
      // });

      [1, 2, 3, 4].map((num) => {
        setValue(
          `questionPerson${num}` as keyof FormData,
          dataListeningPartThree.questions[0].subQuestion[num - 1].content
        );
        setValue(
          `personMatch${num}` as keyof FormData,
          dataListeningPartThree.questions[0].subQuestion[num - 1].correctAnswer
        );
      });
    }
  }, [dataListeningPartThree, setValue]);

  return (
    <div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="form sign-up-form relative"
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
            defaultValue='Both'
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
