import { ProcessFlowBlock } from "@/types/document";

interface ProcessFlowProps {
  data: ProcessFlowBlock;
}

export function ProcessFlow({ data }: ProcessFlowProps) {
  return (
    <div className="process-flow">
      {data.steps.map((step, index) => (
        <div key={index} className="process-step">
          <div className="process-name">{step.name}</div>
          <div className="process-duration">{step.duration}</div>
        </div>
      ))}
    </div>
  );
}
