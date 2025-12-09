/**
 * Strategic Note Components
 *
 * Composants réutilisables pour les notes stratégiques Drakkar.
 * Design system basé sur les couleurs et typographies Drakkar.
 */

// New components (Tailwind-only, reusable)
export { Navigation } from "./Navigation";
export { ProgressBar } from "./ProgressBar";
export { TocNav } from "./TocNav";
export { DocHeader } from "./DocHeader";
export { Section } from "./Section";

// TypeScript types
export type {
  NavigationProps,
  ProgressBarProps,
  TocNavProps,
  TocNavItem,
  DocHeaderProps,
  TocGridItem,
  SectionProps,
} from "./types";

// Legacy components (to be migrated)
export { Navbar } from "./Navbar";
export { WhyBlock } from "./WhyBlock";
export { TableOfContents } from "./TableOfContents";
export { Hero } from "./Hero";
