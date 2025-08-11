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
import { useNavigate } from "react-router-dom";

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

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleCancel = () => {
    navigate("/speakings");
  };

  const handleOpenPreview = () => {
    setPreviewModalOpen(true);
  };

  const handleClosePreview = () => {
    setPreviewModalOpen(false);
  };

  return (
    <>
      <Box sx={{ width: "100%" }}>
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
        <div style={{ width: "100%", height: "100%", overflow: "auto", background: "#fff" }}>
          <FrameRoomExam
            currentExamPart="speaking"
            isDisabled={false}
            hours={0}
            minutes={30}
            seconds={0}
            isSpeakingTaiLieu={true}
            isScreenTaiLieu={false}
            startRecord={() => console.log("Start recording")}
            stopRecording={() => console.log("Stop recording")}
            finishRecording={() => console.log("Finish recording")}
          >
            {/* <div
              style={{
                padding: "20px",
                marginTop: "60px",
                background: "#f5f5f5",
                borderRadius: "8px",
              }}
            >
              <h3 style={{ marginBottom: "16px", color: "#333" }}>
                Nội dung bài thi Speaking
              </h3>
              <p style={{ lineHeight: "1.6", color: "#666" }}>
                Đây là nơi hiển thị nội dung bài thi speaking cho học sinh. Giao
                diện này sẽ bao gồm timer, nút record, và các chức năng khác mà
                học sinh sẽ sử dụng trong quá trình làm bài.
              </p>
              <div
                style={{
                  marginTop: "20px",
                  padding: "16px",
                  background: "#e8f4fd",
                  borderRadius: "4px",
                }}
              >
                <h4 style={{ margin: "0 0 8px 0", color: "#1976d2" }}>
                  Hướng dẫn:
                </h4>
                <ul style={{ margin: 0, paddingLeft: "20px", color: "#555" }}>
                  <li>Nhấn nút Record để bắt đầu ghi âm</li>
                  <li>Theo dõi thời gian còn lại ở góc trên</li>
                  <li>Sử dụng các nút điều hướng để chuyển câu hỏi</li>
                </ul>
              </div>
            </div> */}
          </FrameRoomExam>
        </div>
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleClosePreview}
            sx={{ px: 4 }}
          >
            Đóng xem trước
          </Button>
        </div>
      </ModalBasic>
    </>
  );
}
