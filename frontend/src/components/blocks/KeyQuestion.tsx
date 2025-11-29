import { KeyQuestionBlock } from "@/types/document";

interface KeyQuestionProps {
  data: KeyQuestionBlock;
}

export function KeyQuestion({ data }: KeyQuestionProps) {
  return <div className="key-question">{data.text}</div>;
}
