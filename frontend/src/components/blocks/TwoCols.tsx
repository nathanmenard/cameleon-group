import type { TwoColsBlock } from "@/types/document";
import { cn } from "@/lib/utils";

interface TwoColsProps {
  data: TwoColsBlock;
}

export function TwoCols({ data }: TwoColsProps) {
  return (
    <div className="grid grid-cols-2 gap-6 my-6">
      {data.columns.map((col, index) => (
        <div
          key={`${col.title}_${index}`}
          className={cn(
            "p-6 rounded-md border",
            col.dark
              ? "bg-noir text-blanc border-noir"
              : "bg-gris-100 border-gris-200"
          )}
        >
          <h4 className={cn("mt-0", col.dark && "text-blanc")}>{col.title}</h4>
          <ul className={cn("mb-0", col.dark && "text-gris-300")}>
            {col.items.map((item, i) => (
              <li key={`${col.title}_item_${i}`}>{item}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
