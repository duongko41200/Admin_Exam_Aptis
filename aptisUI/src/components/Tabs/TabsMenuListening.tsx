import * as React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import ListeningPartOne from "../../pages/Listening/ListeningPart/ListeningPartOne";
import ListeningPartTwo from "../../pages/Listening/ListeningPart/ListeningPartTwo";
import ListeningPartThree from "../../pages/Listening/ListeningPart/ListeningPartThree";
import ListeningPartFour from "../../pages/Listening/ListeningPart/ListeningPartFour";

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

  const handleChange = (event, newValue) => {
    setValue(newValue);
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
        <ListeningPartOne showDeleteButton={false} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <ListeningPartTwo showDeleteButton={false} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <ListeningPartThree showDeleteButton={false} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={3}>
        <ListeningPartFour showDeleteButton={false} />
      </CustomTabPanel>
    </Box>
  );
}
