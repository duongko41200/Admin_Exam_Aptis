import { Box } from "@mui/material";
import { EditBase, Title, useNotify, useRecordContext } from "react-admin";
import { useNavigate } from "react-router-dom";
import { boxStyles } from "../../styles";

import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Button } from "react-admin";
import { useForm } from "react-hook-form";
import ModalFrame from "../../components/ModalBase/ModalFrame";
import { CourseTypes } from "../../consts/course";
import { UPDATED_SUCCESS } from "../../consts/general";
import { BaseComponentProps } from "../../types/general";

const CourseEditForm = ({ resource, dataProvider }: BaseComponentProps) => {
  const resourcePath = `/${resource}`;
  const [suggestion, setSuggestion] = useState("");
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [courseType, setCourseType] = useState("");
  const [selectedLectures, setSelectedLectures] = useState<string[]>([]);
  const [lectures, setLectures] = useState([]);
  const record = useRecordContext();
  const notify = useNotify();
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

  const closeModal = () => {
    setOpen(false);
  };
  const handleOpen = async () => {
    setOpen(true);

    const { data } = await dataProvider.getAllWithFiltersCourseType(
      "lectures",
      { courseType: courseType }
    );

    const newData = data.map((item: any) => ({
      id: item._id,
      lectureTitle: item.lectureTitle,
      lectureDescription: item.lectureDescription,
      lectureType: item.lectureType,
      numberLecture: item.numberLecture,
    }));

    console.log("data sdfdsf", newData);
    setLectures(newData);
  };
  const handleCheckboxChange = (lectureId: string) => {
    setSelectedLectures(
      (prevState) =>
        prevState.includes(lectureId)
          ? prevState.filter((id) => id !== lectureId) // Nếu id đã có, xóa
          : [...prevState, lectureId] // Nếu id chưa có, thêm vào
    );
  };

  const onSubmit = async (values: any) => {
    const data = {
      ...values,
      lectures: selectedLectures,
      isPublished: false,
    };

    console.log("data", data);
    try {
      const CreateData = await dataProvider.update("courses", {
        id: record?.id,
        data: data,
        previousData: record,
      });

      console.log({ CreateData });

      await notify(UPDATED_SUCCESS, {
        type: "success",
      });
      record.courseTitle = values.courseTitle;
      record.subTitle = values.subTitle;
      record.courseThumbnail = values.courseThumbnail;
      record.description = values.description;
      record.enrolledStudentsRole = values.enrolledStudentsRole;
      record.courseType = values.courseType;
      record.lectures = selectedLectures;
      record.isPublished = false;
      reset();
      navigate(resourcePath);
    } catch (error) {
      console.log({ error });
    }
  };

  useEffect(() => {
    if (record) {
      setValue("courseTitle", record.courseTitle);
      setValue("subTitle", record.subTitle);
      setValue("courseThumbnail", record.courseThumbnail);
      setValue("description", record.description);
      setValue("enrolledStudentsRole", record.enrolledStudentsRole);
      setValue("courseType", record.courseType);
      setSelectedLectures(record.lectures);
      setCourseType(record.courseType);
      setLectures(record.lectures);
    }
  }, []);
  return (
    <Box sx={boxStyles}>
      <EditBase>
        <Title title="ユーザ登録　編集" />
        <Box sx={{ padding: "20px" }}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="form sign-up-form relative"
          >
            <h2 className="title">Khoa Hoc</h2>
            <Box>
              <TextField
                type="title"
                {...register("courseTitle", { required: true })}
                placeholder="Tieu de khoa hoc"
                variant="outlined"
                fullWidth
                error={!!errors.title}
                helperText={errors.title ? "This field is required" : ""}
              />
            </Box>
            <Box>
              <TextField
                type="subTitle"
                {...register("subTitle", { required: false })}
                placeholder="Tieu de phu"
                variant="outlined"
                fullWidth
                error={!!errors.content}
                helperText={errors.content ? "This field is required" : ""}
              />
            </Box>
            <Box>
              <TextField
                type="courseThumbnail"
                {...register("courseThumbnail", { required: false })}
                placeholder="courseThumbnail"
                variant="outlined"
                fullWidth
                error={!!errors.content}
                helperText={errors.content ? "This field is required" : ""}
              />
            </Box>
            <Box>
              <TextField
                type="description"
                {...register("description", { required: true })}
                placeholder="description"
                variant="outlined"
                fullWidth
                error={!!errors.subTitle}
                helperText={errors.subTitle ? "This field is required" : ""}
              />
            </Box>
            <Box>
              <TextField
                type="number"
                {...register("enrolledStudentsRole", { required: true })}
                placeholder="mã số khóa học theo thể loại "
                variant="outlined"
                fullWidth
                error={!!errors.subTitle}
                helperText={errors.subTitle ? "This field is required" : ""}
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
                  {...register("courseType", { required: true })}
                  defaultValue={record?.courseType}
                  onChange={(e) => {
                    setCourseType(e.target.value);
                  }}
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
                onClick={handleOpen}
              >
                <Box sx={{ fontSize: "15px !important" }}>Thêm cac bai hoc</Box>
              </Button>
            </Box>

            <Box>
              {selectedLectures.length > 0 &&
                selectedLectures.map((item) => (
                  <Box
                    key={item}
                    sx={{
                      display: "flex",
                      margin: "10px",
                      justifyContent: "space-between",
                      gap: "10px",
                      padding: "10px",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                      backgroundColor: "#f9f9f9",
                      cursor: "pointer",
                      "&:hover": {
                        backgroundColor: "#e0f7fa",
                      },
                    }}
                  >
                    <Box>{item}</Box>
                  </Box>
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

          <ModalFrame
            open={open}
            closeModalEdit={closeModal}
            label="Chon bai hoc phu hop"
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                marginBottom: "10px",
                gap: "10px",
                overflow: "auto",
              }}
            >
              {lectures &&
                lectures.length > 0 &&
                lectures.map((item: any) => (
                  <>
                    <Box
                      sx={{
                        display: "flex",
                        marginBottom: "10px",
                        justifyContent: "space-between",
                        gap: "10px",
                        padding: "10px",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        backgroundColor: "#f9f9f9",
                        cursor: "pointer",
                        "&:hover": {
                          backgroundColor: "#e0f7fa",
                        },
                        minWidth: "600px",
                        width: "fit-content",
                      }}
                    >
                      <input
                        type="checkbox"
                        style={{ transform: "scale(1.5)" }}
                        checked={selectedLectures.includes(item.id)}
                        onChange={() => handleCheckboxChange(item.id)}
                      />
                      <Box>{item.id}</Box>

                      <Box>{item.lectureTitle}</Box>
                      <Box>{item.lectureDescription}</Box>
                      <Box sx={{ color: "Highlight" }}>{item.lectureType}</Box>
                      <Box>{item.numberLecture}</Box>
                    </Box>
                  </>
                ))}
            </Box>
          </ModalFrame>
        </Box>
      </EditBase>
    </Box>
  );
};

const CourseEdit = (props: BaseComponentProps) => (
  <Box sx={boxStyles}>
    <EditBase>
      <CourseEditForm {...props} />
    </EditBase>
  </Box>
);

export default CourseEdit;
