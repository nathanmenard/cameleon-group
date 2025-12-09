"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { BLOCK_REGISTRY, COLORS, TYPOGRAPHY, type BlockDefinition } from "@/lib/design-system";
import { ContentRenderer } from "@/components/sections/ContentRenderer";
import { useAuth } from "@/hooks/useAuth";

export default function DesignSystemPage() {
  const router = useRouter();
  const { user, loading: authLoading, isAdmin, logout } = useAuth();
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [tocNavVisible, setTocNavVisible] = useState(false);
  const [inBlocksSection, setInBlocksSection] = useState(false);
  const [forceShowSections, setForceShowSections] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("colors");
  const [activeBlock, setActiveBlock] = useState<string>("");
  const prevInBlocksRef = useRef(false);
  const blockLinksRef = useRef<HTMLDivElement>(null);

  // Auth check
  useEffect(() => {
    if (!authLoading && !isAdmin) {
      router.push("/login");
    }
  }, [authLoading, isAdmin, router]);

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--noir)",
        color: "var(--gris-400)",
        fontFamily: "'Inter', sans-serif",
      }}>
        Chargement...
      </div>
    );
  }

  // Don't render if not admin (will redirect)
  if (!isAdmin) {
    return null;
  }

  const filteredBlocks = activeCategory === "all"
    ? BLOCK_REGISTRY
    : BLOCK_REGISTRY.filter((b) => b.category === activeCategory);

  const categories = [
    { id: "all", label: "Tous", count: BLOCK_REGISTRY.length },
    { id: "content", label: "Contenu", count: BLOCK_REGISTRY.filter(b => b.category === "content").length },
    { id: "visual", label: "Visuels", count: BLOCK_REGISTRY.filter(b => b.category === "visual").length },
    { id: "data", label: "Données", count: BLOCK_REGISTRY.filter(b => b.category === "data").length },
    { id: "layout", label: "Layout", count: BLOCK_REGISTRY.filter(b => b.category === "layout").length },
    { id: "ui", label: "Interface", count: BLOCK_REGISTRY.filter(b => b.category === "ui").length },
  ];

  const tocItems = [
    { id: "colors", num: "1", title: "Couleurs" },
    { id: "typography", num: "2", title: "Typographie" },
    { id: "spacing", num: "3", title: "Espacements" },
    { id: "blocks", num: "4", title: "Composants" },
    { id: "usage", num: "5", title: "Usage" },
  ];

  const catColors: Record<string, string> = {
    content: "#3b82f6",
    visual: "#f59e0b",
    data: "#10b981",
    layout: "#8b5cf6",
    ui: "#ec4899",
  };

  useEffect(() => {
    const handleScroll = () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      setScrollProgress((winScroll / height) * 100);
      const heroEnd = 300;
      setTocNavVisible(winScroll > heroEnd);

      // Detect active section based on scroll position
      const sectionIds = ["colors", "typography", "spacing", "blocks", "usage"];
      let foundActive = false;
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const section = document.getElementById(sectionIds[i]);
        if (section) {
          const rect = section.getBoundingClientRect();
          if (rect.top < 200) {
            setActiveSection(sectionIds[i]);
            foundActive = true;
            break;
          }
        }
      }
      // Default to first section if none found
      if (!foundActive) {
        setActiveSection("colors");
      }

      // Check if we're in the blocks section
      const blocksSection = document.getElementById("blocks");
      const usageSection = document.getElementById("usage");
      if (blocksSection && usageSection) {
        const blocksTop = blocksSection.getBoundingClientRect().top;
        const usageTop = usageSection.getBoundingClientRect().top;
        const newInBlocks = blocksTop < 150 && usageTop > 150;

        if (newInBlocks !== prevInBlocksRef.current) {
          setInBlocksSection(newInBlocks);
          prevInBlocksRef.current = newInBlocks;
          // Reset manual override when scroll changes section
          setForceShowSections(false);
          // Reset category filter when leaving blocks section
          if (!newInBlocks) {
            setActiveCategory("all");
          }
        }
      }

      // Detect active block (always, not just when inBlocksSection changes)
      const blockElements = document.querySelectorAll("[id^='block-']");
      let foundBlock = "";
      for (const el of blockElements) {
        const rect = el.getBoundingClientRect();
        if (rect.top < 200 && rect.bottom > 0) {
          foundBlock = el.id.replace("block-", "");
        }
      }
      if (foundBlock) {
        setActiveBlock(foundBlock);
      }
    };
    window.addEventListener("scroll", handleScroll);
    // Run once on mount
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Auto-scroll component links to show active block
  useEffect(() => {
    if (activeBlock && blockLinksRef.current) {
      const activeLink = blockLinksRef.current.querySelector(`a[href="#block-${activeBlock}"]`);
      if (activeLink) {
        activeLink.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
      }
    }
  }, [activeBlock]);

  return (
    <>
      <nav>
        <a href="/clients/cameleon-group" className="nav-logo">
          <img src="/logos/logo_drakkar_blanc.png" alt="Drakkar" />
        </a>
        <span className="nav-date">Design System v1.0</span>
      </nav>

      <div className="progress-bar" style={{ width: `${scrollProgress}%` }} />

      <div className={`toc-nav ${tocNavVisible ? "visible" : ""}`}>
        <div className="toc-nav-inner" style={{ position: "relative" }}>
          {/* Sections nav - crossfade out when in blocks (unless forced) */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "0.25rem",
            opacity: (inBlocksSection && !forceShowSections) ? 0 : 1,
            transform: (inBlocksSection && !forceShowSections) ? "translateY(-4px)" : "translateY(0)",
            transition: "opacity 0.2s ease, transform 0.2s ease",
            position: (inBlocksSection && !forceShowSections) ? "absolute" : "relative",
            pointerEvents: (inBlocksSection && !forceShowSections) ? "none" : "auto",
          }}>
            {tocItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={() => setForceShowSections(false)}
                className={activeSection === item.id ? "active" : ""}
              >
                <span className="nav-num">{item.num}.</span> {item.title}
              </a>
            ))}
          </div>

          {/* Components nav - crossfade in when in blocks (unless forced to show sections) */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            opacity: (inBlocksSection && !forceShowSections) ? 1 : 0,
            transform: (inBlocksSection && !forceShowSections) ? "translateY(0)" : "translateY(4px)",
            transition: "opacity 0.2s ease, transform 0.2s ease",
            position: (inBlocksSection && !forceShowSections) ? "relative" : "absolute",
            pointerEvents: (inBlocksSection && !forceShowSections) ? "auto" : "none",
            width: "100%",
          }}>
            {/* Fixed left part */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
              {/* Back to sections */}
              <button
                type="button"
                onClick={() => setForceShowSections(true)}
                style={{
                  fontSize: 11,
                  color: "var(--gris-400)",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  padding: "6px 10px",
                  background: "var(--gris-700)",
                  borderRadius: 4,
                  border: "none",
                  cursor: "pointer",
                }}
              >
                ← Sections
              </button>
              {/* Separator */}
              <div style={{ width: 1, height: 20, background: "var(--gris-600)" }} />
              {/* Category filters */}
              <div style={{
                display: "flex",
                gap: 2,
                padding: 3,
                background: "var(--gris-700)",
                borderRadius: 6,
              }}>
                {categories.map((cat) => (
                  <button
                    type="button"
                    key={cat.id}
                    onClick={() => {
                      setActiveCategory(cat.id);
                      setTimeout(() => {
                        if (cat.id === "all") {
                          // Scroll to Section 4 (Composants)
                          const el = document.getElementById("blocks");
                          if (el) el.scrollIntoView({ behavior: "smooth" });
                        } else {
                          // Scroll to category section header
                          const el = document.getElementById(`cat-${cat.id}`);
                          if (el) el.scrollIntoView({ behavior: "smooth" });
                        }
                      }, 50);
                    }}
                    style={{
                      padding: "5px 10px",
                      background: activeCategory === cat.id ? "var(--gris-600)" : "transparent",
                      color: activeCategory === cat.id ? "#fff" : "var(--gris-400)",
                      border: "none",
                      borderRadius: 4,
                      fontSize: 12,
                      fontWeight: 500,
                      cursor: "pointer",
                      fontFamily: "'Inter', sans-serif",
                      whiteSpace: "nowrap",
                      transition: "all 0.15s ease",
                    }}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
              {/* Separator */}
              <div style={{ width: 1, height: 20, background: "var(--gris-600)" }} />
            </div>

            {/* Scrollable component links with fade hints */}
            <div style={{
              position: "relative",
              flex: 1,
              overflow: "hidden",
            }}>
              <div
                ref={blockLinksRef}
                style={{
                  display: "flex",
                  gap: 6,
                  overflowX: "auto",
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                  paddingRight: 24,
                }}
                className="hide-scrollbar"
              >
                {filteredBlocks.map((block) => (
                  <a
                    key={block.type}
                    href={`#block-${block.type}`}
                    className={activeBlock === block.type ? "active" : ""}
                    style={{ fontSize: 12, flexShrink: 0 }}
                  >
                    {block.name}
                  </a>
                ))}
              </div>
              {/* Fade right */}
              <div style={{
                position: "absolute",
                top: 0,
                right: 0,
                bottom: 0,
                width: 40,
                background: "linear-gradient(to right, transparent, var(--gris-800))",
                pointerEvents: "none",
              }} />
            </div>
          </div>
        </div>
      </div>

      <main style={{ maxWidth: 900 }}>
        {/* Header - like main doc */}
        <header className="doc-header">
          <div className="doc-type">Documentation</div>
          <h1 className="doc-title">Design System</h1>
          <p className="doc-subtitle">
            Tokens, typographie et {BLOCK_REGISTRY.length} composants pour créer des notes stratégiques cohérentes
          </p>
        </header>

        {/* TOC Grid */}
        <div className="toc" id="tocBlock">
          <div className="toc-header">
            <div className="toc-title">Contenu</div>
            <div className="toc-count">{tocItems.length} sections</div>
          </div>
          <div className="toc-grid">
            {tocItems.map((item) => (
              <a key={item.id} href={`#${item.id}`} className="toc-item">
                <span className="toc-item-num">{item.num.padStart(2, "0")}</span>
                <span className="toc-item-text">{item.title}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Section 1: Colors */}
        <section id="colors" style={{ scrollMarginTop: 140 }}>
          <div className="section-num">Section 1</div>
          <h2>Couleurs</h2>
          <p>La palette officielle Drakkar avec codes hex et variables CSS.</p>

          <h3>Couleurs principales</h3>
          <div className="ds-color-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 32 }}>
            {[
              { name: "Rouge", hex: COLORS.rouge, css: "--rouge", tw: "bg-rouge" },
              { name: "Rouge Vif", hex: COLORS.rougeVif, css: "--rouge-vif", tw: "bg-rouge-vif" },
              { name: "Rouge Sombre", hex: COLORS.rougeSombre, css: "--rouge-sombre", tw: "bg-rouge-sombre" },
            ].map((c) => (
              <ColorCard key={c.name} {...c} />
            ))}
          </div>

          <h3>Neutres</h3>
          <div className="ds-color-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 32 }}>
            {[
              { name: "Noir", hex: COLORS.noir, css: "--noir", tw: "bg-noir" },
              { name: "Blanc", hex: COLORS.blanc, css: "--blanc", tw: "bg-blanc" },
            ].map((c) => (
              <ColorCard key={c.name} {...c} />
            ))}
          </div>

          <h3>Échelle de gris</h3>
          <div className="ds-color-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
            {Object.entries(COLORS.gris).map(([key, hex]) => (
              <ColorCard
                key={key}
                name={`Gris ${key}`}
                hex={hex}
                css={`--gris-${key}`}
                tw={`bg-gris-${key}`}
              />
            ))}
          </div>

          <h3 style={{ marginTop: 32 }}>Lisibilité selon le fond</h3>
          <p>Règles de contraste pour garantir la lisibilité WCAG AA (4.5:1 pour le texte normal).</p>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Fond clair */}
            <div style={{
              background: "var(--gris-50)",
              borderRadius: 10,
              border: "1px solid var(--gris-200)",
              overflow: "hidden",
            }}>
              <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--gris-200)", background: "#fff" }}>
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 600, color: "var(--noir)" }}>
                  Fond clair
                </span>
                <span style={{ marginLeft: 8, fontSize: 11, color: "var(--gris-500)" }}>
                  blanc, gris-50, gris-100, gris-200
                </span>
              </div>
              <div style={{ padding: 16, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ color: "var(--noir)", fontWeight: 600, marginBottom: 4 }}>Texte principal</div>
                  <code style={{ fontSize: 10, color: "var(--gris-500)" }}>noir</code>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ color: "var(--gris-600)", marginBottom: 4 }}>Texte secondaire</div>
                  <code style={{ fontSize: 10, color: "var(--gris-500)" }}>gris-600</code>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ color: "var(--gris-500)", marginBottom: 4 }}>Texte muted</div>
                  <code style={{ fontSize: 10, color: "var(--gris-500)" }}>gris-500</code>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ border: "1px solid var(--gris-200)", padding: "4px 8px", borderRadius: 4, marginBottom: 4 }}>Bordures</div>
                  <code style={{ fontSize: 10, color: "var(--gris-500)" }}>gris-200</code>
                </div>
              </div>
            </div>

            {/* Fond sombre */}
            <div style={{
              background: "var(--noir)",
              borderRadius: 10,
              overflow: "hidden",
            }}>
              <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--gris-700)" }}>
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 600, color: "#fff" }}>
                  Fond sombre
                </span>
                <span style={{ marginLeft: 8, fontSize: 11, color: "var(--gris-400)" }}>
                  noir, gris-800, gris-700
                </span>
              </div>
              <div style={{ padding: 16, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ color: "#fff", fontWeight: 600, marginBottom: 4 }}>Texte principal</div>
                  <code style={{ fontSize: 10, color: "var(--gris-400)" }}>blanc</code>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ color: "var(--gris-300)", marginBottom: 4 }}>Texte secondaire</div>
                  <code style={{ fontSize: 10, color: "var(--gris-400)" }}>gris-300</code>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ color: "var(--gris-400)", marginBottom: 4 }}>Texte muted</div>
                  <code style={{ fontSize: 10, color: "var(--gris-400)" }}>gris-400</code>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ border: "1px solid var(--gris-700)", padding: "4px 8px", borderRadius: 4, marginBottom: 4, color: "var(--gris-300)" }}>Bordures</div>
                  <code style={{ fontSize: 10, color: "var(--gris-400)" }}>gris-700</code>
                </div>
              </div>
            </div>

            {/* Fond rouge */}
            <div style={{
              background: "linear-gradient(135deg, var(--rouge), var(--rouge-vif), var(--rouge-sombre))",
              borderRadius: 10,
              overflow: "hidden",
            }}>
              <div style={{ padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.2)" }}>
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 600, color: "#fff" }}>
                  Fond coloré (rouge)
                </span>
                <span style={{ marginLeft: 8, fontSize: 11, color: "rgba(255,255,255,0.8)" }}>
                  rouge, rouge-vif, rouge-sombre
                </span>
              </div>
              <div style={{ padding: 16, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ color: "#fff", fontWeight: 600, marginBottom: 4 }}>Texte principal</div>
                  <code style={{ fontSize: 10, color: "rgba(255,255,255,0.7)" }}>blanc</code>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ color: "rgba(255,255,255,0.9)", marginBottom: 4 }}>Texte secondaire</div>
                  <code style={{ fontSize: 10, color: "rgba(255,255,255,0.7)" }}>blanc 90%</code>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ color: "rgba(255,255,255,0.7)", marginBottom: 4 }}>Texte muted</div>
                  <code style={{ fontSize: 10, color: "rgba(255,255,255,0.7)" }}>blanc 70%</code>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Typography */}
        <section id="typography" style={{ scrollMarginTop: 140 }}>
          <div className="section-num">Section 2</div>
          <h2>Typographie</h2>
          <p>Deux familles de polices complémentaires pour un équilibre éditorial / interface.</p>

          <h3>Familles de polices</h3>
          <div className="ds-fonts-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 32 }}>
            <div style={{
              padding: 24,
              background: "var(--gris-50)",
              borderRadius: 10,
              border: "1px solid var(--gris-200)",
            }}>
              <div style={{ fontFamily: TYPOGRAPHY.fontSerif, fontSize: 32, marginBottom: 8 }}>
                Newsreader
              </div>
              <div style={{ fontFamily: TYPOGRAPHY.fontSerif, fontSize: 18, color: "var(--gris-600)", marginBottom: 16 }}>
                ABCDEFGHIJKLMNOPQRSTUVWXYZ<br />
                abcdefghijklmnopqrstuvwxyz<br />
                0123456789
              </div>
              <code style={{
                fontSize: 12,
                color: "var(--gris-500)",
                background: "var(--gris-100)",
                padding: "4px 8px",
                borderRadius: 4,
              }}>
                font-family: &apos;Newsreader&apos;, Georgia, serif
              </code>
              <p style={{ marginTop: 12, fontSize: 14, color: "var(--gris-600)" }}>
                <strong>Usage :</strong> Titres, contenu éditorial, citations
              </p>
            </div>
            <div style={{
              padding: 24,
              background: "var(--noir)",
              borderRadius: 10,
            }}>
              <div style={{
                fontFamily: TYPOGRAPHY.fontSans,
                fontSize: 28,
                fontWeight: 600,
                color: "#fff",
                marginBottom: 8,
              }}>
                Inter
              </div>
              <div style={{ fontFamily: TYPOGRAPHY.fontSans, fontSize: 16, color: "var(--gris-400)", marginBottom: 16 }}>
                ABCDEFGHIJKLMNOPQRSTUVWXYZ<br />
                abcdefghijklmnopqrstuvwxyz<br />
                0123456789
              </div>
              <code style={{
                fontSize: 12,
                color: "var(--gris-400)",
                background: "var(--gris-800)",
                padding: "4px 8px",
                borderRadius: 4,
              }}>
                font-family: &apos;Inter&apos;, system-ui, sans-serif
              </code>
              <p style={{ marginTop: 12, fontSize: 14, color: "var(--gris-500)" }}>
                <strong style={{ color: "var(--gris-300)" }}>Usage :</strong> Interface, labels, navigation, métadonnées
              </p>
            </div>
          </div>

          <h3>Échelle de tailles</h3>
          <div style={{
            background: "var(--gris-50)",
            borderRadius: 10,
            border: "1px solid var(--gris-200)",
            overflow: "hidden",
          }}>
            {[
              { name: "3xl", size: "2rem", px: "32px", usage: "H1, titres principaux" },
              { name: "2xl", size: "1.5rem", px: "24px", usage: "H2, titres de section" },
              { name: "xl", size: "1.25rem", px: "20px", usage: "H3, sous-titres" },
              { name: "lg", size: "1.125rem", px: "18px", usage: "Lead, intro" },
              { name: "base", size: "1rem", px: "16px", usage: "Corps de texte" },
              { name: "sm", size: "0.875rem", px: "14px", usage: "Labels, métadonnées" },
              { name: "xs", size: "0.75rem", px: "12px", usage: "Captions, footnotes" },
            ].map((t, i) => (
              <div key={t.name} style={{
                display: "grid",
                gridTemplateColumns: "80px 100px 80px 1fr",
                alignItems: "center",
                padding: "12px 20px",
                borderBottom: i < 6 ? "1px solid var(--gris-200)" : "none",
                gap: 16,
              }}>
                <code style={{ fontFamily: "monospace", fontSize: 13, color: "var(--rouge)" }}>
                  {t.name}
                </code>
                <span style={{ fontSize: t.size, fontFamily: TYPOGRAPHY.fontSerif }}>Aa</span>
                <code style={{ fontFamily: "monospace", fontSize: 12, color: "var(--gris-500)" }}>
                  {t.px}
                </code>
                <span style={{ fontSize: 13, color: "var(--gris-600)", fontFamily: TYPOGRAPHY.fontSans }}>
                  {t.usage}
                </span>
              </div>
            ))}
          </div>

          <h3 style={{ marginTop: 32 }}>Règles d'usage</h3>
          <div style={{
            background: "var(--gris-50)",
            borderRadius: 10,
            border: "1px solid var(--gris-200)",
            overflow: "hidden",
          }}>
            {[
              { context: "Corps de texte", font: "Newsreader", weight: "400", size: "16px", line: "1.75" },
              { context: "Titres (H1, H2)", font: "Newsreader", weight: "400", size: "24-32px", line: "1.25" },
              { context: "Labels & navigation", font: "Inter", weight: "500", size: "13-14px", line: "1.5" },
              { context: "Accent / CTA", font: "Inter", weight: "600", size: "14px", line: "1.5" },
              { context: "Métadonnées", font: "Inter", weight: "400", size: "12px", line: "1.5" },
            ].map((r, i) => (
              <div key={r.context} style={{
                display: "grid",
                gridTemplateColumns: "180px 100px 60px 80px 50px",
                alignItems: "center",
                padding: "12px 20px",
                borderBottom: i < 4 ? "1px solid var(--gris-200)" : "none",
                gap: 12,
              }}>
                <span style={{ fontSize: 14, fontWeight: 500, color: "var(--noir)" }}>{r.context}</span>
                <span style={{ fontSize: 13, color: "var(--gris-600)" }}>{r.font}</span>
                <code style={{ fontSize: 12, color: "var(--gris-500)" }}>{r.weight}</code>
                <code style={{ fontSize: 12, color: "var(--gris-500)" }}>{r.size}</code>
                <code style={{ fontSize: 12, color: "var(--gris-500)" }}>{r.line}</code>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3: Spacing */}
        <section id="spacing" style={{ scrollMarginTop: 140 }}>
          <div className="section-num">Section 3</div>
          <h2>Espacements</h2>
          <p>Quand utiliser quel espacement.</p>

          <div style={{
            background: "var(--gris-50)",
            borderRadius: 10,
            border: "1px solid var(--gris-200)",
            overflow: "hidden",
          }}>
            {[
              { context: "Entre paragraphes", value: "16px", tailwind: "mb-4", visual: 16 },
              { context: "Padding composants", value: "20-24px", tailwind: "p-5 / p-6", visual: 24 },
              { context: "Gap entre éléments", value: "8-12px", tailwind: "gap-2 / gap-3", visual: 12 },
              { context: "Entre sections", value: "48-64px", tailwind: "mt-12 / mt-16", visual: 64 },
              { context: "Marges latérales page", value: "24px", tailwind: "px-6", visual: 24 },
            ].map((s, i) => (
              <div key={s.context} style={{
                display: "grid",
                gridTemplateColumns: "200px 100px 120px 1fr",
                alignItems: "center",
                padding: "14px 20px",
                borderBottom: i < 4 ? "1px solid var(--gris-200)" : "none",
                gap: 16,
              }}>
                <span style={{ fontSize: 14, fontWeight: 500, color: "var(--noir)" }}>{s.context}</span>
                <code style={{ fontSize: 13, color: "var(--gris-600)" }}>{s.value}</code>
                <code style={{ fontSize: 12, color: "var(--rouge)" }}>{s.tailwind}</code>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <div style={{
                    width: s.visual,
                    height: 14,
                    background: "var(--rouge)",
                    borderRadius: 2,
                    opacity: 0.6,
                  }} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 4: Components */}
        <section id="blocks" style={{ scrollMarginTop: 140 }}>
          <div className="section-num">Section 4</div>
          <h2>Composants</h2>
          <p>Les {BLOCK_REGISTRY.length} blocs de construction pour vos documents.</p>

          {activeCategory === "all" ? (
            // Show grouped by category
            <>
              {[
                { id: "content", label: "Contenu", description: "Texte, titres, listes" },
                { id: "visual", label: "Visuels", description: "Encadrés, mises en avant" },
                { id: "data", label: "Données", description: "Tableaux, diagrammes" },
                { id: "layout", label: "Layout", description: "Colonnes, grilles" },
                { id: "ui", label: "Interface", description: "Navigation, contrôles" },
              ].map((cat) => {
                const catBlocks = BLOCK_REGISTRY.filter(b => b.category === cat.id);
                if (catBlocks.length === 0) return null;
                return (
                  <div key={cat.id} id={`cat-${cat.id}`} style={{ marginBottom: 48, scrollMarginTop: 140 }}>
                    <h3 style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      marginBottom: 20,
                      paddingBottom: 12,
                      borderBottom: `2px solid ${catColors[cat.id] || "var(--gris-300)"}`,
                    }}>
                      <span style={{
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        background: catColors[cat.id] || "var(--gris-500)",
                        flexShrink: 0,
                      }} />
                      {cat.label}
                      <span style={{
                        fontSize: 14,
                        fontWeight: 400,
                        color: "var(--gris-500)",
                        fontStyle: "italic",
                      }}>
                        — {cat.description}
                      </span>
                    </h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                      {catBlocks.map((block) => (
                        <BlockCard key={block.type} block={block} catColors={catColors} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </>
          ) : (
            // Show filtered list with category header
            <div id={`cat-${activeCategory}`} style={{ scrollMarginTop: 140 }}>
              {(() => {
                const catInfo = [
                  { id: "content", label: "Contenu", description: "Texte, titres, listes" },
                  { id: "visual", label: "Visuels", description: "Encadrés, mises en avant" },
                  { id: "data", label: "Données", description: "Tableaux, diagrammes" },
                  { id: "layout", label: "Layout", description: "Colonnes, grilles" },
                  { id: "ui", label: "Interface", description: "Navigation, contrôles" },
                ].find(c => c.id === activeCategory);
                return catInfo ? (
                  <h3 style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 20,
                    paddingBottom: 12,
                    borderBottom: `2px solid ${catColors[activeCategory] || "var(--gris-300)"}`,
                  }}>
                    <span style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background: catColors[activeCategory] || "var(--gris-500)",
                      flexShrink: 0,
                    }} />
                    {catInfo.label}
                    <span style={{
                      fontSize: 14,
                      fontWeight: 400,
                      color: "var(--gris-500)",
                      fontStyle: "italic",
                    }}>
                      — {catInfo.description}
                    </span>
                  </h3>
                ) : null;
              })()}
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {filteredBlocks.map((block) => (
                  <BlockCard key={block.type} block={block} catColors={catColors} />
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Section 5: Usage */}
        <section id="usage" style={{ scrollMarginTop: 140 }}>
          <div className="section-num">Section 5</div>
          <h2>Usage</h2>
          <p>Comment intégrer les composants dans votre code.</p>

          <pre style={{
            background: "var(--noir)",
            borderRadius: 10,
            padding: 24,
            color: "var(--gris-200)",
            fontSize: 14,
            fontFamily: "'SF Mono', 'Fira Code', monospace",
            lineHeight: 1.7,
            overflow: "auto",
          }}>{`import { ContentRenderer } from "@/components/sections";

const block = {
  type: "insight",
  label: "Notre lecture",
  text: "Votre analyse stratégique..."
};

<ContentRenderer block={block} />`}</pre>

          <div className="insight" style={{ marginTop: 24 }}>
            <div className="insight-label">Tailwind disponible</div>
            <p>Vous pouvez utiliser les classes Tailwind avec les couleurs custom : <code>bg-rouge</code>, <code>text-noir</code>, <code>border-gris-200</code>, etc.</p>
          </div>
        </section>
      </main>
    </>
  );
}

function ColorCard({ name, hex, css, tw }: { name: string; hex: string; css: string; tw: string }) {
  const isDark = hex === "#0a0a0a" || hex === "#1a1a1a" || hex === "#333333" || hex === "#505050" || hex.startsWith("#B2") || hex.startsWith("#99") || hex.startsWith("#FF4");
  const isLight = hex === "#ffffff" || hex === "#f8f8f8" || hex === "#f0f0f0" || hex === "#e0e0e0" || hex === "#d0d0d0";

  return (
    <div style={{
      borderRadius: 10,
      border: "1px solid var(--gris-200)",
      overflow: "hidden",
    }}>
      <div style={{
        height: 64,
        background: hex,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: isLight ? "1px solid var(--gris-200)" : "none",
        borderBottom: "none",
      }}>
        <span style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: 11,
          fontWeight: 600,
          color: isDark || hex.startsWith("#B2") || hex.startsWith("#99") || hex.startsWith("#FF") ? "#fff" : "var(--noir)",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
        }}>
          {hex}
        </span>
      </div>
      <div style={{ padding: "10px 12px", background: "#fff" }}>
        <div style={{
          fontSize: 13,
          fontWeight: 500,
          color: "var(--noir)",
          fontFamily: "'Inter', sans-serif",
          marginBottom: 4,
        }}>
          {name}
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          <code style={{
            fontSize: 10,
            color: "var(--gris-500)",
            background: "var(--gris-100)",
            padding: "2px 6px",
            borderRadius: 3,
          }}>
            {css}
          </code>
          <code style={{
            fontSize: 10,
            color: "var(--rouge)",
            background: "var(--gris-100)",
            padding: "2px 6px",
            borderRadius: 3,
          }}>
            {tw}
          </code>
        </div>
      </div>
    </div>
  );
}

function UIComponentPreview({ type, catColor }: { type: string; catColor: string }) {
  // Logos showcase
  if (type === "logos") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ display: "flex", gap: 16 }}>
          {/* Logo blanc sur fond noir */}
          <div style={{ flex: 1, background: "var(--noir)", borderRadius: 8, padding: 24, display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
            <img src="/logos/logo_drakkar_blanc.png" alt="Drakkar blanc" style={{ height: 24 }} />
            <span style={{ fontSize: 11, color: "var(--gris-400)", fontFamily: "'Inter', sans-serif" }}>logo_drakkar_blanc.png</span>
            <span style={{ fontSize: 10, color: "var(--gris-500)", fontFamily: "'Inter', sans-serif" }}>Sur fond sombre</span>
          </div>
          {/* Logo noir sur fond clair */}
          <div style={{ flex: 1, background: "var(--gris-100)", borderRadius: 8, padding: 24, display: "flex", flexDirection: "column", alignItems: "center", gap: 12, border: "1px solid var(--gris-200)" }}>
            <img src="/logos/logo_drakkar_noir.png" alt="Drakkar noir" style={{ height: 24 }} />
            <span style={{ fontSize: 11, color: "var(--gris-500)", fontFamily: "'Inter', sans-serif" }}>logo_drakkar_noir.png</span>
            <span style={{ fontSize: 10, color: "var(--gris-600)", fontFamily: "'Inter', sans-serif" }}>Sur fond clair</span>
          </div>
        </div>
        {/* Règles + icône */}
        <div style={{
          marginTop: 16,
          padding: "12px 16px",
          background: "var(--gris-50)",
          borderRadius: 6,
          border: "1px solid var(--gris-200)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
        }}>
          <div style={{
            fontSize: 11,
            color: "var(--gris-600)",
            fontFamily: "'Inter', sans-serif",
            lineHeight: 1.8,
          }}>
            <strong style={{ color: "var(--noir)" }}>Règles :</strong> Taille min. 16px · Zone de protection 12px · Ne jamais déformer · En carré → utiliser l'icône
          </div>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            flexShrink: 0,
          }}>
            <span style={{ fontSize: 10, color: "var(--gris-500)", fontFamily: "'Inter', sans-serif" }}>Icône :</span>
            <img src="/logos/icon_drk.png" alt="DRK" style={{ height: 32, borderRadius: 4 }} />
          </div>
        </div>
      </div>
    );
  }

  // Main navbar with Drakkar
  if (type === "main-navbar") {
    return (
      <div style={{ background: "var(--noir)", borderRadius: 8, padding: "12px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <img src="/logos/logo_drakkar_blanc.png" alt="Drakkar" style={{ height: 22 }} />
          <span style={{ color: "var(--gris-600)", fontSize: 11, fontFamily: "'Inter', sans-serif" }}>×</span>
          <span style={{
            color: "var(--gris-300)",
            fontSize: 13,
            fontFamily: "'Inter', sans-serif",
            fontWeight: 500,
            padding: "4px 10px",
            background: "var(--gris-800)",
            borderRadius: 4,
          }}>Logo Client</span>
        </div>
        <span style={{ color: "var(--gris-500)", fontSize: 12, fontFamily: "'Inter', sans-serif" }}>Novembre 2024</span>
      </div>
    );
  }

  // Simple sections nav
  if (type === "toc-nav") {
    return (
      <div style={{ background: "var(--gris-800)", borderRadius: 8, padding: 12 }}>
        <div style={{ display: "flex", gap: 4 }}>
          {["1. Intro", "2. Analyse", "3. Solution", "4. Roadmap", "5. Annexes"].map((item) => (
            <span key={item} style={{
              padding: "6px 12px",
              background: item === "2. Analyse" ? "linear-gradient(90deg, var(--rouge), var(--rouge-vif))" : "transparent",
              color: item === "2. Analyse" ? "#fff" : "var(--gris-300)",
              borderRadius: 4,
              fontSize: 12,
              fontFamily: "'Inter', sans-serif",
            }}>{item}</span>
          ))}
        </div>
      </div>
    );
  }

  // Contextual nav with crossfade animation
  if (type === "toc-nav-contextual") {
    return (
      <div style={{ background: "var(--gris-800)", borderRadius: 8, padding: 16 }}>
        <div style={{ fontSize: 10, color: "var(--gris-500)", marginBottom: 12, fontFamily: "'Inter', sans-serif", textTransform: "uppercase", letterSpacing: "0.1em" }}>
          Crossfade Animation (scroll-aware)
        </div>

        {/* State 1: Sections */}
        <div style={{ marginBottom: 16, position: "relative" }}>
          <div style={{ fontSize: 10, color: catColor, marginBottom: 6, fontFamily: "'Inter', sans-serif" }}>État 1 : Navigation sections</div>
          <div style={{ display: "flex", gap: 4, opacity: 1 }}>
            {["1. Couleurs", "2. Typo", "3. Composants", "4. Usage"].map((item) => (
              <span key={item} style={{
                padding: "6px 10px",
                background: item === "3. Composants" ? "var(--rouge)" : "transparent",
                color: item === "3. Composants" ? "#fff" : "var(--gris-300)",
                borderRadius: 4,
                fontSize: 11,
                fontFamily: "'Inter', sans-serif",
              }}>{item}</span>
            ))}
          </div>
        </div>

        {/* Animation indicator */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          margin: "12px 0",
          padding: "8px 12px",
          background: "var(--gris-700)",
          borderRadius: 6,
        }}>
          <span style={{ fontSize: 11, color: "var(--gris-400)", fontFamily: "'Inter', sans-serif" }}>scroll → section "Composants"</span>
          <span style={{ fontSize: 14, color: catColor }}>↓</span>
          <span style={{ fontSize: 11, color: catColor, fontFamily: "'Inter', sans-serif", fontWeight: 500 }}>crossfade 200ms</span>
        </div>

        {/* State 2: Components */}
        <div>
          <div style={{ fontSize: 10, color: catColor, marginBottom: 6, fontFamily: "'Inter', sans-serif" }}>État 2 : Navigation composants</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ padding: "4px 8px", background: "var(--gris-700)", borderRadius: 4, fontSize: 10, color: "var(--gris-400)" }}>← Sections</span>
            <div style={{ width: 1, height: 14, background: "var(--gris-600)" }} />
            <div style={{ display: "flex", gap: 2, padding: 2, background: "var(--gris-700)", borderRadius: 4 }}>
              {["Tous", "Contenu", "UI"].map((cat, i) => (
                <span key={cat} style={{
                  padding: "3px 6px",
                  background: i === 0 ? "var(--rouge)" : "transparent",
                  color: i === 0 ? "#fff" : "var(--gris-400)",
                  borderRadius: 3,
                  fontSize: 10,
                  fontFamily: "'Inter', sans-serif",
                }}>{cat}</span>
              ))}
            </div>
            <div style={{ width: 1, height: 14, background: "var(--gris-600)" }} />
            <div style={{ display: "flex", gap: 4, fontSize: 10, color: "var(--gris-300)" }}>
              <span>Paragraphe</span>
              <span>Titre</span>
              <span>Navbar</span>
              <span style={{ color: "var(--gris-500)" }}>→</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (type === "progress-bar") {
    return (
      <div style={{ background: "var(--gris-100)", borderRadius: 8, padding: 16 }}>
        <div style={{ height: 3, background: "var(--gris-200)", borderRadius: 2, overflow: "hidden" }}>
          <div style={{
            width: "45%",
            height: "100%",
            background: "linear-gradient(90deg, var(--rouge), var(--rouge-vif), var(--rouge-sombre))",
            borderRadius: 2,
          }} />
        </div>
        <div style={{ marginTop: 8, fontSize: 11, color: "var(--gris-500)", fontFamily: "'Inter', sans-serif" }}>
          45% de progression
        </div>
      </div>
    );
  }

  if (type === "filter-tabs") {
    return (
      <div style={{
        display: "flex",
        gap: 6,
        padding: 6,
        background: "var(--gris-100)",
        borderRadius: 10,
      }}>
        {[
          { label: "Tous", count: 21, active: true },
          { label: "Contenu", count: 6, active: false },
          { label: "Visuels", count: 5, active: false },
          { label: "Interface", count: 3, active: false },
        ].map((tab) => (
          <span key={tab.label} style={{
            padding: "8px 14px",
            background: tab.active ? "var(--noir)" : "transparent",
            color: tab.active ? "#fff" : "var(--gris-600)",
            borderRadius: 6,
            fontSize: 13,
            fontWeight: 500,
            fontFamily: "'Inter', sans-serif",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}>
            {tab.label}
            <span style={{
              fontSize: 11,
              padding: "2px 6px",
              borderRadius: 10,
              background: tab.active ? "var(--gris-700)" : "var(--gris-200)",
              color: tab.active ? "var(--gris-300)" : "var(--gris-500)",
            }}>{tab.count}</span>
          </span>
        ))}
      </div>
    );
  }

  return (
    <div style={{
      padding: 24,
      background: "var(--gris-100)",
      borderRadius: 8,
      textAlign: "center",
      color: "var(--gris-500)",
      fontFamily: "'Inter', sans-serif",
      fontSize: 13,
    }}>
      Composant UI - voir la page en action
    </div>
  );
}

function VariantShowcase({ block }: { block: BlockDefinition }) {
  // Highlight variants
  if (block.type === "highlight") {
    const variants = [
      { variant: "default", label: "Default (noir)" },
      { variant: "rouge", label: "Rouge (gradient)" },
      { variant: "info", label: "Info (bleu)" },
      { variant: "success", label: "Success (vert)" },
    ];
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {variants.map((v) => (
          <div key={v.variant}>
            <div style={{
              fontSize: 11,
              color: "var(--gris-500)",
              marginBottom: 8,
              fontFamily: "'Inter', sans-serif",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}>
              variant="{v.variant}"
            </div>
            <ContentRenderer block={{
              type: "highlight",
              text: `Exemple de highlight avec la variante "${v.label}"`,
              variant: v.variant as "default" | "rouge" | "info" | "success",
            }} />
          </div>
        ))}
      </div>
    );
  }

  // Checklist variants
  if (block.type === "checklist") {
    return (
      <div style={{ display: "flex", gap: 24 }}>
        <div style={{ flex: 1 }}>
          <div style={{
            fontSize: 11,
            color: "var(--gris-500)",
            marginBottom: 8,
            fontFamily: "'Inter', sans-serif",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}>
            Sans états cochés
          </div>
          <ContentRenderer block={{
            type: "checklist",
            items: ["Tâche à faire", "Autre tâche", "Dernière tâche"],
          }} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{
            fontSize: 11,
            color: "var(--gris-500)",
            marginBottom: 8,
            fontFamily: "'Inter', sans-serif",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}>
            Avec états cochés
          </div>
          <ContentRenderer block={{
            type: "checklist",
            items: ["Tâche terminée", "En cours", "Aussi terminée"],
            checked: [true, false, true],
          }} />
        </div>
      </div>
    );
  }

  // Heading levels
  if (block.type === "heading") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div>
          <div style={{
            fontSize: 11,
            color: "var(--gris-500)",
            marginBottom: 8,
            fontFamily: "'Inter', sans-serif",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}>
            level=1 (couverture)
          </div>
          <ContentRenderer block={{ type: "heading", level: 1, text: "Titre Principal" }} />
        </div>
        <div>
          <div style={{
            fontSize: 11,
            color: "var(--gris-500)",
            marginBottom: 8,
            fontFamily: "'Inter', sans-serif",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}>
            level=2 (section)
          </div>
          <ContentRenderer block={{ type: "heading", level: 2, text: "Titre de Section" }} />
        </div>
        <div>
          <div style={{
            fontSize: 11,
            color: "var(--gris-500)",
            marginBottom: 8,
            fontFamily: "'Inter', sans-serif",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}>
            level=3 (sous-section)
          </div>
          <ContentRenderer block={{ type: "heading", level: 3, text: "Sous-titre" }} />
        </div>
      </div>
    );
  }

  // Default: just render the example
  return <ContentRenderer block={block.example} />;
}

function BlockCard({ block, catColors }: { block: BlockDefinition; catColors: Record<string, string> }) {

  return (
    <div
      id={`block-${block.type}`}
      style={{
        background: "#fff",
        borderRadius: 12,
        border: "1px solid var(--gris-200)",
        overflow: "hidden",
        scrollMarginTop: 140,
      }}
    >
      <div style={{
        padding: "12px 20px",
        background: "var(--gris-50)",
        borderBottom: "1px solid var(--gris-200)",
        display: "flex",
        alignItems: "center",
        gap: 12,
      }}>
        <span style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: catColors[block.category] || "#888",
          flexShrink: 0,
        }} />
        <span style={{
          fontSize: 15,
          fontWeight: 600,
          color: "var(--noir)",
          fontFamily: "'Inter', sans-serif",
        }}>{block.name}</span>
        <code style={{
          fontSize: 11,
          color: "var(--gris-500)",
          background: "var(--gris-100)",
          padding: "3px 8px",
          borderRadius: 4,
          fontFamily: "monospace",
        }}>{block.type}</code>
        <span style={{
          marginLeft: "auto",
          fontSize: 13,
          color: "var(--gris-500)",
          fontFamily: "'Inter', sans-serif",
        }}>{block.description}</span>
      </div>

      <div style={{ padding: 24, overflow: "hidden" }}>
        {block.isUIComponent ? (
          <UIComponentPreview type={block.type} catColor={catColors[block.category]} />
        ) : (
          <VariantShowcase block={block} />
        )}
      </div>

      <div style={{
        padding: "12px 20px",
        borderTop: "1px solid var(--gris-200)",
        background: "var(--gris-50)",
        display: "flex",
        flexWrap: "wrap",
        gap: 8,
      }}>
        {block.props.map((p) => (
          <span key={p.name} style={{
            fontSize: 11,
            padding: "4px 10px",
            background: "#fff",
            border: "1px solid var(--gris-200)",
            borderRadius: 4,
            color: "var(--gris-600)",
            fontFamily: "monospace",
          }}>
            <strong style={{ color: "var(--noir)" }}>{p.name}</strong>
            {p.required && <span style={{ color: "var(--rouge)", marginLeft: 2 }}>*</span>}
            <span style={{ color: "var(--gris-400)", marginLeft: 6 }}>{p.type}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
