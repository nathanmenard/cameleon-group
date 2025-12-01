import type { ChecklistBlock } from "@/types/document";

interface ChecklistProps {
  data: ChecklistBlock;
}

export function Checklist({ data }: ChecklistProps) {
  return (
    <div className="checklist">
      <ul>
        {data.items.map((item, index) => {
          const isChecked = data.checked?.[index] ?? false;
          return (
            <li key={index} className={isChecked ? "checked" : ""}>
              <span className="check-icon">{isChecked ? "✓" : "○"}</span>
              <span className={isChecked ? "checked-text" : ""}>{item}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
