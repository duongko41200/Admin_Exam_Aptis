import * as React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ReadingPartOne from "../../pages/Speaking/SpeakingPart/ReadingPartOne";
import ReadingPartTwo from "../../pages/Speaking/SpeakingPart/ReadingPartTwo";
import SpeakingPartThree from "../../pages/Speaking/SpeakingPart/SpeakingPartThree";
import SpeakingPartFour from "../../pages/Speaking/SpeakingPart/SpeakingPartFour";
import FrameRoomExam from "../FrameRoomExam";
import ModalBasic from "../Modal/ModalBasic";
import { useNavigate, useLocation } from "react-router-dom";
import ExamSpeaking from "../ExamTest/Speaking/ExamSpeaking";
import { useDispatch } from "react-redux";
import {
  SET_NUMBER_OF_QUESTIONS,
  SET_RESET_NUMBER_QUESTION_SPEAKING,
} from "../../store/feature/speaking";

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
  const [previewModalOpen, setPreviewModalOpen] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  // Đóng modal khi chuyển route
  React.useEffect(() => {
    setPreviewModalOpen(false);
  }, [location.pathname]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    if (newValue === 0) {
      dispatch(SET_NUMBER_OF_QUESTIONS(1));
    }
    if (newValue === 1) {
      dispatch(SET_NUMBER_OF_QUESTIONS(2));
    }
    if (newValue === 2) {
      dispatch(SET_NUMBER_OF_QUESTIONS(3));
    }
    if (newValue === 3) {
      dispatch(SET_NUMBER_OF_QUESTIONS(4));
    }
  };

  const handleCancel = () => {
    navigate("/speakings");
  };

  const handleOpenPreview = () => {
    dispatch(SET_RESET_NUMBER_QUESTION_SPEAKING());
    setPreviewModalOpen(true);
  };

  const handleClosePreview = () => {
    setPreviewModalOpen(false);
  };

  return (
    <>
      <Box
        sx={{
          width: "100%",
          overflow: "auto",
          maxHeight: "calc(100vh - 70px)",
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
          <ReadingPartOne
            showDeleteButton={false}
            handleCancel={handleCancel}
          />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <ReadingPartTwo
            showDeleteButton={false}
            handleCancel={handleCancel}
          />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={2}>
          <SpeakingPartThree
            showDeleteButton={false}
            handleCancel={handleCancel}
          />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={3}>
          <SpeakingPartFour
            showDeleteButton={false}
            handleCancel={handleCancel}
          />
        </CustomTabPanel>
      </Box>

      {/* Modal xem trước */}
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
            currentExamPart="speaking"
            isDisabled={false}
            hours={0}
            minutes={0}
            seconds={0}
            isSpeakingTaiLieu={true}
            isScreenTaiLieu={false}
            startRecord={() => console.log("Start recording")}
            stopRecording={() => console.log("Stop recording")}
            finishRecording={() => console.log("Finish recording")}
          >
            <ExamSpeaking />
          </FrameRoomExam>
        </div>
      </ModalBasic>
    </>
  );
}
