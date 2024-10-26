import { Box, Button } from "@mui/material";
import React from "react";
import ListIcon from "@mui/icons-material/List";
import InfoIcon from "@mui/icons-material/Info";
import SettingsIcon from "@mui/icons-material/Settings";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import TrendingFlatIcon from "@mui/icons-material/TrendingFlat";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import ExamReading from "./Reading/ExamReading.jsx";
import "./RoomExam.css";
import { useDispatch, useSelector } from "react-redux";
import { SET_DECREMENT, SET_INCREMENT } from "../../store/feature/reading.js";

const RoomExam = () => {
  const currentExamPart = useSelector(
    (state) => state.generalStore.currentExamPart
  );
  const numberQuestion = useSelector(
    (state) => state.readingStore.numberQuestion
  );
  const dispatch = useDispatch();

  const nextQuestion = () => {
    if (numberQuestion < 5 && currentExamPart === "reading") {
      dispatch(SET_INCREMENT());
    }
  };
  const previousQuestion = () => {
    if (numberQuestion > 1 && currentExamPart === "reading") {
      dispatch(SET_DECREMENT());
    }
  };
  return (
    <>
      <Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "end",
            alignItems: "center",
            padding: "1rem",
            height: "3.75rem",
            width: "100%",
            // position: 'absolute',
            // top: 0,
            // right: 0,
            backgroundColor: "#fff",
            position: "fixed",
            zIndex: 1000,
          }}
        >
          <Box
            sx={{
              position: "fixed !important",
            }}
          >
            Time remaining: 00:00:00
          </Box>
        </Box>

        <ExamReading />

        {/* Fottter */}

        <Box className=" footer-test">
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                border: "1px solid var(--secondary-400, #b0b0b0)",
                boxSizing: "border-box",
                width: "45px",
                height: "45px",
                textAlign: "center",
                verticalAlign: "baseline",
                outline: "none",
                cursor: "pointer",
                borderRadius: "6px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
              }}
            >
              <ListIcon
                sx={{ fontSize: " calc(1.75rem ) !important" }}
              ></ListIcon>
            </Box>
            <Box
              sx={{
                border: "1px solid var(--secondary-400, #b0b0b0)",
                boxSizing: "border-box",
                width: "45px",
                height: "45px",
                textAlign: "center",
                verticalAlign: "baseline",
                outline: "none",
                cursor: "pointer",
                borderRadius: "6px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
              }}
            >
              <InfoIcon sx={{ fontSize: " calc(1.25rem ) !important" }} />
            </Box>
            <Box
              sx={{
                border: "1px solid var(--secondary-400, #b0b0b0)",
                boxSizing: "border-box",
                width: "45px",
                height: "45px",
                textAlign: "center",
                verticalAlign: "baseline",
                outline: "none",
                cursor: "pointer",
                borderRadius: "6px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
              }}
            >
              <SettingsIcon></SettingsIcon>
            </Box>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                border: "1px solid var(--secondary-400, #b0b0b0)",
                boxSizing: "border-box",
                width: "45px",
                height: "45px",
                textAlign: "center",
                verticalAlign: "baseline",
                outline: "none",
                cursor: "pointer",
                borderRadius: "6px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
              }}
            >
              <ExitToAppIcon fontSize="medium"></ExitToAppIcon>
            </Box>

            <Button
              variant="outlined"
              sx={{ color: "#45368f", padding: "0.5rem 1rem" }}
              onClick={previousQuestion}
            >
              <KeyboardBackspaceIcon sx={{ marginRight: "5px" }} /> Previous
            </Button>

            <Button
              variant="contained"
              className="pt-3  shadow mr-1"
              sx={{ backgroundColor: "#45368f", padding: "0.5rem 1rem" }}
              onClick={nextQuestion}
            >
              Next <TrendingFlatIcon></TrendingFlatIcon>
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default RoomExam;
