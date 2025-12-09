"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { useCommentsStore } from "@/stores/useCommentsStore";
import type { TextSelection, BlockSelection } from "@/types";

/**
 * CommentLayer - Clean, minimal interactions:
 * 1. Drag to select text → sidebar opens, text stays highlighted
 * 2. Click (no drag) on paragraph → sidebar opens for block
 * 3. Subtle dot indicator in left margin on hover
 */

export function CommentLayer() {
  const {
    isCommentModeActive,
    activateCommentMode,
    setCurrentSelection,
    setCurrentBlockSelection,
    setShowNewCommentForm,
    showNewCommentForm,
    isDraggingHandle,
  } = useCommentsStore();

  const [mounted, setMounted] = useState(false);
  const [hoveredBlock, setHoveredBlock] = useState<{
    top: number;
    height: number;
  } | null>(null);
  const mouseDownPos = useRef<{ x: number; y: number } | null>(null);
  const mouseDownTarget = useRef<HTMLElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Track hovered block for indicator
  const handleMouseMove = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest(".comments-sidebar, nav, .toc-nav, .toc")) {
      setHoveredBlock(null);
      return;
    }

    const block = target.closest("section[id] p, section[id] li, section[id] h2, section[id] h3, section[id] blockquote") as HTMLElement | null;
    if (block) {
      const rect = block.getBoundingClientRect();
      setHoveredBlock({
        top: rect.top + window.scrollY,
        height: rect.height,
      });
    } else {
      setHoveredBlock(null);
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoveredBlock(null);
  }, []);

  // Track mouse down position to detect drag vs click
  const handleMouseDown = useCallback((e: MouseEvent) => {
    // Don't track if clicking on selection handles
    const target = e.target as HTMLElement;
    if (target.closest("[data-selection-handle]")) {
      return;
    }
    mouseDownPos.current = { x: e.clientX, y: e.clientY };
    mouseDownTarget.current = target;
  }, []);

  const handleMouseUp = useCallback((e: MouseEvent) => {
    if (!mouseDownPos.current) return;

    // CRITICAL: Don't interfere when SelectionHandles is dragging
    if (isDraggingHandle) {
      mouseDownPos.current = null;
      mouseDownTarget.current = null;
      return;
    }

    const target = e.target as HTMLElement;

    // Don't process if clicking on selection handles
    if (target.closest("[data-selection-handle]")) {
      mouseDownPos.current = null;
      mouseDownTarget.current = null;
      return;
    }

    // Ignore sidebar, nav, toc
    if (target.closest(".comments-sidebar, nav, .toc-nav, .toc")) {
      mouseDownPos.current = null;
      mouseDownTarget.current = null;
      return;
    }

    // Calculate drag distance
    const dx = e.clientX - mouseDownPos.current.x;
    const dy = e.clientY - mouseDownPos.current.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const isDrag = distance > 5;

    setTimeout(() => {
      const selection = window.getSelection();
      const text = selection?.toString().trim() || "";

      // Find section
      const element = target.closest("section[id]") ? target : mouseDownTarget.current;
      const section = element?.closest("section[id]");

      if (!section) {
        mouseDownPos.current = null;
        mouseDownTarget.current = null;
        return;
      }

      if (isDrag && text.length >= 3 && selection?.rangeCount) {
        // DRAG: Text selection → open sidebar with selection, keep highlight
        const range = selection.getRangeAt(0);

        const textSelection: TextSelection = {
          text: text.slice(0, 200),
          sectionId: section.id,
          range: range.cloneRange(),
        };

        setCurrentSelection(textSelection);
        setCurrentBlockSelection(null);
        setShowNewCommentForm(true);
        activateCommentMode();

        // Keep selection visible - don't clear it
        // The highlight stays on the page

      } else if (!isDrag && text.length < 3) {
        // CLICK (no drag, no selection): Block comment
        const block = target.closest("p, li, h2, h3, blockquote") as HTMLElement | null;

        if (block && section) {
          const blockText = block.textContent?.slice(0, 300) || "";
          const idx = Array.from(block.parentElement?.children || []).indexOf(block);
          const blockId = `${section.id}:${block.tagName.toLowerCase()}-${idx}`;

          const blockSelection: BlockSelection = {
            blockId,
            sectionId: section.id,
            blockText,
          };

          setCurrentBlockSelection(blockSelection);
          setCurrentSelection(null);
          setShowNewCommentForm(true);
          activateCommentMode();
        }
      }

      mouseDownPos.current = null;
      mouseDownTarget.current = null;
    }, 10);
  }, [activateCommentMode, setCurrentSelection, setCurrentBlockSelection, setShowNewCommentForm, isDraggingHandle]);

  // Handle touch
  const handleTouchStart = useCallback((e: TouchEvent) => {
    const touch = e.touches[0];
    mouseDownPos.current = { x: touch.clientX, y: touch.clientY };
    mouseDownTarget.current = e.target as HTMLElement;
  }, []);

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    if (!mouseDownPos.current) return;

    // CRITICAL: Don't interfere when SelectionHandles is dragging
    if (isDraggingHandle) {
      mouseDownPos.current = null;
      mouseDownTarget.current = null;
      return;
    }

    const touch = e.changedTouches[0];
    const target = document.elementFromPoint(touch.clientX, touch.clientY) as HTMLElement;

    if (target?.closest(".comments-sidebar, nav, .toc-nav, .toc")) {
      mouseDownPos.current = null;
      mouseDownTarget.current = null;
      return;
    }

    const dx = touch.clientX - mouseDownPos.current.x;
    const dy = touch.clientY - mouseDownPos.current.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const isDrag = distance > 10;

    setTimeout(() => {
      const selection = window.getSelection();
      const text = selection?.toString().trim() || "";

      const section = target?.closest("section[id]");
      if (!section) {
        mouseDownPos.current = null;
        mouseDownTarget.current = null;
        return;
      }

      if (text.length >= 3 && selection?.rangeCount) {
        const range = selection.getRangeAt(0);

        const textSelection: TextSelection = {
          text: text.slice(0, 200),
          sectionId: section.id,
          range: range.cloneRange(),
        };

        setCurrentSelection(textSelection);
        setCurrentBlockSelection(null);
        setShowNewCommentForm(true);
        activateCommentMode();

      } else if (!isDrag) {
        const block = target?.closest("p, li, h2, h3, blockquote") as HTMLElement | null;

        if (block && section) {
          const blockText = block.textContent?.slice(0, 300) || "";
          const idx = Array.from(block.parentElement?.children || []).indexOf(block);
          const blockId = `${section.id}:${block.tagName.toLowerCase()}-${idx}`;

          const blockSelection: BlockSelection = {
            blockId,
            sectionId: section.id,
            blockText,
          };

          setCurrentBlockSelection(blockSelection);
          setCurrentSelection(null);
          setShowNewCommentForm(true);
          activateCommentMode();
        }
      }

      mouseDownPos.current = null;
      mouseDownTarget.current = null;
    }, 10);
  }, [activateCommentMode, setCurrentSelection, setCurrentBlockSelection, setShowNewCommentForm, isDraggingHandle]);

  useEffect(() => {
    if (!mounted) return;

    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("touchstart", handleTouchStart);
    document.addEventListener("touchend", handleTouchEnd);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchend", handleTouchEnd);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [mounted, handleMouseDown, handleMouseUp, handleTouchStart, handleTouchEnd, handleMouseMove, handleMouseLeave]);

  if (!mounted) return null;

  // Subtle indicator: small vertical line in left margin
  return createPortal(
    hoveredBlock && !isCommentModeActive && (
        <div
          style={{
            position: "absolute",
            top: hoveredBlock.top + 4,
            left: 12,
            width: 3,
            height: Math.min(hoveredBlock.height - 8, 24),
            backgroundColor: "#B22222",
            borderRadius: 2,
            opacity: 0.4,
            pointerEvents: "none",
            transition: "all 0.1s ease",
          }}
        />
      ),
    document.body
  );
}

export default CommentLayer;
