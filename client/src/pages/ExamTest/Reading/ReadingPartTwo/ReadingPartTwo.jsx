import { Box, Button, Typography } from "@mui/material";
import React from "react";
import "./ReadingPartTwo.css";
import DragHandleIcon from "@mui/icons-material/DragHandle";

const ReadingPartTwo = () => {
  return (
    <>
      <Box>
        <Box sx={{ fontWeight: "400",fontSize:'16px' }}>
          <strong>
            The sentences below are from a report. Put the sentences in the
            right order. The first sentence is done for you.&nbsp;
          </strong>
        </Box>
        <Box
          sx={{
            border: "1px solid var(--secondary-400, #b0b0b0) !important",
            display: "flex",
            maxWidth: "fit-content",
            marginTop: "1rem",
          }}
        >
          <Box className=" box-right">
            <Box
              sx={{
                fontFamily: "Inter, sans-serif !important",
                fontSize: "15px",
              }}
            >
              <strong>Signs on the coast road</strong>
            </Box>
            <Box>
              <p>
                This report gives information about the traffic problems on the
                coast road.
              </p>
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <Box
                sx={{
                  width: "400px",
                  maxWidth: "400xx",
                  border: "2px dashed #939393",
                  minHeight: "2.5em",
                  backgroundColor: "#F4F6F9",
                  borderRadius: "2px",
                }}
              ></Box>
              <Box
                sx={{
                  width: "400px",
                  maxWidth: "400xx",
                  border: "2px dashed #939393",
                  minHeight: "2.5em",
                  backgroundColor: "#F4F6F9",
                  borderRadius: "2px",
                }}
              ></Box>
              <Box
                sx={{
                  width: "400px",
                  maxWidth: "400xx",
                  border: "2px dashed #939393",
                  minHeight: "2.5em",
                  backgroundColor: "#F4F6F9",
                  borderRadius: "2px",
                }}
              ></Box>
              <Box
                sx={{
                  width: "400px",
                  maxWidth: "400xx",
                  border: "2px dashed #939393",
                  minHeight: "2.5em",
                  backgroundColor: "#F4F6F9",
                  borderRadius: "2px",
                }}
              ></Box>
              <Box
                sx={{
                  width: "400px",
                  maxWidth: "400xx",
                  border: "2px dashed #939393",
                  minHeight: "2.5em",
                  backgroundColor: "#F4F6F9",
                  borderRadius: "2px",
                }}
              ></Box>
            </Box>
          </Box>

          <Box
            className="box-left"
            sx={{
              backgroundColor: "#F4F6F9",
              minWidth: "279px",
              height: "auto",
              padding: "14px",
              overflowY: "hidden",

              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
            }}
          >
            {/* // box element */}
            <Box
              sx={{
                width: "250px",
                height: "100px",
                border: "1px solid #939393",
                backgroundColor: "#fff",
                borderRadius: "2px",
              }}
            >
              <Box sx={{ textAlign: "center" }}>
                <DragHandleIcon />
              </Box>

              <Box
                sx={{ textAlign: "left", fontSize: "14px", padding: "7px 9px" }}
              >
                For this reason it is easy for them to take a wrong turn and get
                lost.
              </Box>
            </Box>

            <Box
              sx={{
                width: "250px",
                height: "100px",
                border: "1px solid #939393",
                backgroundColor: "#fff",
                borderRadius: "2px",
              }}
            >
              <Box sx={{ textAlign: "center" }}>
                <DragHandleIcon />
              </Box>

              <Box
                sx={{ textAlign: "left", fontSize: "14px", padding: "7px 9px" }}
              >
                For this reason it is easy for them to take a wrong turn and get
                lost.
              </Box>
            </Box>
            <Box
              sx={{
                width: "250px",
                height: "100px",
                border: "1px solid #939393",
                backgroundColor: "#fff",
                borderRadius: "2px",
              }}
            >
              <Box sx={{ textAlign: "center" }}>
                <DragHandleIcon />
              </Box>

              <Box
                sx={{ textAlign: "left", fontSize: "14px", padding: "7px 9px" }}
              >
                For this reason it is easy for them to take a wrong turn and get
                lost.
              </Box>
            </Box>
            <Box
              sx={{
                width: "250px",
                height: "100px",
                border: "1px solid #939393",
                backgroundColor: "#fff",
                borderRadius: "2px",
              }}
            >
              <Box sx={{ textAlign: "center" }}>
                <DragHandleIcon />
              </Box>

              <Box
                sx={{ textAlign: "left", fontSize: "14px", padding: "7px 9px" }}
              >
                For this reason it is easy for them to take a wrong turn and get
                lost.
              </Box>
            </Box>
            <Box
              sx={{
                width: "250px",
                height: "100px",
                border: "1px solid #939393",
                backgroundColor: "#fff",
                borderRadius: "2px",
              }}
            >
              <Box sx={{ textAlign: "center" }}>
                <DragHandleIcon />
              </Box>

              <Box
                sx={{ textAlign: "left", fontSize: "14px", padding: "7px 9px" }}
              >
                For this reason it is easy for them to take a wrong turn and get
                lost.
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default ReadingPartTwo;
