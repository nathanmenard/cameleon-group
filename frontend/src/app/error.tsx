"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div style={{
      fontFamily: "'Inter', system-ui, sans-serif",
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#FAFAFA",
      padding: "2rem",
    }}>
      <div style={{ textAlign: "center", maxWidth: 480 }}>
        <div style={{
          fontSize: "8rem",
          fontWeight: 700,
          color: "#E4E4E7",
          lineHeight: 1,
          marginBottom: "1rem",
        }}>
          500
        </div>
        <h1 style={{
          fontSize: "1.5rem",
          fontWeight: 600,
          color: "#18181B",
          marginBottom: "0.75rem",
        }}>
          Erreur serveur
        </h1>
        <p style={{
          color: "#71717A",
          marginBottom: "2rem",
          lineHeight: 1.6,
        }}>
          Une erreur inattendue s&apos;est produite. Veuillez reessayer.
        </p>
        <button
          onClick={() => reset()}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.75rem 1.5rem",
            background: "#B22222",
            color: "white",
            border: "none",
            borderRadius: "0.5rem",
            fontWeight: 500,
            fontSize: "0.875rem",
            cursor: "pointer",
          }}
        >
          Reessayer
        </button>

        <div style={{
          marginTop: "3rem",
          paddingTop: "2rem",
          borderTop: "1px solid #E4E4E7",
        }}>
          <span style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            color: "#71717A",
            fontSize: "0.75rem",
          }}>
            <img src="/logos/spider-deploy.svg" alt="Spider Deploy" style={{ width: 16, height: 16 }} />
            Powered by Spider Deploy
          </span>
        </div>
      </div>
    </div>
  );
}
