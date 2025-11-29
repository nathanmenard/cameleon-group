"use client";

import { useState, useEffect, useCallback } from "react";
import type { User } from "@/types";

const STORAGE_KEY = "feedback_user";

function generateToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (b) => b.toString(16).padStart(2, "0")).join("");
}

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load user from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setIsLoaded(true);
  }, []);

  const login = useCallback((name: string): User => {
    const newUser: User = {
      name,
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

  const updateName = useCallback(
    (name: string) => {
      if (user) {
        const updatedUser = { ...user, name };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
        setUser(updatedUser);
      }
    },
    [user]
  );

  return {
    user,
    isLoaded,
    isLoggedIn: !!user,
    login,
    logout,
    updateName,
    token: user?.token,
  };
}

export default useUser;
