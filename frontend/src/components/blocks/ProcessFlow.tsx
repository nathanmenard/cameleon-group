import { Fragment } from "react";
import { ProcessFlowBlock } from "@/types/document";

interface ProcessFlowProps {
  data: ProcessFlowBlock;
}

export function ProcessFlow({ data }: ProcessFlowProps) {
  return (
    <div className="process-flow">
      {data.steps.map((step, index) => (
        <Fragment key={index}>
          <div className="process-step">
            <div className="process-name">{step.name}</div>
            <div className="process-duration">{step.duration}</div>
          </div>
          {index < data.steps.length - 1 && (
            <div className="process-arrow">→</div>
          )}
        </Fragment>
      ))}
    </div>
  );
}
