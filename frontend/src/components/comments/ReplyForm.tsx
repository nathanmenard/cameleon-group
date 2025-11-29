"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui";

interface ReplyFormProps {
  onSubmit: (content: string) => Promise<void>;
  onCancel: () => void;
}

export function ReplyForm({ onSubmit, onCancel }: ReplyFormProps) {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      alert("Veuillez écrire une réponse");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(content.trim());
      setContent("");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-3 bg-gris-50 border-t border-gris-200">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Votre réponse..."
        rows={2}
        className={cn(
          "w-full px-3 py-2 text-sm rounded-lg border border-gris-200 resize-none mb-2",
          "focus:outline-none focus:ring-2 focus:ring-rouge/20 focus:border-rouge"
        )}
        autoFocus
      />
      <div className="flex gap-2 justify-end">
        <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit" variant="primary" size="sm" disabled={isSubmitting}>
          {isSubmitting ? "..." : "Envoyer"}
        </Button>
      </div>
    </form>
  );
}

export default ReplyForm;
