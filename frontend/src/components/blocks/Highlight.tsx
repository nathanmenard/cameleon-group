import { HighlightBlock } from "@/types/document";

interface HighlightProps {
  data: HighlightBlock;
}

export function Highlight({ data }: HighlightProps) {
  const variantClass = data.variant && data.variant !== "default" ? data.variant : "";
  return (
    <div className={`highlight ${variantClass}`}>
      <p>{data.text}</p>
    </div>
  );
}
