"use client";

import type React from "react";
import { useState } from "react";
import {
  MenuItemLink,
  MenuItemLinkClasses,
  MenuProps,
  useSidebarState,
  useTranslate,
} from "react-admin";
import {
  Users,
  MessageSquare,
  Server,
  Monitor,
  ChevronDown,
  ChevronRight,
  BookOpen,
  GraduationCap,
  FileText,
  Zap,
} from "lucide-react";
import { Tooltip, Popper, Paper, ClickAwayListener } from "@mui/material";

type MenuName = "maintenance" | "users" | "notice" | "va" | "support";

interface SubMenuProps {
  handleToggle: () => void;
  isOpen: boolean;
  name: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  dense?: boolean;
  open?: boolean;
  menuKey: MenuName;
  onHover?: (event: React.MouseEvent<HTMLElement>, menuKey: MenuName) => void;
  onLeave?: () => void;
}

const SubMenu = ({
  handleToggle,
  isOpen,
  name,
  icon,
  children,
  dense,
  open,
  menuKey,
  onHover,
  onLeave,
}: SubMenuProps) => {
  const handleMouseEnter = (event: React.MouseEvent<HTMLElement>) => {
    if (!open && onHover) {
      onHover(event, menuKey);
    }
  };

  const handleMouseLeave = () => {
    if (!open && onLeave) {
      onLeave();
    }
  };

  const content = (
    <div className="w-full">
      <button
        onClick={handleToggle}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="w-full flex items-center justify-between px-6 py-2 text-gray-300 hover:bg-gray-700 transition-colors duration-200"
      >
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 flex items-center justify-center text-[#5B6A99]">
            {icon}
          </div>
          {open && <span className="text-md ">{name}</span>}
        </div>
        {open &&
          (isOpen ? (
            <ChevronDown className="w-5 h-5" />
          ) : (
            <ChevronRight className="w-5 h-5" />
          ))}
      </button>
      {isOpen && open && (
        <div
          className="ml-4"
          style={{
            borderLeft: "2px solid #5B6A99",
          }}
        >
          {children}
        </div>
      )}
    </div>
  );

  if (!open) {
    return (
      <Tooltip title={name} placement="right" arrow>
        {content}
      </Tooltip>
    );
  }

  return content;
};

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

  const [hoverAnchor, setHoverAnchor] = useState<HTMLElement | null>(null);
  const [hoverMenu, setHoverMenu] = useState<MenuName | null>(null);

  const handleToggle = (menu: MenuName) => {
    setState((state) => ({ ...state, [menu]: !state[menu] }));
  };

  const handleMenuHover = (
    event: React.MouseEvent<HTMLElement>,
    menuKey: MenuName
  ) => {
    setHoverAnchor(event.currentTarget);
    setHoverMenu(menuKey);
  };

  const handleMenuLeave = () => {
    setHoverAnchor(null);
    setHoverMenu(null);
  };

  const handleClickAway = () => {
    setHoverAnchor(null);
    setHoverMenu(null);
  };

  const renderPopupMenu = (menuKey: MenuName) => {
    const commonSx = {
      "& .MuiListItemText-primary": {
        color: "#fff",
        fontSize: "18px",
      },
      paddingLeft: 2,
      "&:hover": {
        backgroundColor: "#465074",
      },
      color: "#e2e0e0e0",
      [`&.${MenuItemLinkClasses.active}`]: {
        color: `#fff`,
        backgroundColor: "#343E5E",
        borderRight: "6px solid #4763E4",
      },
    };

    const menuItems = {
      users: [
        {
          to: "/users",
          text: translate("Người dùng", { smart_count: 2 }),
          icon: <Users className="w-5 h-5 text-gray-200" />,
        },
        {
          to: "/classRooms",
          text: translate("Lớp học", { smart_count: 2 }),
          icon: <GraduationCap className="w-5 h-5 text-gray-200" />,
        },
      ],
      notice: [
        {
          to: "/readings",
          text: "Reading",
          icon: <BookOpen className="w-5 h-5 text-gray-200" />,
        },
        {
          to: "/writings",
          text: "Writing",
          icon: <BookOpen className="w-5 h-5 text-gray-200" />,
        },
        {
          to: "/speakings",
          text: "Speaking",
          icon: <BookOpen className="w-5 h-5 text-gray-200" />,
        },
        {
          to: "/listenings",
          text: "Listening",
          icon: <BookOpen className="w-5 h-5 text-gray-200" />,
        },
      ],
      maintenance: [
        {
          to: "/test-banks",
          text: "Bộ đề",
          icon: <Monitor className="w-5 h-5 text-gray-200" />,
        },
      ],
      va: [
        {
          to: "/courses",
          text: "Khoá học",
          icon: <BookOpen className="w-5 h-5 text-gray-200" />,
        },
        {
          to: "/lectures",
          text: "Bài học",
          icon: <BookOpen className="w-5 h-5 text-gray-200" />,
        },
      ],
      support: [
        {
          to: "/assignments",
          text: "Bài học nhỏ",
          icon: <FileText className="w-5 h-5 text-gray-200" />,
        },
      ],
    };

    return (
      <div className="py-2 min-w-[200px]">
        {menuItems[menuKey]?.map((item) => (
          <MenuItemLink
            key={item.to}
            to={item.to}
            state={{ _scrollToTop: true }}
            primaryText={item.text}
            leftIcon={item.icon}
            dense={dense}
            sx={commonSx}
          />
        ))}
      </div>
    );
  };

  return (
    <>
      <div
        className={`bg-[#1F263E] text-white h-[95vh] flex flex-col  duration-300  ${
          open ? "w-fit" : "w-16"
        }`}
      >
        {/* Header */}
        <div className="flex items-center gap-2 px-4 py-4 border-b border-gray-700">
          <Zap className="w-6 h-6 text-blue-400" />
          {open && <span className="text-lg font-bold">APTIS Academy</span>}
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-2">
          <SubMenu
            handleToggle={() => handleToggle("users")}
            isOpen={state.users}
            name="User Information"
            icon={<Users className="w-6 h-6" />}
            dense={dense}
            open={open}
            menuKey="users"
            onHover={handleMenuHover}
            onLeave={handleMenuLeave}
          >
            {/* Nội dung khi open */}
            {renderPopupMenu("users")}
          </SubMenu>

          <SubMenu
            handleToggle={() => handleToggle("notice")}
            isOpen={state.notice}
            name="Các kỹ năng"
            icon={<MessageSquare className="w-6 h-6" />}
            dense={dense}
            open={open}
            menuKey="notice"
            onHover={handleMenuHover}
            onLeave={handleMenuLeave}
          >
            {renderPopupMenu("notice")}
          </SubMenu>

          <SubMenu
            handleToggle={() => handleToggle("maintenance")}
            isOpen={state.maintenance}
            name="Bộ đề thi"
            icon={<Server className="w-6 h-6" />}
            dense={dense}
            open={open}
            menuKey="maintenance"
            onHover={handleMenuHover}
            onLeave={handleMenuLeave}
          >
            {renderPopupMenu("maintenance")}
          </SubMenu>

          <SubMenu
            handleToggle={() => handleToggle("va")}
            isOpen={state.va}
            name="Khoá học"
            icon={<GraduationCap className="w-6 h-6" />}
            dense={dense}
            open={open}
            menuKey="va"
            onHover={handleMenuHover}
            onLeave={handleMenuLeave}
          >
            {renderPopupMenu("va")}
          </SubMenu>

          <SubMenu
            handleToggle={() => handleToggle("support")}
            isOpen={state.support}
            name="Assignment"
            icon={<FileText className="w-6 h-6" />}
            dense={dense}
            open={open}
            menuKey="support"
            onHover={handleMenuHover}
            onLeave={handleMenuLeave}
          >
            {renderPopupMenu("support")}
          </SubMenu>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-700 p-4">
          {open ? (
            <div className="text-center">
              <span className="text-xs text-gray-200">
                © 2025 APTIS Academy
              </span>
            </div>
          ) : (
            <Tooltip title="© 2025 APTIS Academy" placement="right" arrow>
              <div className="flex justify-center">
                <div className="w-6 h-6 rounded-full border border-gray-500"></div>
              </div>
            </Tooltip>
          )}
        </div>
      </div>

      {/* Hover popup */}
      <Popper
        open={Boolean(hoverAnchor && hoverMenu)}
        anchorEl={hoverAnchor}
        placement="right-start"
        sx={{ zIndex: 1300 }}
      >
        <ClickAwayListener onClickAway={handleClickAway}>
          <Paper
            sx={{
              backgroundColor: "#1F263E",
              border: "1px solid #374151",
              boxShadow: "4px 0 12px rgba(0, 0, 0, 0.4)",
              ml: 1,
            }}
          >
            {hoverMenu && renderPopupMenu(hoverMenu)}
          </Paper>
        </ClickAwayListener>
      </Popper>
    </>
  );
};

export default CustomSidebar;
