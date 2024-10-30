import { Create, PasswordInput, SelectInput, TextInput } from "react-admin";
import { userRoles } from "../../consts/user";

import CustomForm from "../../components/CustomForm";
import { BaseComponentProps } from "../../types/general";
import { validateUserCreation } from "./formValidator";
import { Box, Typography, Button } from "@mui/material";
import ReadingIcon from "../../assets/img/reading-icon.svg";
import ListeningIcon from "../../assets/img/listening-icon.svg";
import SpeakingIcon from "../../assets/img/speaking-icon.svg";
import WritingIcon from "../../assets/img/writing-icon.svg";
import { styled } from "@mui/system";
import { useState } from "react";
import ModalFrame from "../../components/ModalBase/ModalFrame";
import ReadingBank from "./Reading/ReadingBank";

const ModuleContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: "#f3f3f3",
  borderBottom: "1px solid #d5d5d5",
  display: "flex",
  alignItems: "center",
}));

const ModuleItem = styled(Box)(({ color }) => ({
  width: "16.42%",
  textAlign: "center",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "13px",
}));

const TestContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2, 2),
  display: "flex",
  gap: 4,
  backgroundColor: "#fff",
  "&:nth-of-type(odd)": {
    backgroundColor: "#f3f3f3",
  },
}));

const TestTitle = styled(Typography)(({ theme }) => ({
  color: "#284664",
  fontSize: "1.3rem", // equivalent to text-sm
  textTransform: "uppercase",
  letterSpacing: "0.17px",
  width: "fit-content",
  paddingTop: theme.spacing(1.25),
  paddingLeft: theme.spacing(2.5),
  paddingRight: theme.spacing(2.5),
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
}));

const TestButton = styled(Button)(({ bgColor }) => ({
  height: "32px",
  width: "100px",
  margin: "0 auto",
  marginBottom: "14px",
  fontSize: "0.875rem", // equivalent to text-[9px]
  fontWeight: "bold",
  letterSpacing: "0.5px",
  backgroundColor: bgColor,
  color: "#fff",
  "&:hover": {
    opacity: 0.9,
  },
}));

const tests = [
  {
    partId: 1,
    title: "PART 1",
    colors: ["#d1e077", "#32b4c8", "#327844", "#faab5a", "#c86478"],
  },
  {
    partId: 2,
    title: "PART 2",
    colors: ["#d1e077", "#32b4c8", "#327844", "#faab5a", "#c86478"],
  },
  {
    partId: 3,
    title: "PART 3",
    colors: ["#d1e077", "#32b4c8", "#327844", "#faab5a", "#c86478"],
  },
  {
    partId: 4,
    title: "PART 4",
    colors: ["#d1e077", "#32b4c8", "#327844", "#faab5a", "#c86478"],
  },
  {
    partId: 5,
    title: "PART 5",
    colors: ["#d1e077", "#32b4c8", "#327844", "#faab5a", "#c86478"],
  },
];

const TestBankCreate = ({ resource }: BaseComponentProps) => {
  const resourcePath = `/${resource}`;

  const [isOpenModalFrame, setIsOpenModalFrame] = useState(false);
  const [partSkill, setPartSkill] = useState(null);
  const [typeSkill, setTypeSkill] = useState(null);

  const FilterSkill = (index: number) => {
    switch (index) {
      case 1:
        return "Grammar";
      case 2:
        return "Listening";
      case 3:
        return "Writing";
      case 4:
        return "Reading";
      case 5:
        return "Speaking";
      default:
        return "";
    }
  };

  const handleChooseTest = (partId, index) => {
    console.log(partId, index);

    setPartSkill(partId);
    setTypeSkill(FilterSkill(index));

    openModalCreateFrame();
  };
  const closeModalCreateFrame = () => {
    setIsOpenModalFrame(false);
  };
  const openModalCreateFrame = () => {
    setIsOpenModalFrame(true);
  };

  return (
    <Create redirect="list" title="管理ユーザー管理　新規作成">
      <Box>
        <ModuleContainer>
          <Box sx={{ width: "150px" }}>
            <Typography
              variant="h6"
              component="div"
              sx={{
                color: "#284664",
                fontWeight: "bold",
                textTransform: "uppercase",
                letterSpacing: "1.6px",
              }}
            >
              Bộ đề thi
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexGrow: 1,
              gap: 4,
            }}
          >
            {[
              { color: "#d1e077", icon: ReadingIcon, label: "Grammar" },
              { color: "#32b4c8", icon: ListeningIcon, label: "Listening" },
              { color: "#327844", icon: WritingIcon, label: "Writing" },
              { color: "#faab5a", icon: ReadingIcon, label: "Reading" },
              { color: "#c86478", icon: SpeakingIcon, label: "Speaking" },
            ].map((module, index) => (
              <ModuleItem key={index} color={module.color}>
                <img
                  alt={module.label.toLowerCase()}
                  loading="lazy"
                  width="38"
                  height="30"
                  src={module.icon}
                />
                <Typography
                  variant="caption"
                  component="div"
                  sx={{
                    color: module.color,
                    fontWeight: "bold",
                    textTransform: "uppercase",
                    letterSpacing: "2.75px",
                  }}
                >
                  {module.label}
                </Typography>
              </ModuleItem>
            ))}
          </Box>
        </ModuleContainer>
        <Box>
          {tests.map((test) => (
            <TestContainer key={test.partId}>
              <Box sx={{ width: "140px" }}>
                <TestTitle>{test.title}</TestTitle>
              </Box>

              {test.colors.map((color, index) => (
                <Box
                  key={index}
                  sx={{ width: "16.42%", textAlign: "center", paddingX: 1 }}
                >
                  <TestButton
                    variant="contained"
                    sx={{ width: "fit-content", backgroundColor: color }}
                    onClick={() => {
                      handleChooseTest(test.partId, index + 1);
                    }}
                  >
                    Check Test
                  </TestButton>
                </Box>
              ))}
            </TestContainer>
          ))}
        </Box>
        <ModalFrame
          open={isOpenModalFrame}
          closeModalEdit={closeModalCreateFrame}
          label={`${typeSkill} - Part ${partSkill}`}
        >
          <>{typeSkill && typeSkill === "Reading" && <ReadingBank partSkill={partSkill} />}</>
        </ModalFrame>
      </Box>
    </Create>
  );
};

export default TestBankCreate;
