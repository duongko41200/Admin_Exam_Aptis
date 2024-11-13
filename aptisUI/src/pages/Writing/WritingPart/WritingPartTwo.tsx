import React, { useEffect, useState } from "react";
import { useNavigate, NavLink, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Button, useNotify } from "react-admin";
import { Stack, Box, TextField } from "@mui/material";
import dataProvider from "../../../providers/dataProviders/dataProvider";
import baseDataProvider from "../../../providers/dataProviders/baseDataProvider";
import { UPDATED_SUCCESS } from "../../../consts/general";

interface WritingPartTwoProps {
  children?: JSX.Element | JSX.Element[];
  showDeleteButton?: boolean;
  showSaveButton?: boolean;
  showCancelButton?: boolean;
  alwaysEnable?: boolean;
  pathTo?: string;
  handleCancel?: () => void;
  dataWritingPartTwo?: any;
  statusHandler?: string;
}

interface FormData {
  title: string;
  subTitle: string;
  content: string;
  suggestion: string;
  question: string;
  [key: string]: any;
}

const WritingPartTwo: React.FC<WritingPartTwoProps> = ({
  children,
  pathTo,
  showDeleteButton = true,
  showSaveButton = true,
  showCancelButton = true,
  alwaysEnable = false,
  dataWritingPartTwo = null,
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
    setValue,
    reset,
  } = useForm<FormData>();
  const [isShow, setIsShow] = useState(false);

  const onSubmit = async (values: FormData) => {
    const data = {
      title: values.title,
      timeToDo: 50,
      questions: [
        {
          questionTitle: values.subTitle,
          content: values.content,
          answerList: [],
          correctAnswer: "",
          file: null,
          subQuestionAnswerList: [],
          suggestion: values.suggestion,
          subQuestion: [
            {
              content: values.question,
              correctAnswer: null,
              file: null,
              answerList: null,
              image: null,
              suggestion: null,
            },
          ],
        },
      ],
      questionType: "WRITING",
      questionPart: "TWO",
      image: null,
    };

    console.log("data", data);

    if (statusHandler === "create") {
      createWritingPart(data);
    } else if (statusHandler === "edit") {
      updateWritingPart(data);
    }
  };

  const createWritingPart = async (data: any) => {
    try {
      await baseDataProvider.create("Writings", { data });
      notify(UPDATED_SUCCESS, { type: "success" });
      reset();
    } catch (error) {
      console.error(error);
    }
  };

  const updateWritingPart = async (data: any) => {
    try {
      await dataProvider.update("Writings", {
        id: dataWritingPartTwo?.id,
        data,
        previousData: dataWritingPartTwo,
      });
      notify(UPDATED_SUCCESS, { type: "success" });
      navigate("/Writings");
    } catch (error) {
      notify(`Error: Failed to update writing part: ${error}`, {
        type: "warning",
      });
    }
  };

  useEffect(() => {
    if (dataWritingPartTwo) {
      setValue("title", dataWritingPartTwo.data.title);
      setValue("content", dataWritingPartTwo.data.questions.content);
      setValue("subTitle", dataWritingPartTwo.data.questions.questionTitle);

      [1, 2, 3, 4, 5].forEach((num) => {
        setValue(
          `correctAnswer${num}`,
          dataWritingPartTwo.data.questions.answerList[num - 1].content
        );
        setValue(
          `numberOrder${num}`,
          dataWritingPartTwo.data.questions.answerList[num - 1].numberOrder
        );
      });
    }
  }, [dataWritingPartTwo, setValue]);

  return (
    <div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="form sign-up-form relative"
      >
        <h2 className="title">Writing Part 2</h2>
        <TextField
          type="title"
          {...register("title", { required: true })}
          placeholder="Title"
          variant="outlined"
          fullWidth
          error={!!errors.title}
          helperText={errors.title ? "This field is required" : ""}
        />
        <TextField
          type="subTitle"
          {...register("subTitle", { required: true })}
          placeholder="Sub Title"
          variant="outlined"
          fullWidth
          error={!!errors.subTitle}
          helperText={errors.subTitle ? "This field is required" : ""}
        />
        <TextField
          type="content"
          {...register("content", { required: true })}
          placeholder="Content"
          variant="outlined"
          fullWidth
          error={!!errors.content}
          helperText={errors.content ? "This field is required" : ""}
        />
        <TextField
          type="suggestion"
          {...register("suggestion", { required: true })}
          placeholder="Gợi ý câu trả lời"
          variant="outlined"
          fullWidth
          error={!!errors.suggestion}
          helperText={errors.suggestion ? "This field is required" : ""}
        />
        <TextField
          type="question"
          {...register("question", { required: true })}
          placeholder="Câu hỏi"
          variant="outlined"
          fullWidth
          error={!!errors.question}
          helperText={errors.question ? "This field is required" : ""}
        />
        <Box sx={{ width: "100%", minHeight: "100px", position: "relative" }}>
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

export default WritingPartTwo;
