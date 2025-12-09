"use client";

import { useEffect, useRef } from "react";
import { useCommentsStore } from "@/stores/useCommentsStore";

/**
 * This component applies permanent highlights to commented text in the document.
 * It watches the comments store and highlights text that has comments.
 */
export function CommentHighlights() {
  const { comments, isCommentModeActive } = useCommentsStore();
  const highlightsRef = useRef<HTMLElement[]>([]);

  useEffect(() => {
    // Clear previous highlights
    for (const el of highlightsRef.current) {
      const parent = el.parentNode;
      if (parent) {
        parent.replaceChild(document.createTextNode(el.textContent || ""), el);
        parent.normalize();
      }
    }
    highlightsRef.current = [];

    // Only show highlights when comment mode is active
    if (!isCommentModeActive) return;

    // Get unique commented texts (only unresolved comments)
    const commentedTexts = comments
      .filter((c) => c.selected_text && !c.is_resolved)
      .map((c) => ({
        sectionId: c.section_id,
        text: c.selected_text!,
        commentId: c.id,
      }));

    // Apply highlights for each commented text
    for (const { sectionId, text, commentId } of commentedTexts) {
      const section = document.getElementById(sectionId);
      if (!section) continue;

      // Search for the text in the section
      const walker = document.createTreeWalker(section, NodeFilter.SHOW_TEXT);
      let node: Node | null = walker.nextNode();
      const searchText = text.substring(0, 50); // Match first 50 chars

      while (node) {
        const textContent = node.textContent || "";
        const index = textContent.indexOf(searchText);

        if (index !== -1) {
          try {
            const range = document.createRange();
            range.setStart(node, index);
            range.setEnd(node, Math.min(index + text.length, textContent.length));

            const highlight = document.createElement("mark");
            highlight.className = "comment-highlight";
            highlight.dataset.commentId = String(commentId);
            highlight.style.cssText = `
              background: rgba(178, 34, 34, 0.12);
              border-bottom: 2px solid rgba(178, 34, 34, 0.4);
              padding: 0 2px;
              margin: 0 -2px;
              border-radius: 2px;
              cursor: pointer;
              transition: all 0.15s ease;
            `;

            // Add hover effect
            highlight.addEventListener("mouseenter", () => {
              highlight.style.background = "rgba(178, 34, 34, 0.25)";
              highlight.style.borderBottomColor = "rgba(178, 34, 34, 0.8)";
            });
            highlight.addEventListener("mouseleave", () => {
              highlight.style.background = "rgba(178, 34, 34, 0.12)";
              highlight.style.borderBottomColor = "rgba(178, 34, 34, 0.4)";
            });

            // Click to focus comment in sidebar
            highlight.addEventListener("click", (e) => {
              e.stopPropagation();
              useCommentsStore.getState().setActiveComment(commentId);
              // Scroll to comment in sidebar
              const commentEl = document.querySelector(`[data-comment-id="${commentId}"]`);
              commentEl?.scrollIntoView({ behavior: "smooth", block: "center" });
            });

            range.surroundContents(highlight);
            highlightsRef.current.push(highlight);
          } catch {
            // Range might fail if it crosses element boundaries
          }
          break; // Only highlight first occurrence
        }
        node = walker.nextNode();
      }
    }

    // Cleanup on unmount
    return () => {
      for (const el of highlightsRef.current) {
        const parent = el.parentNode;
        if (parent) {
          parent.replaceChild(document.createTextNode(el.textContent || ""), el);
          parent.normalize();
        }
      }
      highlightsRef.current = [];
    };
  }, [comments, isCommentModeActive]);

  return null; // This component doesn't render anything
}

export default CommentHighlights;
