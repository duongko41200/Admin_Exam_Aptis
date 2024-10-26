import React, { useEffect, useState } from "react";
import { useNavigate, NavLink, useParams } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import { Button } from "react-admin";
import { Stack, Box, TextField } from "@mui/material";
import dataProvider from "../../../providers/dataProviders/dataProvider";

interface ReadingPartOneProps {
  children?: JSX.Element | JSX.Element[];
  showDeleteButton?: boolean;
  showSaveButton?: boolean;
  showCancelButton?: boolean;
  alwaysEnable?: boolean;
  pathTo?: string;
  handleCancel?: () => void;
}

interface FormData {
  title: string;
  content: string;
  password: string;
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
      minHeight: "200px",
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
          type={`correctAnswer${questionNumber}`}
          {...register(`correctAnswer${questionNumber}`, { required: true })}
          placeholder="Correct Answer"
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
              placeholder={`Answer ${num}`}
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
);

const ReadingPartOne: React.FC<ReadingPartOneProps> = ({
  children,
  pathTo,
  showDeleteButton = true,
  showSaveButton = true,
  showCancelButton = true,
  alwaysEnable = false,
  handleCancel,
  ...props
}) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<FormData>();
  const [idTele, setIdTele] = useState("");
  const [isShow, setIsShow] = useState(false);

  const onSignUp: SubmitHandler<FormData> = async (data) => {
    console.log(data);

    try {
      const createUser = await dataProvider.create("access/signup", { data });
      alert("Sign up success");
      console.log("new user:", createUser);
    } catch (error) {
      console.log({ error });
      setIsShow(false);
    }
	};
	

	const onSubmit = async (values: any) => { 
		
		console.log({values});
	}

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const id = searchParams.get("id");
    if (id) {
      setIdTele(id);
    }
  }, []);

  return (
    <div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="form sign-up-form relative"
      >
        <h2 className="title">Reading Part 1</h2>
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
            type="password"
            {...register("password", { required: true })}
            placeholder="Password"
            variant="outlined"
            fullWidth
            error={!!errors.password}
            helperText={errors.password ? "This field is required" : ""}
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
          {[1, 2, 3, 4, 5, 6].map((num) => (
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

export default ReadingPartOne;
