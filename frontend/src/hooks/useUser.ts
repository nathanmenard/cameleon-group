"use client";

import { useState, useEffect, useCallback } from "react";
import type { User } from "@/types";

const STORAGE_KEY = "feedback_user";

function generateToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (b) => b.toString(16).padStart(2, "0")).join("");
}

export interface LoginData {
  firstName: string;
  lastName: string;
  company: string;
}

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load user from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Validate new format (must have firstName and lastName)
        if (parsed.firstName && parsed.lastName && parsed.company && parsed.token) {
          setUser(parsed);
        } else {
          // Old format, clear it
          localStorage.removeItem(STORAGE_KEY);
        }
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setIsLoaded(true);
  }, []);

  const login = useCallback((data: LoginData): User => {
    const newUser: User = {
      firstName: data.firstName,
      lastName: data.lastName,
      company: data.company,
      token: generateToken(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
    setUser(newUser);
    return newUser;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }, []);

  return {
    user,
    isLoaded,
    isLoggedIn: !!user,
    login,
    logout,
    token: user?.token,
  };
}

export default useUser;
