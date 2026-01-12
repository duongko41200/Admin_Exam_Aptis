import {
  Box,
  LinearProgress,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useNotify } from "react-admin";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { SimpleR2FilePreview } from "../../../components/R2FileUpload";
import TextEditor from "../../../components/TextEditor/TextEditor";
import { UPDATED_SUCCESS } from "../../../consts/general";
import baseDataProvider from "../../../providers/dataProviders/baseDataProvider";
import dataProvider from "../../../providers/dataProviders/dataProvider";
import R2UploadService from "../../../services/API/r2UploadHelper.service";
import {
  INIT_LISTENING_SUB_QUESTIONS,
  RESET_LISTENING_DATA,
  UPDATE_LISTENING_MAIN_DATA,
  UPDATE_LISTENING_SUB_QUESTION,
  UPDATE_LISTENING_SUB_QUESTION_SUGGESTION,
} from "../../../store/feature/listening";

// Type definitions
interface ListeningData {
  id: string;
  title: string;
  questions: {
    content: string;
    questionTitle: string;
    subQuestion: SubQuestionData[];
  }[];
}

interface SubQuestionData {
  content: string;
  correctAnswer: string;
  file: string;
  suggestion: string;
  answerList: { content: string }[];
}

interface ListeningStore {
  currentListeningData: {
    title: string;
    subTitle: string;
    content: string;
    suggestion: string;
    file: string;
    subQuestions: SubQuestionData[];
  };
}

interface RootState {
  listeningStore: ListeningStore;
}

interface ListeningPartOneProps {
  children?: JSX.Element | JSX.Element[];
  showDeleteButton?: boolean;
  showSaveButton?: boolean;
  showCancelButton?: boolean;
  alwaysEnable?: boolean;
  pathTo?: string;
  dataListeningPartOne?: ListeningData | null;
  statusHandler?: string;
  handleCancel?: () => void;
}

interface FormData {
  title: string;
  subTitle: string;
  content: string;
  // Sub content fields for 13 questions
  subContent1: string;
  subContent2: string;
  subContent3: string;
  subContent4: string;
  subContent5: string;
  subContent6: string;
  subContent7: string;
  subContent8: string;
  subContent9: string;
  subContent10: string;
  subContent11: string;
  subContent12: string;
  subContent13: string;
  // Correct answers for 13 questions
  correctAnswer1: string;
  correctAnswer2: string;
  correctAnswer3: string;
  correctAnswer4: string;
  correctAnswer5: string;
  correctAnswer6: string;
  correctAnswer7: string;
  correctAnswer8: string;
  correctAnswer9: string;
  correctAnswer10: string;
  correctAnswer11: string;
  correctAnswer12: string;
  correctAnswer13: string;
  // File fields for 13 questions
  subFile1: string;
  subFile2: string;
  subFile3: string;
  subFile4: string;
  subFile5: string;
  subFile6: string;
  subFile7: string;
  subFile8: string;
  subFile9: string;
  subFile10: string;
  subFile11: string;
  subFile12: string;
  subFile13: string;
  // Answer fields for each question (3 answers per question, 13 questions)
  answer1Sub1: string;
  answer2Sub1: string;
  answer3Sub1: string;
  answer1Sub2: string;
  answer2Sub2: string;
  answer3Sub2: string;
  answer1Sub3: string;
  answer2Sub3: string;
  answer3Sub3: string;
  answer1Sub4: string;
  answer2Sub4: string;
  answer3Sub4: string;
  answer1Sub5: string;
  answer2Sub5: string;
  answer3Sub5: string;
  answer1Sub6: string;
  answer2Sub6: string;
  answer3Sub6: string;
  answer1Sub7: string;
  answer2Sub7: string;
  answer3Sub7: string;
  answer1Sub8: string;
  answer2Sub8: string;
  answer3Sub8: string;
  answer1Sub9: string;
  answer2Sub9: string;
  answer3Sub9: string;
  answer1Sub10: string;
  answer2Sub10: string;
  answer3Sub10: string;
  answer1Sub11: string;
  answer2Sub11: string;
  answer3Sub11: string;
  answer1Sub12: string;
  answer2Sub12: string;
  answer3Sub12: string;
  answer1Sub13: string;
  answer2Sub13: string;
  answer3Sub13: string;
}

