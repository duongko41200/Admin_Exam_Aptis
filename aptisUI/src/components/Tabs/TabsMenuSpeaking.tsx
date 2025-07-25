import * as React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import ReadingPartOne from "../../pages/Speaking/SpeakingPart/ReadingPartOne";
import ReadingPartTwo from "../../pages/Speaking/SpeakingPart/ReadingPartTwo";
import SpeakingPartThree from "../../pages/Speaking/SpeakingPart/SpeakingPartThree";
import SpeakingPartFour from "../../pages/Speaking/SpeakingPart/SpeakingPartFour";
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
  const navigate = useNavigate();
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const handleCancel = () => {
    navigate("/speakings");
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
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
      </Box>
      <CustomTabPanel value={value} index={0}>
        <ReadingPartOne showDeleteButton={false} handleCancel={handleCancel} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <ReadingPartTwo showDeleteButton={false} handleCancel={handleCancel} />
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
  );
}
