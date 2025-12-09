import type { WhyBlockData } from "@/types/document";
import { cn } from "@/lib/utils";

interface WhyBlockProps {
  data: WhyBlockData;
}

export function WhyBlock({ data }: WhyBlockProps) {
  const getIndentClass = (indent: number) => {
    const indentMap: Record<number, string> = {
      1: "pl-6",
      2: "pl-12",
      3: "pl-[4.5rem]",
      4: "pl-24"
    };
    return indentMap[indent] || "";
  };

  return (
    <div className="my-12 pt-8 border-t border-gris-200">
      <div className="flex items-baseline gap-3 mb-6">
        <span className="font-sans text-[2rem] font-bold text-rouge-vif leading-none">
          #{data.num}
        </span>
        <h4 className="font-serif text-[1.35rem] font-medium text-noir m-0">
          {data.title}
        </h4>
      </div>
      <div className="pl-14">
        <div className="mb-6">
          <span className="font-serif text-lg font-medium italic text-noir leading-normal">
            {data.symptom}
          </span>
        </div>
        <div className="font-sans text-[0.9rem] leading-[1.8] text-gris-600 mb-6">
          {data.causes.map((cause, index) => (
            <div key={`cause_${data.num}_${index}`} className={cn("py-1.5", getIndentClass(cause.indent))}>
              {cause.text}
            </div>
          ))}
        </div>
        <div className="py-5 px-6 bg-noir text-gris-300 rounded-md font-sans text-[0.9rem] font-medium leading-relaxed">
          {data.rootCause}
        </div>
      </div>
    </div>
  );
}
