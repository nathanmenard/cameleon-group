"use client";

import { useState, useEffect, type ReactNode } from "react";

interface PasswordProtectionProps {
  slug: string;
  title: string;
  children: ReactNode;
}

export function PasswordProtection({ slug, title, children }: PasswordProtectionProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if user already has access (via cookie)
  useEffect(() => {
    const checkAccess = () => {
      // Check client-side cookie
      const cookies = document.cookie.split(";");
      const accessCookie = cookies.find((c) =>
        c.trim().startsWith(`page_access_${slug}=`)
      );
      if (accessCookie?.includes("granted")) {
        setHasAccess(true);
      }
      setIsLoading(false);
    };

    checkAccess();
  }, [slug]);

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
        {/* Logo Drakkar */}
        <div style={{ marginBottom: "1.5rem" }}>
          <svg width="100" viewBox="0 0 200 102" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M47.1188 39.5161C47.1188 45.2578 46.4406 50.3241 45.0846 54.3769C43.7289 58.7679 41.6948 62.1453 38.9831 64.8471C36.2711 67.5491 32.8812 69.5755 29.1526 71.2644C25.4237 72.6154 21.017 73.2908 16.2712 73.2908C14.2373 73.2908 11.5254 73.2908 8.47458 72.9533C5.42372 72.6154 2.71186 72.2776 0 71.6022V7.42996C2.71186 6.75447 5.76271 6.4167 8.81357 6.07895C11.8644 5.74121 14.5763 5.74121 16.6102 5.74121C21.3559 5.74121 25.4237 6.4167 29.1526 7.7677C32.8812 9.11871 36.2711 11.1452 38.9831 13.8472C41.6948 16.5492 43.7289 19.9267 45.0846 24.3174C46.4406 28.3703 47.1188 33.4366 47.1188 39.5161ZM12.2034 60.4564C12.8814 60.4564 13.5593 60.4564 14.2373 60.4564C14.9153 60.4564 15.9322 60.4564 16.9491 60.4564C23.0509 60.4564 27.4576 58.43 30.5085 54.7147C33.5594 50.9995 34.9154 45.9332 34.9154 39.1783C34.9154 32.4234 33.5594 27.0194 30.8474 23.6419C27.7966 20.2644 23.3898 18.5757 17.2881 18.5757C16.6102 18.5757 15.5932 18.5757 14.5763 18.5757C13.5593 18.5757 12.8814 18.5757 12.2034 18.9134V60.4564Z" fill="#B22222"/>
            <path d="M140.002 72.9538C138.985 70.5892 137.629 67.8875 136.273 65.1854C134.917 62.4833 133.222 59.7816 131.527 56.7417C129.832 54.0396 128.137 51.3378 126.103 48.6358C124.069 45.9337 122.374 43.9073 120.34 41.8809V72.9538H108.137V0H120.34V27.3576C123.391 22.9669 126.781 18.2384 129.832 13.5099C133.222 8.78146 135.934 4.05299 138.646 0H153.222C149.493 6.07948 145.764 11.4834 142.035 17.2252C138.306 22.9669 134.239 28.0331 130.171 33.775C134.578 38.5035 138.646 44.5827 142.713 51C146.781 57.7549 150.51 65.1854 154.239 73.2913H140.002V72.9538Z" fill="#B22222"/>
            <path d="M199.999 102.002H70.1683V92.2068H184.406L168.134 60.4585L176.948 56.0679L199.999 102.002Z" fill="#B22222"/>
            <path d="M71.5243 18.9138C79.6597 18.9138 85.7615 20.2648 90.1683 23.3045C94.5751 26.3443 96.6089 30.735 96.6089 36.8144C96.6089 40.5297 95.592 43.5696 93.8969 45.9338C92.2021 48.298 89.4901 49.9866 86.4394 51.3376C87.4563 52.6887 88.8123 54.3775 89.8292 56.0661C91.1852 57.755 92.2021 59.7814 93.2191 61.4703C94.236 63.4967 95.592 65.1852 96.6089 67.2119C97.6258 69.2383 98.6427 71.2647 99.6597 73.2914H86.1003C86.1003 73.2914 86.1003 73.2914 85.7615 73.2914C83.7277 69.5762 82.0326 66.1987 79.9987 62.821C78.9818 61.1324 77.9649 59.4435 76.948 58.0925C75.9311 56.4039 74.9138 55.0529 73.8969 54.0397H67.7954V73.629H55.592V20.2648C58.3037 19.5893 61.0157 19.2516 63.7277 19.2516C66.7784 18.9138 69.1514 18.9138 71.5243 18.9138ZM72.2021 29.0463C71.1852 29.0463 70.5071 29.0463 69.8292 29.0463C69.1514 29.0463 68.4732 29.0463 67.7954 29.0463V43.9071H71.1852C75.592 43.9071 78.9818 43.2317 81.0157 42.2185C83.0495 41.2053 84.0664 39.1786 84.0664 36.4769C84.0664 33.7748 83.0495 32.0859 81.0157 30.735C78.9818 29.7218 75.9311 29.0463 72.2021 29.0463Z" fill="#B22222"/>
          </svg>
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
