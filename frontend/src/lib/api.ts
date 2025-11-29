import type {
  Comment,
  CommentCreate,
  CommentDelete,
  CommentUpdate,
  CommentsListResponse,
} from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001";

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || `Request failed: ${response.status}`);
    }

    return response.json();
  }

  // Comments API
  async getComments(
    documentId: string,
    token?: string,
    includeInternal?: boolean
  ): Promise<CommentsListResponse> {
    const params = new URLSearchParams({ document_id: documentId });
    if (token) params.append("token", token);
    if (includeInternal) params.append("include_internal", "true");

    return this.request<CommentsListResponse>(
      `/api/comments?${params.toString()}`
    );
  }

  async createComment(data: CommentCreate): Promise<Comment> {
    return this.request<Comment>("/api/comments", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateComment(commentId: number, data: CommentUpdate): Promise<Comment> {
    return this.request<Comment>(`/api/comments/${commentId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteComment(
    commentId: number,
    data: CommentDelete
  ): Promise<{ success: boolean; message: string }> {
    return this.request(`/api/comments/${commentId}`, {
      method: "DELETE",
      body: JSON.stringify(data),
    });
  }

  // Health check
  async health(): Promise<{ status: string; service: string }> {
    return this.request("/health");
  }
}

export const api = new ApiClient(API_URL);
export default api;
