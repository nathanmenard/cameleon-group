import Link from "next/link";

export default function NotFound() {
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
          404
        </div>
        <h1 style={{
          fontSize: "1.5rem",
          fontWeight: 600,
          color: "#18181B",
          marginBottom: "0.75rem",
        }}>
          Page introuvable
        </h1>
        <p style={{
          color: "#71717A",
          marginBottom: "2rem",
          lineHeight: 1.6,
        }}>
          La page que vous recherchez n&apos;existe pas ou a ete deplacee.
        </p>
        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.75rem 1.5rem",
            background: "#B22222",
            color: "white",
            textDecoration: "none",
            borderRadius: "0.5rem",
            fontWeight: 500,
            fontSize: "0.875rem",
          }}
        >
          Retour a l&apos;accueil
        </Link>

        <div style={{
          marginTop: "3rem",
          paddingTop: "2rem",
          borderTop: "1px solid #E4E4E7",
        }}>
          <span style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            color: "#A1A1AA",
            fontSize: "0.6875rem",
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
