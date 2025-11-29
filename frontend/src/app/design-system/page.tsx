"use client";

import { useState, useEffect, useRef } from "react";
import { BLOCK_REGISTRY, COLORS, BlockDefinition } from "@/lib/design-system";
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

  useEffect(() => {
    const handleScroll = () => {
      // Progress bar
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      setScrollProgress((winScroll / height) * 100);

      // Show toc-nav after scrolling past hero
      const heroEnd = 300;
      setTocNavVisible(winScroll > heroEnd);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Use the same nav structure as the main page */}
      <nav>
        <a href="/clients/cameleon-group" className="nav-logo">
          <img src="/logos/logo_drakkar_blanc.png" alt="Drakkar" />
        </a>
        <span className="nav-date">Design System v1.0</span>
      </nav>

      {/* Progress bar - uses globals.css .progress-bar class */}
      <div className="progress-bar" style={{ width: `${scrollProgress}%` }} />

      {/* TOC sub-navigation for components - uses globals.css .toc-nav class */}
      <div className={`toc-nav ${tocNavVisible ? "visible" : ""}`}>
        <div
          className="toc-nav-inner"
          ref={tocNavInnerRef}
          style={{ gap: 8, padding: "0 24px" }}
        >
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              style={{
                padding: "8px 16px",
                background: activeCategory === cat.id ? "var(--rouge)" : "transparent",
                color: activeCategory === cat.id ? "#fff" : "var(--gris-300)",
                border: "none",
                borderRadius: 4,
                fontSize: 13,
                fontWeight: 500,
                cursor: "pointer",
                whiteSpace: "nowrap",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              {cat.label}
              <span style={{ marginLeft: 6, opacity: 0.6 }}>{cat.count}</span>
            </button>
          ))}
          <span style={{
            width: 1,
            height: 24,
            background: "var(--gris-600)",
            margin: "0 12px",
            flexShrink: 0,
          }} />
          {filteredBlocks.slice(0, 10).map((block) => (
            <a
              key={block.type}
              href={`#block-${block.type}`}
              style={{
                padding: "6px 12px",
                color: "var(--gris-300)",
                fontSize: 12,
                textDecoration: "none",
                whiteSpace: "nowrap",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              {block.name}
            </a>
          ))}
          {filteredBlocks.length > 10 && (
            <span style={{
              color: "var(--gris-500)",
              fontSize: 12,
              padding: "6px 8px",
              fontFamily: "'Inter', sans-serif",
            }}>
              +{filteredBlocks.length - 10}
            </span>
          )}
        </div>
      </div>

      {/* Main content - uses globals.css main styles */}
      <main style={{ maxWidth: 900 }}>
        {/* Hero */}
        <section style={{ marginBottom: 64 }}>
          <h1>Design System</h1>
          <p className="subtitle" style={{ fontSize: "1.1rem", color: "var(--gris-600)" }}>
            {BLOCK_REGISTRY.length} composants pour créer des notes stratégiques cohérentes.
          </p>
        </section>

        {/* Colors */}
        <section id="colors" style={{ marginBottom: 64 }}>
          <h2>Couleurs</h2>
          <p style={{ marginBottom: 24 }}>La palette officielle Drakkar.</p>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            {[
              { name: "Rouge", value: COLORS.rouge, css: "--rouge" },
              { name: "Rouge Vif", value: COLORS.rougeVif, css: "--rouge-vif" },
              { name: "Noir", value: COLORS.noir, css: "--noir" },
              { name: "Gris 700", value: COLORS.gris[700], css: "--gris-700" },
              { name: "Gris 400", value: COLORS.gris[400], css: "--gris-400" },
              { name: "Gris 100", value: COLORS.gris[100], css: "--gris-100" },
            ].map((c) => (
              <div key={c.name} style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "10px 16px 10px 10px",
                background: "var(--gris-50)",
                borderRadius: 8,
                border: "1px solid var(--gris-200)",
              }}>
                <div style={{
                  width: 36,
                  height: 36,
                  borderRadius: 6,
                  background: c.value,
                  border: c.value === "#ffffff" ? "1px solid var(--gris-200)" : "none",
                }} />
                <div>
                  <div style={{
                    fontSize: 14,
                    fontWeight: 500,
                    color: "var(--noir)",
                    fontFamily: "'Inter', sans-serif",
                  }}>{c.name}</div>
                  <div style={{
                    fontSize: 12,
                    color: "var(--gris-500)",
                    fontFamily: "monospace",
                  }}>{c.css}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Typography */}
        <section id="typography" style={{ marginBottom: 64 }}>
          <h2>Typographie</h2>
          <p style={{ marginBottom: 24 }}>Deux familles de polices complémentaires.</p>
          <div style={{ display: "flex", gap: 20 }}>
            <div style={{
              flex: 1,
              padding: 28,
              background: "var(--gris-50)",
              borderRadius: 10,
              border: "1px solid var(--gris-200)",
            }}>
              <div style={{ fontFamily: "'Newsreader', serif", fontSize: 28, marginBottom: 8 }}>
                Newsreader
              </div>
              <div style={{ fontSize: 14, color: "var(--gris-500)", fontFamily: "'Inter', sans-serif" }}>
                Serif — Titres & contenu éditorial
              </div>
            </div>
            <div style={{
              flex: 1,
              padding: 28,
              background: "var(--noir)",
              borderRadius: 10,
            }}>
              <div style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 24,
                fontWeight: 600,
                color: "#fff",
                marginBottom: 8,
              }}>
                Inter
              </div>
              <div style={{ fontSize: 14, color: "var(--gris-500)", fontFamily: "'Inter', sans-serif" }}>
                Sans-serif — Interface & labels
              </div>
            </div>
          </div>
        </section>

        {/* Components */}
        <section id="blocks">
          <h2>Composants</h2>
          <p style={{ marginBottom: 24 }}>Les blocs de construction pour vos documents.</p>

          {/* Category filter */}
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
                <span style={{
                  marginLeft: 6,
                  opacity: 0.5,
                  fontSize: 12,
                }}>{cat.count}</span>
              </button>
            ))}
          </div>

          {/* Block cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {filteredBlocks.map((block) => (
              <BlockCard key={block.type} block={block} />
            ))}
          </div>
        </section>

        {/* Usage */}
        <section id="usage" style={{ marginTop: 64 }}>
          <h2>Usage</h2>
          <p style={{ marginBottom: 24 }}>Comment intégrer les composants dans votre code.</p>
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
        </section>
      </main>
    </>
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
      {/* Header */}
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

      {/* Preview - rendered inside a container that inherits global styles */}
      <div style={{ padding: 24 }}>
        <ContentRenderer block={block.example} />
      </div>

      {/* Props */}
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
