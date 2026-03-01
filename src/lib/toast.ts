import { createElement, type ReactNode } from "react";
import { toast } from "sonner";
import { FaCircleCheck } from "react-icons/fa6";
import { FaTimesCircle } from "react-icons/fa";
import { FiAlertTriangle, FiInfo } from "react-icons/fi";

export type ToastState = "success" | "error" | "warning" | "info";

const stateIcons: Record<ToastState, ReactNode> = {
  success: createElement(FaCircleCheck, { className: "text-green-500", size: 20 }),
  error: createElement(FaTimesCircle, { className: "text-red-500", size: 20 }),
  warning: createElement(FiAlertTriangle, { className: "text-amber-500", size: 20 }),
  info: createElement(FiInfo, { className: "text-blue-500", size: 20 }),
};

interface ToastPayload {
  state: ToastState;
  title: string;
  description?: string;
  icon?: ReactNode;
}

export function showToast({ state, title, description, icon }: ToastPayload) {
  toast.message(title, {
    description,
    icon: icon ?? stateIcons[state],
  });
}
