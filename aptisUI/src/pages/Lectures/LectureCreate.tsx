import { Create, useRecordContext } from "react-admin";

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
} from "@mui/material";
import { useState, useRef } from "react";
import { Button, useNotify } from "react-admin";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import TextEditor from "../../components/TextEditor/TextEditor";
import VideoUpload from "../../components/VideoUpload/VideoUpload";
import dataProvider from "../../providers/dataProviders/dataProvider";

import { CourseTypes } from "../../consts/course";
import { UPDATED_SUCCESS } from "../../consts/general";

interface LectureCreateProps {
  resource: string;
  props?: any;
  showCancelButton?: boolean;
}

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

const LectureCreate = ({
  resource,
  props,
  showCancelButton = true,
}: LectureCreateProps) => {
  const resourcePath = `/${resource}`;
  const [suggestion, setSuggestion] = useState("");
  const navigate = useNavigate();
  const record = useRecordContext();
  const notify = useNotify();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{
    [key: number]: number;
  }>({});

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
  };

  const handleSubLectureChange = (index: number, field: string, value: any) => {
    const newSubLectures = [...subLectures];
    newSubLectures[index][field] = value;
    setSubLectures(newSubLectures);
  };

  const handleVideoUpload = (index: number, videoUrl: string, file: File) => {
    handleSubLectureChange(index, "videoUrl", videoUrl);
    // Optionally store file info for additional processing
    if (file) {
      handleSubLectureChange(index, "videoFileName", file.name);
      handleSubLectureChange(index, "videoFileSize", file.size);
    }
  };

  const handleVideoFileSelected = (
    index: number,
    file: File | null,
    fileInfo: any
  ) => {
    handleSubLectureChange(index, "videoFile", file);
    handleSubLectureChange(index, "videoFileInfo", fileInfo);
  };

  const onSubmit = async (values: any) => {
    console.log("values", values);
    console.log("subLectures", subLectures);

    setIsSubmitting(true);

    try {
      // Process videos based on their upload method
      const videoUploadPromises = subLectures.map(async (subLecture, index) => {
        const uploadRef = videoUploadRefs.current[index];

        if (uploadRef && uploadRef.hasFile()) {
          try {
            setUploadProgress((prev) => ({ ...prev, [index]: 0 }));

            // Get video URL (could be from server upload, direct upload, or manual URL)
            const videoUrl = await uploadRef.uploadVideo();

            return { index, videoUrl };
          } catch (error) {
            console.error(
              `Failed to get video URL for lecture ${index + 1}:`,
              error
            );
            throw new Error(
              `Failed to process video for lecture ${index + 1}: ${
                error.message
              }`
            );
          }
        }
        return { index, videoUrl: subLecture.videoUrl };
      });

      // Wait for all video processing to complete
      const uploadResults = await Promise.all(videoUploadPromises);

      // Update subLectures with final video URLs
      const updatedSubLectures = subLectures.map((subLecture, index) => {
        const uploadResult = uploadResults.find(
          (result) => result.index === index
        );
        return {
          ...subLecture,
          videoUrl: uploadResult?.videoUrl || subLecture.videoUrl,
          videoFile: null,
          videoFileInfo: null,
        };
      });

      const data = {
        lectureTitle: values.lectureTitle,
        lectureDescription: values.lectureDescription,
        lectureType: values.lectureType,
        numberLecture: values.numberLecture,
        subLectures: updatedSubLectures,
      };

      console.log("Final lecture data:", data);

      const CreateData = await dataProvider.create("lectures", { data });

      console.log({ CreateData });

      await notify(UPDATED_SUCCESS, { type: "success" });

      reset();
      setUploadProgress({});
    } catch (error) {
      console.log({ error });
      await notify("Lỗi tạo bài học: " + error.message, { type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <Create redirect="list" title="Tạo bài học mới">
      {/* Global upload progress */}
      {isSubmitting && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 9999,
            backgroundColor: "rgba(255,255,255,0.95)",
            backdropFilter: "blur(5px)",
          }}
        >
          <LinearProgress
            color="primary"
            sx={{
              height: 6,
              "& .MuiLinearProgress-bar": {
                background: "linear-gradient(90deg, #1976d2, #42a5f5)",
              },
            }}
          />
          <Box sx={{ textAlign: "center", py: 2 }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              Đang upload videos và tạo bài học...
            </Typography>
          </Box>
        </Box>
      )}

      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
          padding: { xs: 2, md: 3 },
        }}
      >
        <Box
          sx={{
            maxWidth: "1200px",
            margin: "0 auto",
            maxHeight: "90vh",
            overflowY: "auto",
            "&::-webkit-scrollbar": {
              width: "8px",
            },
            "&::-webkit-scrollbar-track": {
              background: "rgba(0,0,0,0.1)",
              borderRadius: "4px",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "rgba(25, 118, 210, 0.3)",
              borderRadius: "4px",
              "&:hover": {
                background: "rgba(25, 118, 210, 0.5)",
              },
            },
          }}
        >
          <Paper
            elevation={8}
            sx={{
              borderRadius: "20px",
              overflow: "hidden",
              background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
              boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
            }}
          >
            {/* Header */}
            <Box
              sx={{
                background: "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
                color: "white",
                textAlign: "center",
                py: 4,
                position: "relative",
                overflow: "hidden",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background:
                    'url(\'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>\')',
                },
              }}
            >
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 800,
                  mb: 1,
                  position: "relative",
                  textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                }}
              >
                Tạo Bài Học Mới
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  opacity: 0.9,
                  position: "relative",
                  fontWeight: 400,
                }}
              >
                Tạo bài học với video chất lượng cao
              </Typography>
            </Box>

            <Box sx={{ p: { xs: 3, md: 4 } }}>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="form sign-up-form relative"
              >
                {/* Lecture Basic Info Section */}
                <Paper
                  elevation={2}
                  sx={{
                    p: 4,
                    mb: 4,
                    borderRadius: "16px",
                    background:
                      "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
                    border: "1px solid rgba(25, 118, 210, 0.1)",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #1976d2, #42a5f5)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mr: 2,
                      }}
                    >
                      <Typography sx={{ color: "white", fontWeight: "bold" }}>
                        1
                      </Typography>
                    </Box>
                    <Typography
                      variant="h5"
                      sx={{ color: "#1976d2", fontWeight: 700 }}
                    >
                      Thông Tin Cơ Bản
                    </Typography>
                  </Box>

                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 3 }}
                  >
                    <TextField
                      {...register("lectureTitle", {
                        required: "Tiêu đề là bắt buộc",
                      })}
                      label="Tiêu đề phần học"
                      variant="outlined"
                      fullWidth
                      error={!!errors.lectureTitle}
                      helperText={
                        errors.lectureTitle
                          ? String(
                              errors.lectureTitle.message ||
                                "This field is required"
                            )
                          : ""
                      }
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "12px",
                          "&:hover": {
                            "& .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#1976d2",
                            },
                          },
                        },
                      }}
                    />

                    <TextField
                      {...register("lectureDescription")}
                      label="Mô tả phần học"
                      variant="outlined"
                      fullWidth
                      multiline
                      rows={3}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "12px",
                          "&:hover": {
                            "& .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#1976d2",
                            },
                          },
                        },
                      }}
                    />

                    <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                      <TextField
                        type="number"
                        {...register("numberLecture")}
                        label="Số thứ tự bài học"
                        variant="outlined"
                        sx={{
                          flex: 1,
                          minWidth: "200px",
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "12px",
                          },
                        }}
                      />

                      <FormControl
                        sx={{
                          flex: 2,
                          minWidth: "250px",
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "12px",
                          },
                        }}
                        error={!!errors.lectureType}
                      >
                        <InputLabel>Chọn loại bài học</InputLabel>
                        <Select
                          {...register("lectureType", {
                            required: "Loại bài học là bắt buộc",
                          })}
                          label="Chọn loại bài học"
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
                        {errors.lectureType && (
                          <Typography color="error" variant="caption">
                            {String(
                              errors.lectureType.message ||
                                "This field is required"
                            )}
                          </Typography>
                        )}
                      </FormControl>
                    </Box>
                  </Box>
                </Paper>

                {/* Sub Lectures Section */}
                <Paper
                  elevation={2}
                  sx={{
                    p: 4,
                    mb: 4,
                    borderRadius: "16px",
                    background:
                      "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
                    border: "1px solid rgba(25, 118, 210, 0.1)",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #1976d2, #42a5f5)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mr: 2,
                      }}
                    >
                      <Typography sx={{ color: "white", fontWeight: "bold" }}>
                        2
                      </Typography>
                    </Box>
                    <Typography
                      variant="h5"
                      sx={{ color: "#1976d2", fontWeight: 700, flex: 1 }}
                    >
                      Danh Sách Bài Học Con
                    </Typography>
                    <Button
                      variant="contained"
                      color="success"
                      onClick={handleAddSubLecture}
                      disabled={isSubmitting}
                      sx={{
                        borderRadius: "12px",
                        textTransform: "none",
                        px: 3,
                        py: 1,
                        fontWeight: 600,
                        boxShadow: "0 4px 12px rgba(76, 175, 80, 0.3)",
                        "&:hover": {
                          boxShadow: "0 6px 16px rgba(76, 175, 80, 0.4)",
                        },
                      }}
                    >
                      <span>+ Thêm Bài Học</span>
                    </Button>
                  </Box>

                  {subLectures.length === 0 && (
                    <Box
                      sx={{
                        textAlign: "center",
                        py: 6,
                        color: "text.secondary",
                        border: "2px dashed #ccc",
                        borderRadius: "16px",
                        background: "rgba(0,0,0,0.02)",
                      }}
                    >
                      <Typography variant="h6" sx={{ mb: 1 }}>
                        Chưa có bài học con nào
                      </Typography>
                      <Typography>
                        Nhấn "Thêm Bài Học" để bắt đầu tạo nội dung
                      </Typography>
                    </Box>
                  )}

                  <Box
                    sx={{
                      maxHeight: "60vh",
                      overflowY: "auto",
                      "&::-webkit-scrollbar": {
                        width: "6px",
                      },
                      "&::-webkit-scrollbar-track": {
                        background: "rgba(0,0,0,0.1)",
                        borderRadius: "3px",
                      },
                      "&::-webkit-scrollbar-thumb": {
                        background: "rgba(25, 118, 210, 0.3)",
                        borderRadius: "3px",
                      },
                    }}
                  >
                    {subLectures.map((subLecture, index) => (
                      <Paper
                        key={index}
                        elevation={3}
                        sx={{
                          p: 4,
                          mb: 3,
                          borderRadius: "16px",
                          position: "relative",
                          border: "1px solid rgba(25, 118, 210, 0.1)",
                          background:
                            "linear-gradient(135deg, #ffffff 0%, #fafbff 100%)",
                          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                          "&:hover": {
                            transform: "translateY(-2px)",
                            boxShadow: "0 8px 25px rgba(25, 118, 210, 0.15)",
                          },
                        }}
                      >
                        {/* Lecture Number Badge */}
                        <Chip
                          label={`Bài ${index + 1}`}
                          color="primary"
                          sx={{
                            position: "absolute",
                            top: -10,
                            left: 20,
                            fontWeight: "bold",
                            fontSize: "14px",
                            height: "28px",
                            boxShadow: "0 2px 8px rgba(25, 118, 210, 0.3)",
                          }}
                        />

                        {/* Upload Progress for this video */}
                        {isSubmitting &&
                          uploadProgress[index] !== undefined && (
                            <Box
                              sx={{
                                position: "absolute",
                                top: 15,
                                right: 60,
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <Typography variant="caption" color="primary">
                                {uploadProgress[index]}%
                              </Typography>
                              <LinearProgress
                                variant="determinate"
                                value={uploadProgress[index]}
                                sx={{ width: 60, height: 4, borderRadius: 2 }}
                              />
                            </Box>
                          )}

                        {/* Remove Button */}
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          onClick={() => handleRemoveSubLecture(index)}
                          disabled={isSubmitting}
                          sx={{
                            position: "absolute",
                            top: 15,
                            right: 15,
                            minWidth: "40px",
                            borderRadius: "50%",
                            p: 1,
                            "&:hover": {
                              transform: "scale(1.1)",
                            },
                          }}
                        >
                          <span>×</span>
                        </Button>

                        <Box sx={{ mt: 3 }}>
                          {/* Basic Info */}
                          <Box
                            sx={{
                              display: "flex",
                              gap: 2,
                              mb: 3,
                              flexWrap: "wrap",
                            }}
                          >
                            <TextField
                              value={subLecture.subLectureTitle}
                              onChange={(e) =>
                                handleSubLectureChange(
                                  index,
                                  "subLectureTitle",
                                  e.target.value
                                )
                              }
                              label="Tiêu đề bài học"
                              variant="outlined"
                              sx={{
                                flex: 1,
                                minWidth: "300px",
                                "& .MuiOutlinedInput-root": {
                                  borderRadius: "12px",
                                },
                              }}
                            />
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
                              label="Thời gian (phút)"
                              variant="outlined"
                              sx={{
                                minWidth: "150px",
                                "& .MuiOutlinedInput-root": {
                                  borderRadius: "12px",
                                },
                              }}
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
                              label="Preview miễn phí"
                              sx={{ minWidth: "160px" }}
                            />
                          </Box>

                          <Divider sx={{ my: 3 }} />

                          {/* Video Upload Section */}
                          <Box sx={{ mb: 3 }}>
                            <Typography
                              variant="h6"
                              gutterBottom
                              sx={{
                                fontWeight: "bold",
                                color: "#1976d2",
                                mb: 2,
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              📹 Video Bài Học
                            </Typography>
                            <VideoUpload
                              ref={(ref) => {
                                if (ref) {
                                  videoUploadRefs.current[index] = ref;
                                }
                              }}
                              onFileSelected={(file, fileInfo) =>
                                handleVideoFileSelected(index, file, fileInfo)
                              }
                              initialVideoUrl={subLecture.videoUrl}
                              maxSizeGB={10}
                              disabled={isSubmitting}
                              index={index}
                            />
                          </Box>

                          <Divider sx={{ my: 3 }} />

                          {/* Summary Editor */}
                          <Box>
                            <Typography
                              variant="h6"
                              gutterBottom
                              sx={{
                                fontWeight: "bold",
                                color: "#1976d2",
                                mb: 2,
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              📝 Tóm Tắt và Ghi Chú
                            </Typography>
                            <Box
                              sx={{
                                border: "1px solid #e0e0e0",
                                borderRadius: "12px",
                                overflow: "hidden",
                                background: "#fafafa",
                              }}
                            >
                              <TextEditor
                                editorId={`editor${index}`}
                                placeholder="Viết tóm tắt hoặc ghi chú cho bài học..."
                                suggestion={subLecture.summaryLecture}
                                setSuggestion={(value) =>
                                  handleSubLectureChange(
                                    index,
                                    "summaryLecture",
                                    value
                                  )
                                }
                              />
                            </Box>
                          </Box>
                        </Box>
                      </Paper>
                    ))}
                  </Box>
                </Paper>

                {/* Action Buttons */}
                <Paper
                  elevation={2}
                  sx={{
                    p: 4,
                    borderRadius: "16px",
                    background:
                      "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
                    border: "1px solid rgba(25, 118, 210, 0.1)",
                    position: "sticky",
                    bottom: 0,
                    zIndex: 10,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #1976d2, #42a5f5)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mr: 2,
                      }}
                    >
                      <Typography sx={{ color: "white", fontWeight: "bold" }}>
                        3
                      </Typography>
                    </Box>
                    <Typography
                      variant="h5"
                      sx={{ color: "#1976d2", fontWeight: 700 }}
                    >
                      Hoàn Tất
                    </Typography>
                  </Box>

                  {/* Progress Summary */}
                  {isSubmitting && Object.keys(uploadProgress).length > 0 && (
                    <Box sx={{ mb: 3 }}>
                      <Typography
                        variant="body2"
                        sx={{ mb: 2, fontWeight: 600 }}
                      >
                        Tiến trình upload videos:
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 1,
                        }}
                      >
                        {Object.entries(uploadProgress).map(
                          ([index, progress]) => (
                            <Box
                              key={index}
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 2,
                              }}
                            >
                              <Typography
                                variant="caption"
                                sx={{ minWidth: "80px" }}
                              >
                                Bài {parseInt(index) + 1}:
                              </Typography>
                              <LinearProgress
                                variant="determinate"
                                value={progress}
                                sx={{
                                  flex: 1,
                                  height: 6,
                                  borderRadius: 3,
                                  "& .MuiLinearProgress-bar": {
                                    background:
                                      "linear-gradient(90deg, #4caf50, #81c784)",
                                  },
                                }}
                              />
                              <Typography
                                variant="caption"
                                sx={{ minWidth: "40px" }}
                              >
                                {progress}%
                              </Typography>
                            </Box>
                          )
                        )}
                      </Box>
                    </Box>
                  )}

                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    justifyContent="center"
                    alignItems="center"
                    spacing={3}
                  >
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      size="large"
                      disabled={isSubmitting}
                      sx={{
                        px: 6,
                        py: 2,
                        borderRadius: "12px",
                        textTransform: "none",
                        fontSize: "18px",
                        fontWeight: 700,
                        minWidth: "200px",
                        background:
                          "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
                        boxShadow: "0 8px 25px rgba(25, 118, 210, 0.4)",
                        "&:hover": {
                          background:
                            "linear-gradient(135deg, #1565c0 0%, #1976d2 100%)",
                          boxShadow: "0 12px 35px rgba(25, 118, 210, 0.5)",
                          transform: "translateY(-2px)",
                        },
                        "&:disabled": {
                          background:
                            "linear-gradient(135deg, #e0e0e0 0%, #f5f5f5 100%)",
                          color: "#9e9e9e",
                        },
                      }}
                    >
                      <span>
                        {isSubmitting
                          ? "Đang Tạo Bài Học..."
                          : "🚀 Tạo Bài Học"}
                      </span>
                    </Button>

                    <Button
                      type="button"
                      variant="outlined"
                      color="inherit"
                      size="large"
                      onClick={handleCancel}
                      disabled={isSubmitting}
                      sx={{
                        px: 6,
                        py: 2,
                        borderRadius: "12px",
                        textTransform: "none",
                        fontSize: "18px",
                        fontWeight: 600,
                        minWidth: "200px",
                        borderColor: "#e0e0e0",
                        color: "#666",
                        "&:hover": {
                          borderColor: "#1976d2",
                          color: "#1976d2",
                          background: "rgba(25, 118, 210, 0.05)",
                        },
                      }}
                    >
                      <span>❌ Hủy Bỏ</span>
                    </Button>
                  </Stack>

                  {/* Additional Info */}
                  <Box
                    sx={{
                      mt: 3,
                      pt: 2,
                      borderTop: "1px solid rgba(0,0,0,0.1)",
                      textAlign: "center",
                    }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      💡 Videos sẽ được upload song song để tiết kiệm thời gian.
                      Hỗ trợ file lên đến 10GB với công nghệ multipart upload.
                    </Typography>
                  </Box>
                </Paper>
              </form>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Create>
  );
};

export default LectureCreate;
