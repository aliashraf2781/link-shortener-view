"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import type { IconType } from "react-icons";
import { FiEye, FiEyeOff } from "react-icons/fi";

type FieldVariant = "default" | "filled" | "underline";

interface BaseFieldProps {
  label?: string;
  labelIcon?: IconType;
  error?: string;
  helperText?: string;
  variant?: FieldVariant;
  fullWidth?: boolean;
  containerClassName?: string;
}

interface InputFieldProps
  extends BaseFieldProps,
    Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  type: "text" | "password" | "date";
  leftIcon?: IconType;
  rightIcon?: IconType;
}

interface SelectOption {
  label: string;
  value: string;
}

interface SelectFieldProps
  extends BaseFieldProps,
    Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "type"> {
  type: "select";
  options: SelectOption[];
  placeholder?: string;
  leftIcon?: IconType;
}

type FormFieldProps = InputFieldProps | SelectFieldProps;

const variantBase: Record<FieldVariant, string> = {
  default:
    "border border-teal/10 rounded-lg bg-linear-to-br from-white to-teal/5 focus-within:border-teal focus-within:ring-2 ring-teal/20 transition-all",
  filled:
    "border border-transparent rounded-lg bg-linear-to-br from-teal/10 to-cyan/10 focus-within:bg-linear-to-br focus-within:from-teal/15 focus-within:to-cyan/15 focus-within:border-teal focus-within:ring-2 ring-teal/20",
  underline:
    "border-b-2 border-teal/20 rounded-none bg-transparent focus-within:border-teal focus-within:shadow-sm",
};

const FormField = React.forwardRef<
  HTMLInputElement | HTMLSelectElement,
  FormFieldProps
>((props, ref) => {
  const {
    label,
    labelIcon: LabelIcon,
    error,
    helperText,
    variant = "default",
    fullWidth = false,
    containerClassName,
    type,
    className,
    ...rest
  } = props;

  const [showPassword, setShowPassword] = useState(false);

  const wrapperCn = cn(
    "flex flex-col gap-1.5",
    fullWidth && "w-full",
    containerClassName
  );

  const fieldWrapperCn = cn(
    "flex items-center gap-2 px-3 py-2 transition-all duration-200",
    variantBase[variant],
    error && "border-red-500 focus-within:border-red-500 focus-within:ring-red-200",
  );

  const inputCn =
    "flex-1 bg-transparent outline-none text-gray-900 placeholder:text-gray-400 text-sm disabled:cursor-not-allowed";

  /* ---------- SELECT ---------- */
  if (type === "select") {
    const { options, placeholder, leftIcon: LeftIcon, ...selectRest } =
      rest as Omit<SelectFieldProps, keyof BaseFieldProps | "type">;

    return (
      <div className={wrapperCn}>
      {label && (
        <label className="flex items-center gap-1.5 text-sm font-semibold bg-linear-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
          {LabelIcon && <LabelIcon className="text-teal" />}
          {label}
        </label>
      )}
        <div className={fieldWrapperCn}>
          {LeftIcon && <LeftIcon className="text-gray-400 text-lg shrink-0" />}
          <select
            ref={ref as React.Ref<HTMLSelectElement>}
            className={cn(inputCn, "appearance-none cursor-pointer text-gray-900", className)}
            {...selectRest}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        {error && <p className="text-xs text-red-500">{error}</p>}
        {!error && helperText && (
          <p className="text-xs text-gray-400">{helperText}</p>
        )}
      </div>
    );
  }

  /* ---------- INPUT (text | password | date) ---------- */
  const {
    leftIcon: LeftIcon,
    rightIcon: RightIcon,
    ...inputRest
  } = rest as Omit<InputFieldProps, keyof BaseFieldProps | "type">;

  const resolvedType = type === "password" && showPassword ? "text" : type;

  return (
    <div className={wrapperCn}>
      {label && (
        <label className="flex items-center gap-1.5 text-sm font-semibold bg-linear-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
          {LabelIcon && <LabelIcon className="text-teal" />}
          {label}
        </label>
      )}
      <div className={fieldWrapperCn}>
        {LeftIcon && (
          <LeftIcon className="text-gray-400 text-lg shrink-0" />
        )}
        <input
          ref={ref as React.Ref<HTMLInputElement>}
          type={resolvedType}
          className={cn(inputCn, className)}
          {...inputRest}
        />
        {type === "password" && (
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShowPassword((p) => !p)}
            className="text-gray-400 hover:text-teal transition-colors shrink-0"
          >
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </button>
        )}
        {type !== "password" && RightIcon && (
          <RightIcon className="text-gray-400 text-lg shrink-0" />
        )}
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
      {!error && helperText && (
        <p className="text-xs text-gray-400">{helperText}</p>
      )}
    </div>
  );
});

FormField.displayName = "FormField";

export default FormField;
