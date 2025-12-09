import type {
  Comment,
  CommentCreate,
  CommentDelete,
  CommentUpdate,
  CommentsListResponse,
} from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8002";

// Auth types
export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  is_admin: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  user: User;
}

export interface TrackVisitData {
  screen_resolution?: string;
  device_memory?: number;
  cpu_cores?: number;
  is_touch?: boolean;
}

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
      credentials: "include", // Important for cookies
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

  // Auth API - use Next.js proxy to avoid CORS issues
  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || `Login failed: ${response.status}`);
    }

    return response.json();
  }

  async logout(): Promise<{ message: string }> {
    return this.request("/auth/logout", {
      method: "POST",
    });
  }

  async me(): Promise<User> {
    const response = await fetch("/api/auth/me", {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Not authenticated");
    }

    return response.json();
  }

  // Analytics API
  async trackVisit(slug: string, data?: TrackVisitData): Promise<void> {
    await fetch(`${this.baseUrl}/analytics/track/${slug}`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: data ? JSON.stringify(data) : undefined,
    });
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
