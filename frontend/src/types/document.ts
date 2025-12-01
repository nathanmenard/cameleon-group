// Document Types for Strategic Notes Builder

export interface Author {
  name: string;
  role: string;
  email: string;
  phone: string;
  photo: string;
  note?: string;
}

export interface DocumentMeta {
  slug: string;
  title: string;
  subtitle: string;
  date: string;
  type: string;
  logo: {
    white: string;
    black: string;
  };
  clientLogo?: string;
  authors: Author[];
}

export interface TocItem {
  id: string;
  num: string;
  title: string;
  shortTitle?: string;
}

// Content Block Types
export interface ParagraphBlock {
  type: "paragraph";
  text: string;
  bold?: boolean;
}

export interface HeadingBlock {
  type: "heading";
  level: 1 | 2 | 3;
  text: string;
}

export interface ListBlock {
  type: "list";
  items: string[];
  ordered?: boolean;
}

export interface WhyBlockData {
  type: "why-block";
  num: string;
  title: string;
  symptom: string;
  causes: { text: string; indent: number }[];
  rootCause: string;
}

export interface InsightBlock {
  type: "insight";
  label?: string;
  text: string;
}

export interface HighlightBlock {
  type: "highlight";
  text: string;
  variant?: "default" | "rouge";
}

export interface KeyQuestionBlock {
  type: "key-question";
  text: string;
}

export interface SystemMapBlock {
  type: "system-map";
  blocks: {
    id: string;
    title: string;
    items: string[];
    variant: "strategy" | "org" | "client";
  }[];
}

export interface ZoneData {
  title: string;
  description: string;
  example: string;
  variant: "green" | "orange" | "red";
}

export interface ZonesGridBlock {
  type: "zones-grid";
  zones: ZoneData[];
}

export interface ArchModuleData {
  name: string;
  status: string;
  variant?: "nervous" | "refonte";
}

export interface ArchDiagramBlock {
  type: "arch-diagram";
  header: {
    title: string;
    description: string;
  };
  modules: ArchModuleData[];
  connectors?: { from: string; to: string }[];
}

export interface TrackData {
  label: string;
  title: string;
  team: string;
  items: string[];
}

export interface TracksBlock {
  type: "tracks";
  tracks: TrackData[];
}

export interface ProcessStepData {
  name: string;
  duration: string;
}

export interface ProcessFlowBlock {
  type: "process-flow";
  steps: ProcessStepData[];
}

export interface OptionData {
  letter: string;
  title: string;
  description: string;
  verdict: "yes" | "partial" | "no";
  verdictText: string;
  recommended?: boolean;
}

export interface OptionsBlock {
  type: "options";
  items: OptionData[];
}

export interface TableBlock {
  type: "table";
  headers: string[];
  rows: (string | { text: string; tag?: "critical" })[][];
}

export interface ChecklistBlock {
  type: "checklist";
  items: string[];
}

export interface CommitmentsBlock {
  type: "commitments";
  items: string[];
}

export interface TwoColsBlock {
  type: "two-cols";
  columns: {
    title: string;
    items: string[];
    dark?: boolean;
  }[];
}

export interface FootnoteBlock {
  type: "footnote";
  text: string;
}

export type ContentBlock =
  | ParagraphBlock
  | HeadingBlock
  | ListBlock
  | WhyBlockData
  | InsightBlock
  | HighlightBlock
  | KeyQuestionBlock
  | SystemMapBlock
  | ZonesGridBlock
  | ArchDiagramBlock
  | TracksBlock
  | ProcessFlowBlock
  | OptionsBlock
  | TableBlock
  | ChecklistBlock
  | CommitmentsBlock
  | TwoColsBlock
  | FootnoteBlock;

export interface Section {
  id: string;
  num: string;
  title: string;
  content: ContentBlock[];
}

export interface StrategicNote {
  meta: DocumentMeta;
  toc: TocItem[];
  sections: Section[];
}
