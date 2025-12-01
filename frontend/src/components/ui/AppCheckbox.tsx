import React from "react";
import { cn } from "@/lib/utils";

export interface AppCheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string;
  helperText?: string;
  className?: string;
  labelClassName?: string;
}

const AppCheckbox = React.forwardRef<HTMLInputElement, AppCheckboxProps>(
  (
    {
      id,
      name,
      label,
      helperText,
      className = "",
      labelClassName = "",
      ...props
    },
    ref
  ) => {
    const checkboxId =
      id || name || `checkbox-${label.replace(/\s+/g, "-").toLowerCase()}`;

    return (
      <div className={cn("flex flex-col gap-1", className)}>
        <label
          htmlFor={checkboxId}
          className="flex cursor-pointer select-none items-center gap-3"
        >
          <span className="relative inline-flex h-5 w-5 items-center justify-center">
            <input
              {...props}
              ref={ref}
              id={checkboxId}
              name={name}
              type="checkbox"
              className="peer h-5 w-5 appearance-none rounded border border-gris-300 bg-blanc transition-colors duration-150 checked:border-rouge checked:bg-rouge focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-rouge disabled:cursor-not-allowed disabled:border-gris-200 disabled:bg-gris-100"
            />
            <svg
              className="pointer-events-none absolute h-3.5 w-3.5 text-blanc opacity-0 transition-opacity duration-150 peer-checked:opacity-100"
              viewBox="0 0 16 16"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 111.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z" />
            </svg>
          </span>
          <span
            className={cn(
              "text-sm font-sans text-noir",
              labelClassName
            )}
          >
            {label}
          </span>
        </label>
        {helperText && (
          <p className="text-xs text-gris-500">{helperText}</p>
        )}
      </div>
    );
  }
);

AppCheckbox.displayName = "AppCheckbox";

export default AppCheckbox;
