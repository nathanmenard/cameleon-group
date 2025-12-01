import type { ArchDiagramBlock } from "@/types/document";

interface ArchDiagramProps {
  data: ArchDiagramBlock;
}

export function ArchDiagram({ data }: ArchDiagramProps) {
  return (
    <div className="arch-diagram">
      <div className="arch-header">
        <h4>{data.header.title}</h4>
        <p>{data.header.description}</p>
      </div>
      <div className="arch-connector">
        <div className="arch-connector-line" />
      </div>
      <div className="arch-modules">
        {data.modules.map((module, index) => (
          <div key={index} className={`arch-module ${module.variant || ""}`}>
            <div className="arch-module-name">{module.name}</div>
            <div className="arch-module-status">{module.status}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
