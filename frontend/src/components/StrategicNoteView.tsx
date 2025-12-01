"use client";

import { useEffect } from "react";
import type { StrategicNote, TocItem } from "@/types/document";
import { Navigation, DocumentHeader, TableOfContents, Section, Signature } from "./sections";
import { CommentsSidebar } from "./comments";
import { SelectionPopup } from "./comments/SelectionPopup";

interface StrategicNoteViewProps {
  note: StrategicNote;
  documentId: string;
}

export function StrategicNoteView({ note, documentId }: StrategicNoteViewProps) {
  const { meta, toc, sections } = note;

  // Navigation items for sticky nav (with short titles)
  const navItems: TocItem[] = toc.map((item) => ({
    ...item,
    title: item.shortTitle || item.title,
  }));

  // Scroll hints for mobile
  useEffect(() => {
    const scrollableElements = window.document.querySelectorAll(".arch-diagram, .table-wrap");
    const hints: HTMLDivElement[] = [];
    const resizeHandlers: (() => void)[] = [];

    scrollableElements.forEach((el) => {
      const hint = window.document.createElement("div");
      hint.className = "scroll-hint-text";
      hint.textContent = "← Glissez pour voir plus →";
      el.after(hint);
      hints.push(hint);

      const checkOverflow = () => {
        const hasOverflow = el.scrollWidth > el.clientWidth + 10;
        hint.style.display = hasOverflow ? "" : "none";
      };

      checkOverflow();
      resizeHandlers.push(checkOverflow);
      window.addEventListener("resize", checkOverflow);
    });

    return () => {
      hints.forEach((hint) => hint.remove());
      resizeHandlers.forEach((handler) => window.removeEventListener("resize", handler));
    };
  }, []);

  return (
    <>
      <Navigation meta={meta} tocItems={navItems} />

      <main>
        <DocumentHeader meta={meta} />
        <TableOfContents items={toc} />

        {sections.map((section, _index) => (
          <Section key={section.id} section={section} />
        ))}

        {/* Final signature section */}
        <section id="signature">
          <Signature meta={meta} />
        </section>
      </main>

      <SelectionPopup />
      <CommentsSidebar documentId={documentId} />
    </>
  );
}
