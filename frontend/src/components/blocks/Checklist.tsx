import type { ChecklistBlock } from "@/types/document";
import { cn } from "@/lib/utils";

interface ChecklistProps {
  data: ChecklistBlock;
}

export function Checklist({ data }: ChecklistProps) {
  return (
    <div className="bg-gris-100 py-6 px-8 my-6 rounded-md border border-gris-200">
      <ul className="list-none m-0 p-0">
        {data.items.map((item, index) => {
          const isChecked = data.checked?.[index] ?? false;
          return (
            <li
              key={item}
              className="font-sans text-[0.9rem] py-2 flex items-center gap-3 border-b border-gris-200 last:border-b-0"
            >
              <span
                className={cn(
                  "text-base w-5 text-center flex-shrink-0",
                  isChecked ? "text-[#10b981] font-bold" : "text-gris-400"
                )}
              >
                {isChecked ? "✓" : "○"}
              </span>
              <span className={cn(isChecked && "line-through text-gris-500")}>
                {item}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
