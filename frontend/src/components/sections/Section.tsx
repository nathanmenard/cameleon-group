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
      {section.content.map((block, index) => (
        <ContentRenderer key={index} block={block} />
      ))}
    </section>
  );
}
