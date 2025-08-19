import { Button } from "@mui/material";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import PropTypes from "prop-types";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ListeningPartFour from "../../pages/Listening/ListeningPart/ListeningPartFour";
import ListeningPartOne from "../../pages/Listening/ListeningPart/ListeningPartOne";
import ListeningPartThree from "../../pages/Listening/ListeningPart/ListeningPartThree";
import ListeningPartTwo from "../../pages/Listening/ListeningPart/ListeningPartTwo";
import {
  SET_RESET_NUMBER_QUESTION_LISTENING,
  SET_NUMBER_QUESTION_LISTENING,
  SET_INCREMENT_LISTENING_EACH_PART,
  SET_DECREMENT_LISTENING_EACH_PART,
} from "../../store/feature/listening";
import ExamListening from "../ExamTest/Listening/ExamListening";
import FrameRoomExam from "../FrameRoomExam";
import ModalBasic from "../Modal/ModalBasic";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function BasicTabs() {
  const [value, setValue] = React.useState(0);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [previewModalOpen, setPreviewModalOpen] = React.useState(false);

  const handleChange = (event, newValue) => {
    setValue(newValue);

    // Set number question for preview logic, similar to writing
    if (newValue === 0) {
      dispatch(SET_NUMBER_QUESTION_LISTENING(1));
    }
    if (newValue === 1) {
      dispatch(SET_NUMBER_QUESTION_LISTENING(2));
    }
    if (newValue === 2) {
      dispatch(SET_NUMBER_QUESTION_LISTENING(3));
    }
    if (newValue === 3) {
      dispatch(SET_NUMBER_QUESTION_LISTENING(4));
    }
  };
  const handleCancel = () => {
    navigate("/listenings");
  };
  const handleOpenPreview = () => {
    dispatch(SET_RESET_NUMBER_QUESTION_LISTENING());
    setPreviewModalOpen(true);
  };

  const handleClosePreview = () => {
    setPreviewModalOpen(false);
  };

  // Navigation functions for Listening preview
  const numberQuestion = useSelector(
    (state: any) => state.listeningStore.numberQuestion
  );
  const numberQuestionEachPart = useSelector(
    (state: any) => state.listeningStore.numberQuestionEachPart
  );

  const getMaxQuestionsForPart = (part) => {
    switch (part) {
      case 1:
        return 13;
      case 2:
        return 1;
      case 3:
        return 1;
      case 4:
        return 2;
      default:
        return 1;
    }
  };

  const nextQuestion = () => {
    const maxQuestions = getMaxQuestionsForPart(numberQuestion);
    if (numberQuestionEachPart < maxQuestions) {
      dispatch(SET_INCREMENT_LISTENING_EACH_PART());
    } else {
      // Move to next part if available
      if (numberQuestion < 4) {
        dispatch(SET_NUMBER_QUESTION_LISTENING(numberQuestion + 1));
        dispatch(SET_RESET_NUMBER_QUESTION_LISTENING());
      }
    }
  };

  const previousQuestion = () => {
    if (numberQuestionEachPart > 1) {
      dispatch(SET_DECREMENT_LISTENING_EACH_PART());
    } else {
      // Move to previous part if available
      if (numberQuestion > 1) {
        dispatch(SET_NUMBER_QUESTION_LISTENING(numberQuestion - 1));
        // Set to last question of previous part
        const prevPartMaxQuestions = getMaxQuestionsForPart(numberQuestion - 1);
        dispatch(SET_RESET_NUMBER_QUESTION_LISTENING());
        // Need to set to max questions of previous part
        for (let i = 1; i < prevPartMaxQuestions; i++) {
          dispatch(SET_INCREMENT_LISTENING_EACH_PART());
        }
      }
    }
  };

  const moveExamSkill = () => {
    // Logic to move to next skill or finish exam
    console.log("Move to next skill");
  };

  return (
    <>
      <Box
        sx={{
          width: "100%",
        }}
      >
        <Box
          sx={{
            borderBottom: 1,
            borderColor: "divider",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
          >
            <Tab label="Part 1" {...a11yProps(0)} />
            <Tab label="Part 2" {...a11yProps(1)} />
            <Tab label="Part 3" {...a11yProps(2)} />
            <Tab label="Part 4" {...a11yProps(3)} />
          </Tabs>
          <Button
            variant="contained"
            color="primary"
            onClick={handleOpenPreview}
            sx={{ mr: 2 }}
          >
            Xem trước
          </Button>
        </Box>
        <CustomTabPanel value={value} index={0}>
          <ListeningPartOne
            showDeleteButton={false}
            handleCancel={handleCancel}
          />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <ListeningPartTwo
            showDeleteButton={false}
            handleCancel={handleCancel}
          />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={2}>
          <ListeningPartThree
            showDeleteButton={false}
            handleCancel={handleCancel}
          />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={3}>
          <ListeningPartFour
            showDeleteButton={false}
            handleCancel={handleCancel}
          />
        </CustomTabPanel>
      </Box>
      <ModalBasic
        open={previewModalOpen}
        handleClose={handleClosePreview}
        label="Xem trước bài thi"
        subLabel="Đây là giao diện bài thi mà học sinh sẽ thấy"
        size="large"
        draggable={true}
        resizable={true}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            overflow: "auto",
            background: "#fff",
            position: "relative",
          }}
        >
          <FrameRoomExam
            currentExamPart="listening"
            isDisabled={false}
            hours={0}
            minutes={0}
            seconds={0}
            isSpeakingTaiLieu={true}
            isScreenTaiLieu={false}
            startRecord={() => console.log("Start recording")}
            stopRecording={() => console.log("Stop recording")}
            finishRecording={() => console.log("Finish recording")}
            nextQuestion={nextQuestion}
            previousQuestion={previousQuestion}
            moveExamSkill={moveExamSkill}
          >
            <ExamListening />
          </FrameRoomExam>
        </div>
      </ModalBasic>
    </>
  );
}
