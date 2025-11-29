import { ChecklistBlock } from "@/types/document";

interface ChecklistProps {
  data: ChecklistBlock;
}

export function Checklist({ data }: ChecklistProps) {
  return (
    <div className="checklist">
      <ul>
        {data.items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
