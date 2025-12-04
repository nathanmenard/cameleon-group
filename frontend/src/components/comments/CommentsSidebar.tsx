"use client";

import { useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { useCommentsStore } from "@/stores/useCommentsStore";
import { useUser } from "@/hooks/useUser";
import { api } from "@/lib/api";
import { CommentThread } from "./CommentThread";
import { NewCommentForm } from "./NewCommentForm";
import { ReplyForm } from "./ReplyForm";

interface CommentsSidebarProps {
  documentId: string;
}

export function CommentsSidebar({ documentId }: CommentsSidebarProps) {
  const {
    comments,
    isLoading,
    isSidebarOpen,
    showNewCommentForm,
    replyingToId,
    currentSelection,
    setComments,
    setLoading,
    closeSidebar,
    setShowNewCommentForm,
    setReplyingToId,
    unresolvedCount,
  } = useCommentsStore();

  const { user, login, token } = useUser();

  // Load comments
  const loadComments = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getComments(documentId, token || undefined);
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

  // Handle new comment submit
  const handleNewComment = async (data: {
    content: string;
    authorName: string;
    isInternal: boolean;
  }) => {
    if (!currentSelection) return;

    let currentUser = user;
    if (!currentUser) {
      currentUser = login(data.authorName);
    }

    await api.createComment({
      document_id: documentId,
      section_id: currentSelection.sectionId,
      author_name: currentUser.name,
      author_token: currentUser.token,
      selected_text: currentSelection.text,
      content: data.content,
      is_internal: data.isInternal,
    });

    setShowNewCommentForm(false);
    await loadComments();
  };

  // Handle reply submit
  const handleReply = async (parentId: number, content: string) => {
    const parentComment = comments.find((c) => c.id === parentId);
    if (!parentComment) return;

    let currentUser = user;
    if (!currentUser) {
      const name = prompt("Votre nom :");
      if (!name) return;
      currentUser = login(name);
    }

    await api.createComment({
      document_id: documentId,
      section_id: parentComment.section_id,
      author_name: currentUser.name,
      author_token: currentUser.token,
      content,
      parent_id: parentId,
      is_internal: parentComment.is_internal,
    });

    setReplyingToId(null);
    await loadComments();
  };

  // Handle resolve
  const handleResolve = async (commentId: number) => {
    if (!token) return;
    await api.updateComment(commentId, { author_token: token, is_resolved: true });
    await loadComments();
  };

  // Handle delete
  const handleDelete = async (commentId: number) => {
    if (!token) return;
    if (!confirm("Supprimer ce commentaire ?")) return;
    await api.deleteComment(commentId, { author_token: token });
    await loadComments();
  };

  // Keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeSidebar();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [closeSidebar]);

  const count = unresolvedCount();

  return (
    <>
      {/* Backdrop (mobile) */}
      <div
        className={cn(
          "fixed inset-0 bg-noir/30 z-40 transition-opacity duration-300 md:hidden",
          isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={closeSidebar}
      />

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed z-50 bg-blanc flex flex-col transition-transform duration-300 ease-out",
          // Desktop: right sidebar
          "md:top-16 md:right-0 md:w-80 md:h-[calc(100vh-4rem)] md:border-l md:border-gris-200",
          isSidebarOpen ? "md:translate-x-0" : "md:translate-x-full",
          // Mobile: bottom drawer
          "max-md:bottom-0 max-md:left-0 max-md:right-0 max-md:h-[80vh] max-md:rounded-t-2xl max-md:border-t max-md:border-gris-200",
          isSidebarOpen ? "max-md:translate-y-0" : "max-md:translate-y-full"
        )}
      >
        {/* Drawer handle (mobile) */}
        <div className="md:hidden absolute top-2 left-1/2 -translate-x-1/2 w-10 h-1 bg-gris-300 rounded-full" />

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gris-200 bg-gris-50 max-md:pt-5 max-md:rounded-t-2xl">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm text-noir">Commentaires</span>
            <span className="text-xs text-gris-500 bg-gris-200 px-2 py-0.5 rounded-full">
              {comments.length}
            </span>
          </div>
          <button
            onClick={closeSidebar}
            className="w-7 h-7 flex items-center justify-center rounded hover:bg-gris-200 text-gris-500 hover:text-noir transition-colors"
          >
            &times;
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {isLoading ? (
            <div className="text-center py-8 text-gris-400">Chargement...</div>
          ) : comments.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-4 opacity-50">💬</div>
              <p className="text-sm text-gris-500">
                Sélectionnez du texte dans le document pour ajouter un
                commentaire
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {comments.map((comment) => (
                <div key={comment.id}>
                  <CommentThread
                    comment={comment}
                    onResolve={handleResolve}
                    onDelete={handleDelete}
                    onReply={(id) => setReplyingToId(id)}
                  />
                  {replyingToId === comment.id && (
                    <ReplyForm
                      onSubmit={(content) => handleReply(comment.id, content)}
                      onCancel={() => setReplyingToId(null)}
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* New comment form */}
        {showNewCommentForm && currentSelection && (
          <NewCommentForm
            onSubmit={handleNewComment}
            onCancel={() => setShowNewCommentForm(false)}
          />
        )}
      </aside>

      {/* Toggle button */}
      <button
        onClick={() => useCommentsStore.getState().toggleSidebar()}
        className={cn(
          "fixed z-40 flex items-center gap-2 px-4 py-2.5 rounded-full",
          "bg-noir text-blanc shadow-lg hover:bg-gris-800 transition-all duration-200",
          // Desktop: top right
          "md:top-20 md:right-4",
          // Mobile: bottom center
          "max-md:bottom-6 max-md:left-1/2 max-md:-translate-x-1/2",
          isSidebarOpen && "hidden"
        )}
      >
        <span className="text-lg">💬</span>
        <span className="text-sm font-medium max-sm:hidden">Commentaires</span>
        {count > 0 && (
          <span className="bg-rouge text-blanc text-xs font-semibold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
            {count}
          </span>
        )}
      </button>
    </>
  );
}

export default CommentsSidebar;
