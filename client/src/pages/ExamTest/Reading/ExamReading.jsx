import { Box } from "@mui/material";
import React from "react";
import "./ExamReading.css";
import ReadingPartOne from "./ReadingPartOne/ReadingPartOne";
import { useDispatch, useSelector } from "react-redux";
import ReadingPartTwo from "./ReadingPartTwo/ReadingPartTwo";
import ReadingPartThree from "./ReadingPartThree/ReadingPartThree";
import ReadingPartFour from "./ReadingPartFour/ReadingPartFour";

const ExamReading = () => {
  const numberQuestion = useSelector(
    (state) => state.readingStore.numberQuestion
  );

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          // padding: "1rem",
          marginBottom: "4rem",
          
        }}
        className="fluid"
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "start",
            width: "fit-content",
            marginTop: "3.25rem",
            padding:'1rem'
          }}
        >
          <Box
            sx={{
              fontWeight: "600",
              fontSize: "1.275rem",
            }}
          >
            Reading
          </Box>
          <Box>
            <Box className="row">
              <Box
                style={{
                  marginBottom: "1.5em",
                  marginTop: 0,
                  fontWeight: "600",
                  fontSize: "1.275rem",
                }}
              >
                Question {numberQuestion} of 5
              </Box>
            </Box>
          </Box>
          {numberQuestion && numberQuestion === 1 && <ReadingPartOne />}
          {numberQuestion && numberQuestion === 2 && <ReadingPartTwo />}
          {numberQuestion && numberQuestion === 3 && <ReadingPartThree />}
          {numberQuestion && numberQuestion === 4 && <ReadingPartFour />}
        </Box>
      </Box>
    </>
  );
};

export default ExamReading;
