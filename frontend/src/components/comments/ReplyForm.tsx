"use client";

import { useState, useRef, useEffect } from "react";

interface ReplyFormProps {
  onSubmit: (content: string) => Promise<void>;
  onCancel: () => void;
}

export function ReplyForm({ onSubmit, onCancel }: ReplyFormProps) {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const handleSubmit = async () => {
    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(content.trim());
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSubmit();
    }
    if (e.key === "Escape") {
      onCancel();
    }
  };

  const canSubmit = content.trim().length > 0;

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      gap: "8px",
    }}>
      <textarea
        ref={textareaRef}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Répondre..."
        rows={2}
        style={{
          width: "100%",
          padding: "8px 10px",
          fontSize: "12px",
          borderRadius: "6px",
          border: "1px solid #e0e0e0",
          outline: "none",
          resize: "none",
          fontFamily: "inherit",
          lineHeight: 1.5,
          boxSizing: "border-box",
        }}
      />
      <div style={{
        display: "flex",
        justifyContent: "flex-end",
        gap: "6px",
      }}>
        <button
          type="button"
          onClick={onCancel}
          style={{
            fontSize: "11px",
            color: "#888",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "4px 8px",
          }}
        >
          Annuler
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!canSubmit || isSubmitting}
          style={{
            fontSize: "11px",
            fontWeight: 500,
            color: canSubmit ? "#fff" : "#999",
            backgroundColor: canSubmit ? "#111" : "#f0f0f0",
            padding: "4px 10px",
            borderRadius: "4px",
            border: "none",
            cursor: canSubmit ? "pointer" : "default",
          }}
        >
          {isSubmitting ? "..." : "Répondre"}
        </button>
      </div>
    </div>
  );
}

export default ReplyForm;
