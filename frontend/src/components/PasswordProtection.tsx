"use client";

import { useState, useEffect, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";

interface PasswordProtectionProps {
  slug: string;
  title: string;
  children: ReactNode;
}

export function PasswordProtection({ slug, title, children }: PasswordProtectionProps) {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if user already has access (via cookie) or password in URL
  useEffect(() => {
    const checkAccess = async () => {
      // Check client-side cookie first
      const cookies = document.cookie.split(";");
      const accessCookie = cookies.find((c) =>
        c.trim().startsWith(`page_access_${slug}=`)
      );
      if (accessCookie?.includes("granted")) {
        setHasAccess(true);
        setIsLoading(false);
        return;
      }

      // Check for password in URL (?p=BASE64_ENCODED_PASSWORD)
      const encodedPassword = searchParams.get("p");
      if (encodedPassword) {
        try {
          const decodedPassword = atob(encodedPassword);
          // Auto-submit the password
          const response = await fetch(`/api/pages/${slug}/verify-password`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ password: decodedPassword }),
          });

          if (response.ok) {
            const data = await response.json();
            if (data.granted) {
              setHasAccess(true);
              setIsLoading(false);
              // Clean up URL by removing the password parameter
              const url = new URL(window.location.href);
              url.searchParams.delete("p");
              window.history.replaceState({}, "", url.toString());
              return;
            }
          }
        } catch {
          // Invalid base64 or request failed - fall through to password form
        }
      }

      setIsLoading(false);
    };

    checkAccess();
  }, [slug, searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/pages/${slug}/verify-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.detail || "Mot de passe incorrect");
        return;
      }

      if (data.granted) {
        setHasAccess(true);
      }
    } catch {
      setError("Erreur de connexion");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#FAFAFA",
        fontFamily: "'Inter', system-ui, sans-serif",
      }}>
        <div style={{ color: "#71717A", fontSize: 14 }}>Chargement...</div>
      </div>
    );
  }

  // Has access - render children
  if (hasAccess) {
    return <>{children}</>;
  }

  // Password form (style spider-deploy)
  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#FAFAFA",
      padding: "1.5rem",
      fontFamily: "'Inter', system-ui, sans-serif",
    }}>
      <div style={{
        background: "white",
        borderRadius: 12,
        padding: "2.5rem",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.08), 0 4px 12px rgba(0, 0, 0, 0.04)",
        maxWidth: 380,
        width: "100%",
        textAlign: "center",
        border: "1px solid #E4E4E7",
      }}>
        {/* Logo Drakkar Noir */}
        <div style={{ marginBottom: "1.5rem" }}>
          <img
            src="/logos/logo_drakkar_noir.svg"
            alt="Drakkar"
            style={{ height: 32, width: "auto" }}
          />
        </div>

        <h1 style={{
          fontSize: "1.375rem",
          fontWeight: 600,
          color: "#18181B",
          marginBottom: "0.375rem",
        }}>
          {title}
        </h1>

        <p style={{
          color: "#71717A",
          marginBottom: "1.75rem",
          fontSize: "0.875rem",
          lineHeight: 1.5,
        }}>
          Ce document est protégé par mot de passe
        </p>

        {error && (
          <div style={{
            background: "#FEF2F2",
            border: "1px solid #FECACA",
            color: "#DC2626",
            padding: "0.625rem 0.875rem",
            borderRadius: 6,
            marginBottom: "1rem",
            fontSize: "0.8125rem",
            textAlign: "left",
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ textAlign: "left", marginBottom: "1.25rem" }}>
            <label
              htmlFor="password"
              style={{
                display: "block",
                fontWeight: 500,
                marginBottom: "0.5rem",
                color: "#3F3F46",
                fontSize: "0.8125rem",
              }}
            >
              Mot de passe
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoFocus
              placeholder="Entrez le mot de passe"
              style={{
                width: "100%",
                padding: "0.625rem 0.875rem",
                border: "1px solid #E4E4E7",
                borderRadius: 6,
                fontSize: "0.875rem",
                background: "#FAFAFA",
                outline: "none",
                fontFamily: "'Inter', sans-serif",
              }}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              width: "100%",
              padding: "0.625rem 1rem",
              background: isSubmitting ? "#A1A1AA" : "#B22222",
              color: "white",
              border: "none",
              borderRadius: 6,
              fontSize: "0.875rem",
              fontWeight: 500,
              cursor: isSubmitting ? "not-allowed" : "pointer",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            {isSubmitting ? "Vérification..." : "Déverrouiller"}
          </button>
        </form>

        <div style={{
          marginTop: "1.75rem",
          paddingTop: "1.5rem",
          borderTop: "1px solid #F4F4F5",
        }}>
          <span style={{
            color: "#A1A1AA",
            fontSize: "0.6875rem",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.375rem",
          }}>
            <img
              src="/logos/spider.svg"
              alt="Spider"
              width={12}
              height={12}
              style={{ opacity: 0.5 }}
            />
            Powered by Spider Deploy
          </span>
        </div>
      </div>
    </div>
  );
}
