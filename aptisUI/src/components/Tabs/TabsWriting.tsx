import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import PropTypes from "prop-types";
import * as React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import WritingPartFour from "../../pages/Writing/WritingPart/WritingPartFour";
import WritingPartOne from "../../pages/Writing/WritingPart/WritingPartOne";
import WritingPartThree from "../../pages/Writing/WritingPart/WritingPartThree";
import WritingPartTwo from "../../pages/Writing/WritingPart/WritingPartTwo";
import {
  SET_RESET_NUMBER_QUESTION_WRITING,
  SET_NUMBER_QUESTION_WRITING,
} from "../../store/feature/writing";
import ExamWriting from "../ExamTest/Writing/ExamWriting";
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

    if (newValue === 0) {
      dispatch(SET_NUMBER_QUESTION_WRITING(1));
    }
    if (newValue === 1) {
      dispatch(SET_NUMBER_QUESTION_WRITING(2));
    }
    if (newValue === 2) {
      dispatch(SET_NUMBER_QUESTION_WRITING(3));
    }
    if (newValue === 3) {
      dispatch(SET_NUMBER_QUESTION_WRITING(4));
    }
  };
  const handleCancel = () => {
    navigate("/writings");
  };

  const handleOpenPreview = () => {
    dispatch(SET_RESET_NUMBER_QUESTION_WRITING());
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
          <WritingPartOne
            showDeleteButton={false}
            handleCancel={handleCancel}
          />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <WritingPartTwo
            showDeleteButton={false}
            handleCancel={handleCancel}
          />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={2}>
          <WritingPartThree handleCancel={handleCancel} />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={3}>
          <WritingPartFour handleCancel={handleCancel} />
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
            currentExamPart="writing"
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
            <ExamWriting />
          </FrameRoomExam>
        </div>
      </ModalBasic>
    </>
  );
}
