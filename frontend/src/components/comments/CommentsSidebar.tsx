"use client";

import { useEffect, useCallback, useState, useMemo } from "react";
import { useCommentsStore } from "@/stores/useCommentsStore";
import { useUser } from "@/hooks/useUser";
import { api } from "@/lib/api";
import { getUserInitials } from "@/types";
import { formatDate, scrollToText } from "@/lib/utils";

interface CommentsSidebarProps {
  documentId: string;
  clientName?: string;
  tocNavVisible?: boolean;
}

// Parse "Prénom Nom • Entreprise" format
function parseAuthorName(authorName: string): { name: string; company: string | null; initials: string } {
  const parts = authorName.split(" • ");
  const name = parts[0];
  const company = parts[1] || null;
  const nameParts = name.trim().split(" ");
  const initials = nameParts.length >= 2
    ? `${nameParts[0].charAt(0)}${nameParts[1].charAt(0)}`.toUpperCase()
    : name.charAt(0).toUpperCase();
  return { name, company, initials };
}

export function CommentsSidebar({
  documentId,
  clientName = "Client",
  tocNavVisible = false
}: CommentsSidebarProps) {
  const {
    comments,
    isLoading,
    isCommentModeActive,
    showNewCommentForm,
    currentSelection,
    currentBlockSelection,
    setComments,
    setLoading,
    deactivateCommentMode,
    toggleCommentMode,
    setShowNewCommentForm,
    setCurrentSelection,
    setCurrentBlockSelection,
    unresolvedCount,
  } = useCommentsStore();

  const { user, login, logout, token } = useUser();

  // Form state
  const [commentText, setCommentText] = useState("");
  const [isInternal, setIsInternal] = useState(false);
  const [askingIdentity, setAskingIdentity] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [company, setCompany] = useState("");
  const [customCompany, setCustomCompany] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const [editSelectedText, setEditSelectedText] = useState<string | null>(null);
  const [isReselectingForEdit, setIsReselectingForEdit] = useState(false);

  const companyOptions = [clientName, "Drakkar Group", "Autre"];

  const loadComments = useCallback(async () => {
    setLoading(true);
    try {
      // Always include internal comments so users can see all their comments
      const data = await api.getComments(documentId, token || undefined, true);
      setComments(data.comments);
    } catch (error) {
      console.error("Error loading comments:", error);
    } finally {
      setLoading(false);
    }
  }, [documentId, token, setComments, setLoading]);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  // Reset form when new selection
  useEffect(() => {
    if (showNewCommentForm) {
      setCommentText("");
      setIsInternal(false);
      setAskingIdentity(false);
    }
  }, [showNewCommentForm, currentSelection, currentBlockSelection]);

  const handleSubmitComment = async () => {
    if (!commentText.trim()) return;

    if (!user) {
      setAskingIdentity(true);
      return;
    }

    await submitComment(user);
  };

  const handleIdentitySubmit = async () => {
    if (!firstName.trim() || !lastName.trim()) return;
    const finalCompany = company === "Autre" ? customCompany.trim() : company;
    if (!finalCompany) return;

    const newUser = login({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      company: finalCompany,
    });
    await submitComment(newUser);
  };

  const submitComment = async (submittingUser: { firstName: string; lastName: string; company: string; token: string }) => {
    const sectionId = currentSelection?.sectionId || currentBlockSelection?.sectionId;
    const selectedText = currentSelection?.text || currentBlockSelection?.blockText;
    if (!sectionId) return;

    setIsSubmitting(true);
    try {
      const displayName = `${submittingUser.firstName} ${submittingUser.lastName} • ${submittingUser.company}`;
      await api.createComment({
        document_id: documentId,
        section_id: sectionId,
        author_name: displayName,
        author_token: submittingUser.token,
        selected_text: selectedText,
        content: commentText.trim(),
        is_internal: isInternal,
      });

      setShowNewCommentForm(false);
      setCurrentBlockSelection(null);
      setCommentText("");
      setAskingIdentity(false);
      await loadComments();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelComment = () => {
    setShowNewCommentForm(false);
    setCurrentBlockSelection(null);
    setCommentText("");
    setAskingIdentity(false);
  };

  const handleReply = async (parentId: number) => {
    if (!replyText.trim() || !user) return;

    const parentComment = comments.find((c) => c.id === parentId);
    if (!parentComment) return;

    const displayName = `${user.firstName} ${user.lastName} • ${user.company}`;
    await api.createComment({
      document_id: documentId,
      section_id: parentComment.section_id,
      author_name: displayName,
      author_token: user.token,
      content: replyText.trim(),
      parent_id: parentId,
      is_internal: parentComment.is_internal,
    });

    setReplyingTo(null);
    setReplyText("");
    await loadComments();
  };

  const handleResolve = async (commentId: number) => {
    if (!token) return;
    await api.updateComment(commentId, { author_token: token, is_resolved: true });
    await loadComments();
  };

  const startEditing = (comment: { id: number; content: string; selected_text?: string | null }) => {
    setEditingId(comment.id);
    setEditText(comment.content);
    setEditSelectedText(comment.selected_text || null);
    setIsReselectingForEdit(false);
    setReplyingTo(null);
  };

  const handleEdit = async (commentId: number) => {
    if (!editText.trim() || !token) return;
    const updateData: { author_token: string; content: string; selected_text?: string } = {
      author_token: token,
      content: editText.trim(),
    };
    // Include selected_text if it was changed
    if (editSelectedText !== null) {
      updateData.selected_text = editSelectedText;
    }
    await api.updateComment(commentId, updateData);
    setEditingId(null);
    setEditText("");
    setEditSelectedText(null);
    setIsReselectingForEdit(false);
    await loadComments();
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText("");
    setEditSelectedText(null);
    setIsReselectingForEdit(false);
  };

  // Handle text selection for edit reselection
  const handleReselectForEdit = () => {
    setIsReselectingForEdit(true);
    // Listen for selection
    const handleSelectionChange = () => {
      const selection = window.getSelection();
      const text = selection?.toString().trim();
      if (text && text.length >= 3) {
        setEditSelectedText(text.slice(0, 200));
        setIsReselectingForEdit(false);
        document.removeEventListener("mouseup", handleSelectionChange);
      }
    };
    document.addEventListener("mouseup", handleSelectionChange);
    // Cleanup after 30 seconds
    setTimeout(() => {
      document.removeEventListener("mouseup", handleSelectionChange);
      setIsReselectingForEdit(false);
    }, 30000);
  };

  const handleDelete = async (commentId: number) => {
    if (!token) return;
    if (!confirm("Supprimer ce commentaire ?")) return;
    await api.deleteComment(commentId, { author_token: token });
    await loadComments();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (editingId) {
          cancelEdit();
        } else if (replyingTo) {
          setReplyingTo(null);
          setReplyText("");
        } else if (askingIdentity) {
          setAskingIdentity(false);
        } else if (showNewCommentForm) {
          handleCancelComment();
        } else {
          deactivateCommentMode();
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [deactivateCommentMode, askingIdentity, showNewCommentForm, replyingTo, editingId]);

  const count = unresolvedCount();
  const topOffset = tocNavVisible ? 112 : 64;
  const displayText = currentSelection?.text || currentBlockSelection?.blockText || "";
  const canSubmitIdentity = firstName.trim() && lastName.trim() && (company !== "Autre" ? company : customCompany.trim());

  // Group comments by section for better organization
  const _groupedComments = useMemo(() => {
    const groups: Record<string, typeof comments> = {};
    comments.forEach(c => {
      if (!groups[c.section_id]) groups[c.section_id] = [];
      groups[c.section_id].push(c);
    });
    return groups;
  }, [comments]);

  return (
    <>
      {/* Sidebar Panel */}
      <aside
        style={{
          position: "fixed",
          zIndex: 997,
          backgroundColor: "#fff",
          display: isCommentModeActive ? "flex" : "none",
          flexDirection: "column",
          fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
          top: topOffset,
          right: 0,
          width: "380px",
          height: `calc(100vh - ${topOffset}px)`,
          borderLeft: "1px solid #e5e5e5",
          boxSizing: "border-box",
          transition: "top 0.3s ease, height 0.3s ease",
        }}
      >
        {/* Header - minimal */}
        <div style={{
          padding: "16px 20px",
          borderBottom: "1px solid #eee",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "15px", fontWeight: 600, color: "#111" }}>
              Commentaires
            </span>
            {count > 0 && (
              <span style={{
                fontSize: "12px",
                fontWeight: 500,
                color: "#fff",
                backgroundColor: "#B22222",
                padding: "2px 8px",
                borderRadius: "10px",
              }}>
                {count}
              </span>
            )}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            {user && (
              <button
                onClick={logout}
                title="Changer d'utilisateur"
                style={{
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
                  border: "none",
                  cursor: "pointer",
                }}
              >
                {getUserInitials(user)}
              </button>
            )}
            <button
              onClick={deactivateCommentMode}
              style={{
                width: "28px",
                height: "28px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "6px",
                border: "none",
                background: "#f5f5f5",
                color: "#666",
                cursor: "pointer",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* New comment form - prominently at top when active */}
        {showNewCommentForm && (currentSelection || currentBlockSelection) && (
          <div style={{
            padding: "16px 20px",
            borderBottom: "2px solid #111",
            backgroundColor: "#fff",
          }}>
            <div style={{
              fontSize: "11px",
              fontWeight: 600,
              color: "#111",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              marginBottom: "12px",
            }}>
              Nouveau commentaire
            </div>

            {/* Quote with hint for handles */}
            {displayText && (
              <div style={{
                fontSize: "12px",
                color: "#666",
                marginBottom: "12px",
                padding: "10px 12px",
                backgroundColor: "#f8f8f8",
                borderRadius: "6px",
                borderLeft: "3px solid #B22222",
                lineHeight: 1.5,
              }}>
                <div style={{ marginBottom: "4px" }}>
                  "{displayText.length > 80 ? `${displayText.substring(0, 80)}...` : displayText}"
                </div>
                {currentSelection && (
                  <div style={{ fontSize: "10px", color: "#999", display: "flex", alignItems: "center", gap: "4px" }}>
                    <span style={{
                      display: "inline-block",
                      width: 8,
                      height: 8,
                      backgroundColor: "#B22222",
                      borderRadius: "50%",
                      flexShrink: 0,
                    }} />
                    Glissez les poignées pour ajuster
                  </div>
                )}
              </div>
            )}

            {askingIdentity ? (
              /* Identity form */
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div style={{ fontSize: "13px", color: "#333" }}>
                  Présentez-vous pour publier
                </div>

                <div style={{ display: "flex", gap: "8px" }}>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Prénom"
                    style={{
                      flex: 1,
                      padding: "10px 12px",
                      fontSize: "14px",
                      border: "1px solid #ddd",
                      borderRadius: "8px",
                      outline: "none",
                      fontFamily: "inherit",
                    }}
                  />
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Nom"
                    style={{
                      flex: 1,
                      padding: "10px 12px",
                      fontSize: "14px",
                      border: "1px solid #ddd",
                      borderRadius: "8px",
                      outline: "none",
                      fontFamily: "inherit",
                    }}
                  />
                </div>

                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {companyOptions.map(opt => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setCompany(opt)}
                      style={{
                        padding: "8px 14px",
                        fontSize: "13px",
                        fontWeight: company === opt ? 500 : 400,
                        color: company === opt ? "#fff" : "#333",
                        backgroundColor: company === opt ? "#111" : "#f0f0f0",
                        border: "none",
                        borderRadius: "20px",
                        cursor: "pointer",
                      }}
                    >
                      {opt}
                    </button>
                  ))}
                </div>

                {company === "Autre" && (
                  <input
                    type="text"
                    value={customCompany}
                    onChange={(e) => setCustomCompany(e.target.value)}
                    placeholder="Nom de votre entreprise"
                    style={{
                      padding: "10px 12px",
                      fontSize: "14px",
                      border: "1px solid #ddd",
                      borderRadius: "8px",
                      outline: "none",
                      fontFamily: "inherit",
                    }}
                  />
                )}

                <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                  <button
                    onClick={() => setAskingIdentity(false)}
                    style={{
                      fontSize: "13px",
                      color: "#666",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: "8px 12px",
                    }}
                  >
                    Retour
                  </button>
                  <button
                    onClick={handleIdentitySubmit}
                    disabled={!canSubmitIdentity || isSubmitting}
                    style={{
                      fontSize: "13px",
                      fontWeight: 600,
                      color: canSubmitIdentity ? "#fff" : "#999",
                      backgroundColor: canSubmitIdentity ? "#111" : "#e5e5e5",
                      padding: "8px 20px",
                      borderRadius: "6px",
                      border: "none",
                      cursor: canSubmitIdentity ? "pointer" : "default",
                    }}
                  >
                    {isSubmitting ? "..." : "Publier"}
                  </button>
                </div>
              </div>
            ) : (
              /* Comment input */
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                      e.preventDefault();
                      handleSubmitComment();
                    }
                  }}
                  placeholder="Écrivez votre commentaire..."
                  rows={3}
                  style={{
                    padding: "12px",
                    fontSize: "14px",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    outline: "none",
                    resize: "none",
                    fontFamily: "inherit",
                    lineHeight: 1.5,
                  }}
                />

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <label style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    cursor: "pointer",
                    fontSize: "12px",
                    color: isInternal ? "#B22222" : "#888",
                  }}>
                    <input
                      type="checkbox"
                      checked={isInternal}
                      onChange={(e) => setIsInternal(e.target.checked)}
                      style={{ accentColor: "#B22222" }}
                    />
                    Commentaire interne
                  </label>

                  <div style={{ display: "flex", gap: "10px" }}>
                    <button
                      onClick={handleCancelComment}
                      style={{
                        fontSize: "13px",
                        color: "#666",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        padding: "8px 12px",
                      }}
                    >
                      Annuler
                    </button>
                    <button
                      onClick={handleSubmitComment}
                      disabled={!commentText.trim() || isSubmitting}
                      style={{
                        fontSize: "13px",
                        fontWeight: 600,
                        color: commentText.trim() ? "#fff" : "#999",
                        backgroundColor: commentText.trim() ? "#111" : "#e5e5e5",
                        padding: "8px 20px",
                        borderRadius: "6px",
                        border: "none",
                        cursor: commentText.trim() ? "pointer" : "default",
                      }}
                    >
                      {isSubmitting ? "..." : "Envoyer"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Comments list */}
        <div style={{ flex: 1, overflowY: "auto", padding: "12px 0" }}>
          {isLoading ? (
            <div style={{ padding: "40px 20px", textAlign: "center", color: "#888", fontSize: "13px" }}>
              Chargement...
            </div>
          ) : comments.length === 0 ? (
            <div style={{ padding: "40px 20px", textAlign: "center" }}>
              <div style={{ fontSize: "13px", color: "#888", marginBottom: "8px" }}>
                Aucun commentaire
              </div>
              <div style={{ fontSize: "12px", color: "#aaa" }}>
                Sélectionnez du texte dans le document pour commenter
              </div>
            </div>
          ) : (
            comments.map((comment) => {
              const author = parseAuthorName(comment.author_name);
              return (
                <div
                  key={comment.id}
                  style={{
                    padding: "16px 20px",
                    borderBottom: "1px solid #f0f0f0",
                    opacity: comment.is_resolved ? 0.5 : 1,
                  }}
                >
                  {/* Author line */}
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                    <div style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      backgroundColor: "#111",
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "11px",
                      fontWeight: 600,
                      flexShrink: 0,
                    }}>
                      {author.initials}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: "13px", fontWeight: 500, color: "#111" }}>
                        {author.name}
                      </div>
                      <div style={{ fontSize: "11px", color: "#888" }}>
                        {author.company && `${author.company} · `}{formatDate(comment.created_at)}
                      </div>
                    </div>
                    {comment.is_internal && (
                      <span style={{
                        fontSize: "10px",
                        fontWeight: 500,
                        color: "#B22222",
                        backgroundColor: "rgba(178,34,34,0.1)",
                        padding: "3px 8px",
                        borderRadius: "4px",
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
                        padding: "3px 8px",
                        borderRadius: "4px",
                      }}>
                        Résolu
                      </span>
                    )}
                  </div>

                  {/* Quote - compact & clickable */}
                  {comment.selected_text && (
                    <button
                      onClick={() => scrollToText(comment.section_id, comment.selected_text)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        fontSize: "11px",
                        color: "#888",
                        background: "none",
                        border: "none",
                        padding: "0 0 8px 0",
                        cursor: "pointer",
                        textAlign: "left",
                        width: "100%",
                      }}
                    >
                      <span style={{ color: "#B22222" }}>↗</span>
                      <span style={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        fontStyle: "italic",
                      }}>
                        "{comment.selected_text.length > 50
                          ? `${comment.selected_text.substring(0, 50)}...`
                          : comment.selected_text}"
                      </span>
                    </button>
                  )}

                  {/* Content - editable if owner and editing */}
                  {editingId === comment.id ? (
                    <div style={{ marginBottom: "12px" }}>
                      {/* Edit selected text */}
                      {editSelectedText && (
                        <div style={{
                          fontSize: "12px",
                          color: "#666",
                          marginBottom: "10px",
                          padding: "8px 10px",
                          backgroundColor: "#f8f8f8",
                          borderRadius: "4px",
                          borderLeft: "2px solid #B22222",
                        }}>
                          <div style={{ marginBottom: "4px", fontStyle: "italic" }}>
                            "{editSelectedText.length > 60 ? `${editSelectedText.substring(0, 60)}...` : editSelectedText}"
                          </div>
                          <button
                            onClick={handleReselectForEdit}
                            style={{
                              fontSize: "10px",
                              color: isReselectingForEdit ? "#16a34a" : "#B22222",
                              background: "none",
                              border: "none",
                              padding: 0,
                              cursor: "pointer",
                              textDecoration: "underline",
                            }}
                          >
                            {isReselectingForEdit ? "Sélectionnez du texte dans le document..." : "Resélectionner"}
                          </button>
                        </div>
                      )}
                      <textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                            e.preventDefault();
                            handleEdit(comment.id);
                          }
                          if (e.key === "Escape") {
                            cancelEdit();
                          }
                        }}
                        style={{
                          width: "100%",
                          padding: "10px",
                          fontSize: "14px",
                          border: "1px solid #ddd",
                          borderRadius: "6px",
                          outline: "none",
                          resize: "none",
                          fontFamily: "inherit",
                          lineHeight: 1.5,
                          boxSizing: "border-box",
                          minHeight: "80px",
                        }}
                      />
                      <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "8px" }}>
                        <button
                          onClick={cancelEdit}
                          style={{
                            fontSize: "12px",
                            color: "#888",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                          }}
                        >
                          Annuler
                        </button>
                        <button
                          onClick={() => handleEdit(comment.id)}
                          disabled={!editText.trim()}
                          style={{
                            fontSize: "12px",
                            fontWeight: 500,
                            color: editText.trim() ? "#fff" : "#999",
                            backgroundColor: editText.trim() ? "#111" : "#e5e5e5",
                            padding: "6px 14px",
                            borderRadius: "4px",
                            border: "none",
                            cursor: editText.trim() ? "pointer" : "default",
                          }}
                        >
                          Enregistrer
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p style={{ fontSize: "14px", color: "#333", margin: "0 0 12px 0", lineHeight: 1.5 }}>
                      {comment.content}
                    </p>
                  )}

                  {/* Actions */}
                  {editingId !== comment.id && (
                    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                      {user && (
                        <button
                          onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                          style={{
                            fontSize: "12px",
                            color: replyingTo === comment.id ? "#111" : "#888",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            padding: 0,
                            fontWeight: replyingTo === comment.id ? 500 : 400,
                          }}
                        >
                          Répondre
                        </button>
                      )}
                      {comment.is_owner && !comment.is_resolved && (
                        <>
                          <button
                            onClick={() => startEditing(comment)}
                            style={{
                              fontSize: "12px",
                              color: "#888",
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              padding: 0,
                            }}
                          >
                            Modifier
                          </button>
                          <button
                            onClick={() => handleResolve(comment.id)}
                            style={{
                              fontSize: "12px",
                              color: "#16a34a",
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              padding: 0,
                            }}
                          >
                            Résoudre
                          </button>
                        </>
                      )}
                      {comment.is_owner && (
                        <button
                          onClick={() => handleDelete(comment.id)}
                          style={{
                            fontSize: "12px",
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
                  {replyingTo === comment.id && user && (
                    <div style={{ marginTop: "12px", paddingTop: "12px", borderTop: "1px solid #eee" }}>
                      <div style={{ display: "flex", gap: "10px" }}>
                        <div style={{
                          width: "24px",
                          height: "24px",
                          borderRadius: "50%",
                          backgroundColor: "#666",
                          color: "#fff",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "9px",
                          fontWeight: 600,
                          flexShrink: 0,
                        }}>
                          {getUserInitials(user)}
                        </div>
                        <div style={{ flex: 1 }}>
                          <textarea
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                                e.preventDefault();
                                handleReply(comment.id);
                              }
                            }}
                            placeholder="Votre réponse..."
                            rows={2}
                            style={{
                              width: "100%",
                              padding: "10px",
                              fontSize: "13px",
                              border: "1px solid #ddd",
                              borderRadius: "6px",
                              outline: "none",
                              resize: "none",
                              fontFamily: "inherit",
                              lineHeight: 1.4,
                              boxSizing: "border-box",
                            }}
                          />
                          <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "8px" }}>
                            <button
                              onClick={() => { setReplyingTo(null); setReplyText(""); }}
                              style={{
                                fontSize: "12px",
                                color: "#888",
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                              }}
                            >
                              Annuler
                            </button>
                            <button
                              onClick={() => handleReply(comment.id)}
                              disabled={!replyText.trim()}
                              style={{
                                fontSize: "12px",
                                fontWeight: 500,
                                color: replyText.trim() ? "#fff" : "#999",
                                backgroundColor: replyText.trim() ? "#111" : "#e5e5e5",
                                padding: "6px 14px",
                                borderRadius: "4px",
                                border: "none",
                                cursor: replyText.trim() ? "pointer" : "default",
                              }}
                            >
                              Répondre
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Replies */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div style={{ marginTop: "12px", paddingLeft: "42px" }}>
                      {comment.replies.map((reply) => {
                        const replyAuthor = parseAuthorName(reply.author_name);
                        return (
                          <div key={reply.id} style={{
                            padding: "10px 0",
                            borderTop: "1px solid #f5f5f5",
                          }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                              <div style={{
                                width: "20px",
                                height: "20px",
                                borderRadius: "50%",
                                backgroundColor: "#888",
                                color: "#fff",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "8px",
                                fontWeight: 600,
                              }}>
                                {replyAuthor.initials}
                              </div>
                              <span style={{ fontSize: "12px", fontWeight: 500, color: "#333" }}>
                                {replyAuthor.name}
                              </span>
                              {replyAuthor.company && (
                                <span style={{ fontSize: "11px", color: "#888" }}>
                                  {replyAuthor.company}
                                </span>
                              )}
                              <span style={{ fontSize: "11px", color: "#aaa" }}>
                                · {formatDate(reply.created_at)}
                              </span>
                              {reply.is_owner && (
                                <button
                                  onClick={() => handleDelete(reply.id)}
                                  style={{
                                    fontSize: "11px",
                                    color: "#ccc",
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                    marginLeft: "auto",
                                  }}
                                >
                                  ×
                                </button>
                              )}
                            </div>
                            <p style={{ fontSize: "13px", color: "#444", margin: 0, lineHeight: 1.4 }}>
                              {reply.content}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </aside>

      {/* FAB */}
      <button
        onClick={toggleCommentMode}
        style={{
          position: "fixed",
          zIndex: 999,
          display: isCommentModeActive ? "none" : "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          bottom: 24,
          right: 24,
          height: 48,
          padding: count > 0 ? "0 18px 0 16px" : "0 16px",
          borderRadius: 24,
          border: "none",
          backgroundColor: "#111",
          color: "#fff",
          boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
          cursor: "pointer",
          fontSize: 14,
          fontWeight: 500,
          fontFamily: "inherit",
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
        {count > 0 && (
          <span style={{
            backgroundColor: "#B22222",
            fontSize: 12,
            fontWeight: 600,
            padding: "2px 8px",
            borderRadius: 10,
          }}>
            {count}
          </span>
        )}
      </button>
    </>
  );
}

export default CommentsSidebar;
