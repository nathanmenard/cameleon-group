import type React from "react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface AppButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline" | "accent" | "ghost";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
}

const AppButton: React.FC<AppButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  className = "",
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-sans font-semibold rounded-md transition-all duration-150 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rouge disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "text-blanc bg-noir hover:bg-gris-800 shadow-sm hover:shadow-md",
    secondary:
      "text-noir bg-blanc border border-gris-200 shadow-sm hover:shadow-md hover:bg-gris-50",
    outline:
      "text-noir bg-transparent border border-gris-300 hover:bg-gris-50",
    accent:
      "text-blanc bg-rouge hover:bg-rouge-vif shadow-sm hover:shadow-md",
    ghost:
      "text-gris-600 bg-transparent hover:bg-gris-100 hover:text-noir",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        fullWidth && "w-full",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default AppButton;
