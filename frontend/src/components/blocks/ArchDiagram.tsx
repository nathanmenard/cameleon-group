import type { ArchDiagramBlock } from "@/types/document";
import { cn } from "@/lib/utils";

interface ArchDiagramProps {
  data: ArchDiagramBlock;
}

export function ArchDiagram({ data }: ArchDiagramProps) {
  const getModuleClasses = (variant?: string) => {
    if (variant === "refonte") {
      return "bg-noir border-rouge-vif text-blanc";
    }
    if (variant === "nervous") {
      return "bg-gradient-to-br from-rouge to-rouge-vif border-none text-blanc";
    }
    return "bg-gris-100 border-gris-200 text-noir";
  };

  const getStatusClasses = (variant?: string) => {
    if (variant === "refonte") return "text-rouge-vif";
    if (variant === "nervous") return "text-blanc";
    return "text-gris-500";
  };

  return (
    <div className="bg-blanc border border-gris-200 py-10 px-8 my-8 rounded-lg overflow-x-auto relative">
      <div className="bg-noir py-7 px-8 rounded-lg mb-0 relative text-center before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-1 before:bg-gradient-to-r before:from-rouge before:via-rouge-vif before:to-rouge-sombre before:rounded-t-lg">
        <h4 className="font-sans text-blanc m-0 mb-2 text-lg font-bold tracking-wide">
          {data.header.title}
        </h4>
        <p className="font-sans text-[0.8rem] text-gris-400 m-0">
          {data.header.description}
        </p>
      </div>
      <div className="flex justify-center py-4">
        <div className="w-0.5 h-10 bg-gris-300 relative after:content-[''] after:absolute after:-bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-0 after:border-l-[6px] after:border-l-transparent after:border-r-[6px] after:border-r-transparent after:border-t-[8px] after:border-t-gris-300" />
      </div>
      <div className="grid grid-cols-5 gap-3">
        {data.modules.map((module, index) => (
          <div
            key={`${module.name}_${index}`}
            className={cn(
              "border py-4 px-4 rounded-md font-sans text-center",
              getModuleClasses(module.variant)
            )}
          >
            <div className="text-[0.8rem] font-semibold mb-1">
              {module.name}
            </div>
            <div className={cn("text-[0.7rem]", getStatusClasses(module.variant))}>
              {module.status}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
