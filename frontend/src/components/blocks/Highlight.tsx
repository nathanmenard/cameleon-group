import type { HighlightBlock } from "@/types/document";
import { cn } from "@/lib/utils";

interface HighlightProps {
  data: HighlightBlock;
}

export function Highlight({ data }: HighlightProps) {
  const variant = data.variant || "default";

  const baseClasses = "rounded-md px-10 py-8 my-8 -mx-4";

  const variantClasses = {
    default: "bg-noir text-gris-300",
    rouge: "bg-gradient-to-br from-rouge via-rouge-vif to-rouge-sombre bg-[length:200%_200%] animate-[gradientShift_6s_ease-in-out_infinite] text-blanc",
    info: "bg-gradient-to-br from-[#3b82f6] via-[#60a5fa] to-[#2563eb] bg-[length:200%_200%] animate-[gradientShift_6s_ease-in-out_infinite] text-blanc",
    success: "bg-gradient-to-br from-[#10b981] via-[#34d399] to-[#059669] bg-[length:200%_200%] animate-[gradientShift_6s_ease-in-out_infinite] text-blanc"
  };

  return (
    <div className={cn(baseClasses, variantClasses[variant])}>
      <p className={cn("mb-0", variant === "default" ? "text-gris-300" : "text-blanc")}>
        {data.text}
      </p>
    </div>
  );
}
