"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

interface PageData {
  id: number;
  slug: string;
  title: string;
  has_password: boolean;
  is_public: boolean;
  total_visits: number;
  unique_visitors: number;
  last_visit: string | null;
}

export default function ProjectDetail() {
  const params = useParams();
  const slug = params.slug as string;

  const [page, setPage] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<"link" | "password" | null>(null);

  useEffect(() => {
    fetch(`/api/pages/${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error("Page not found");
        return res.json();
      })
      .then((data) => {
        setPage(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [slug]);

  const formatDate = (isoString: string | null) => {
    if (!isoString) return null;
    const date = new Date(isoString);
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const copyLink = () => {
    const url = `${window.location.origin}/clients/${slug}`;
    navigator.clipboard.writeText(url);
    setCopied("link");
    setTimeout(() => setCopied(null), 2000);
  };

  // Inline styles
  const styles = {
    wrapper: {
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column" as const,
      backgroundColor: "#F8FAFC",
      fontFamily: "'Inter', system-ui, sans-serif",
    } as React.CSSProperties,
    header: {
      backgroundColor: "#FFFFFF",
      borderBottom: "1px solid #E2E8F0",
      padding: "0",
      flexShrink: 0,
    } as React.CSSProperties,
    headerInner: {
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "1rem 1.5rem",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    } as React.CSSProperties,
    navbarBrand: {
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      fontSize: "1rem",
      fontWeight: 600,
      color: "#0F172A",
      textDecoration: "none",
    } as React.CSSProperties,
    navbarDivider: {
      color: "#CBD5E1",
      fontWeight: 400,
    } as React.CSSProperties,
    navbarDeploy: {
      color: "#64748B",
      fontWeight: 500,
    } as React.CSSProperties,
    main: {
      flex: 1,
      maxWidth: "1200px",
      width: "100%",
      margin: "0 auto",
      padding: "2rem 1.5rem",
    } as React.CSSProperties,
    backLink: {
      display: "inline-flex",
      alignItems: "center",
      gap: "0.5rem",
      color: "#64748B",
      textDecoration: "none",
      fontSize: "0.875rem",
      marginBottom: "1rem",
    } as React.CSSProperties,
    titleRow: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: "2rem",
      flexWrap: "wrap" as const,
      gap: "1rem",
    } as React.CSSProperties,
    titleGroup: {
      display: "flex",
      flexDirection: "column" as const,
      gap: "0.25rem",
    } as React.CSSProperties,
    pageTitle: {
      fontSize: "1.75rem",
      fontWeight: 600,
      color: "#0F172A",
      margin: 0,
    } as React.CSSProperties,
    pageSlug: {
      color: "#64748B",
      fontSize: "0.875rem",
    } as React.CSSProperties,
    viewButton: {
      display: "inline-flex",
      alignItems: "center",
      gap: "0.5rem",
      padding: "0.625rem 1rem",
      backgroundColor: "#B22222",
      color: "white",
      textDecoration: "none",
      borderRadius: "0.5rem",
      fontSize: "0.875rem",
      fontWeight: 500,
    } as React.CSSProperties,
    grid: {
      display: "grid",
      gap: "1.5rem",
      gridTemplateColumns: "1fr 320px",
    } as React.CSSProperties,
    section: {
      backgroundColor: "#FFFFFF",
      borderRadius: "1rem",
      border: "1px solid #E2E8F0",
      padding: "1.5rem",
      marginBottom: "1.5rem",
    } as React.CSSProperties,
    sectionTitle: {
      fontSize: "1rem",
      fontWeight: 600,
      color: "#0F172A",
      margin: "0 0 1rem 0",
    } as React.CSSProperties,
    statsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(2, 1fr)",
      gap: "1rem",
    } as React.CSSProperties,
    statCard: {
      backgroundColor: "#F8FAFC",
      borderRadius: "0.75rem",
      padding: "1rem",
      textAlign: "center" as const,
    } as React.CSSProperties,
    statValue: {
      fontSize: "2rem",
      fontWeight: 700,
      color: "#0F172A",
      lineHeight: 1,
    } as React.CSSProperties,
    statValueGreen: {
      fontSize: "2rem",
      fontWeight: 700,
      color: "#059669",
      lineHeight: 1,
    } as React.CSSProperties,
    statLabel: {
      fontSize: "0.75rem",
      color: "#64748B",
      marginTop: "0.5rem",
    } as React.CSSProperties,
    lastVisit: {
      marginTop: "1rem",
      paddingTop: "1rem",
      borderTop: "1px solid #E2E8F0",
    } as React.CSSProperties,
    lastVisitLabel: {
      fontSize: "0.75rem",
      color: "#64748B",
      marginBottom: "0.25rem",
    } as React.CSSProperties,
    lastVisitValue: {
      fontSize: "0.875rem",
      color: "#334155",
    } as React.CSSProperties,
    sidebar: {
      display: "flex",
      flexDirection: "column" as const,
      gap: "1.5rem",
    } as React.CSSProperties,
    sidebarSection: {
      backgroundColor: "#FFFFFF",
      borderRadius: "1rem",
      border: "1px solid #E2E8F0",
      padding: "1.5rem",
    } as React.CSSProperties,
    shareButtons: {
      display: "flex",
      flexDirection: "column" as const,
      gap: "0.75rem",
    } as React.CSSProperties,
    shareButton: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "0.5rem",
      padding: "0.75rem 1rem",
      border: "1px solid #E2E8F0",
      borderRadius: "0.5rem",
      backgroundColor: "#FFFFFF",
      color: "#334155",
      fontSize: "0.875rem",
      fontWeight: 500,
      cursor: "pointer",
      transition: "all 0.15s ease",
    } as React.CSSProperties,
    shareButtonPrimary: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "0.5rem",
      padding: "0.75rem 1rem",
      border: "none",
      borderRadius: "0.5rem",
      backgroundColor: "#B22222",
      color: "white",
      fontSize: "0.875rem",
      fontWeight: 500,
      cursor: "pointer",
      transition: "all 0.15s ease",
    } as React.CSSProperties,
    infoRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "0.75rem 0",
      borderBottom: "1px solid #F1F5F9",
    } as React.CSSProperties,
    infoLabel: {
      color: "#64748B",
      fontSize: "0.8125rem",
    } as React.CSSProperties,
    infoValue: {
      color: "#0F172A",
      fontSize: "0.8125rem",
      fontWeight: 500,
    } as React.CSSProperties,
    badge: {
      fontSize: "0.6875rem",
      backgroundColor: "#FEF3C7",
      color: "#92400E",
      padding: "0.25rem 0.5rem",
      borderRadius: "9999px",
      border: "1px solid #FDE68A",
      fontWeight: 500,
    } as React.CSSProperties,
    badgeSuccess: {
      fontSize: "0.6875rem",
      backgroundColor: "#D1FAE5",
      color: "#065F46",
      padding: "0.25rem 0.5rem",
      borderRadius: "9999px",
      border: "1px solid #A7F3D0",
      fontWeight: 500,
    } as React.CSSProperties,
    footer: {
      borderTop: "1px solid #E2E8F0",
      backgroundColor: "#FFFFFF",
      flexShrink: 0,
    } as React.CSSProperties,
    footerInner: {
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "1rem 1.5rem",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    } as React.CSSProperties,
    footerText: {
      fontSize: "0.6875rem",
      color: "#94A3B8",
      display: "inline-flex",
      alignItems: "center",
      gap: "0.375rem",
    } as React.CSSProperties,
    loading: {
      textAlign: "center" as const,
      padding: "4rem",
      color: "#64748B",
      fontSize: "0.875rem",
    } as React.CSSProperties,
    errorBox: {
      backgroundColor: "#FEF2F2",
      border: "1px solid #FECACA",
      borderRadius: "0.5rem",
      padding: "2rem",
      textAlign: "center" as const,
      color: "#DC2626",
    } as React.CSSProperties,
  };

  if (loading) {
    return (
      <div style={styles.wrapper}>
        <header style={styles.header}>
          <div style={styles.headerInner}>
            <Link href="/" style={styles.navbarBrand}>
              <img src="/logos/spider.svg" alt="Spider" style={{ width: 28, height: 28 }} />
              <span>DRK</span>
              <span style={styles.navbarDivider}>|</span>
              <span style={styles.navbarDeploy}>Deploy</span>
            </Link>
          </div>
        </header>
        <div style={styles.main}>
          <div style={styles.loading}>Chargement...</div>
        </div>
      </div>
    );
  }

  if (error || !page) {
    return (
      <div style={styles.wrapper}>
        <header style={styles.header}>
          <div style={styles.headerInner}>
            <Link href="/" style={styles.navbarBrand}>
              <img src="/logos/spider.svg" alt="Spider" style={{ width: 28, height: 28 }} />
              <span>DRK</span>
              <span style={styles.navbarDivider}>|</span>
              <span style={styles.navbarDeploy}>Deploy</span>
            </Link>
          </div>
        </header>
        <div style={styles.main}>
          <Link href="/" style={styles.backLink}>
            ← Retour aux projets
          </Link>
          <div style={styles.errorBox}>
            <h2 style={{ marginBottom: "0.5rem" }}>Page introuvable</h2>
            <p>Le projet demandé n&apos;existe pas.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.wrapper}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerInner}>
          <Link href="/" style={styles.navbarBrand}>
            <img src="/logos/spider.svg" alt="Spider" style={{ width: 28, height: 28 }} />
            <span>DRK</span>
            <span style={styles.navbarDivider}>|</span>
            <span style={styles.navbarDeploy}>Deploy</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div style={styles.main}>
        <Link href="/" style={styles.backLink}>
          ← Retour aux projets
        </Link>

        <div style={styles.titleRow}>
          <div style={styles.titleGroup}>
            <h1 style={styles.pageTitle}>{page.title}</h1>
            <span style={styles.pageSlug}>/{page.slug}</span>
          </div>
          <Link href={`/clients/${page.slug}`} target="_blank" style={styles.viewButton}>
            Voir la page ↗
          </Link>
        </div>

        <div style={styles.grid}>
          {/* Main Column */}
          <div>
            {/* Analytics Section */}
            <section style={styles.section}>
              <h2 style={styles.sectionTitle}>Statistiques</h2>
              <div style={styles.statsGrid}>
                <div style={styles.statCard}>
                  <div style={styles.statValue}>{page.total_visits}</div>
                  <div style={styles.statLabel}>Visites totales</div>
                </div>
                <div style={styles.statCard}>
                  <div style={styles.statValueGreen}>{page.unique_visitors}</div>
                  <div style={styles.statLabel}>Visiteurs uniques</div>
                </div>
              </div>
              <div style={styles.lastVisit}>
                <div style={styles.lastVisitLabel}>Dernière visite</div>
                <div style={styles.lastVisitValue}>
                  {page.last_visit ? formatDate(page.last_visit) : "Aucune visite"}
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside style={styles.sidebar}>
            {/* Share Section */}
            <section style={styles.sidebarSection}>
              <h3 style={styles.sectionTitle}>Partager</h3>
              <div style={styles.shareButtons}>
                <button
                  type="button"
                  style={styles.shareButtonPrimary}
                  onClick={copyLink}
                >
                  {copied === "link" ? "Copié !" : "Copier le lien"}
                </button>
              </div>
            </section>

            {/* Info Section */}
            <section style={styles.sidebarSection}>
              <h3 style={styles.sectionTitle}>Informations</h3>
              <div style={styles.infoRow}>
                <span style={styles.infoLabel}>Slug</span>
                <code style={{ ...styles.infoValue, fontFamily: "monospace" }}>{page.slug}</code>
              </div>
              <div style={styles.infoRow}>
                <span style={styles.infoLabel}>Protection</span>
                <span style={page.has_password ? styles.badge : styles.badgeSuccess}>
                  {page.has_password ? "Protégé" : "Public"}
                </span>
              </div>
              <div style={{ ...styles.infoRow, borderBottom: "none" }}>
                <span style={styles.infoLabel}>Statut</span>
                <span style={styles.badgeSuccess}>Actif</span>
              </div>
            </section>
          </aside>
        </div>
      </div>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerInner}>
          <span style={styles.footerText}>
            <img
              src="/logos/spider.svg"
              alt="Spider"
              style={{ width: 12, height: 12, opacity: 0.5 }}
            />
            Powered by Spider Deploy
          </span>
        </div>
      </footer>
    </div>
  );
}
