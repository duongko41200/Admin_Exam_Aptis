import { EditBase, Title, useNotify, useRecordContext } from "react-admin";
import { useNavigate } from "react-router-dom";

import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  Paper,
  Divider,
  Chip,
  LinearProgress,
  Alert,
  FormControlLabel,
  Switch,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { Button } from "react-admin";
import TextEditor from "../../components/TextEditor/TextEditor";
import VideoUpload from "../../components/VideoUpload/VideoUpload";
import { CourseTypes } from "../../consts/course";
import { BaseComponentProps } from "../../types/general";
import { UPDATED_SUCCESS } from "../../consts/general";
import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import dataProvider from "../../providers/dataProviders/dataProvider";

const boxStyles = {
  width: "100%",
  maxWidth: "100%",
  bgcolor: "background.paper",
  maxHeight: "95vh",
  overflowY: "auto",
  "&::-webkit-scrollbar": {
    width: "6px",
  },
  // border: "2px solid #000",
};

interface SubLecture {
  subLectureTitle: string;
  summaryLecture: string;
  note: string;
  durationInMinutes: string;
  videoUrl: string;
  videoFile: File | null;
  videoFileInfo: any;
  isPreviewFree: boolean;
}

const LectureEditForm = ({ resource, dataProvider }) => {
  const navigate = useNavigate();
  const record = useRecordContext();
  const resourcePath = `/${resource}`;
  const notify = useNotify();
  const [isSubmitting, setIsSubmitting] = useState(false);

  console.log("record", record);

  const [subLectures, setSubLectures] = useState<SubLecture[]>([
    {
      subLectureTitle: "",
      summaryLecture: "",
      note: "",
      durationInMinutes: "",
      videoUrl: "",
      videoFile: null as File | null,
      videoFileInfo: null,
      isPreviewFree: false,
    },
  ]);

  // Refs for video upload components
  const videoUploadRefs = useRef<{ [key: number]: any }>({});
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
        videoFile: null as File | null,
        videoFileInfo: null,
        isPreviewFree: false,
      },
    ]);
  };

  const handleRemoveSubLecture = (index: number) => {
    const newSubLectures = subLectures.filter((_, i) => i !== index);
    setSubLectures(newSubLectures);
    // Clean up refs
    delete videoUploadRefs.current[index];
  };

  const handleSubLectureChange = (index: number, field: string, value: any) => {
    const newSubLectures = [...subLectures];
    newSubLectures[index][field] = value;
    setSubLectures(newSubLectures);
  };

  const onSubmit = async (values: any) => {
    console.log("values", values);
    console.log("subLectures", subLectures);

    setIsSubmitting(true);

    try {
      const data = {
        lectureTitle: values.lectureTitle,
        lectureDescription: values.lectureDescription,
        lectureType: values.lectureType,
        numberLecture: values.numberLecture,
        subLectures: subLectures,
      };

      console.log("data", data);

      await dataProvider.update("lectures", {
        id: record?.id,
        data: data,
        previousData: record,
      });

      record.lectureTitle = data.lectureTitle;
      record.lectureDescription = data.lectureDescription;
      record.lectureType = data.lectureType;
      record.numberLecture = data.numberLecture;
      record.subLectures = data.subLectures;

      await notify(UPDATED_SUCCESS, {
        type: "success",
      });
      reset();

      navigate(resourcePath);
    } catch (error) {
      console.log({ error });
      notify("Update failed", { type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (record) {
      setValue("lectureTitle", record.lectureTitle || "");
      setValue("lectureDescription", record.lectureDescription || "");
      setValue("lectureType", record.lectureType || "");
      setValue("numberLecture", record.numberLecture || "");

      if (record.subLectures && record.subLectures.length > 0) {
        const populatedSubLectures = record.subLectures.map(
          (subLecture: any) => ({
            subLectureTitle: subLecture.subLectureTitle || "",
            summaryLecture: subLecture.summaryLecture || "",
            note: subLecture.note || "",
            durationInMinutes: subLecture.durationInMinutes || "",
            videoUrl: subLecture.videoUrl || "",
            videoFile: null as File | null,
            videoFileInfo: null,
            isPreviewFree: subLecture.isPreviewFree || false,
          })
        );
        setSubLectures(populatedSubLectures);
      }
    }
  }, [record, setValue]);

  return (
    <Box sx={boxStyles}>
      <EditBase>
        <Title title="Edit Bài học chi tiết" />
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
                {...register("numberLecture", { required: true })}
                placeholder="mô tả phần học"
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
                  defaultValue={record?.lectureType || ""}
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

            {/* Add SubLecture Button */}
            <Box sx={{ marginTop: "20px", marginBottom: 2 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddSubLecture}
                startIcon={<AddIcon />}
                sx={{
                  padding: "12px 24px",
                  fontWeight: "bold",
                  textTransform: "none",
                  borderRadius: 2,
                  backgroundColor: "#1976d2",
                  "&:hover": {
                    backgroundColor: "#1565c0",
                  },
                }}
              >
                <span>Thêm bài học con</span>
              </Button>
            </Box>

            {/* Sub-lectures Grid Container */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: 3,
                marginTop: 3,
              }}
            >
              {subLectures.map((subLecture, index) => (
                <Paper
                  key={index}
                  elevation={3}
                  sx={{
                    padding: 3,
                    position: "relative",
                    borderRadius: 2,
                    backgroundColor: "#f8f9fa",
                    border: "1px solid #e0e0e0",
                  }}
                >
                  {/* Header with index and delete button */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 2,
                    }}
                  >
                    <Chip
                      label={`Bài ${index + 1}`}
                      color="primary"
                      size="small"
                      sx={{ fontWeight: "bold" }}
                    />
                    <IconButton
                      onClick={() => handleRemoveSubLecture(index)}
                      color="error"
                      size="small"
                      sx={{
                        backgroundColor: "rgba(244, 67, 54, 0.1)",
                        "&:hover": {
                          backgroundColor: "rgba(244, 67, 54, 0.2)",
                        },
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>

                  {/* Sub-Lecture Title */}
                  <TextField
                    fullWidth
                    label="Tiêu đề bài học"
                    value={subLecture.subLectureTitle}
                    onChange={(e) =>
                      handleSubLectureChange(
                        index,
                        "subLectureTitle",
                        e.target.value
                      )
                    }
                    variant="outlined"
                    size="small"
                    sx={{ marginBottom: 2 }}
                  />

                  {/* Duration and Preview Free Toggle */}
                  <Box sx={{ display: "flex", gap: 1, marginBottom: 2 }}>
                    <TextField
                      label="Thời gian (phút)"
                      type="number"
                      value={subLecture.durationInMinutes}
                      onChange={(e) =>
                        handleSubLectureChange(
                          index,
                          "durationInMinutes",
                          e.target.value
                        )
                      }
                      variant="outlined"
                      size="small"
                      sx={{ flex: 1 }}
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={subLecture.isPreviewFree}
                          onChange={(e) =>
                            handleSubLectureChange(
                              index,
                              "isPreviewFree",
                              e.target.checked
                            )
                          }
                          color="primary"
                        />
                      }
                      label="Xem trước miễn phí"
                      sx={{ marginLeft: 1 }}
                    />
                  </Box>

                  {/* Video Upload Section */}
                  <Box sx={{ marginBottom: 2 }}>
                    <Typography variant="subtitle2" sx={{ marginBottom: 1 }}>
                      Video bài học:
                    </Typography>
                    <VideoUpload
                      ref={(ref) => (videoUploadRefs.current[index] = ref)}
                      onFileSelected={(file, fileInfo) => {
                        if (file && fileInfo) {
                          // Handle successful upload - the component will provide publicUrl via VideoService
                          const newSubLectures = [...subLectures];
                          newSubLectures[index].videoFile = file;
                          newSubLectures[index].videoFileInfo = fileInfo;
                          // VideoUrl will be set by the component's internal upload process
                          setSubLectures(newSubLectures);
                        }
                      }}
                      onUrlChange={(url) => {
                        const newSubLectures = [...subLectures];
                        newSubLectures[index].videoUrl = url;
                        setSubLectures(newSubLectures);
                      }}
                      initialVideoUrl={subLecture.videoUrl}
                      maxSizeGB={0.2}
                      acceptedFormats="video/*"
                      index={index}
                    />
                  </Box>

                  <Divider sx={{ marginY: 2 }} />

                  {/* Summary Editor */}
                  <Box>
                    <Typography variant="subtitle2" sx={{ marginBottom: 1 }}>
                      Tóm tắt bài học:
                    </Typography>
                    <TextEditor
                      editorId={`editor-${index}`}
                      placeholder="Nhập tóm tắt hoặc ghi chú cho bài học này..."
                      suggestion={subLecture.summaryLecture}
                      setSuggestion={(value: any) =>
                        handleSubLectureChange(index, "summaryLecture", value)
                      }
                    />
                  </Box>

                  {/* Notes Section */}
                  <TextField
                    fullWidth
                    label="Ghi chú"
                    multiline
                    rows={2}
                    value={subLecture.note}
                    onChange={(e) =>
                      handleSubLectureChange(index, "note", e.target.value)
                    }
                    variant="outlined"
                    size="small"
                    sx={{ marginTop: 2 }}
                    placeholder="Thêm ghi chú cho bài học này..."
                  />
                </Paper>
              ))}
            </Box>

            {/* Submit and Cancel Buttons */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: 4,
                padding: 3,
                backgroundColor: "#f8f9fa",
                borderRadius: 2,
                border: "1px solid #e0e0e0",
              }}
            >
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isSubmitting}
                size="large"
                sx={{
                  paddingX: 4,
                  paddingY: 1.5,
                  fontWeight: "bold",
                  textTransform: "none",
                }}
              >
                <span>
                  {isSubmitting ? "Đang cập nhật..." : "Cập nhật bài học"}
                </span>
              </Button>

              <Button
                type="button"
                variant="outlined"
                color="error"
                onClick={handleCancel}
                disabled={isSubmitting}
                size="large"
                sx={{
                  paddingX: 4,
                  paddingY: 1.5,
                  fontWeight: "bold",
                  textTransform: "none",
                }}
              >
                <span>Hủy bỏ</span>
              </Button>
            </Box>
          </form>
        </Box>
      </EditBase>
    </Box>
  );
};

const LectureEdit = (props: BaseComponentProps) => (
  <Box sx={boxStyles}>
    <EditBase>
      <LectureEditForm {...props} />
    </EditBase>
  </Box>
);

export default LectureEdit;
