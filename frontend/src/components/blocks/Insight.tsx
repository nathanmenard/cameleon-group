import type { InsightBlock } from "@/types/document";

interface InsightProps {
  data: InsightBlock;
}

export function Insight({ data }: InsightProps) {
  return (
    <div className="border-l-[3px] border-rouge-vif pl-5 my-6">
      <div className="font-sans text-[0.7rem] font-bold uppercase tracking-wider text-rouge-sombre mb-2">
        {data.label || "Notre lecture"}
      </div>
      <p className="m-0 italic text-gris-600 leading-relaxed">{data.text}</p>
    </div>
  );
}
