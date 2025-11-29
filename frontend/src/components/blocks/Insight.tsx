import { InsightBlock } from "@/types/document";

interface InsightProps {
  data: InsightBlock;
}

export function Insight({ data }: InsightProps) {
  return (
    <div className="insight">
      <div className="insight-label">{data.label || "Notre lecture"}</div>
      <p>{data.text}</p>
    </div>
  );
}
