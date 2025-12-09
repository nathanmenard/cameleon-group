import type { OptionsBlock } from "@/types/document";
import { cn } from "@/lib/utils";

interface OptionsProps {
  data: OptionsBlock;
}

export function Options({ data }: OptionsProps) {
  const getVerdictClasses = (verdict: string) => {
    const verdictMap: Record<string, string> = {
      no: "bg-gris-100 text-gris-600",
      partial: "bg-[#fef3c7] text-[#92400e]",
      yes: "bg-rouge-vif text-blanc font-bold"
    };
    return verdictMap[verdict] || verdictMap.no;
  };

  return (
    <>
      {data.items.map((option, index) => (
        <div
          key={`${option.letter}_${index}`}
          className={cn(
            "grid grid-cols-[auto_1fr_auto] gap-5 items-start py-5 px-6 border-b border-gris-200 rounded-lg mb-2 last:border-b-0",
            option.recommended &&
              "bg-noir border-2 border-rouge-vif p-6"
          )}
        >
          <div
            className={cn(
              "font-sans text-[0.95rem] font-bold w-9 h-9 flex items-center justify-center rounded-lg",
              option.recommended
                ? "bg-gradient-to-br from-rouge via-rouge-vif to-rouge-sombre bg-[length:200%_200%] animate-[gradientShift_6s_ease-in-out_infinite] text-blanc w-10 h-10 text-lg"
                : "bg-gris-100 text-gris-600"
            )}
          >
            {option.letter}
          </div>
          <div>
            <h4
              className={cn(
                "m-0 mb-1 text-[0.95rem]",
                option.recommended && "text-blanc text-[1.05rem]"
              )}
            >
              {option.title}
            </h4>
            <p
              className={cn(
                "text-[0.9rem] m-0",
                option.recommended && "text-gris-300"
              )}
            >
              {option.description}
            </p>
          </div>
          <div
            className={cn(
              "font-sans text-xs font-bold uppercase tracking-wide py-2 px-4 rounded-full whitespace-nowrap",
              getVerdictClasses(option.verdict)
            )}
          >
            {option.verdictText}
          </div>
        </div>
      ))}
    </>
  );
}
