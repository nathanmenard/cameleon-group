import { TocItem } from "@/types/document";

interface TableOfContentsProps {
  items: TocItem[];
}

export function TableOfContents({ items }: TableOfContentsProps) {
  return (
    <div className="toc" id="tocBlock">
      <div className="toc-header">
        <div className="toc-title">Sommaire</div>
        <div className="toc-count">{items.length} sections</div>
      </div>
      <div className="toc-grid">
        {items.map((item) => (
          <a key={item.id} href={`#${item.id}`} className="toc-item">
            <span className="toc-item-num">{item.num.padStart(2, "0")}</span>
            <span className="toc-item-text">{item.shortTitle || item.title}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
