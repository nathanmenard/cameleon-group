# Guide de Migration - page.tsx vers Composants Strategic-Note

Ce guide explique comment migrer le fichier `src/app/clients/[slug]/page.tsx` pour utiliser les nouveaux composants réutilisables.

## État actuel

Le fichier `page.tsx` contient 1400+ lignes avec :
- HTML inline avec classes CSS custom
- Logique de scroll et navigation mélangée au markup
- Duplication de code entre différentes notes

## Objectif

Refactoriser en utilisant les composants réutilisables pour :
- Réduire la taille du fichier
- Faciliter la maintenance
- Permettre la réutilisation pour d'autres clients

---

## Étape 1 : Remplacer la Navigation

### Avant
```tsx
<nav>
  <a href="#" className="nav-logo" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
    <img src="/logos/logo_drakkar_blanc.png" alt="Drakkar" />
    <span className="nav-collab">×</span>
    <img src="/logos/logo_cameleon_group.webp" alt="Cameleon Group" className="logo-cameleon" />
  </a>
  <span className="nav-date">27 novembre 2025</span>
</nav>
```

### Après
```tsx
import { Navigation } from "@/components/strategic-note";

<Navigation
  clientLogo={{
    src: "/logos/logo_cameleon_group.webp",
    alt: "Cameleon Group"
  }}
  date="27 novembre 2025"
  onLogoClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
/>
```

---

## Étape 2 : Remplacer la ProgressBar

### Avant
```tsx
<div className="progress-bar" id="progress" style={{ width: `${scrollProgress}%` }} />
```

### Après
```tsx
import { ProgressBar } from "@/components/strategic-note";

<ProgressBar progress={scrollProgress} />
```

---

## Étape 3 : Remplacer le TocNav

### Avant
```tsx
<div className={`toc-nav ${tocNavVisible ? "visible" : ""}`}>
  <button className="nav-arrow nav-arrow-left" aria-label="Scroll left" onClick={scrollNavLeft} style={{ opacity: canScrollLeft ? 1 : 0.3 }}>‹</button>
  <div className="toc-nav-inner" ref={tocNavInnerRef}>
    {tocItems.map((item) => (
      <a key={item.id} href={`#${item.id}`} className={activeSection === item.id ? "active" : ""}>
        <span className="nav-num">{item.num}</span> {item.title}
      </a>
    ))}
  </div>
  <button className="nav-arrow nav-arrow-right" aria-label="Scroll right" onClick={scrollNavRight} style={{ opacity: canScrollRight ? 1 : 0.3 }}>›</button>
</div>
```

### Après
```tsx
import { TocNav } from "@/components/strategic-note";

<TocNav
  items={tocItems}
  activeId={activeSection}
  visible={tocNavVisible}
/>
```

**Note** : Toute la logique des flèches et du scroll est maintenant encapsulée dans le composant.

---

## Étape 4 : Remplacer le DocHeader

### Avant
```tsx
<header className="doc-header">
  <div className="doc-type">Note stratégique</div>
  <h1 className="doc-title">Cameleon Group</h1>
  <p className="doc-subtitle">Suite à notre échange du 17 novembre 2025</p>
</header>

<div className="toc" id="tocBlock">
  <div className="toc-header">
    <div className="toc-title">Sommaire</div>
    <div className="toc-count">12 sections</div>
  </div>
  <div className="toc-grid">
    {tocGridItems.map((item) => (
      <a key={item.id} href={`#${item.id}`} className="toc-item">
        <span className="toc-item-num">{item.num}</span>
        <span className="toc-item-text">{item.title}</span>
      </a>
    ))}
  </div>
</div>
```

### Après
```tsx
import { DocHeader } from "@/components/strategic-note";

<DocHeader
  type="Note stratégique"
  title="Cameleon Group"
  subtitle="Suite à notre échange du 17 novembre 2025"
  tocItems={tocGridItems}
/>
```

---

## Étape 5 : Remplacer les Sections

### Avant
```tsx
<section id="ambition">
  <div className="section-num">Section 1</div>
  <h2>Votre ambition et ce qui la bloque</h2>
  {/* Contenu */}
</section>
```

### Après
```tsx
import { Section } from "@/components/strategic-note";

<Section id="ambition" num="Section 1" title="Votre ambition et ce qui la bloque">
  {/* Contenu */}
