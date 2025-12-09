// Strategic Note Types
export interface ClientConfig {
  id: string;
  name: string;
  logo: string;
  documentId: string;
}

export interface Section {
  id: string;
  title: string;
  icon?: string;
  content: React.ReactNode;
}

export interface TocItem {
  id: string;
  title: string;
  icon?: string;
}

export interface WhyBlock {
  title: string;
  content: string;
}

export interface StrategicNoteData {
  client: ClientConfig;
  title: string;
  subtitle?: string;
  sections: Section[];
  toc: TocItem[];
}

// Comments Types
export interface Comment {
  id: number;
  document_id: string;
  section_id: string;
  author_name: string;
  selected_text: string | null;
  text_offset: number | null;
  content: string;
  parent_id: number | null;
  is_resolved: boolean;
  is_internal: boolean;
  is_owner: boolean;
  replies: Comment[];
  created_at: string;
  updated_at: string;
}

export interface CommentsListResponse {
  comments: Comment[];
  count: number;
}

export interface CommentCreate {
  document_id: string;
  section_id: string;
  author_name: string;
  author_token: string;
  selected_text?: string;
  text_offset?: number;
  content: string;
  parent_id?: number;
  is_internal?: boolean;
}

export interface CommentUpdate {
  author_token: string;
  content?: string;
  selected_text?: string;
  is_resolved?: boolean;
}

export interface CommentDelete {
  author_token: string;
}

// User (stored in localStorage)
export interface User {
  firstName: string;
  lastName: string;
  company: string;
  token: string;
}

// Helper to get display name and initials
export function getUserDisplayName(user: User): string {
  if (user.firstName && user.lastName) {
    return `${user.firstName} ${user.lastName}`;
  }
  // Fallback for old format
  return (user as unknown as { name?: string }).name || "Anonyme";
}

export function getUserInitials(user: User): string {
  const first = user.firstName?.charAt(0) || "";
  const last = user.lastName?.charAt(0) || "";
  return `${first}${last}`.toUpperCase() || "?";
}

// Selection state for commenting
export interface TextSelection {
  text: string;
  sectionId: string;
  range: Range;
}

// Block selection for Notion-style commenting
export interface BlockSelection {
  blockId: string;      // Unique ID for the block (e.g., "ambition:p-0")
  sectionId: string;    // Section containing the block
  blockText: string;    // Text content of the block (for display in sidebar)
}
