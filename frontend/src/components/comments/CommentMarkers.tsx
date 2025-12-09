"use client";

import { useEffect, useState, useCallback } from "react";
import { useCommentsStore } from "@/stores/useCommentsStore";

interface CommentMarkerPosition {
  id: string;
  top: number;
  sectionId: string;
  count: number;
}

interface CommentMarkersProps {
  documentId: string;
}

export function CommentMarkers({ documentId }: CommentMarkersProps) {
  const { comments, openSidebar, setActiveComment } = useCommentsStore();
  const [markers, setMarkers] = useState<CommentMarkerPosition[]>([]);

  const calculateMarkerPositions = useCallback(() => {
    // Group comments by section
    const commentsBySectionId = comments.reduce((acc, comment) => {
      const sectionId = comment.section_id;
      if (!sectionId || !acc[sectionId]) {
        if (sectionId) acc[sectionId] = [];
      }
      if (sectionId) acc[sectionId].push(comment);
      return acc;
    }, {} as Record<string, typeof comments>);

    const newMarkers: CommentMarkerPosition[] = [];

    for (const [sectionId, sectionComments] of Object.entries(commentsBySectionId)) {
      const section = document.getElementById(sectionId);
      if (!section) continue;

      const rect = section.getBoundingClientRect();
      const scrollTop = window.scrollY;

      newMarkers.push({
        id: sectionId,
        top: rect.top + scrollTop + 40, // Offset from section top
        sectionId,
        count: sectionComments.length,
      });
    }

    setMarkers(newMarkers);
  }, [comments]);

  useEffect(() => {
    calculateMarkerPositions();

    // Recalculate on scroll and resize
    const handleUpdate = () => {
      requestAnimationFrame(calculateMarkerPositions);
    };

    window.addEventListener("scroll", handleUpdate);
    window.addEventListener("resize", handleUpdate);

    return () => {
      window.removeEventListener("scroll", handleUpdate);
      window.removeEventListener("resize", handleUpdate);
    };
  }, [calculateMarkerPositions]);

  const handleMarkerClick = (sectionId: string) => {
    // Find first comment in this section
    const firstComment = comments.find((c) => c.section_id === sectionId);
    if (firstComment) {
      setActiveComment(firstComment.id);
    }
    openSidebar();
  };

  if (markers.length === 0) return null;

  return (
    <div className="comment-markers-container">
      {markers.map((marker) => (
        <button
          type="button"
          key={marker.id}
          className="comment-marker"
          style={{ top: marker.top }}
          onClick={() => handleMarkerClick(marker.sectionId)}
          aria-label={`${marker.count} commentaire${marker.count > 1 ? "s" : ""} dans cette section`}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <span className="comment-marker-count">{marker.count}</span>
        </button>
      ))}
    </div>
  );
}

export default CommentMarkers;
