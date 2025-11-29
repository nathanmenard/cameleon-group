"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui";
import { useCommentsStore } from "@/stores/useCommentsStore";
import { useUser } from "@/hooks/useUser";

interface NewCommentFormProps {
  onSubmit: (data: {
    content: string;
    authorName: string;
    isInternal: boolean;
  }) => Promise<void>;
  onCancel: () => void;
}

export function NewCommentForm({ onSubmit, onCancel }: NewCommentFormProps) {
  const { currentSelection } = useCommentsStore();
  const { user } = useUser();

  const [name, setName] = useState(user?.name || "");
  const [content, setContent] = useState("");
  const [isInternal, setIsInternal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      alert("Veuillez écrire un commentaire");
      return;
    }

    if (!user && !name.trim()) {
      alert("Veuillez entrer votre nom");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        content: content.trim(),
        authorName: user?.name || name.trim(),
        isInternal,
      });
      setContent("");
      setIsInternal(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-gris-50 border-t border-gris-200">
      {/* Quote */}
      {currentSelection && (
        <div className="mb-4 p-3 bg-blanc rounded-lg border-l-4 border-rouge text-sm text-gris-600 italic">
          &ldquo;
          {currentSelection.text.length > 100
            ? `${currentSelection.text.substring(0, 100)}...`
            : currentSelection.text}
          &rdquo;
        </div>
      )}

      {/* Name field (only if not logged in) */}
      {!user && (
        <div className="mb-3">
          <label className="block text-xs font-semibold text-gris-600 mb-1">
            Votre nom
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Prénom Nom"
            className={cn(
              "w-full px-3 py-2 text-sm rounded-lg border border-gris-200",
              "focus:outline-none focus:ring-2 focus:ring-rouge/20 focus:border-rouge"
            )}
          />
        </div>
      )}

      {/* Content */}
      <div className="mb-3">
        <label className="block text-xs font-semibold text-gris-600 mb-1">
          Commentaire
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Écrivez votre commentaire..."
          rows={3}
          className={cn(
            "w-full px-3 py-2 text-sm rounded-lg border border-gris-200 resize-none",
            "focus:outline-none focus:ring-2 focus:ring-rouge/20 focus:border-rouge"
          )}
          autoFocus={!!user}
        />
      </div>

      {/* Internal checkbox */}
      <label className="flex items-center gap-2 mb-4 cursor-pointer">
        <input
          type="checkbox"
          checked={isInternal}
          onChange={(e) => setIsInternal(e.target.checked)}
          className="w-4 h-4 rounded border-gris-300 text-rouge focus:ring-rouge"
        />
        <span className="text-sm text-gris-600">
          Confidentiel (Drakkar uniquement)
        </span>
      </label>

      {/* Actions */}
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onCancel}
          className="flex-1"
        >
          Annuler
        </Button>
        <Button
          type="submit"
          variant="primary"
          size="sm"
          disabled={isSubmitting}
          className="flex-1"
        >
          {isSubmitting ? "Envoi..." : "Envoyer"}
        </Button>
      </div>
    </form>
  );
}

export default NewCommentForm;
