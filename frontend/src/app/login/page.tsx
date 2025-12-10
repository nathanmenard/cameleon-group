"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/lib/api";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.login({ email, password });
      const redirect = searchParams.get("redirect") || "/";
      if (response.user.is_admin) {
        router.push(redirect);
      } else {
        router.push("/");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      background: "#27272A",
      borderRadius: 12,
      padding: "2.5rem",
      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.3), 0 4px 12px rgba(0, 0, 0, 0.2)",
      maxWidth: 380,
      width: "100%",
      textAlign: "center",
      border: "1px solid #3F3F46",
    }}>
      {/* Logo Drakkar Blanc */}
      <div style={{ marginBottom: "1.5rem", display: "flex", justifyContent: "center" }}>
        <img
          src="/logos/logo_drakkar_blanc.png"
          alt="Drakkar"
          style={{ height: 24, width: "auto" }}
        />
      </div>

      <h1 style={{
        fontSize: "1.375rem",
        fontWeight: 600,
        color: "#FAFAFA",
        marginBottom: "0.375rem",
      }}>
        Espace Admin
      </h1>

      <p style={{
        color: "#A1A1AA",
        marginBottom: "1.75rem",
        fontSize: "0.875rem",
        lineHeight: 1.5,
      }}>
        Connectez-vous pour accéder au design system
      </p>

      {error && (
        <div style={{
          background: "rgba(220, 38, 38, 0.15)",
          border: "1px solid rgba(220, 38, 38, 0.4)",
          color: "#F87171",
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
        <div style={{ textAlign: "left", marginBottom: "1rem" }}>
          <label
            htmlFor="email"
            style={{
              display: "block",
              fontWeight: 500,
              marginBottom: "0.5rem",
              color: "#D4D4D8",
              fontSize: "0.8125rem",
            }}
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoFocus
            placeholder="admin@drakkar.io"
            style={{
              width: "100%",
              padding: "0.625rem 0.875rem",
              border: "1px solid #3F3F46",
              borderRadius: 6,
              fontSize: "0.875rem",
              background: "#18181B",
              color: "#FAFAFA",
              outline: "none",
              fontFamily: "'Inter', sans-serif",
            }}
          />
        </div>

        <div style={{ textAlign: "left", marginBottom: "1.25rem" }}>
          <label
            htmlFor="password"
            style={{
              display: "block",
              fontWeight: 500,
              marginBottom: "0.5rem",
              color: "#D4D4D8",
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
            placeholder="Entrez votre mot de passe"
            style={{
              width: "100%",
              padding: "0.625rem 0.875rem",
              border: "1px solid #3F3F46",
              borderRadius: 6,
              fontSize: "0.875rem",
              background: "#18181B",
              color: "#FAFAFA",
              outline: "none",
              fontFamily: "'Inter', sans-serif",
            }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "0.625rem 1rem",
            background: loading ? "#52525B" : "#B22222",
            color: "white",
            border: "none",
            borderRadius: 6,
            fontSize: "0.875rem",
            fontWeight: 500,
            cursor: loading ? "not-allowed" : "pointer",
            fontFamily: "'Inter', sans-serif",
          }}
        >
          {loading ? "Connexion..." : "Se connecter"}
        </button>
      </form>

      <div style={{
        marginTop: "1.75rem",
        paddingTop: "1.5rem",
        borderTop: "1px solid #3F3F46",
      }}>
        <span style={{
          color: "#71717A",
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
  );
}

export default function LoginPage() {
  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#18181B",
      padding: "1.5rem",
      fontFamily: "'Inter', system-ui, sans-serif",
    }}>
      <Suspense fallback={
        <div style={{
          background: "#27272A",
          borderRadius: 12,
          padding: "2.5rem",
          maxWidth: 380,
          width: "100%",
          textAlign: "center",
          border: "1px solid #3F3F46",
        }}>
          <div style={{ color: "#A1A1AA" }}>Chargement...</div>
        </div>
      }>
        <LoginForm />
      </Suspense>
    </div>
  );
}