interface QuestionBoxProps {
  questionNumber: number;
  register: ReturnType<typeof useForm<FormData>>["register"];
  errors: ReturnType<typeof useForm<FormData>>["formState"]["errors"];
  suggestion: string;
  setSuggestion: (value: string) => void;
  num: number;
  selectedFiles: File[];
  existingAudioUrls: string[];
  onFilesChange: (files: File[]) => void;
  onRemoveExistingAudio: (url: string) => void;
}

// Optimized QuestionBox component with memo
const QuestionBox = memo(
  ({
    questionNumber,
    register,
    errors,
    suggestion,
    setSuggestion,
    num,
    selectedFiles,
    existingAudioUrls,
    onFilesChange,
    onRemoveExistingAudio,
  }: QuestionBoxProps) => (
    <Box
      sx={{
        minHeight: "200px",
        height: "fit-content",
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "16px",
        backgroundColor: "#fafafa",
      }}
    >
      <Box
        sx={{
          fontSize: "18px",
          fontWeight: "bold",
          marginBottom: "12px",
          color: "#1976d2",
        }}
      >
        Nội Dung Câu {questionNumber}
      </Box>
      <Box>
        <div>
          <TextField
            {...register(`subContent${questionNumber}` as keyof FormData, {
              required: true,
            })}
            placeholder={`Question ${questionNumber} content`}
            variant="outlined"
            fullWidth
            error={!!errors[`subContent${questionNumber}` as keyof FormData]}
            helperText={
              errors[`subContent${questionNumber}` as keyof FormData]
                ? "This field is required"
                : ""
            }
            sx={{
              "& .MuiOutlinedInput-root": {
                backgroundColor: "white",
              },
            }}
          />
        </div>
        <Box sx={{ marginTop: "12px" }}>
          <TextField
            {...register(`correctAnswer${questionNumber}` as keyof FormData, {
              required: true,
            })}
            placeholder="Đáp án đúng"
            variant="outlined"
            fullWidth
            error={!!errors[`correctAnswer${questionNumber}` as keyof FormData]}
            helperText={
              errors[`correctAnswer${questionNumber}` as keyof FormData]
                ? "This field is required"
                : ""
            }
            sx={{
              "& .MuiOutlinedInput-root": {
                backgroundColor: "#fff3e0",
                "&:hover": {
                  backgroundColor: "#ffe0b2",
                },
              },
            }}
          />
        </Box>
        <Box sx={{ marginTop: "12px" }}>
          <TextEditor
            placeholder="gợi ý câu trả lời"
            suggestion={suggestion}
            setSuggestion={setSuggestion}
            editorId={`editor${num}`}
          />
        </Box>

        <Box sx={{ marginTop: "12px" }}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 500,
              mb: 1,
              color: "#666",
            }}
          >
            Upload file âm thanh câu hỏi:
          </Typography>
          <SimpleR2FilePreview
            onFilesChange={onFilesChange}
            multiple={false}
            maxFiles={1}
            initialImageUrls={existingAudioUrls}
            onRemoveExistingImage={onRemoveExistingAudio}
            acceptedFileTypes={[
              "audio/mp3",
              "audio/mpeg",
              "audio/wav",
              "audio/mp4",
              "audio/x-m4a",
            ]}
            fileTypeLabel="Audio"
            icon="🎵"
          />
        </Box>
        <Box sx={{ marginTop: "12px" }}>
          {[1, 2, 3].map((answerNum) => (
            <Box key={answerNum} sx={{ marginBottom: "8px" }}>
              <TextField
                {...register(
                  `answer${answerNum}Sub${questionNumber}` as keyof FormData,
                  {
                    required: true,
                  }
                )}
                placeholder={`Đáp án ${answerNum}`}
                variant="outlined"
                fullWidth
                size="small"
                error={
                  !!errors[
                    `answer${answerNum}Sub${questionNumber}` as keyof FormData
                  ]
                }
                helperText={
                  errors[
                    `answer${answerNum}Sub${questionNumber}` as keyof FormData
                  ]
                    ? "This field is required"
                    : ""
                }
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "#f0f8ff",
                    "&:hover": {
                      backgroundColor: "#e6f3ff",
                    },
                  },
                }}
              />
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  )
);

QuestionBox.displayName = "QuestionBox";

