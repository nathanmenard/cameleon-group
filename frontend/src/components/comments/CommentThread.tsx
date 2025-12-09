"use client";

import { useState } from "react";
import { formatDate, scrollToText } from "@/lib/utils";
import type { Comment } from "@/types";
import { useCommentsStore } from "@/stores/useCommentsStore";
import { ReplyForm } from "./ReplyForm";

// Parse "Prénom Nom • Entreprise" format
function parseAuthorName(authorName: string): { name: string; company: string | null; initials: string } {
  const parts = authorName.split(" • ");
  const name = parts[0];
  const company = parts[1] || null;

  // Get initials from first two words of name
  const nameParts = name.trim().split(" ");
  const initials = nameParts.length >= 2
    ? `${nameParts[0].charAt(0)}${nameParts[1].charAt(0)}`.toUpperCase()
    : name.charAt(0).toUpperCase();

  return { name, company, initials };
}

interface CommentThreadProps {
  comment: Comment;
  onResolve: (id: number) => void;
  onDelete: (id: number) => void;
  onReply: (parentId: number, content: string) => Promise<void>;
  canReply?: boolean;
}

export function CommentThread({
  comment,
  onResolve,
  onDelete,
  onReply,
  canReply = false,
}: CommentThreadProps) {
  const { activeCommentId, setActiveComment } = useCommentsStore();
  const [showReplyForm, setShowReplyForm] = useState(false);
  const isActive = activeCommentId === comment.id;

  const handleQuoteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    scrollToText(comment.section_id, comment.selected_text);
  };

  const handleReplySubmit = async (content: string) => {
    await onReply(comment.id, content);
    setShowReplyForm(false);
  };

  return (
    <div
      onClick={() => setActiveComment(comment.id)}
      style={{
        backgroundColor: "#fff",
        borderRadius: "8px",
        marginBottom: "8px",
        border: isActive ? "1px solid #111" : "1px solid #e8e8e8",
        opacity: comment.is_resolved ? 0.6 : 1,
        cursor: "pointer",
        transition: "all 0.15s",
      }}
    >
      {/* Main comment */}
      <div style={{ padding: "12px" }}>
        {/* Header */}
        <div style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: "8px",
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
            <div style={{
              width: "28px",
              height: "28px",
              borderRadius: "50%",
              backgroundColor: "#111",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "10px",
              fontWeight: 600,
              flexShrink: 0,
            }}>
              {parseAuthorName(comment.author_name).initials}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ fontSize: "12px", fontWeight: 500, color: "#333" }}>
                  {parseAuthorName(comment.author_name).name}
                </span>
                <span style={{ fontSize: "11px", color: "#999" }}>
                  {formatDate(comment.created_at)}
                </span>
              </div>
              {parseAuthorName(comment.author_name).company && (
                <span style={{ fontSize: "11px", color: "#888" }}>
                  {parseAuthorName(comment.author_name).company}
                </span>
              )}
            </div>
          </div>

          {/* Badges */}
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            {comment.is_internal && (
              <span style={{
                fontSize: "10px",
                fontWeight: 500,
                color: "#B22222",
                backgroundColor: "rgba(178,34,34,0.1)",
                padding: "2px 6px",
                borderRadius: "3px",
              }}>
                Interne
              </span>
            )}
            {comment.is_resolved && (
              <span style={{
                fontSize: "10px",
                fontWeight: 500,
                color: "#16a34a",
                backgroundColor: "#f0fdf4",
                padding: "2px 6px",
                borderRadius: "3px",
              }}>
                Résolu
              </span>
            )}
          </div>
        </div>

        {/* Quote */}
        {comment.selected_text && (
          <button
            type="button"
            onClick={handleQuoteClick}
            style={{
              display: "block",
              width: "100%",
              textAlign: "left",
              marginBottom: "8px",
              padding: "8px 10px",
              backgroundColor: "#f8f8f8",
              borderRadius: "4px",
              borderLeft: "2px solid #ddd",
              border: "none",
              cursor: "pointer",
              fontSize: "11px",
              color: "#666",
              fontStyle: "italic",
              lineHeight: 1.4,
              transition: "border-color 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderLeftColor = "#B22222";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderLeftColor = "#ddd";
            }}
          >
            {comment.selected_text.length > 80
              ? `${comment.selected_text.substring(0, 80)}...`
              : comment.selected_text}
          </button>
        )}

        {/* Content */}
        <p style={{
          fontSize: "13px",
          color: "#333",
          lineHeight: 1.5,
          margin: 0,
        }}>
          {comment.content}
        </p>

        {/* Actions */}
        {isActive && (
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginTop: "10px",
            paddingTop: "10px",
            borderTop: "1px solid #f0f0f0",
          }}>
            {canReply && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowReplyForm(!showReplyForm);
                }}
                style={{
                  fontSize: "11px",
                  color: "#666",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                Répondre
              </button>
            )}
            {comment.is_owner && !comment.is_resolved && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onResolve(comment.id);
                }}
                style={{
                  fontSize: "11px",
                  color: "#16a34a",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                Résoudre
              </button>
            )}
            {comment.is_owner && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(comment.id);
                }}
                style={{
                  fontSize: "11px",
                  color: "#999",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  marginLeft: "auto",
                }}
              >
                Supprimer
              </button>
            )}
          </div>
        )}

        {/* Reply form */}
        {showReplyForm && canReply && (
          <div style={{ marginTop: "10px" }}>
            <ReplyForm
              onSubmit={handleReplySubmit}
              onCancel={() => setShowReplyForm(false)}
            />
          </div>
        )}
      </div>

      {/* Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div style={{
          borderTop: "1px solid #f0f0f0",
          backgroundColor: "#fafafa",
          borderRadius: "0 0 8px 8px",
        }}>
          {comment.replies.map((reply) => {
            const replyAuthor = parseAuthorName(reply.author_name);
            return (
              <div
                key={reply.id}
                style={{
                  padding: "10px 12px",
                  borderBottom: "1px solid #f0f0f0",
                }}
              >
                <div style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "6px",
                  marginBottom: "4px",
                }}>
                  <div style={{
                    width: "20px",
                    height: "20px",
                    borderRadius: "50%",
                    backgroundColor: "#666",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "8px",
                    fontWeight: 600,
                    flexShrink: 0,
                  }}>
                    {replyAuthor.initials}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
                      <span style={{ fontSize: "11px", fontWeight: 500, color: "#333" }}>
                        {replyAuthor.name}
                      </span>
                      {replyAuthor.company && (
                        <span style={{ fontSize: "10px", color: "#888" }}>
                          {replyAuthor.company}
                        </span>
                      )}
                      <span style={{ fontSize: "10px", color: "#999" }}>
                        {formatDate(reply.created_at)}
                      </span>
                    </div>
                    <p style={{
                      fontSize: "12px",
                      color: "#555",
                      margin: "4px 0 0 0",
                      lineHeight: 1.4,
                    }}>
                      {reply.content}
                    </p>
                  </div>
                  {reply.is_owner && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(reply.id);
                      }}
                      style={{
                        fontSize: "12px",
                        color: "#999",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        padding: 0,
                        flexShrink: 0,
                      }}
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default CommentThread;
