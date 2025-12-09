import { Fragment } from "react";
import type { ProcessFlowBlock } from "@/types/document";

interface ProcessFlowProps {
  data: ProcessFlowBlock;
}

export function ProcessFlow({ data }: ProcessFlowProps) {
  return (
    <div className="flex items-stretch gap-0 my-8">
      {data.steps.map((step, index) => (
        <Fragment key={`${step.name}_${index}`}>
          <div className="flex-1 text-center py-5 px-4 bg-gris-100 rounded-md relative border border-gris-200 flex flex-col items-center justify-center first:border-l-[3px] first:border-l-rouge">
            <div className="font-sans text-[0.8rem] font-semibold text-noir mb-1.5">
              {step.name}
            </div>
            <div className="font-sans text-[0.65rem] text-blanc bg-gris-600 py-0.5 px-2 rounded-[10px] tracking-wide">
              {step.duration}
            </div>
          </div>
          {index < data.steps.length - 1 && (
            <div className="flex items-center justify-center w-8 text-gris-400 text-base flex-shrink-0">
              →
            </div>
          )}
        </Fragment>
      ))}
    </div>
  );
}
