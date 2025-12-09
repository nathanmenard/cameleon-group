# Composants Strategic-Note - Documentation Projet

## Vue d'ensemble

Nouveaux composants réutilisables pour les notes stratégiques Drakkar, construits avec **Tailwind CSS uniquement** (sans CSS custom).

**Localisation** : `/src/components/strategic-note/`

---

## Fichiers créés

### Composants principaux (Tailwind-only)

| Fichier | Lignes | Description |
|---------|--------|-------------|
| **Navigation.tsx** | 50 | Navbar fixe avec logo Drakkar, logo client et date |
| **ProgressBar.tsx** | 30 | Barre de progression de lecture avec gradient rouge |
| **TocNav.tsx** | 150 | Navigation sticky avec scroll horizontal et auto-scroll |
| **DocHeader.tsx** | 90 | En-tête document + grille TOC cliquable |
| **Section.tsx** | 45 | Wrapper de section avec numéro et titre optionnels |

### Fichiers de configuration

| Fichier | Description |
|---------|-------------|
| **index.ts** | Exports centralisés de tous les composants + types |
| **types.ts** | Définitions TypeScript pour les props |
| **example.tsx** | Exemple d'utilisation complète (page entière) |
| **README.md** | Documentation détaillée des composants |
| **MIGRATION.md** | Guide de migration de page.tsx |

### Composants legacy (à migrer)

| Fichier | Status |
|---------|--------|
| Navbar.tsx | À remplacer par Navigation |
| Hero.tsx | À évaluer |
| TableOfContents.tsx | À remplacer par DocHeader |
| WhyBlock.tsx | À évaluer |

---

## Design System Drakkar

### Couleurs Tailwind
```typescript
{
  noir: "#0a0a0a",
  blanc: "#ffffff",
  "gris-50": "#f8f8f8",
  "gris-100": "#f0f0f0",
  "gris-200": "#e0e0e0",
  "gris-300": "#d0d0d0",
  "gris-400": "#a0a0a0",
  "gris-500": "#707070",
  "gris-600": "#505050",
  "gris-700": "#333333",
  "gris-800": "#1a1a1a",
  rouge: "#B22222",
  "rouge-vif": "#FF4A48",
  "rouge-sombre": "#992C2B",
}
```

### Typographies
- **font-serif** : Newsreader (contenu principal)
- **font-sans** : Inter (UI elements)

---

## Usage rapide

```tsx
import {
  Navigation,
  ProgressBar,
  TocNav,
  DocHeader,
  Section,
} from "@/components/strategic-note";

<Navigation
  clientLogo={{ src: "/logos/client.png", alt: "Client" }}
  date="27 novembre 2025"
  onLogoClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
/>

<ProgressBar progress={scrollProgress} />

<TocNav
  items={tocItems}
  activeId={activeSection}
  visible={tocNavVisible}
/>

<DocHeader
  type="Note stratégique"
  title="Titre du document"
  subtitle="Sous-titre"
  tocItems={tocGridItems}
/>

<Section id="section-1" num="Section 1" title="Titre de la section">
  <p>Contenu...</p>
</Section>
```

---

## Fonctionnalités clés

### Navigation
- Position fixe en haut (z-index 1000)
- Logo Drakkar + logo client + date
- Responsive (hauteur réduite sur mobile)
- Click sur logo = scroll to top

### ProgressBar
- Position fixe sous la navigation
- Gradient rouge Drakkar animé
- Transition fluide (100ms ease-out)
- Calcul automatique du % de scroll

### TocNav
- Position sticky sous navigation
- Auto-scroll vers élément actif
- Flèches de navigation (masquées sur mobile)
- Gradient actif sur section courante
- Position bottom sur mobile (au lieu de top)

### DocHeader
- Type + titre + sous-titre
- Grille TOC (3 colonnes → 2 → 1 responsive)
- Gradient bar animé en haut
- Compteur de sections
- ID "tocBlock" pour détecter visibilité TocNav

### Section
- Scroll margin pour navigation sticky
- Numéro + titre optionnels
- Espacements cohérents (mb-16)
- Styles typographiques automatiques

---

## Responsive Design

### Breakpoints Tailwind
- `md:` = max-width: 768px (tablet)
- `sm:` = max-width: 640px (mobile)

### Adaptations mobiles
- **Navigation** : h-16 → md:h-14
- **TocNav** : top → md:bottom (fixe en bas)
- **DocHeader** : grid-cols-3 → md:grid-cols-2 → sm:grid-cols-1
- **Section** : text-[1.85rem] → md:text-2xl
- **Main** : px-8 → md:px-5

---

## Animations

Définies dans `globals.css` et utilisées via Tailwind :

```css
@keyframes gradientShift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}
```

Usage : `animate-[gradientShift_6s_ease-in-out_infinite]`

---

## Migration de page.tsx

**Avant** : 1400+ lignes avec HTML inline et CSS custom
**Après** : ~500 lignes avec composants réutilisables

**Voir** : `/src/components/strategic-note/MIGRATION.md`

### Gains
- ✅ 65% de réduction du code
- ✅ Lisibilité améliorée
- ✅ Réutilisabilité pour d'autres clients
- ✅ Maintenance centralisée
- ✅ TypeScript + autocomplétion
- ✅ Cohérence design system garantie

---

## Tests

```bash
# Build sans erreurs TypeScript
npm run build

# Dev server
npm run dev
```

---

## Prochaines étapes

### Court terme
1. Migrer `page.tsx` pour utiliser les nouveaux composants
2. Tester sur Cameleon Group note
3. Vérifier responsive (mobile/tablet/desktop)

### Moyen terme
1. Créer d'autres composants réutilisables :
   - `WhyBlock` (causes profondes)
   - `Highlight` (blocs colorés)
   - `TwoColumns` (grilles comparatives)
   - `ProcessFlow` (diagrammes de flux)
2. Migrer les composants legacy
3. Supprimer les classes CSS custom inutilisées

### Long terme
1. Créer un storybook pour les composants
2. Ajouter des tests unitaires (Jest/Testing Library)
3. Documenter les patterns d'utilisation avancés

---

## Ressources

- **Documentation complète** : `/src/components/strategic-note/README.md`
- **Guide de migration** : `/src/components/strategic-note/MIGRATION.md`
- **Exemple d'usage** : `/src/components/strategic-note/example.tsx`
- **Types TypeScript** : `/src/components/strategic-note/types.ts`

---

## Notes techniques

### Pourquoi Tailwind uniquement ?
- Cohérence du design system
- Pas de conflits CSS
- Maintenance simplifiée
- Tree-shaking automatique
- Responsive facile

### Pourquoi des composants séparés ?
- Réutilisabilité entre notes
- Tests unitaires possibles
- Modifications isolées
- Documentation centralisée
- Onboarding facilité

### Gestion des classes conditionnelles
Utilisation de `cn()` (classnames + tailwind-merge) :
```tsx
import { cn } from "@/lib/utils";

<div className={cn(
  "base-classes",
  condition && "conditional-classes",
  className // props override
)} />
```

---

## Support

Pour toute question ou problème :
1. Consulter le README.md du composant
2. Voir l'exemple complet (example.tsx)
3. Vérifier le guide de migration (MIGRATION.md)
4. Tester avec le build (`npm run build`)
