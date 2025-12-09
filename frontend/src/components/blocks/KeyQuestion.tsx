import type { KeyQuestionBlock } from "@/types/document";

interface KeyQuestionProps {
  data: KeyQuestionBlock;
}

export function KeyQuestion({ data }: KeyQuestionProps) {
  return (
    <div className="text-2xl italic text-center py-10 px-8 my-10 border-t border-b border-gris-200 text-noir">
      {data.text}
    </div>
  );
}
