"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

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

export default function Dashboard() {
  const [pages, setPages] = useState<PageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/pages")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch pages");
        return res.json();
      })
      .then((data) => {
        setPages(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const formatDate = (isoString: string | null) => {
    if (!isoString) return null;
    const date = new Date(isoString);
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // All inline styles to bypass globals.css
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
    pageTitle: {
      fontSize: "1.5rem",
      fontWeight: 600,
      color: "#0F172A",
      marginBottom: "1.5rem",
      fontFamily: "'Inter', system-ui, sans-serif",
    } as React.CSSProperties,
    loading: {
      textAlign: "center" as const,
      padding: "3rem",
      color: "#64748B",
      fontSize: "0.875rem",
    } as React.CSSProperties,
    error: {
      backgroundColor: "#FEF2F2",
      border: "1px solid #FECACA",
      borderRadius: "0.5rem",
      padding: "1rem",
      color: "#DC2626",
      fontSize: "0.875rem",
    } as React.CSSProperties,
    emptyState: {
      textAlign: "center" as const,
      padding: "4rem 2rem",
      backgroundColor: "#FFFFFF",
      borderRadius: "1rem",
      border: "1px solid #E2E8F0",
    } as React.CSSProperties,
    emptyIcon: {
      fontSize: "4rem",
      marginBottom: "1rem",
    } as React.CSSProperties,
    emptyTitle: {
      fontSize: "1.125rem",
      fontWeight: 600,
      color: "#0F172A",
      marginBottom: "0.5rem",
    } as React.CSSProperties,
    emptyText: {
      color: "#64748B",
      fontSize: "0.875rem",
      margin: 0,
    } as React.CSSProperties,
    grid: {
      display: "grid",
      gap: "1.5rem",
      gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
    } as React.CSSProperties,
    card: {
      backgroundColor: "#FFFFFF",
      borderRadius: "1rem",
      border: "1px solid #E2E8F0",
      padding: "1.5rem",
      textDecoration: "none",
      display: "block",
      transition: "all 0.2s ease",
    } as React.CSSProperties,
    cardHeader: {
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "space-between",
      marginBottom: "1rem",
    } as React.CSSProperties,
    cardTitle: {
      fontSize: "1rem",
      fontWeight: 600,
      color: "#0F172A",
      margin: 0,
      marginBottom: "0.25rem",
    } as React.CSSProperties,
    cardSlug: {
      fontSize: "0.75rem",
      color: "#64748B",
      margin: 0,
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
    statsBox: {
      backgroundColor: "#F8FAFC",
      borderRadius: "0.75rem",
      padding: "1rem",
      marginBottom: "1rem",
    } as React.CSSProperties,
    statsGrid: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "1rem",
    } as React.CSSProperties,
    statValue: {
      fontSize: "1.5rem",
      fontWeight: 700,
      color: "#0F172A",
      lineHeight: 1,
      marginBottom: "0.25rem",
    } as React.CSSProperties,
    statValueGreen: {
      fontSize: "1.5rem",
      fontWeight: 700,
      color: "#059669",
      lineHeight: 1,
      marginBottom: "0.25rem",
    } as React.CSSProperties,
    statLabel: {
      fontSize: "0.6875rem",
      color: "#64748B",
      margin: 0,
    } as React.CSSProperties,
    statDivider: {
      marginTop: "0.75rem",
      paddingTop: "0.75rem",
      borderTop: "1px solid #E2E8F0",
    } as React.CSSProperties,
    lastVisitLabel: {
      fontSize: "0.6875rem",
      color: "#64748B",
      marginBottom: "0.125rem",
    } as React.CSSProperties,
    lastVisitValue: {
      fontSize: "0.8125rem",
      color: "#334155",
      margin: 0,
    } as React.CSSProperties,
    noVisit: {
      fontSize: "0.75rem",
      color: "#94A3B8",
      fontStyle: "italic",
      margin: 0,
    } as React.CSSProperties,
    cardFooter: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    } as React.CSSProperties,
    statusDot: {
      display: "inline-flex",
      alignItems: "center",
      gap: "0.375rem",
      fontSize: "0.75rem",
    } as React.CSSProperties,
    dot: {
      width: "0.5rem",
      height: "0.5rem",
      backgroundColor: "#10B981",
      borderRadius: "9999px",
    } as React.CSSProperties,
    statusText: {
      color: "#64748B",
    } as React.CSSProperties,
    arrow: {
      color: "#94A3B8",
      fontSize: "1rem",
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
    footerIcon: {
      width: "12px",
      height: "12px",
      opacity: 0.5,
    } as React.CSSProperties,
  };

  return (
    <div style={styles.wrapper}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerInner}>
          <div style={styles.navbarBrand}>
            <img src="/logos/spider.svg" alt="Spider" style={{ width: 28, height: 28 }} />
            <span>DRK</span>
            <span style={styles.navbarDivider}>|</span>
            <span style={styles.navbarDeploy}>Deploy</span>
          </div>
          <div />
        </div>
      </header>

      {/* Main Content */}
      <div style={styles.main}>
        <h1 style={styles.pageTitle}>Mes Projets</h1>

        {/* Loading State */}
        {loading && (
          <div style={styles.loading}>
            Chargement...
          </div>
        )}

        {/* Error State */}
        {error && (
          <div style={styles.error}>
            Erreur: {error}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && pages.length === 0 && (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>📄</div>
            <h3 style={styles.emptyTitle}>Aucun projet</h3>
            <p style={styles.emptyText}>Aucun projet n&apos;a encore été créé.</p>
          </div>
        )}

        {/* Projects Grid */}
        {!loading && !error && pages.length > 0 && (
          <div style={styles.grid}>
            {pages.map((page) => (
              <Link
                key={page.id}
                href={`/clients/${page.slug}`}
                style={styles.card}
              >
                {/* Card Header */}
                <div style={styles.cardHeader}>
                  <div>
                    <h3 style={styles.cardTitle}>{page.title}</h3>
                    <div style={styles.cardSlug}>/{page.slug}</div>
                  </div>
                  {page.has_password && (
                    <span style={styles.badge}>Protégé</span>
                  )}
                </div>

                {/* Analytics */}
                <div style={styles.statsBox}>
                  <div style={styles.statsGrid}>
                    <div>
                      <div style={styles.statValue}>{page.total_visits}</div>
                      <div style={styles.statLabel}>Visites totales</div>
                    </div>
                    <div>
                      <div style={styles.statValueGreen}>{page.unique_visitors}</div>
                      <div style={styles.statLabel}>Visiteurs uniques</div>
                    </div>
                  </div>

                  <div style={styles.statDivider}>
                    {page.last_visit ? (
                      <>
                        <div style={styles.lastVisitLabel}>Dernière visite</div>
                        <div style={styles.lastVisitValue}>{formatDate(page.last_visit)}</div>
                      </>
                    ) : (
                      <div style={styles.noVisit}>Aucune visite</div>
                    )}
                  </div>
                </div>

                {/* Card Footer */}
                <div style={styles.cardFooter}>
                  <span style={styles.statusDot}>
                    <span style={styles.dot}></span>
                    <span style={styles.statusText}>Actif</span>
                  </span>
                  <span style={styles.arrow}>→</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Footer - Fixed at bottom */}
      <footer style={styles.footer}>
        <div style={styles.footerInner}>
          <span style={styles.footerText}>
            <img
              src="/logos/spider.svg"
              alt="Spider"
              style={styles.footerIcon}
            />
            Powered by Spider Deploy
          </span>
        </div>
      </footer>
    </div>
  );
}
