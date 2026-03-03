import React from "react";
import { cn } from "@/lib/utils";
import type { IconType } from "react-icons";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: IconType;
  iconPosition?: "left" | "right";
  isLoading?: boolean;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-teal text-white hover:bg-teal-dark focus:ring-2 ring-teal-light",
  secondary:
    "bg-teal-light text-white hover:bg-teal focus:ring-2 ring-teal",
  outline:
    "bg-transparent border-2 border-teal text-teal hover:bg-teal focus:ring-2 ring-teal-light",
  ghost:
    "bg-transparent text-teal hover:bg-teal/10 focus:ring-2 ring-teal-light",
  danger:
    "bg-red-600 text-white hover:bg-red-700 focus:ring-2 ring-red-300",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm gap-1.5",
  md: "px-4 py-2 text-base gap-2",
  lg: "px-6 py-3 text-lg gap-2.5",
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      icon: Icon,
      iconPosition = "left",
      isLoading = false,
      fullWidth = false,
      className,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none",
          variantStyles[variant],
          sizeStyles[size],
          fullWidth && "w-full",
          className
        )}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
        )}
        {!isLoading && Icon && iconPosition === "left" && <Icon />}
        {children}
        {!isLoading && Icon && iconPosition === "right" && <Icon />}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
