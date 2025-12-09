import type { SystemMapBlock } from "@/types/document";
import { cn } from "@/lib/utils";

interface SystemMapProps {
  data: SystemMapBlock;
}

export function SystemMap({ data }: SystemMapProps) {
  const getBlockClasses = (variant: string) => {
    const variantMap: Record<string, { bg: string; border: string; title: string; list: string }> = {
      strategy: {
        bg: "bg-noir",
        border: "border-noir",
        title: "text-blanc",
        list: "text-gris-300"
      },
      org: {
        bg: "bg-gris-50",
        border: "border-gris-200",
        title: "text-noir",
        list: "text-gris-600"
      },
      client: {
        bg: "bg-gris-50",
        border: "border-gris-200",
        title: "text-noir",
        list: "text-gris-600"
      }
    };
    return variantMap[variant] || variantMap.org;
  };

  return (
    <div className="flex flex-col gap-4 my-8">
      <div className="grid grid-cols-3 gap-4">
        {data.blocks.map((block) => {
          const classes = getBlockClasses(block.variant);
          return (
            <div
              key={block.id}
              className={cn(
                "border rounded-lg py-5 px-5",
                classes.bg,
                classes.border
              )}
            >
              <div
                className={cn(
                  "font-sans text-[0.7rem] font-bold uppercase tracking-wider mb-3",
                  classes.title
                )}
              >
                {block.title}
              </div>
              <ul
                className={cn(
                  "font-sans text-[0.8rem] leading-relaxed m-0 pl-4",
                  classes.list
                )}
              >
                {block.items.map((item, index) => (
                  <li key={`${block.id}_item_${index}`} className="mb-1">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
