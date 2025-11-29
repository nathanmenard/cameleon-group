"use client";

import { create } from "zustand";
import type { Comment, TextSelection } from "@/types";

interface CommentsState {
  // Data
  comments: Comment[];
  isLoading: boolean;
  error: string | null;

  // UI State
  isSidebarOpen: boolean;
  activeCommentId: number | null;
  currentSelection: TextSelection | null;
  showNewCommentForm: boolean;
  replyingToId: number | null;

  // Actions
  setComments: (comments: Comment[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  toggleSidebar: () => void;
  openSidebar: () => void;
  closeSidebar: () => void;

  setActiveComment: (id: number | null) => void;
  setCurrentSelection: (selection: TextSelection | null) => void;
  setShowNewCommentForm: (show: boolean) => void;
  setReplyingToId: (id: number | null) => void;

  // Computed
  unresolvedCount: () => number;
}

export const useCommentsStore = create<CommentsState>((set, get) => ({
  // Initial state
  comments: [],
  isLoading: false,
  error: null,
  isSidebarOpen: false,
  activeCommentId: null,
  currentSelection: null,
  showNewCommentForm: false,
  replyingToId: null,

  // Data actions
  setComments: (comments) => set({ comments }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  // UI actions
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  openSidebar: () => set({ isSidebarOpen: true }),
  closeSidebar: () =>
    set({
      isSidebarOpen: false,
      showNewCommentForm: false,
      replyingToId: null,
      activeCommentId: null,
    }),

  setActiveComment: (activeCommentId) => set({ activeCommentId }),
  setCurrentSelection: (currentSelection) => set({ currentSelection }),
  setShowNewCommentForm: (showNewCommentForm) => set({ showNewCommentForm }),
  setReplyingToId: (replyingToId) => set({ replyingToId }),

  // Computed
  unresolvedCount: () => get().comments.filter((c) => !c.is_resolved).length,
}));

export default useCommentsStore;