</Section>
```

---

## Étape 6 : Simplifier la logique de scroll

Avec le composant `TocNav`, vous pouvez simplifier la logique :

### Avant
```tsx
const [canScrollLeft, setCanScrollLeft] = useState(false);
const [canScrollRight, setCanScrollRight] = useState(true);
const tocNavInnerRef = useRef<HTMLDivElement>(null);

const updateArrows = useCallback(() => {
  const inner = tocNavInnerRef.current;
  if (!inner) return;
  setCanScrollLeft(inner.scrollLeft > 10);
  setCanScrollRight(inner.scrollLeft < inner.scrollWidth - inner.clientWidth - 10);
}, []);

const scrollNavLeft = useCallback(() => {
  tocNavInnerRef.current?.scrollBy({ left: -200, behavior: "smooth" });
}, []);

const scrollNavRight = useCallback(() => {
  tocNavInnerRef.current?.scrollBy({ left: 200, behavior: "smooth" });
}, []);

useEffect(() => {
  const inner = tocNavInnerRef.current;
  if (!inner) return;
  inner.addEventListener("scroll", updateArrows);
  return () => inner.removeEventListener("scroll", updateArrows);
}, [updateArrows]);

// + logique d'auto-scroll dans handleScroll
```

### Après
```tsx
// Toute cette logique est maintenant dans le composant TocNav !
// Il vous suffit de passer les props
```

---

## Étape 7 : Structure finale du fichier

```tsx
"use client";

import { useEffect, useState } from "react";
import { notFound, useParams } from "next/navigation";
import {
  Navigation,
  ProgressBar,
  TocNav,
  DocHeader,
  Section,
} from "@/components/strategic-note";

const DOCUMENT_ID = "cameleon-group-note";

const tocItems = [
  { id: "ambition", num: "1.", title: "Ambition" },
  // ...
];

const tocGridItems = [
  { id: "ambition", num: "01", title: "Votre ambition" },
  // ...
];

export default function ClientNotePage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [tocNavVisible, setTocNavVisible] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [scrollProgress, setScrollProgress] = useState(0);

  if (slug !== "cameleon-group") {
    notFound();
  }

  useEffect(() => {
    const handleScroll = () => {
      // Logic simplifiée (voir example.tsx)
      // ...
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="page-layout">
      <Navigation
        clientLogo={{
          src: "/logos/logo_cameleon_group.webp",
          alt: "Cameleon Group"
        }}
        date="27 novembre 2025"
        onLogoClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      />

      <ProgressBar progress={scrollProgress} />

      <TocNav
        items={tocItems}
        activeId={activeSection}
        visible={tocNavVisible}
      />

      <main className="max-w-[720px] mx-auto px-8 pt-[120px] pb-12">
        <DocHeader
          type="Note stratégique"
          title="Cameleon Group"
          subtitle="Suite à notre échange du 17 novembre 2025"
          tocItems={tocGridItems}
        />

        <Section id="ambition" num="Section 1" title="Votre ambition et ce qui la bloque">
          <p>Après notre échange dans vos locaux...</p>
          {/* Contenu de la section */}
        </Section>

        {/* Autres sections */}
      </main>
    </div>
  );
}
```

---

## Avantages de la migration

1. **Réduction du code** : De 1400+ lignes à ~500 lignes
2. **Meilleure lisibilité** : Séparation claire structure/contenu
3. **Réutilisabilité** : Mêmes composants pour toutes les notes
4. **Maintenance** : Un seul endroit pour corriger un bug
5. **Cohérence** : Design system garanti via Tailwind
6. **TypeScript** : Props typées, autocomplétion

---

## Checklist de migration

- [ ] Remplacer `<nav>` par `<Navigation>`
- [ ] Remplacer `.progress-bar` par `<ProgressBar>`
- [ ] Remplacer `.toc-nav` par `<TocNav>`
- [ ] Supprimer la logique des flèches et du scroll horizontal
- [ ] Remplacer `.doc-header` + `.toc` par `<DocHeader>`
- [ ] Remplacer toutes les `<section>` par `<Section>`
- [ ] Tester le responsive (mobile/tablet)
- [ ] Vérifier le scroll et la navigation
- [ ] Vérifier les animations (gradient, transitions)
- [ ] Build sans erreurs TypeScript

---

## Notes importantes

- Les classes CSS custom (`.doc-header`, `.toc-nav`, etc.) peuvent rester dans `globals.css` pour l'instant
- Elles seront utilisées par les anciens composants legacy
- Vous pouvez migrer progressivement (une section à la fois)
- Le fichier `example.tsx` montre un cas d'usage complet
