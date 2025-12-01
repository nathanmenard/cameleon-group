import type React from "react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type AppCardVariant = "default" | "bordered" | "elevated" | "subtle";
type AppCardPadding = "xs" | "sm" | "md" | "lg" | "none";

interface AppCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  variant?: AppCardVariant;
  padding?: AppCardPadding;
  noPadding?: boolean;
}

const baseCardClasses =
  "relative w-full overflow-hidden rounded-lg transition-shadow duration-200";

const variantClasses: Record<AppCardVariant, string> = {
  default: "bg-blanc border border-gris-200 shadow-sm",
  bordered: "bg-blanc border border-gris-300",
  elevated: "bg-blanc border border-gris-100 shadow-md hover:shadow-lg",
  subtle: "bg-gris-50 border border-gris-100",
};

const paddingClasses: Record<AppCardPadding, string> = {
  none: "p-0",
  xs: "px-3 py-2",
  sm: "p-4",
  md: "px-5 py-4",
  lg: "px-6 py-5",
};

const AppCard: React.FC<AppCardProps> = ({
  children,
  className = "",
  variant = "default",
  padding = "md",
  noPadding = false,
  ...props
}) => {
  const paddingKey: AppCardPadding = noPadding ? "none" : padding;

  return (
    <div
      className={cn(
        baseCardClasses,
        variantClasses[variant],
        paddingClasses[paddingKey],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default AppCard;