const ListeningPartOneOptimized: React.FC<ListeningPartOneProps> = ({
  showDeleteButton = true,
  showSaveButton = true,
  showCancelButton = true,
  dataListeningPartOne = null,
  statusHandler = "create",
  handleCancel,
}) => {
  const navigate = useNavigate();
  const notify = useNotify();
  const dispatch = useDispatch();
  const listeningStore = useSelector(
    (state: RootState) => state.listeningStore
  );

  const [suggestions, setSuggestions] = useState<string[]>(Array(14).fill(""));

  // Audio file upload states for each sub question (13 questions)
  const [selectedFilesPerQuestion, setSelectedFilesPerQuestion] = useState<{
    [key: number]: File[];
  }>({});
  const [existingAudioUrlsPerQuestion, setExistingAudioUrlsPerQuestion] =
    useState<{
      [key: number]: string[];
    }>({});
  const [removedAudioUrlsPerQuestion, setRemovedAudioUrlsPerQuestion] =
    useState<{
      [key: number]: string[];
    }>({});
  const [isUploading, setIsUploading] = useState(false);

  const handleSuggestionChange = useCallback(
    (index: number, value: string) => {
      setSuggestions((prev) => {
        const newSuggestions = [...prev];
        newSuggestions[index] = value;
        return newSuggestions;
      });

      // Update Redux store for suggestion
      if (index > 0 && index <= 13) {
        dispatch(
          UPDATE_LISTENING_SUB_QUESTION_SUGGESTION({
            index: index - 1,
            value: value,
          })
        );
      }
    },
    [dispatch]
  );

  // File upload handlers for each sub question
  const handleFilesChange = useCallback(
    (questionNumber: number, files: File[]) => {
      setSelectedFilesPerQuestion((prev) => ({
        ...prev,
        [questionNumber]: files,
      }));

      // Update Redux store
      dispatch(
        UPDATE_LISTENING_SUB_QUESTION({
          index: questionNumber - 1,
          field: "selectedAudioFiles",
          value: files.map((f) => f.name),
        })
      );
    },
    [dispatch]
  );

  const handleRemoveExistingAudio = useCallback(
    (questionNumber: number, url: string) => {
      setRemovedAudioUrlsPerQuestion((prev) => ({
        ...prev,
        [questionNumber]: [...(prev[questionNumber] || []), url],
      }));

      setExistingAudioUrlsPerQuestion((prev) => ({
        ...prev,
        [questionNumber]: (prev[questionNumber] || []).filter(
          (audioUrl) => audioUrl !== url
        ),
      }));
    },
    []
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    watch,
  } = useForm<FormData>();

  // Watch all form fields for real-time Redux sync
  const watchedFields = watch();

  // Sync form data to Redux store with optimization
  const prevFieldsRef = useRef<Partial<FormData>>({});
  const prevSubQuestionsRef = useRef<SubQuestionData[]>([]);

  // Memoize field configurations to prevent recreation
  const fieldConfigs = useMemo(
    () => [
      { key: "title" as keyof FormData, action: UPDATE_LISTENING_MAIN_DATA },
      { key: "content" as keyof FormData, action: UPDATE_LISTENING_MAIN_DATA },
      { key: "subTitle" as keyof FormData, action: UPDATE_LISTENING_MAIN_DATA },
    ],
    []
  );

  // Debounced update function to prevent excessive Redux updates
  const debouncedUpdate = useCallback(
    useMemo(() => {
      let timeoutId: NodeJS.Timeout;
      return (callback: () => void) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(callback, 100); // 100ms debounce
      };
    }, []),
    []
  );

  // Initialize store data once
  useEffect(() => {
    if (!listeningStore?.currentListeningData) {
      dispatch(RESET_LISTENING_DATA());
      dispatch(INIT_LISTENING_SUB_QUESTIONS({ count: 13 }));
      return;
    }
    if (listeningStore.currentListeningData.subQuestions.length !== 13) {
      dispatch(INIT_LISTENING_SUB_QUESTIONS({ count: 13 }));
    }
  }, [dispatch, listeningStore?.currentListeningData]);

  // Optimized form sync with debouncing
  useEffect(() => {
    if (!listeningStore?.currentListeningData?.subQuestions?.length) return;

    debouncedUpdate(() => {
      const updates: Array<() => void> = [];

      // Check main fields changes
      fieldConfigs.forEach(({ key, action }) => {
        if (
          watchedFields[key] !== undefined &&
          prevFieldsRef.current[key] !== watchedFields[key]
        ) {
          updates.push(() =>
            dispatch(
              action({
                field: key,
                value: watchedFields[key] || "",
              })
            )
          );
        }
      });

      // Check sub questions changes - batched updates
      for (let i = 0; i < 13; i++) {
        const num = i + 1;
        const subContentKey = `subContent${num}` as keyof FormData;
        const correctAnswerKey = `correctAnswer${num}` as keyof FormData;
        const subFileKey = `subFile${num}` as keyof FormData;
        const currentSubQ =
          listeningStore.currentListeningData.subQuestions[i] || {};
        const prevSubQ = prevSubQuestionsRef.current[i] || {};

        // Check content, correctAnswer, file changes
        [
          { key: subContentKey, field: "content" },
          { key: correctAnswerKey, field: "correctAnswer" },
          { key: subFileKey, field: "file" },
        ].forEach(({ key, field }) => {
          if (
            watchedFields[key] !== undefined &&
            prevSubQ[field as keyof SubQuestionData] !== watchedFields[key]
          ) {
            updates.push(() =>
              dispatch(
                UPDATE_LISTENING_SUB_QUESTION({
                  index: i,
                  field,
                  value: watchedFields[key] || "",
                })
              )
            );
          }
        });

        // Check answer list changes
        if (
          currentSubQ &&
          "answerList" in currentSubQ &&
          Array.isArray(currentSubQ.answerList)
        ) {
          const currentAnswerList = [...currentSubQ.answerList] as {
            content: string;
          }[];
          let answerChanged = false;
          [1, 2, 3].forEach((ansNum) => {
            const answerKey = `answer${ansNum}Sub${num}` as keyof FormData;
            if (
              watchedFields[answerKey] !== undefined &&
              currentAnswerList[ansNum - 1]?.content !==
                watchedFields[answerKey]
            ) {
              currentAnswerList[ansNum - 1] = {
                content: watchedFields[answerKey] || "",
              };
              answerChanged = true;
            }
          });

          if (answerChanged) {
            updates.push(() =>
              dispatch(
                UPDATE_LISTENING_SUB_QUESTION({
                  index: i,
                  field: "answerList",
                  value: currentAnswerList,
                })
              )
            );
          }
        }
      }

      // Execute all updates at once
      updates.forEach((update) => update());

      // Save current state for next comparison
      prevFieldsRef.current = { ...watchedFields };
      prevSubQuestionsRef.current =
        listeningStore.currentListeningData.subQuestions.map(
          (q: SubQuestionData) => ({
            content: q.content,
            correctAnswer: q.correctAnswer,
            file: q.file,
            suggestion: q.suggestion,
            answerList: q.answerList ? q.answerList.map((a) => ({ ...a })) : [],
          })
        );
    });
  }, [watchedFields, dispatch, listeningStore, fieldConfigs, debouncedUpdate]);

  // Optimized reset function
  const resetAllData = useCallback(() => {
    // Reset form
    reset();

    // Reset suggestions
    setSuggestions(Array(14).fill(""));

    // Reset file upload states
    setSelectedFilesPerQuestion({});
    setExistingAudioUrlsPerQuestion({});
    setRemovedAudioUrlsPerQuestion({});

    // Reset Redux store
    dispatch(RESET_LISTENING_DATA());
    dispatch(INIT_LISTENING_SUB_QUESTIONS({ count: 13 }));

    // Reset TextEditor components via events
    for (let i = 1; i <= 13; i++) {
      const editorElement = document.getElementById(`editor${i}`);
      if (editorElement) {
        const event = new CustomEvent("editorReset");
        editorElement.dispatchEvent(event);
      }
    }
  }, [reset, dispatch]);

  const onSubmit = useCallback(
    async (values: FormData) => {
      try {
        setIsUploading(true);

        // Upload audio files cho từng sub question
        const uploadedAudioUrls: { [key: number]: string } = {};

        // Process each question's audio files
        for (let questionNum = 1; questionNum <= 13; questionNum++) {
          const removedUrls = removedAudioUrlsPerQuestion[questionNum] || [];
          const selectedFiles = selectedFilesPerQuestion[questionNum] || [];
          const existingUrls = existingAudioUrlsPerQuestion[questionNum] || [];

          // Xóa các audio files cũ đã được đánh dấu xóa
          if (removedUrls.length > 0) {
            for (const audioUrl of removedUrls) {
              try {
                const key = audioUrl
                  .split("https://files.aptisacademy.com.vn/")
                  .pop();

                if (key) {
                  await R2UploadService.deleteFile(key);
                }
              } catch (deleteError) {
                console.error(
                  "❌ Failed to delete audio:",
                  audioUrl,
                  deleteError
                );
              }
            }
          }

          // Upload new audio files nếu có
          let finalAudioUrl = existingUrls[0] || ""; // Lấy existing file nếu có

          if (selectedFiles.length > 0) {
            const uploadResults = await R2UploadService.uploadMultipleFiles(
              selectedFiles,
              "listening"
            );

            if (
              uploadResults.metadata.successful &&
              uploadResults.metadata.successful.length > 0
            ) {
              finalAudioUrl = `https://files.aptisacademy.com.vn/${uploadResults.metadata.successful[0].key}`;
            }
          }

          uploadedAudioUrls[questionNum] = finalAudioUrl;
        }

        // Use data from Redux store instead of form values
        const data = {
          title: listeningStore?.currentListeningData?.title || values.title,
          timeToDo: 35,
          questions: {
            questionTitle:
              listeningStore?.currentListeningData?.subTitle || values.subTitle,
            content:
              listeningStore?.currentListeningData?.content || values.content,
            answerList: [],
            correctAnswer: "",
            file: null,
            subQuestionAnswerList: [],
            suggestion: null,
            subQuestion: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map(
              (num) => ({
                content:
                  listeningStore?.currentListeningData?.subQuestions?.[num - 1]
                    ?.content ||
                  values[`subContent${num}` as keyof FormData] ||
                  "",
                correctAnswer:
                  listeningStore?.currentListeningData?.subQuestions?.[num - 1]
                    ?.correctAnswer ||
                  values[`correctAnswer${num}` as keyof FormData] ||
                  "",
                file: uploadedAudioUrls[num] || "",
                answerList:
                  listeningStore?.currentListeningData?.subQuestions?.[num - 1]
                    ?.answerList ||
                  [1, 2, 3].map((ansNum) => ({
                    content:
                      values[`answer${ansNum}Sub${num}` as keyof FormData] ||
                      "",
                  })),
                image: null,
                suggestion: suggestions[num] || "",
              })
            ),
            isExample: false,
            image: null,
          },
          questionType: "LISTENING",
          questionPart: "ONE",
          description: null,
        };

        if (statusHandler === "create") {
          await createListeningPartOne(data);
          resetAllData();
        }
        if (statusHandler === "edit") {
          await updateListeningPartOne(data);
        }

        // Reset file upload states sau khi submit thành công
        setSelectedFilesPerQuestion({});
        setRemovedAudioUrlsPerQuestion({});
      } catch (error) {
        console.error("Error uploading files:", error);
        await notify("Lỗi upload file: " + error, {
          type: "error",
        });
      } finally {
        setIsUploading(false);
      }
    },
    [
      listeningStore,
      suggestions,
      statusHandler,
      resetAllData,
      selectedFilesPerQuestion,
      existingAudioUrlsPerQuestion,
      removedAudioUrlsPerQuestion,
      notify,
    ]
  );

  const createListeningPartOne = useCallback(
    async (data: any) => {
      try {
        await baseDataProvider.create("listenings", { data });
        await notify(UPDATED_SUCCESS, {
          type: "success",
        });
      } catch (error) {
        console.log({ error });
      }
    },
    [notify]
  );

  const updateListeningPartOne = useCallback(
    async (values: any) => {
      try {
        await dataProvider.update("listenings", {
          id: dataListeningPartOne?.id,
          data: values,
          previousData: dataListeningPartOne,
        });

        await notify(UPDATED_SUCCESS, {
          type: "success",
        });
        navigate("/listenings");
      } catch (error) {
        notify("エラー: 生産管理の更新に失敗しました: " + error, {
          type: "warning",
        });
      }
    },
    [dataListeningPartOne, notify, navigate]
  );

  // Load data for edit mode
  useEffect(() => {
    if (dataListeningPartOne) {
      setValue("title", dataListeningPartOne.title);
      setValue("content", dataListeningPartOne.questions[0].content);
      setValue("subTitle", dataListeningPartOne.questions[0].questionTitle);

      // Update Redux store
      dispatch(
        UPDATE_LISTENING_MAIN_DATA({
          field: "title",
          value: dataListeningPartOne.title,
        })
      );
      dispatch(
        UPDATE_LISTENING_MAIN_DATA({
          field: "content",
          value: dataListeningPartOne.questions[0].content,
        })
      );
      dispatch(
        UPDATE_LISTENING_MAIN_DATA({
          field: "subTitle",
          value: dataListeningPartOne.questions[0].questionTitle,
        })
      );

      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].forEach((num) => {
        const subQuestion =
          dataListeningPartOne.questions[0].subQuestion[num - 1];
        if (subQuestion) {
          setValue(`subContent${num}` as keyof FormData, subQuestion.content);
          setValue(
            `correctAnswer${num}` as keyof FormData,
            subQuestion.correctAnswer
          );
          setValue(`subFile${num}` as keyof FormData, subQuestion.file);

          // Set existing audio URL if available
          if (subQuestion.file) {
            setExistingAudioUrlsPerQuestion((prev) => ({
              ...prev,
              [num]: [subQuestion.file],
            }));
          }

          // Update Redux store
          dispatch(
            UPDATE_LISTENING_SUB_QUESTION({
              index: num - 1,
              field: "content",
              value: subQuestion.content,
            })
          );
          dispatch(
            UPDATE_LISTENING_SUB_QUESTION({
              index: num - 1,
              field: "correctAnswer",
              value: subQuestion.correctAnswer,
            })
          );
          dispatch(
            UPDATE_LISTENING_SUB_QUESTION({
              index: num - 1,
              field: "file",
              value: subQuestion.file,
            })
          );

          handleSuggestionChange(num, subQuestion.suggestion);

          // Load answer options
          if (subQuestion.answerList) {
            subQuestion.answerList.forEach((answer, index) => {
              setValue(
                `answer${index + 1}Sub${num}` as keyof FormData,
                answer.content
              );
            });

            dispatch(
              UPDATE_LISTENING_SUB_QUESTION({
                index: num - 1,
                field: "answerList",
                value: subQuestion.answerList,
              })
            );
          }
        }
      });
    }
  }, [dataListeningPartOne, setValue, dispatch, handleSuggestionChange]);

  // Memoize questions array to prevent recreation
  const questionNumbers = useMemo(
    () => Array.from({ length: 13 }, (_, i) => i + 1),
    []
  );

  return (
    <div style={{ position: "relative", height: "100vh" }}>
      {/* Loading Progress Bar */}
      {isUploading && (
        <Box
          sx={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 9999 }}
        >
          <LinearProgress
            color="primary"
            sx={{
              height: 4,
              background: "linear-gradient(90deg, #1976d2, #42a5f5)",
            }}
          />
        </Box>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="form sign-up-form relative max-h-[calc(100vh-200px)] overflow-auto"
      >
        <h2 className="title">Listening Part 1 - Optimized</h2>

        {/* Main form fields */}
        <div style={{ marginBottom: "16px" }}>
          <TextField
            {...register("title", { required: true })}
            placeholder="Title"
            variant="outlined"
            fullWidth
            error={!!errors.title}
            helperText={errors.title ? "This field is required" : ""}
          />
        </div>

        <div style={{ marginBottom: "16px" }}>
          <TextField
            {...register("subTitle", { required: true })}
            placeholder="Sub Title"
            variant="outlined"
            fullWidth
            error={!!errors.subTitle}
            helperText={errors.subTitle ? "This field is required" : ""}
          />
        </div>

        <div style={{ marginBottom: "16px" }}>
          <TextField
            {...register("content", { required: true })}
            placeholder="Content"
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            error={!!errors.content}
            helperText={errors.content ? "This field is required" : ""}
          />
        </div>

        {/* Questions Grid - Optimized with memoized array */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
            gap: "20px",
            marginTop: "20px",
          }}
        >
          {questionNumbers.map((num) => (
            <QuestionBox
              key={num}
              questionNumber={num}
              register={register}
              errors={errors}
              suggestion={suggestions[num]}
              setSuggestion={(value: string) =>
                handleSuggestionChange(num, value)
              }
              num={num}
              selectedFiles={selectedFilesPerQuestion[num] || []}
              existingAudioUrls={existingAudioUrlsPerQuestion[num] || []}
              onFilesChange={(files: File[]) => handleFilesChange(num, files)}
              onRemoveExistingAudio={(url: string) =>
                handleRemoveExistingAudio(num, url)
              }
            />
          ))}
        </div>

        {/* Action buttons */}
        <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
          {showSaveButton && (
            <button
              type="submit"
              style={{
                padding: "10px 20px",
                backgroundColor: "#1976d2",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Save
            </button>
          )}
          {showCancelButton && handleCancel && (
            <button
              type="button"
              onClick={handleCancel}
              style={{
                padding: "10px 20px",
                backgroundColor: "#f44336",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          )}
        </Stack>
      </form>
    </div>
  );
};

export default ListeningPartOneOptimized;
