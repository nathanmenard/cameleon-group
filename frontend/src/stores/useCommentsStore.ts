"use client";

import { create } from "zustand";
import type { Comment, TextSelection, BlockSelection } from "@/types";

interface CommentsState {
  // Data
  comments: Comment[];
  isLoading: boolean;
  error: string | null;

  // UI State - Comment Mode (split layout)
  isCommentModeActive: boolean;
  isSidebarOpen: boolean; // deprecated, use isCommentModeActive
  activeCommentId: number | null;
  currentSelection: TextSelection | null;
  currentBlockSelection: BlockSelection | null;
  showNewCommentForm: boolean;
  replyingToId: number | null;
  isDraggingHandle: boolean; // Flag to prevent CommentLayer interference during handle drag

  // Actions
  setComments: (comments: Comment[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  toggleCommentMode: () => void;
  activateCommentMode: () => void;
  deactivateCommentMode: () => void;

  // Legacy - keep for compatibility
  toggleSidebar: () => void;
  openSidebar: () => void;
  closeSidebar: () => void;

  setActiveComment: (id: number | null) => void;
  setCurrentSelection: (selection: TextSelection | null) => void;
  setCurrentBlockSelection: (selection: BlockSelection | null) => void;
  setShowNewCommentForm: (show: boolean) => void;
  setReplyingToId: (id: number | null) => void;
  setIsDraggingHandle: (isDragging: boolean) => void;

  // Computed
  unresolvedCount: () => number;
  getBlockCommentCount: (blockId: string) => number;
}

export const useCommentsStore = create<CommentsState>((set, get) => ({
  // Initial state
  comments: [],
  isLoading: false,
  error: null,
  isCommentModeActive: false,
  isSidebarOpen: false,
  activeCommentId: null,
  currentSelection: null,
  currentBlockSelection: null,
  showNewCommentForm: false,
  replyingToId: null,
  isDraggingHandle: false,

  // Data actions
  setComments: (comments) => set({ comments }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  // Comment Mode actions
  toggleCommentMode: () => set((state) => ({
    isCommentModeActive: !state.isCommentModeActive,
    isSidebarOpen: !state.isCommentModeActive,
  })),
  activateCommentMode: () => set({ isCommentModeActive: true, isSidebarOpen: true }),
  deactivateCommentMode: () => set({
    isCommentModeActive: false,
    isSidebarOpen: false,
    showNewCommentForm: false,
    replyingToId: null,
    activeCommentId: null,
    currentBlockSelection: null,
  }),

  // Legacy UI actions (for compatibility)
  toggleSidebar: () => set((state) => ({
    isSidebarOpen: !state.isSidebarOpen,
    isCommentModeActive: !state.isSidebarOpen,
  })),
  openSidebar: () => set({ isSidebarOpen: true, isCommentModeActive: true }),
  closeSidebar: () =>
    set({
      isSidebarOpen: false,
      isCommentModeActive: false,
      showNewCommentForm: false,
      replyingToId: null,
      activeCommentId: null,
      currentBlockSelection: null,
    }),

  setActiveComment: (activeCommentId) => set({ activeCommentId }),
  setCurrentSelection: (currentSelection) => set({ currentSelection }),
  setCurrentBlockSelection: (currentBlockSelection) => set({ currentBlockSelection }),
  setShowNewCommentForm: (showNewCommentForm) => set({ showNewCommentForm }),
  setReplyingToId: (replyingToId) => set({ replyingToId }),
  setIsDraggingHandle: (isDraggingHandle) => set({ isDraggingHandle }),

  // Computed
  unresolvedCount: () => get().comments.filter((c) => !c.is_resolved).length,
  getBlockCommentCount: (blockId: string) =>
    get().comments.filter((c) => c.selected_text === blockId && !c.is_resolved).length,
}));

export default useCommentsStore;
