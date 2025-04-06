import { Create, useRecordContext } from "react-admin";

import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { Button, useNotify } from "react-admin";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import TextEditor from "../../components/TextEditor/TextEditor";
import dataProvider from "../../providers/dataProviders/dataProvider";
import { CourseTypes } from "../../consts/course";
import { UPDATED_SUCCESS } from "../../consts/general";

const LectureCreate = ({ resource, props, showCancelButton = true }) => {
  const resourcePath = `/${resource}`;
  const [suggestion, setSuggestion] = useState("");
  const navigate = useNavigate();
  const record = useRecordContext();
  const notify = useNotify();
  const [subLectures, setSubLectures] = useState([
    {
      subLectureTitle: "",
      summaryLecture: "",
      note: "",
      durationInMinutes: "",
      videoUrl: "",
      isPreviewFree: false,
    },
  ]);
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    reset,
  } = useForm<any>();

  const handleCancel = () => {
    navigate(resourcePath);
  };

  const handleAddSubLecture = () => {
    setSubLectures([
      ...subLectures,
      {
        subLectureTitle: "",
        summaryLecture: "",
        note: "",
        durationInMinutes: "",
        videoUrl: "",
        isPreviewFree: false,
      },
    ]);
  };

  const handleRemoveSubLecture = (index) => {
    const newSubLectures = subLectures.filter((_, i) => i !== index);
    setSubLectures(newSubLectures);
  };

  const handleSubLectureChange = (index, field, value) => {
    const newSubLectures = [...subLectures];
    newSubLectures[index][field] = value;
    setSubLectures(newSubLectures); // Cập nhật state subLectures khi thay đổi
  };

  const onSubmit = async (values: any) => {
    console.log("values", values);
    console.log("subLectures", subLectures);

    const data = {
      lectureTitle: values.lectureTitle,
      lectureDescription: values.lectureDescription,
      lectureType: values.lectureType,
      numberLecture: values.numberLecture,
      subLectures: subLectures,
    };

    console.log("data", data);

    try {
      const CreateData = await dataProvider.create("lectures", { data });

      console.log({ CreateData });

      await notify(UPDATED_SUCCESS, {
        type: "success",
      });
      reset();
    } catch (error) {
      console.log({ error });
    }
  };
  return (
    <Create redirect="list" title="管理ユーザー管理　新規作成">
      <Box sx={{ padding: "20px" }}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="form sign-up-form relative"
        >
          <h2 className="title">Bài học chi tiết </h2>
          <Box>
            <TextField
              type="title"
              {...register("lectureTitle", { required: true })}
              placeholder="tiêu đề phần học"
              variant="outlined"
              fullWidth
              error={!!errors.title}
              helperText={errors.title ? "This field is required" : ""}
            />
          </Box>
          <Box>
            <TextField
              type="lectureDescription"
              {...register("lectureDescription", { required: false })}
              placeholder="mô tả phần học"
              variant="outlined"
              fullWidth
              error={!!errors.content}
              helperText={errors.content ? "This field is required" : ""}
            />
          </Box>
          <Box>
            <TextField
              type="number"
              {...register("numberLecture", { required: false })}
              placeholder="so thu tu bai hoc"
              variant="outlined"
              fullWidth
              error={!!errors.content}
              helperText={errors.content ? "This field is required" : ""}
            />
          </Box>

          <Box>
            <FormControl
              fullWidth
              variant="outlined"
              error={!!errors.lectureCategory}
            >
              <InputLabel id="lectureCategory">Chọn loại bài học</InputLabel>
              <Select
                labelId="lectureCategory"
                label="Chọn loại bài học"
                {...register("lectureType", { required: true })}
                defaultValue=""
              >
                <MenuItem value="">
                  <em>Chọn một loại</em>
                </MenuItem>

                {CourseTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
              {errors.lectureCategory && (
                <Box
                  color="error.main"
                  sx={{ fontSize: "0.875rem", marginTop: "4px" }}
                >
                  This field is required
                </Box>
              )}
            </FormControl>
          </Box>

          <Box sx={{ marginTop: "20px" }}>
            <Button
              variant="contained"
              color="info"
              sx={{ padding: "5px 10px !important" }}
              onClick={handleAddSubLecture}
            >
              <Box sx={{ fontSize: "15px !important" }}>Thêm</Box>
            </Button>
          </Box>

          {subLectures.map((subLecture, index) => (
            <Box
              sx={{
                marginTop: "20px",
                border: "1px solid ",
                padding: "10px",
                borderRadius: "5px",
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                position: "relative",
              }}
              key={index}
            >
              <Box sx={{ marginTop: "30px", display: "flex", gap: "10px" }}>
                {/* Sub-Lecture Title */}
                <TextField
                  type="subLectureTitle"
                  value={subLecture.subLectureTitle}
                  onChange={(e) =>
                    handleSubLectureChange(
                      index,
                      "subLectureTitle",
                      e.target.value
                    )
                  }
                  placeholder="tiêu đề bài học"
                  variant="outlined"
                  fullWidth
                />
                {/* Duration */}
                <TextField
                  type="number"
                  value={subLecture.durationInMinutes}
                  onChange={(e) =>
                    handleSubLectureChange(
                      index,
                      "durationInMinutes",
                      e.target.value
                    )
                  }
                  placeholder="thời gian học"
                  variant="outlined"
                  fullWidth
                />
                {/* Video URL */}
                <TextField
                  type="videoUrl"
                  value={subLecture.videoUrl}
                  onChange={(e) =>
                    handleSubLectureChange(index, "videoUrl", e.target.value)
                  }
                  placeholder="Video URL"
                  variant="outlined"
                  fullWidth
                />
              </Box>

              {/* Editor for Summary */}
              <Box>
                <TextEditor
                  editorId={`editor${index}`}
                  placeholder="Write summary or notes"
                  suggestion={subLecture.summaryLecture}
                  setSuggestion={(value: any) =>
                    handleSubLectureChange(index, "summaryLecture", value)
                  }
                />
              </Box>
              <Box
                sx={{
                  position: "absolute",
                  top: "10px",
                  left: "10px",
                  backgroundColor: "blue",
                  padding: "4px 10px",
                  cursor: "pointer",
                  color: "#fff",
                  borderRadius: "100%",
                  "&:hover": {
                    backgroundColor: "#ff4d4d",
                  },
                }}
                onClick={() => handleRemoveSubLecture(index)}
              >
                {index + 1}
              </Box>
              <Box
                sx={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  backgroundColor: "red",
                  padding: "4px 10px",
                  cursor: "pointer",
                  color: "#fff",
                  borderRadius: "5px",
                  "&:hover": {
                    backgroundColor: "#ff4d4d",
                  },
                }}
                onClick={() => handleRemoveSubLecture(index)}
              >
                X
              </Box>
            </Box>
          ))}

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

              <Button
                type="button"
                variant="contained"
                color="error"
                onClick={handleCancel}
              >
                <span>Cancel</span>
              </Button>
            </Stack>
          </Box>
        </form>
      </Box>
    </Create>
  );
};

export default LectureCreate;
