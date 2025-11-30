"use client";

import { useState, useEffect, useRef } from "react";
import { BLOCK_REGISTRY, COLORS, TYPOGRAPHY, BlockDefinition } from "@/lib/design-system";
import { ContentRenderer } from "@/components/sections/ContentRenderer";

export default function DesignSystemPage() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [tocNavVisible, setTocNavVisible] = useState(false);
  const tocNavInnerRef = useRef<HTMLDivElement>(null);

  const filteredBlocks = activeCategory === "all"
    ? BLOCK_REGISTRY
    : BLOCK_REGISTRY.filter((b) => b.category === activeCategory);

  const categories = [
    { id: "all", label: "Tous", count: BLOCK_REGISTRY.length },
    { id: "content", label: "Contenu", count: BLOCK_REGISTRY.filter(b => b.category === "content").length },
    { id: "visual", label: "Visuels", count: BLOCK_REGISTRY.filter(b => b.category === "visual").length },
    { id: "data", label: "Données", count: BLOCK_REGISTRY.filter(b => b.category === "data").length },
    { id: "layout", label: "Layout", count: BLOCK_REGISTRY.filter(b => b.category === "layout").length },
  ];

  const tocItems = [
    { id: "colors", num: "1", title: "Couleurs" },
    { id: "typography", num: "2", title: "Typographie" },
    { id: "spacing", num: "3", title: "Espacements" },
    { id: "blocks", num: "4", title: "Composants" },
    { id: "usage", num: "5", title: "Usage" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      setScrollProgress((winScroll / height) * 100);
      const heroEnd = 300;
      setTocNavVisible(winScroll > heroEnd);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
        <div className="toc-nav-inner" ref={tocNavInnerRef}>
          {tocItems.map((item) => (
            <a key={item.id} href={`#${item.id}`}>
              <span className="nav-num">{item.num}.</span> {item.title}
            </a>
          ))}
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
        <section id="colors">
          <div className="section-num">Section 1</div>
          <h2>Couleurs</h2>
          <p>La palette officielle Drakkar avec codes hex et variables CSS.</p>

          <h3>Couleurs principales</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 32 }}>
            {[
              { name: "Rouge", hex: COLORS.rouge, css: "--rouge", tw: "bg-rouge" },
              { name: "Rouge Vif", hex: COLORS.rougeVif, css: "--rouge-vif", tw: "bg-rouge-vif" },
              { name: "Rouge Sombre", hex: COLORS.rougeSombre, css: "--rouge-sombre", tw: "bg-rouge-sombre" },
            ].map((c) => (
              <ColorCard key={c.name} {...c} />
            ))}
          </div>

          <h3>Neutres</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 32 }}>
            {[
              { name: "Noir", hex: COLORS.noir, css: "--noir", tw: "bg-noir" },
              { name: "Blanc", hex: COLORS.blanc, css: "--blanc", tw: "bg-blanc" },
            ].map((c) => (
              <ColorCard key={c.name} {...c} />
            ))}
          </div>

          <h3>Échelle de gris</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
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
        </section>

        {/* Section 2: Typography */}
        <section id="typography">
          <div className="section-num">Section 2</div>
          <h2>Typographie</h2>
          <p>Deux familles de polices complémentaires pour un équilibre éditorial / interface.</p>

          <h3>Familles de polices</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 32 }}>
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
        <section id="spacing">
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
        <section id="blocks">
          <div className="section-num">Section 4</div>
          <h2>Composants</h2>
          <p>Les blocs de construction pour vos documents.</p>

          <div style={{
            display: "flex",
            gap: 8,
            marginBottom: 32,
            padding: 6,
            background: "var(--gris-50)",
            borderRadius: 10,
            border: "1px solid var(--gris-200)",
            width: "fit-content",
          }}>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                style={{
                  padding: "8px 16px",
                  background: activeCategory === cat.id ? "var(--noir)" : "transparent",
                  color: activeCategory === cat.id ? "#fff" : "var(--gris-600)",
                  border: "none",
                  borderRadius: 6,
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: "pointer",
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                {cat.label}
                <span style={{ marginLeft: 6, opacity: 0.5, fontSize: 12 }}>{cat.count}</span>
              </button>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {filteredBlocks.map((block) => (
              <BlockCard key={block.type} block={block} />
            ))}
          </div>
        </section>

        {/* Section 5: Usage */}
        <section id="usage">
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

function BlockCard({ block }: { block: BlockDefinition }) {
  const catColors: Record<string, string> = {
    content: "#3b82f6",
    visual: "#f59e0b",
    data: "#10b981",
    layout: "#8b5cf6",
  };

  return (
    <div
      id={`block-${block.type}`}
      style={{
        background: "#fff",
        borderRadius: 12,
        border: "1px solid var(--gris-200)",
        overflow: "hidden",
      }}
    >
      <div style={{
        padding: "14px 20px",
        background: "var(--gris-50)",
        borderBottom: "1px solid var(--gris-200)",
        display: "flex",
        alignItems: "center",
        gap: 10,
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

      <div style={{ padding: 24 }}>
        <ContentRenderer block={block.example} />
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
