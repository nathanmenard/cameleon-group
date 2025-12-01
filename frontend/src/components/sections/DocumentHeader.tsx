import type { DocumentMeta } from "@/types/document";

interface DocumentHeaderProps {
  meta: DocumentMeta;
}

export function DocumentHeader({ meta }: DocumentHeaderProps) {
  return (
    <header className="doc-header">
      <div className="doc-type">{meta.type}</div>
      <h1 className="doc-title">{meta.title}</h1>
      <p className="doc-subtitle">{meta.subtitle}</p>
    </header>
  );
}
