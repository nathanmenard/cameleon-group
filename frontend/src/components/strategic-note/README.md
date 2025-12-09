# Strategic Note Components

Composants réutilisables pour les notes stratégiques Drakkar, construits avec **Tailwind CSS uniquement** (pas de CSS custom).

## Design System

### Couleurs Drakkar (Tailwind)
- `noir`: #0a0a0a
- `blanc`: #ffffff
- `gris-50` à `gris-800`: échelle de gris
- `rouge`: #B22222
- `rouge-vif`: #FF4A48
- `rouge-sombre`: #992C2B

### Typographies
- `font-serif`: Newsreader (pour le contenu)
- `font-sans`: Inter (pour les UI elements)

---

## Composants

### 1. Navigation

**Description**: Navbar fixe en haut avec logo Drakkar, logo client optionnel et date.

**Props**:
```typescript
interface NavigationProps {
  clientLogo?: {
    src: string;
    alt: string;
  };
  date: string;
  onLogoClick?: () => void;
}
```

**Usage**:
```tsx
<Navigation
  clientLogo={{
    src: "/logos/logo_cameleon_group.webp",
    alt: "Cameleon Group"
  }}
  date="27 novembre 2025"
  onLogoClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
/>
```

**Classes Tailwind principales**:
- `fixed top-0 left-0 right-0 h-16 bg-noir z-[1000]`
- Responsive: `md:h-14` sur mobile

---

### 2. ProgressBar

**Description**: Barre de progression de lecture avec gradient rouge Drakkar.

**Props**:
```typescript
interface ProgressBarProps {
  progress: number; // 0-100
  className?: string;
}
```

**Usage**:
```tsx
<ProgressBar progress={scrollProgress} />
```

**Classes Tailwind principales**:
- `fixed top-16 left-0 h-0.5 z-[999]`
- `bg-gradient-to-r from-rouge via-rouge-vif to-rouge-sombre`
- Transition: `transition-all duration-100 ease-out`

---

### 3. TocNav

**Description**: Navigation sticky sous la navbar avec scroll horizontal sur mobile.

**Props**:
```typescript
interface TocNavItem {
  id: string;
  num: string;
  title: string;
}

interface TocNavProps {
  items: TocNavItem[];
  activeId: string;
  visible: boolean;
  className?: string;
}
```

**Usage**:
```tsx
const tocItems = [
  { id: "ambition", num: "1.", title: "Ambition" },
  { id: "forces", num: "2.", title: "Forces" },
  // ...
];

<TocNav
  items={tocItems}
  activeId={activeSection}
  visible={tocNavVisible}
/>
```

**Fonctionnalités**:
- Auto-scroll vers l'élément actif
- Flèches de navigation (masquées sur mobile)
- Gradient actif sur l'élément sélectionné
- Position: top sur desktop, bottom sur mobile

**Classes Tailwind principales**:
- Desktop: `fixed top-16 bg-gris-800 z-[998]`
- Mobile: `md:top-auto md:bottom-0`
- Transition: `transition-all duration-300`

---

### 4. DocHeader

**Description**: En-tête du document avec titre, sous-titre et grille TOC cliquable.

**Props**:
```typescript
interface TocGridItem {
  id: string;
  num: string;
  title: string;
}

interface DocHeaderProps {
  type: string;
  title: string;
  subtitle?: string;
  tocItems?: TocGridItem[];
  className?: string;
}
```

**Usage**:
```tsx
const tocGridItems = [
  { id: "ambition", num: "01", title: "Votre ambition" },
  { id: "forces", num: "02", title: "Vos forces" },
  // ...
];

<DocHeader
  type="Note stratégique"
  title="Cameleon Group"
  subtitle="Suite à notre échange du 17 novembre 2025"
  tocItems={tocGridItems}
/>
```

**Classes Tailwind principales**:
- Grille: `grid grid-cols-3 md:grid-cols-2 sm:grid-cols-1`
- TOC container: `bg-noir p-10 rounded-lg relative overflow-hidden`
- Gradient bar: `absolute top-0 left-0 right-0 h-[3px]`

---

### 5. Section

**Description**: Wrapper de section avec numéro et titre optionnels.

**Props**:
```typescript
interface SectionProps {
  id: string;
  num?: string;
  title?: string;
  children: ReactNode;
  className?: string;
}
```

**Usage**:
```tsx
<Section id="ambition" num="Section 1" title="Votre ambition">
  <p>Contenu de la section...</p>
</Section>
```

**Classes Tailwind principales**:
- `mb-16 scroll-mt-[140px]` (scroll margin pour navigation sticky)
- Numéro: `font-sans text-xs font-bold uppercase tracking-[0.1em] text-gris-500`
- Titre: `text-[1.85rem] md:text-2xl font-medium`

---

## Exemple d'utilisation complète

```tsx
"use client";

import { useState, useEffect } from "react";
import {
  Navigation,
  ProgressBar,
  TocNav,
  DocHeader,
  Section,
} from "@/components/strategic-note";

export default function StrategicNotePage() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState("");
  const [tocNavVisible, setTocNavVisible] = useState(false);

  const tocItems = [
    { id: "ambition", num: "1.", title: "Ambition" },
    { id: "forces", num: "2.", title: "Forces" },
  ];

  const tocGridItems = [
    { id: "ambition", num: "01", title: "Votre ambition" },
    { id: "forces", num: "02", title: "Vos forces" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      // Calculate scroll progress
      const winScroll = document.documentElement.scrollTop;
      const height =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      setScrollProgress(scrolled);

      // Detect active section
      // ... (voir page.tsx pour la logique complète)

      // Show/hide TOC nav
      const tocBlock = document.getElementById("tocBlock");
      if (tocBlock) {
        setTocNavVisible(tocBlock.getBoundingClientRect().bottom < 64);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <Navigation
        clientLogo={{
          src: "/logos/client.png",
          alt: "Client",
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
          title="Titre du document"
          subtitle="Sous-titre optionnel"
          tocItems={tocGridItems}
        />

        <Section id="ambition" num="Section 1" title="Votre ambition">
          <p>Contenu...</p>
        </Section>

        <Section id="forces" num="Section 2" title="Vos forces">
          <p>Contenu...</p>
        </Section>
      </main>
    </>
  );
}
```

---

## Animations globales (globals.css)

Les animations sont définies dans `globals.css` et utilisables via Tailwind :

```css
@keyframes gradientShift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}
```

**Usage**: `animate-[gradientShift_6s_ease-in-out_infinite]`

---

## Responsive Design

Tous les composants sont responsive avec des breakpoints Tailwind :
- `md:` = max-width: 768px (tablet)
- `sm:` = max-width: 640px (mobile)

### Spécificités mobiles
- **Navigation**: Hauteur réduite (`md:h-14`)
- **TocNav**: Position bottom au lieu de top
- **DocHeader**: Grid 2 colonnes puis 1 colonne
- **Section**: Titres plus petits

---

## Classes utilitaires personnalisées

Ajoutées dans `globals.css` :

```css
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}

.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
```

Usage: `className="overflow-x-auto hide-scrollbar"`

---

## Migration depuis l'ancien code

Les anciens composants (`Navbar`, `Hero`, etc.) restent disponibles pour rétrocompatibilité mais seront progressivement remplacés.

**Legacy components** (à migrer) :
- `Navbar` → `Navigation`
- `TableOfContents` → `DocHeader`
- Custom CSS classes → Tailwind utilities
