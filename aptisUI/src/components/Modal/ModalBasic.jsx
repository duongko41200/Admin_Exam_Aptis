import React, { useState, useRef, useEffect } from "react";

export default function ModalBasic({
  children,
  open = false,
  handleClose,
  label,
  subLabel = "",
  size = "small", // 'small', 'medium', 'large', 'fullscreen'
  draggable = false, // Tính năng kéo thả
  resizable = false, // Tính năng resize
}) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  const modalRef = useRef(null);

  const getInitialSize = () => {
    switch (size) {
      case "medium":
        return { width: 800, height: 400 };
      case "large":
        return { width: 800, height: 600 };
      case "fullscreen":
        return { width: window.innerWidth, height: window.innerHeight };
      default:
        return { width: 400, height: 300 };
    }
  };

  const getSizeStyle = () => {
    if (resizable && dimensions.width > 0) {
      return {
        width: `${dimensions.width}px`,
        height: `${dimensions.height}px`,
        minWidth: "300px",
        minHeight: "350px",
        maxWidth: "100vw",
        maxHeight: "95vh",
      };
    }

    switch (size) {
      case "medium":
        return { width: "600px", height: "400px" };
      case "large":
        return { width: "800px", height: "600px" };
      case "fullscreen":
        return { width: "100vw", height: "100vh" };
      default:
        return { width: "400px", height: "300px" };
    }
  };

  // Reset position và size khi modal mở
  useEffect(() => {
    if (open) {
      setPosition({ x: 0, y: 0 });
      if (resizable) {
        const initialSize = getInitialSize();
        setDimensions(initialSize);
      }
    }
  }, [open, size, resizable]);

  const handleMouseDown = (e) => {
    if (!draggable || size === "fullscreen") return;

    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleResizeMouseDown = (e) => {
    if (!resizable || size === "fullscreen") return;

    e.stopPropagation();
    setIsResizing(true);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: dimensions.width,
      height: dimensions.height,
    });
  };

  const handleMouseMove = (e) => {
    if (isDragging && draggable && size !== "fullscreen") {
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;

      // Giới hạn vị trí modal trong viewport
      const modalElement = modalRef.current;
      if (modalElement) {
        const rect = modalElement.getBoundingClientRect();
        const maxX = window.innerWidth - rect.width;
        const maxY = window.innerHeight - rect.height;

        setPosition({
          x: Math.max(-rect.width / 2, Math.min(maxX / 2, newX)),
          y: Math.max(-rect.height / 2, Math.min(maxY / 2, newY)),
        });
      }
    }

    if (isResizing && resizable && size !== "fullscreen") {
      const deltaX = e.clientX - resizeStart.x;
      const deltaY = e.clientY - resizeStart.y;

      const newWidth = Math.max(
        800,
        Math.min(window.innerWidth * 0.95, resizeStart.width + deltaX)
      );
      const newHeight = Math.max(
        200,
        Math.min(window.innerHeight * 0.95, resizeStart.height + deltaY)
      );

      setDimensions({
        width: newWidth,
        height: newHeight,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
  };

  // Thêm event listeners cho drag và resize
  useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, isResizing, dragStart, resizeStart, position, dimensions]);

  if (!open) return null;

  return (
    <>
      {/* Overlay nhẹ không chặn sự kiện */}
      <div
        className="fixed inset-0"
        style={{
          zIndex: 999998,
          // background: "rgba(0,0,0,0.1)",
          pointerEvents: "none", // Không chặn sự kiện
        }}
      />

      {/* Modal content floating */}
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          zIndex: 999999,
          transform: `translate(-50%, -50%)${
            (draggable || resizable) && size !== "fullscreen"
              ? ` translate(${position.x}px, ${position.y}px)`
              : ""
          }`,
          pointerEvents: "auto", // Modal có thể tương tác
          
        }}
      >
        <div
          ref={modalRef}
          className={` rounded-lg shadow-2xl relative ${
            size === "fullscreen" ? "overflow-auto" : "overflow-hidden"
          } ${
            (draggable || resizable) && size !== "fullscreen"
              ? "transition-none"
              : ""
          }`}
          onClick={(e) => e.stopPropagation()}
          style={{
            ...getSizeStyle(),
            padding: size === "fullscreen" ? "24px" : "0",
            cursor: isDragging
              ? "grabbing"
              : isResizing
              ? "nw-resize"
              : "default",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
          }}
        >
          {/* Header với tính năng drag */}
          <div
            className={`${
              draggable && size !== "fullscreen"
                ? "cursor-grab active:cursor-grabbing"
                : ""
            } px-6 py-4 border-b border-gray-200 bg-[#fff] rounded-t-lg`}
            onMouseDown={handleMouseDown}
          >
            <h2
              className="text-xl font-semibold select-none flex items-center justify-between"
              id="modal-modal-title"
            >
              <span>{label}</span>
              <div className="flex items-center space-x-2">
                {draggable && size !== "fullscreen" && (
                  <span className="text-xs text-gray-400">🖱️ Kéo</span>
                )}
                {resizable && size !== "fullscreen" && (
                  <span className="text-xs text-gray-400">📐 Resize</span>
                )}
                <button
                  onClick={handleClose}
                  className="text-gray-400 hover:text-gray-600 text-4xl font-bold w-8 h-8 flex items-center justify-center"
                >
                  ×
                </button>
              </div>
            </h2>
            {subLabel && (
              <p
                className="text-sm text-gray-600 mt-1"
                id="modal-modal-description"
              >
                {subLabel}
              </p>
            )}
          </div>

          {/* Content */}
          <div
            className="px-8 bg-[#fff]"
            style={{
              height: resizable ? `${dimensions.height - 120}px` : "auto",
              maxHeight:
                size === "fullscreen"
                  ? "calc(100vh - 120px)"
                  : "calc(95vh - 120px)",
            }}
          >
            {children}
          </div>

          {/* Resize handle */}
          {resizable && size !== "fullscreen" && (
            <div
              className="absolute bottom-0 right-0 w-4 h-4 cursor-nw-resize bg-gray-300 hover:bg-gray-400"
              style={{
                // background:
                //   "linear-gradient(-45deg, transparent 30%, #9ca3af 30%, #9ca3af 60%, transparent 60%)",
                borderRadius: "0 0 8px 0",
              }}
              onMouseDown={handleResizeMouseDown}
            />
          )}
        </div>
      </div>
    </>
  );
}
