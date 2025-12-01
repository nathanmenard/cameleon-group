import type { ContentBlock } from "@/types/document";
import {
  WhyBlock,
  Insight,
  Highlight,
  KeyQuestion,
  SystemMap,
  ZonesGrid,
  ArchDiagram,
  Tracks,
  ProcessFlow,
  Options,
  Table,
  Checklist,
  Commitments,
  TwoCols,
} from "@/components/blocks";

interface ContentRendererProps {
  block: ContentBlock;
}

export function ContentRenderer({ block }: ContentRendererProps) {
  switch (block.type) {
    case "paragraph":
      return block.bold ? (
        <p><strong>{block.text}</strong></p>
      ) : (
        <p>{block.text}</p>
      );

    case "heading":
      if (block.level === 1) return <h1>{block.text}</h1>;
      if (block.level === 2) return <h2>{block.text}</h2>;
      return <h3>{block.text}</h3>;

    case "list":
      return block.ordered ? (
        <ol>
          {block.items.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ol>
      ) : (
        <ul>
          {block.items.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      );

    case "why-block":
      return <WhyBlock data={block} />;

    case "insight":
      return <Insight data={block} />;

    case "highlight":
      return <Highlight data={block} />;

    case "key-question":
      return <KeyQuestion data={block} />;

    case "system-map":
      return <SystemMap data={block} />;

    case "zones-grid":
      return <ZonesGrid data={block} />;

    case "arch-diagram":
      return <ArchDiagram data={block} />;

    case "tracks":
      return <Tracks data={block} />;

    case "process-flow":
      return <ProcessFlow data={block} />;

    case "options":
      return <Options data={block} />;

    case "table":
      return <Table data={block} />;

    case "checklist":
      return <Checklist data={block} />;

    case "commitments":
      return <Commitments data={block} />;

    case "two-cols":
      return <TwoCols data={block} />;

    case "footnote":
      return <p className="footnote">{block.text}</p>;

    default:
      return null;
  }
}
