"use client";

import { useEffect, useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { useCommentsStore } from "@/stores/useCommentsStore";
import type { TextSelection } from "@/types";

export function SelectionPopup() {
  const { openSidebar, setCurrentSelection, setShowNewCommentForm } =
    useCommentsStore();

  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  const handleSelectionChange = useCallback(() => {
    const selection = window.getSelection();
    const text = selection?.toString().trim() || "";

    // Check if valid selection
    if (text.length < 4 || text.length > 500) {
      setIsVisible(false);
      return;
    }

    // Check if selection is in a section
    const range = selection?.getRangeAt(0);
    const container = range?.startContainer.parentElement;
    const section = container?.closest("section[id]");

    if (!section) {
      setIsVisible(false);
      return;
    }

    // Check if clicking inside sidebar or popup
    const clickedElement = document.elementFromPoint(position.x, position.y);
    if (
      clickedElement?.closest(".comments-sidebar") ||
      clickedElement?.closest(".selection-popup")
    ) {
      return;
    }

    // Store selection
    const textSelection: TextSelection = {
      text,
      sectionId: section.id,
      range: range!.cloneRange(),
    };
    setCurrentSelection(textSelection);

    // Position popup
    const rect = range!.getBoundingClientRect();
    setPosition({
      x: rect.left + rect.width / 2,
      y: rect.bottom + window.scrollY + 8,
    });
    setIsVisible(true);
  }, [setCurrentSelection, position.x, position.y]);

  const hidePopup = useCallback(() => {
    setIsVisible(false);
  }, []);

  const handleComment = () => {
    hidePopup();
    openSidebar();
    setShowNewCommentForm(true);
    window.getSelection()?.removeAllRanges();
  };

  useEffect(() => {
    const handleMouseUp = () => {
      // Small delay to let selection complete
      setTimeout(handleSelectionChange, 10);
    };

    const handleScroll = () => {
      hidePopup();
    };

    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("touchend", handleMouseUp);
    document.addEventListener("scroll", handleScroll);

    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchend", handleMouseUp);
      document.removeEventListener("scroll", handleScroll);
    };
  }, [handleSelectionChange, hidePopup]);

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        "selection-popup fixed z-50 bg-noir rounded-lg shadow-xl animate-popup-in",
        "px-1 py-1"
      )}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: "translateX(-50%)",
      }}
    >
      <button
        onClick={handleComment}
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-md",
          "text-blanc text-sm font-medium",
          "hover:bg-blanc/10 transition-colors"
        )}
      >
        <span>💬</span>
        <span>Commenter</span>
      </button>
    </div>
  );
}

export default SelectionPopup;
