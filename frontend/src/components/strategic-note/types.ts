/**
 * TypeScript types for Strategic Note components
 */

// Navigation
export interface NavigationProps {
  clientLogo?: {
    src: string;
    alt: string;
  };
  date: string;
  onLogoClick?: () => void;
}

// ProgressBar
export interface ProgressBarProps {
  progress: number; // 0-100
  className?: string;
}

// TocNav
export interface TocNavItem {
  id: string;
  num: string;
  title: string;
}

export interface TocNavProps {
  items: TocNavItem[];
  activeId: string;
  visible: boolean;
  className?: string;
}

// DocHeader
export interface TocGridItem {
  id: string;
  num: string;
  title: string;
}

export interface DocHeaderProps {
  type: string;
  title: string;
  subtitle?: string;
  tocItems?: TocGridItem[];
  className?: string;
}

// Section
export interface SectionProps {
  id: string;
  num?: string;
  title?: string;
  children: React.ReactNode;
  className?: string;
}
