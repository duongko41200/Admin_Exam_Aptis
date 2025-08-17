"use client";

import type React from "react";
import { useState } from "react";
import {
  MenuItemLink,
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
  LogOut,
} from "lucide-react";
import { Tooltip } from "@mui/material";

type MenuName = "maintenance" | "users" | "notice" | "va" | "support";

interface SubMenuProps {
  handleToggle: () => void;
  isOpen: boolean;
  name: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  dense?: boolean;
  open?: boolean;
}

const SubMenu = ({
  handleToggle,
  isOpen,
  name,
  icon,
  children,
  dense,
  open,
}: SubMenuProps) => {
  const content = (
    <div className="w-full">
      <button
        onClick={handleToggle}
        className="w-full flex items-center justify-between px-4 py-2 text-gray-300 hover:bg-gray-700 transition-colors duration-200"
      >
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 flex items-center justify-center">{icon}</div>
          {open && <span className="text-sm font-medium">{name}</span>}
        </div>
        {open &&
          (isOpen ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          ))}
      </button>
      {isOpen && open && (
        <div className="ml-4 border-l border-gray-600">{children}</div>
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

  const handleToggle = (menu: MenuName) => {
    setState((state) => ({ ...state, [menu]: !state[menu] }));
  };

  return (
    <div
      className={`bg-gray-800 text-white h-screen flex flex-col transition-all duration-300 ease-in-out ${
        open ? "w-72" : "w-16"
      }`}
    >
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-4 border-b border-gray-700">
        <Zap className="w-6 h-6 text-blue-400" />
        {open && <span className="text-lg font-bold">APTIS Academy</span>}
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-2">
        {/* User Management Section */}
        <SubMenu
          handleToggle={() => handleToggle("users")}
          isOpen={state.users}
          name="User Information"
          icon={<Users className="w-5 h-5" />}
          dense={dense}
          open={open}
        >
          <MenuItemLink
            to="/users"
            state={{ _scrollToTop: true }}
            primaryText={translate("Người dùng", { smart_count: 2 })}
            leftIcon={<Users className="w-4 h-4 text-gray-400" />}
            dense={dense}
            sx={{
              "& .MuiListItemText-primary": {
                color: "#9ca3af",
                fontSize: "14px",
              },
              paddingLeft: 4,
              "&:hover": {
                backgroundColor: "#374151",
              },
            }}
          />
          <MenuItemLink
            to="/classRooms"
            state={{ _scrollToTop: true }}
            primaryText={translate("Lớp học", { smart_count: 2 })}
            leftIcon={<GraduationCap className="w-4 h-4 text-gray-400" />}
            dense={dense}
            sx={{
              "& .MuiListItemText-primary": {
                color: "#9ca3af",
                fontSize: "14px",
              },
              paddingLeft: 4,
              "&:hover": {
                backgroundColor: "#374151",
              },
            }}
          />
        </SubMenu>

        {/* Skills Section */}
        <SubMenu
          handleToggle={() => handleToggle("notice")}
          isOpen={state.notice}
          name="Các kỹ năng"
          icon={<MessageSquare className="w-5 h-5" />}
          dense={dense}
          open={open}
        >
          <MenuItemLink
            to="/readings"
            state={{ _scrollToTop: true }}
            primaryText={translate("Reading", { smart_count: 2 })}
            leftIcon={<BookOpen className="w-4 h-4 text-gray-400" />}
            dense={dense}
            sx={{
              "& .MuiListItemText-primary": {
                color: "#9ca3af",
                fontSize: "14px",
              },
              paddingLeft: 4,
              "&:hover": {
                backgroundColor: "#374151",
              },
            }}
          />
          <MenuItemLink
            to="/writings"
            state={{ _scrollToTop: true }}
            primaryText={translate("Writing", { smart_count: 2 })}
            leftIcon={<BookOpen className="w-4 h-4 text-gray-400" />}
            dense={dense}
            sx={{
              "& .MuiListItemText-primary": {
                color: "#9ca3af",
                fontSize: "14px",
              },
              paddingLeft: 4,
              "&:hover": {
                backgroundColor: "#374151",
              },
            }}
          />
          <MenuItemLink
            to="/speakings"
            state={{ _scrollToTop: true }}
            primaryText={translate("Speaking", { smart_count: 2 })}
            leftIcon={<BookOpen className="w-4 h-4 text-gray-400" />}
            dense={dense}
            sx={{
              "& .MuiListItemText-primary": {
                color: "#9ca3af",
                fontSize: "14px",
              },
              paddingLeft: 4,
              "&:hover": {
                backgroundColor: "#374151",
              },
            }}
          />
          <MenuItemLink
            to="/listenings"
            state={{ _scrollToTop: true }}
            primaryText={translate("Listening", { smart_count: 2 })}
            leftIcon={<BookOpen className="w-4 h-4 text-gray-400" />}
            dense={dense}
            sx={{
              "& .MuiListItemText-primary": {
                color: "#9ca3af",
                fontSize: "14px",
              },
              paddingLeft: 4,
              "&:hover": {
                backgroundColor: "#374151",
              },
            }}
          />
        </SubMenu>

        {/* Test Banks Section */}
        <SubMenu
          handleToggle={() => handleToggle("maintenance")}
          isOpen={state.maintenance}
          name="Bộ đề thi"
          icon={<Server className="w-5 h-5" />}
          dense={dense}
          open={open}
        >
          <MenuItemLink
            to="/test-banks"
            state={{ _scrollToTop: true }}
            primaryText={translate("Bộ đề", { smart_count: 2 })}
            leftIcon={<Monitor className="w-4 h-4 text-gray-400" />}
            dense={dense}
            sx={{
              "& .MuiListItemText-primary": {
                color: "#9ca3af",
                fontSize: "14px",
              },
              paddingLeft: 4,
              "&:hover": {
                backgroundColor: "#374151",
              },
            }}
          />
        </SubMenu>

        {/* Courses Section */}
        <SubMenu
          handleToggle={() => handleToggle("va")}
          isOpen={state.va}
          name="Khoá học"
          icon={<GraduationCap className="w-5 h-5" />}
          dense={dense}
          open={open}
        >
          <MenuItemLink
            to="/courses"
            state={{ _scrollToTop: true }}
            primaryText={translate("Khoá học", { smart_count: 2 })}
            leftIcon={<BookOpen className="w-4 h-4 text-gray-400" />}
            dense={dense}
            sx={{
              "& .MuiListItemText-primary": {
                color: "#9ca3af",
                fontSize: "14px",
              },
              paddingLeft: 4,
              "&:hover": {
                backgroundColor: "#374151",
              },
            }}
          />
          <MenuItemLink
            to="/lectures"
            state={{ _scrollToTop: true }}
            primaryText={translate("Bài học", { smart_count: 2 })}
            leftIcon={<BookOpen className="w-4 h-4 text-gray-400" />}
            dense={dense}
            sx={{
              "& .MuiListItemText-primary": {
                color: "#9ca3af",
                fontSize: "14px",
              },
              paddingLeft: 4,
              "&:hover": {
                backgroundColor: "#374151",
              },
            }}
          />
        </SubMenu>

        {/* Assignment Section */}
        <SubMenu
          handleToggle={() => handleToggle("support")}
          isOpen={state.support}
          name="Assignment"
          icon={<FileText className="w-5 h-5" />}
          dense={dense}
          open={open}
        >
          <MenuItemLink
            to="/assignments"
            state={{ _scrollToTop: true }}
            primaryText={translate("Bài học nhỏ", { smart_count: 2 })}
            leftIcon={<FileText className="w-4 h-4 text-gray-400" />}
            dense={dense}
            sx={{
              "& .MuiListItemText-primary": {
                color: "#9ca3af",
                fontSize: "14px",
              },
              paddingLeft: 4,
              "&:hover": {
                backgroundColor: "#374151",
              },
            }}
          />
        </SubMenu>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-700 p-4">
        {open ? (
          <div className="text-center">
            <span className="text-xs text-gray-400">© 2025 APTIS Academy</span>
          </div>
        ) : (
          <Tooltip title="© 2025 APTIS Academy" placement="right" arrow>
            <div className="flex justify-center">
              <div className="w-5 h-5 rounded-full border border-gray-500"></div>
            </div>
          </Tooltip>
        )}
      </div>
    </div>
  );
};

export default CustomSidebar;
