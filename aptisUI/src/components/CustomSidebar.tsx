import { useState } from "react";
import {
  MenuItemLink,
  MenuProps,
  useSidebarState,
  useTranslate,
} from "react-admin";
import { Group, TaskOutlined } from "@mui/icons-material/";
import AppsIcon from "@mui/icons-material/Apps";
import CommentIcon from "@mui/icons-material/Comment";
import DnsIcon from "@mui/icons-material/Dns";
import DvrIcon from "@mui/icons-material/Dvr";
import { Box } from "@mui/material";
import SubMenu from "./SubMenu";

type MenuName = "maintenance" | "users" | "notice" | "va" | "support";

const CustomSidebar = ({ dense = false }: MenuProps) => {
  const [state, setState] = useState({
    maintenance: true,
    users: true,
    notice: true,
    va: true,
    support: true,
  });
  const translate = useTranslate();
  const [open] = useSidebarState();

  const handleToggle = (menu: MenuName) => {
    setState((state) => ({ ...state, [menu]: !state[menu] }));
  };

  return (
    <Box
      sx={{
        width: open ? "100%" : 50,
        marginTop: 1,
        marginBottom: 1,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        transition: (theme) =>
          theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
      }}
    >
      <SubMenu
        handleToggle={() => handleToggle("users")}
        isOpen={state.users}
        name="User Information"
        icon={<Group />}
        dense={dense}
      >
        <MenuItemLink
          to="/users"
          state={{ _scrollToTop: true }}
          primaryText={translate(`Người dùng`, {
            smart_count: 2,
          })}
          leftIcon={<Group />}
          dense={dense}
        />
        <MenuItemLink
          to="/classRooms"
          state={{ _scrollToTop: true }}
          primaryText={translate(`Lớp học `, {
            smart_count: 2,
          })}
          leftIcon={<Group />}
          dense={dense}
        />
        {/* <MenuItemLink
          to="/app-users"
          state={{ _scrollToTop: true }}
          primaryText={translate(`APPユーザ一覧`, {
            smart_count: 2,
          })}
          leftIcon={<Group />}
          dense={dense}
        /> */}
      </SubMenu>

      <SubMenu
        handleToggle={() => handleToggle("notice")}
        isOpen={state.notice}
        name="Các kỹ năng"
        icon={<CommentIcon />}
        dense={dense}
      >
        <MenuItemLink
          to="/readings"
          state={{ _scrollToTop: true }}
          primaryText={translate(`Reading`, {
            smart_count: 2,
          })}
          leftIcon={<AppsIcon />}
          dense={dense}
        />
        <MenuItemLink
          to="/writings"
          state={{ _scrollToTop: true }}
          primaryText={translate(`Writing`, {
            smart_count: 2,
          })}
          leftIcon={<AppsIcon />}
          dense={dense}
        />
        <MenuItemLink
          to="/speakings"
          state={{ _scrollToTop: true }}
          primaryText={translate(`Speaking`, {
            smart_count: 2,
          })}
          leftIcon={<AppsIcon />}
          dense={dense}
        />
        <MenuItemLink
          to="/listenings"
          state={{ _scrollToTop: true }}
          primaryText={translate(`Listening`, {
            smart_count: 2,
          })}
          leftIcon={<AppsIcon />}
          dense={dense}
        />
      </SubMenu>

      <SubMenu
        handleToggle={() => handleToggle("maintenance")}
        isOpen={state.maintenance}
        name="Bộ đề thi"
        icon={<DnsIcon />}
        dense={dense}
      >
        <MenuItemLink
          to="/test-banks"
          state={{ _scrollToTop: true }}
          primaryText={translate(`Bộ đề`, {
            smart_count: 2,
          })}
          leftIcon={<DvrIcon />}
          dense={dense}
        />
      </SubMenu>

      <SubMenu
        handleToggle={() => handleToggle("va")}
        isOpen={state.va}
        name="Khoá học "
        icon={<DnsIcon />}
        dense={dense}
      >
        <MenuItemLink
          to="/courses"
          state={{ _scrollToTop: true }}
          primaryText={translate(`Khoá học `, {
            smart_count: 2,
          })}
          leftIcon={<AppsIcon />}
          dense={dense}
        />

        <MenuItemLink
          to="/lectures"
          state={{ _scrollToTop: true }}
          primaryText={translate(`Bài học`, {
            smart_count: 2,
          })}
          leftIcon={<AppsIcon />}
          dense={dense}
        />
      </SubMenu>

      <SubMenu
        handleToggle={() => handleToggle("support")}
        isOpen={state.support}
        name="Assignment"
        icon={<DnsIcon />}
        dense={dense}
      >
        <MenuItemLink
          to="/assignments" 
          state={{ _scrollToTop: true }}
          primaryText={translate(`Bài học nhỏ`, {
            smart_count: 2,
          })}
          leftIcon={<AppsIcon />}
          dense={dense}
        />
      </SubMenu>
    </Box>
  );
};

export default CustomSidebar;
