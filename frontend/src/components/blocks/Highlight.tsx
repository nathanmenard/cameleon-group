import { HighlightBlock } from "@/types/document";

interface HighlightProps {
  data: HighlightBlock;
}

export function Highlight({ data }: HighlightProps) {
  return (
    <div className={`highlight ${data.variant === "rouge" ? "rouge" : ""}`}>
      <p>{data.text}</p>
    </div>
  );
}
