"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { FiX } from "react-icons/fi";

type ModalSize = "sm" | "md" | "lg" | "xl" | "full";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: ModalSize;
  resizable?: boolean;
  footer?: React.ReactNode;
  closeOnOverlay?: boolean;
  className?: string;
  /** Minimum width in px when resizable */
  minWidth?: number;
  /** Minimum height in px when resizable */
  minHeight?: number;
}

const sizeStyles: Record<ModalSize, string> = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
  full: "max-w-[95vw] max-h-[95vh]",
};

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  resizable = false,
  footer,
  closeOnOverlay = true,
  className,
  minWidth = 320,
  minHeight = 200,
}) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const isResizing = useRef(false);
  const [dimensions, setDimensions] = useState<{
    width?: number;
    height?: number;
  }>({});

  /* Close on Escape */
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  /* Lock body scroll */
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  /* Resize logic */
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!resizable) return;
      e.preventDefault();
      isResizing.current = true;

      const startX = e.clientX;
      const startY = e.clientY;
      const startW = panelRef.current?.offsetWidth ?? 0;
      const startH = panelRef.current?.offsetHeight ?? 0;

      const onMouseMove = (ev: MouseEvent) => {
        if (!isResizing.current) return;
        const newW = Math.max(minWidth, startW + (ev.clientX - startX));
        const newH = Math.max(minHeight, startH + (ev.clientY - startY));
        setDimensions({ width: newW, height: newH });
      };

      const onMouseUp = () => {
        isResizing.current = false;
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
      };

      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    },
    [resizable, minWidth, minHeight]
  );

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-9999 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 transition-opacity"
        onClick={closeOnOverlay ? onClose : undefined}
      />

      {/* Panel */}
      <div
        ref={panelRef}
        style={
          resizable && dimensions.width
            ? { width: dimensions.width, height: dimensions.height }
            : undefined
        }
        className={cn(
          "relative z-10 flex flex-col bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl w-full overflow-hidden border border-white/20",
          !resizable && sizeStyles[size],
          resizable && !dimensions.width && sizeStyles[size],
          className
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-teal-800/20">
          <h2 className="text-lg font-semibold bg-linear-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            {title ?? ""}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-teal-600 hover:bg-teal-50 transition-all"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="px-6 py-4 border-t border-teal-800/20 flex items-center justify-end gap-2 bg-linear-to-b from-white/0 to-teal-50/40">
            {footer}
          </div>
        )}

        {/* Resize handle */}
        {resizable && (
          <div
            onMouseDown={handleMouseDown}
            className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize"
            title="Drag to resize"
          >
            <svg
              className="w-4 h-4 text-gray-400"
              viewBox="0 0 16 16"
              fill="currentColor"
            >
              <path d="M14 14H12V12H14V14ZM14 10H12V8H14V10ZM10 14H8V12H10V14ZM14 6H12V4H14V6ZM10 10H8V8H10V10ZM6 14H4V12H6V14Z" />
            </svg>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

export default Modal;
