import { SystemMapBlock } from "@/types/document";

interface SystemMapProps {
  data: SystemMapBlock;
}

export function SystemMap({ data }: SystemMapProps) {
  return (
    <div className="system-map">
      <div className="system-row">
        {data.blocks.map((block) => (
          <div key={block.id} className={`system-block system-${block.variant}`}>
            <div className="system-title">{block.title}</div>
            <ul>
              {block.items.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
