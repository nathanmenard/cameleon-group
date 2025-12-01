import type { ReactNode } from "react";
import React from "react";
import { cn } from "@/lib/utils";

interface AppTextInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  rightIcon?: ReactNode;
  label?: string;
  error?: string;
}

const AppTextInput = React.forwardRef<HTMLInputElement, AppTextInputProps>(
  function AppTextInput(
    { rightIcon, label, error, className = "", ...props },
    ref
  ) {
    const baseInputStyles =
      "font-sans bg-blanc border border-gris-300 text-noir text-sm rounded-md focus:ring-rouge focus:border-rouge focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-rouge block w-full p-2.5 placeholder:text-gris-400";

    return (
      <div>
        {label && (
          <label
            htmlFor={props.id}
            className="block mb-2 text-sm font-medium font-sans text-noir"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            className={cn(
              baseInputStyles,
              props.disabled && "cursor-not-allowed opacity-50 bg-gris-50",
              error &&
                "border-rouge text-rouge placeholder-rouge/70 focus:ring-rouge focus:border-rouge",
              rightIcon && "pr-10",
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p className="mt-2 text-sm text-rouge">{error}</p>
        )}
      </div>
    );
  }
);

export default AppTextInput;
