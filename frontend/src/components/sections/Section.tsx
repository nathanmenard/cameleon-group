import type { Section as SectionType } from "@/types/document";
import { ContentRenderer } from "./ContentRenderer";

interface SectionProps {
  section: SectionType;
}

export function Section({ section }: SectionProps) {
  return (
    <section id={section.id}>
      <div className="section-num">Section {section.num}</div>
      <h2>{section.title}</h2>
      {section.content.map((block) => (
        <ContentRenderer key={`${section.id}_${block.type}`} block={block} />
      ))}
    </section>
  );
}
