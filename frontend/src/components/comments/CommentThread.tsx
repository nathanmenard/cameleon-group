"use client";

import { cn } from "@/lib/utils";
import { formatDate, scrollToText } from "@/lib/utils";
import type { Comment } from "@/types";
import { useCommentsStore } from "@/stores/useCommentsStore";

interface CommentThreadProps {
  comment: Comment;
  onResolve: (id: number) => void;
  onDelete: (id: number) => void;
  onReply: (id: number) => void;
}

export function CommentThread({
  comment,
  onResolve,
  onDelete,
  onReply,
}: CommentThreadProps) {
  const { activeCommentId, setActiveComment } = useCommentsStore();
  const isActive = activeCommentId === comment.id;

  const handleQuoteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    scrollToText(comment.section_id, comment.selected_text);
  };

  return (
    <div
      className={cn(
        "bg-blanc border border-gris-200 rounded-lg overflow-hidden transition-all duration-150",
        "hover:border-gris-300 hover:shadow-sm",
        isActive && "border-rouge shadow-md ring-2 ring-rouge/10",
        comment.is_resolved && "opacity-60"
      )}
      onClick={() => setActiveComment(comment.id)}
    >
      {/* Quote */}
      {comment.selected_text && (
        <button
          onClick={handleQuoteClick}
          className={cn(
            "w-full text-left px-4 py-3 bg-gris-50 border-b border-gris-100",
            "text-sm text-gris-600 italic leading-relaxed",
            "hover:bg-gris-100 transition-colors cursor-pointer"
          )}
          title="Cliquez pour voir dans le document"
        >
          &ldquo;
          {comment.selected_text.length > 80
            ? `${comment.selected_text.substring(0, 80)}...`
            : comment.selected_text}
          &rdquo;
        </button>
      )}

      {/* Main content */}
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <span className="font-medium text-sm text-noir">
            {comment.author_name}
          </span>
          <span className="text-xs text-gris-400">
            {formatDate(comment.created_at)}
          </span>
        </div>

        {/* Content */}
        <p className="text-sm text-gris-700 leading-relaxed mb-3">
          {comment.content}
        </p>

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-3">
          {comment.is_internal && (
            <span className="text-xs font-semibold uppercase tracking-wide text-rouge-sombre bg-rouge/10 px-2 py-0.5 rounded">
              Confidentiel
            </span>
          )}
          {comment.is_resolved && (
            <span className="text-xs font-semibold uppercase tracking-wide text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
              Résolu
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-2 border-t border-gris-100">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onReply(comment.id);
            }}
            className="text-xs text-gris-500 hover:text-noir px-2 py-1 rounded hover:bg-gris-100 transition-colors"
          >
            Répondre
          </button>
          {comment.is_owner && !comment.is_resolved && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onResolve(comment.id);
              }}
              className="text-xs text-gris-500 hover:text-noir px-2 py-1 rounded hover:bg-gris-100 transition-colors"
            >
              Résoudre
            </button>
          )}
          {comment.is_owner && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(comment.id);
              }}
              className="text-xs text-gris-500 hover:text-rouge px-2 py-1 rounded hover:bg-rouge/5 transition-colors"
            >
              Supprimer
            </button>
          )}
        </div>
      </div>

      {/* Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="bg-gris-50 border-t border-gris-200 px-4 py-3">
          <div className="text-xs font-semibold uppercase tracking-wide text-gris-500 mb-3">
            {comment.replies.length} réponse
            {comment.replies.length > 1 ? "s" : ""}
          </div>
          <div className="space-y-3">
            {comment.replies.map((reply) => (
              <div
                key={reply.id}
                className="border-l-2 border-gris-200 pl-3 py-1"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-xs text-noir">
                    {reply.author_name}
                  </span>
                  <span className="text-xs text-gris-400">
                    {formatDate(reply.created_at)}
                  </span>
                </div>
                <p className="text-sm text-gris-700">{reply.content}</p>
                {reply.is_owner && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(reply.id);
                    }}
                    className="text-xs text-gris-400 hover:text-rouge mt-1"
                  >
                    Supprimer
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default CommentThread;
