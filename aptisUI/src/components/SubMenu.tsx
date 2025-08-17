"use client";

import type React from "react";
import { Collapse, Tooltip } from "@mui/material";
import { ChevronDown, ChevronRight } from "lucide-react";

interface SubMenuProps {
  handleToggle: () => void;
  isOpen: boolean;
  name: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  dense?: boolean;
  sx?: any;
  open?: boolean;
}

const SubMenu = ({
  handleToggle,
  isOpen,
  name,
  icon,
  children,
  dense = false,
  sx = {},
  open = true,
}: SubMenuProps) => {
  const buttonContent = (
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
  );

  return (
    <div className="w-full">
      {!open ? (
        <Tooltip title={name} placement="right" arrow>
          <div>{buttonContent}</div>
        </Tooltip>
      ) : (
        buttonContent
      )}
      {open && (
        <Collapse in={isOpen} timeout="auto" unmountOnExit>
          <div className="ml-4 border-l border-gray-600">{children}</div>
        </Collapse>
      )}
    </div>
  );
};

export default SubMenu;
