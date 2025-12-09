"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

interface VisitorInfo {
  ip: string;
  country: string | null;
  count: number;
}

interface RecentVisit {
  ip: string;
  country: string | null;
  city: string | null;
  device_type: string | null;
  os: string | null;
  browser: string | null;
  visited_at: string;
}

interface PageAnalytics {
  total_visits: number;
  unique_visitors: number;
  failed_attempts: number;
  last_visit: string | null;
  top_visitors: VisitorInfo[];
  recent_visits: RecentVisit[];
}

interface PageData {
  id: number;
  slug: string;
  title: string;
  has_password: boolean;
  is_public: boolean;
  analytics: PageAnalytics;
}

export default function ProjectDetail() {
  const params = useParams();
  const slug = params.slug as string;

  const [page, setPage] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<"link" | "password" | null>(null);
  const [password, setPassword] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [origin, setOrigin] = useState<string>("");

  useEffect(() => {
    setOrigin(window.location.origin);
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

  const fetchPassword = async () => {
    if (password) return password;
    try {
      const res = await fetch(`/api/pages/${slug}/password`);
      const data = await res.json();
      setPassword(data.password);
      return data.password;
    } catch {
      return null;
    }
  };

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

  const formatShortDate = (isoString: string | null) => {
    if (!isoString) return null;
    const date = new Date(isoString);
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const copyLinkWithPassword = async () => {
    const pwd = await fetchPassword();
    if (!pwd) {
      copyLink();
      return;
    }
    const encodedPassword = btoa(pwd);
    const url = `${window.location.origin}/clients/${slug}?p=${encodedPassword}`;
    navigator.clipboard.writeText(url);
    setCopied("password");
    setTimeout(() => setCopied(null), 2000);
  };

  const copyLink = () => {
    const url = `${window.location.origin}/clients/${slug}`;
    navigator.clipboard.writeText(url);
    setCopied("link");
    setTimeout(() => setCopied(null), 2000);
  };

  const togglePassword = async () => {
    if (!showPassword) {
      await fetchPassword();
    }
    setShowPassword(!showPassword);
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
      borderBottom: "1px solid #E4E4E7", // --color-divider
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
      fontFamily: "monospace",
    } as React.CSSProperties,
    projectUrl: {
      color: "#B22222",
      fontSize: "0.875rem",
      fontWeight: 500,
      textDecoration: "none",
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
      alignItems: "start",
    } as React.CSSProperties,
    section: {
      backgroundColor: "#FFFFFF",
      borderRadius: "1rem",
      border: "1px solid #E4E4E7",
      padding: "1.5rem",
    } as React.CSSProperties,
    sectionTitle: {
      fontSize: "1rem",
      fontWeight: 600,
      color: "#0F172A",
      margin: "0 0 1rem 0",
    } as React.CSSProperties,
    statsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: "1rem", // --space-4
      marginBottom: "1.5rem", // --space-6
    } as React.CSSProperties,
    statCard: {
      backgroundColor: "#FAFAFA", // --color-slate-50
      borderRadius: "0.75rem",
      padding: "1.25rem", // --space-5
      textAlign: "center" as const,
    } as React.CSSProperties,
    statValue: {
      fontSize: "1.75rem",
      fontWeight: 700,
      color: "#0F172A",
      lineHeight: 1,
    } as React.CSSProperties,
    statValueGreen: {
      fontSize: "1.75rem",
      fontWeight: 700,
      color: "#059669",
      lineHeight: 1,
    } as React.CSSProperties,
    statValueRed: {
      fontSize: "1.75rem",
      fontWeight: 700,
      color: "#DC2626",
      lineHeight: 1,
    } as React.CSSProperties,
    statLabel: {
      fontSize: "0.75rem",
      color: "#64748B",
      marginTop: "0.5rem",
    } as React.CSSProperties,
    subSection: {
      marginTop: "2rem", // --space-8
      paddingTop: "2rem", // --space-8
      borderTop: "1px solid #E4E4E7", // --color-divider
    } as React.CSSProperties,
    subSectionTitle: {
      fontSize: "0.875rem",
      fontWeight: 600,
      color: "#475569",
      marginBottom: "1rem",
    } as React.CSSProperties,
    visitorList: {
      display: "flex",
      flexDirection: "column" as const,
      gap: "0",
      backgroundColor: "#F9FAFB",
      borderRadius: "0.5rem",
      padding: "0.5rem 0.75rem",
    } as React.CSSProperties,
    visitorItem: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "0.75rem 0", // --space-3
      borderBottom: "1px solid #F4F4F5", // --color-slate-100
      fontSize: "0.875rem",
    } as React.CSSProperties,
    visitorIp: {
      fontFamily: "monospace",
      color: "#334155",
    } as React.CSSProperties,
    visitorCountry: {
      color: "#64748B",
      marginLeft: "0.5rem",
    } as React.CSSProperties,
    visitorCount: {
      color: "#B22222",
      fontWeight: 600,
    } as React.CSSProperties,
    recentVisitsContainer: {
      display: "flex",
      flexDirection: "column" as const,
      gap: "0",
    } as React.CSSProperties,
    recentVisitCard: {
      padding: "0.75rem 0", // --space-3
      borderBottom: "1px solid #F4F4F5", // --color-slate-100
    } as React.CSSProperties,
    recentVisitHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "0.25rem",
    } as React.CSSProperties,
    recentVisitIp: {
      fontFamily: "monospace",
      fontSize: "0.8125rem",
      color: "#334155",
    } as React.CSSProperties,
    recentVisitTime: {
      fontSize: "0.75rem",
      color: "#94A3B8",
    } as React.CSSProperties,
    recentVisitDetails: {
      fontSize: "0.75rem",
      color: "#64748B",
    } as React.CSSProperties,
    deviceBadge: {
      display: "inline-block",
      padding: "0.125rem 0.5rem",
      backgroundColor: "#DBEAFE",
      color: "#1D4ED8",
      borderRadius: "0.25rem",
      fontSize: "0.6875rem",
      fontWeight: 500,
      marginLeft: "0.75rem",
      textTransform: "uppercase" as const,
      letterSpacing: "0.025em",
    } as React.CSSProperties,
    sidebar: {
      display: "flex",
      flexDirection: "column" as const,
      gap: "1rem",
    } as React.CSSProperties,
    sidebarSection: {
      backgroundColor: "#FFFFFF",
      borderRadius: "1rem",
      border: "1px solid #E4E4E7", // --color-divider
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
      padding: "0.75rem 1rem", // --space-3 --space-4
      border: "1px solid #E4E4E7", // --color-divider
      borderRadius: "0.75rem", // --radius-xl
      backgroundColor: "#FFFFFF",
      color: "#334155",
      fontSize: "0.875rem",
      fontWeight: 500,
      cursor: "pointer",
    } as React.CSSProperties,
    shareButtonPrimary: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "0.5rem",
      padding: "0.75rem 1rem", // --space-3 --space-4
      border: "none",
      borderRadius: "0.75rem", // --radius-xl
      backgroundColor: "#B22222",
      color: "white",
      fontSize: "0.875rem",
      fontWeight: 500,
      cursor: "pointer",
    } as React.CSSProperties,
    passwordBox: {
      marginTop: "1rem",
      padding: "0.75rem",
      backgroundColor: "#FAFAFA", // --color-slate-50
      borderRadius: "0.5rem",
      border: "1px solid #E4E4E7", // --color-divider
    } as React.CSSProperties,
    passwordHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "0.5rem",
    } as React.CSSProperties,
    passwordLabel: {
      fontSize: "0.75rem",
      color: "#64748B",
    } as React.CSSProperties,
    passwordToggle: {
      fontSize: "0.75rem",
      color: "#B22222",
      background: "none",
      border: "none",
      cursor: "pointer",
      padding: 0,
    } as React.CSSProperties,
    passwordValue: {
      fontFamily: "monospace",
      fontSize: "0.875rem",
      color: "#0F172A",
    } as React.CSSProperties,
    infoRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "0.75rem 0",
      borderBottom: "1px solid #F4F4F5", // --color-slate-100
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
    badgeError: {
      fontSize: "0.6875rem",
      backgroundColor: "#FEE2E2",
      color: "#991B1B",
      padding: "0.25rem 0.5rem",
      borderRadius: "9999px",
      border: "1px solid #FECACA",
      fontWeight: 500,
    } as React.CSSProperties,
    footer: {
      borderTop: "1px solid #E4E4E7", // --color-divider
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
    emptyState: {
      textAlign: "center" as const,
      padding: "1.5rem",
      color: "#94A3B8",
      fontSize: "0.8125rem",
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
            <a
              href={`/clients/${page.slug}${page.has_password && password ? `?p=${btoa(password)}` : ''}`}
              target="_blank"
              rel="noopener noreferrer"
              style={styles.projectUrl}
              onClick={async (e) => {
                if (page.has_password && !password) {
                  e.preventDefault();
                  const pwd = await fetchPassword();
                  if (pwd) {
                    window.open(`/clients/${page.slug}?p=${btoa(pwd)}`, '_blank');
                  } else {
                    window.open(`/clients/${page.slug}`, '_blank');
                  }
                }
              }}
            >
              {origin}/clients/{page.slug} ↗
            </a>
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
                  <div style={styles.statValue}>{page.analytics.total_visits}</div>
                  <div style={styles.statLabel}>Visites totales</div>
                </div>
                <div style={styles.statCard}>
                  <div style={styles.statValueGreen}>{page.analytics.unique_visitors}</div>
                  <div style={styles.statLabel}>Visiteurs uniques</div>
                </div>
                <div style={styles.statCard}>
                  <div style={page.analytics.failed_attempts > 0 ? styles.statValueRed : styles.statValue}>
                    {page.analytics.failed_attempts}
                  </div>
                  <div style={styles.statLabel}>Échecs connexion (24h)</div>
                </div>
              </div>

              {/* Top Visitors */}
              {page.analytics.top_visitors.length > 0 && (
                <div style={styles.subSection}>
                  <h3 style={styles.subSectionTitle}>Top Visiteurs</h3>
                  <div style={styles.visitorList}>
                    {page.analytics.top_visitors.map((visitor, index) => (
                      <div key={index} style={styles.visitorItem}>
                        <span>
                          <span style={styles.visitorIp}>{visitor.ip}</span>
                          {visitor.country && (
                            <span style={styles.visitorCountry}>• {visitor.country}</span>
                          )}
                        </span>
                        <span style={styles.visitorCount}>{visitor.count}×</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recent Visits */}
              {page.analytics.recent_visits.length > 0 && (
                <div style={styles.subSection}>
                  <h3 style={styles.subSectionTitle}>Visites Récentes</h3>
                  <div style={styles.recentVisitsContainer}>
                    {page.analytics.recent_visits.map((visit, index) => (
                      <div key={index} style={{
                        ...styles.recentVisitCard,
                        borderBottom: index === page.analytics.recent_visits.length - 1 ? "none" : undefined
                      }}>
                        <div style={styles.recentVisitHeader}>
                          <span>
                            <span style={styles.recentVisitIp}>{visit.ip}</span>
                            {visit.device_type && (
                              <span style={styles.deviceBadge}>{visit.device_type.toUpperCase()}</span>
                            )}
                          </span>
                          <span style={styles.recentVisitTime}>{formatShortDate(visit.visited_at)}</span>
                        </div>
                        <div style={styles.recentVisitDetails}>
                          {[visit.country, visit.city].filter(Boolean).join(", ")}
                          {(visit.os || visit.browser) && (
                            <>
                              {(visit.country || visit.city) && <span style={{ margin: "0 0.375rem" }}>•</span>}
                              {visit.os}{visit.os && visit.browser && " / "}{visit.browser}
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {page.analytics.total_visits === 0 && (
                <div style={styles.emptyState}>
                  Aucune visite enregistrée
                </div>
              )}
            </section>
          </div>

          {/* Sidebar */}
          <aside style={styles.sidebar}>
            {/* Share Section */}
            <section style={styles.sidebarSection}>
              <h3 style={styles.sectionTitle}>Partager</h3>
              <div style={styles.shareButtons}>
                {page.has_password && (
                  <button
                    type="button"
                    style={styles.shareButtonPrimary}
                    onClick={copyLinkWithPassword}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                    {copied === "password" ? "Copié !" : "Copier avec mot de passe"}
                  </button>
                )}
                <button
                  type="button"
                  style={page.has_password ? styles.shareButton : styles.shareButtonPrimary}
                  onClick={copyLink}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                  </svg>
                  {copied === "link" ? "Copié !" : "Copier le lien"}
                </button>
              </div>

              {page.has_password && (
                <div style={styles.passwordBox}>
                  <div style={styles.passwordHeader}>
                    <span style={styles.passwordLabel}>Mot de passe</span>
                    <button type="button" style={styles.passwordToggle} onClick={togglePassword}>
                      {showPassword ? "Masquer" : "Afficher"}
                    </button>
                  </div>
                  <div style={styles.passwordValue}>
                    {showPassword && password ? password : "••••••••"}
                  </div>
                </div>
              )}
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
              <div style={styles.infoRow}>
                <span style={styles.infoLabel}>Dernière visite</span>
                <span style={styles.infoValue}>
                  {page.analytics.last_visit ? formatShortDate(page.analytics.last_visit) : "—"}
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
