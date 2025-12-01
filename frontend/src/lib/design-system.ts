/**
 * Design System Registry
 *
 * Ce fichier définit tous les blocs disponibles pour construire des notes stratégiques.
 * Une IA peut utiliser ces définitions pour comprendre et utiliser les composants.
 */

import { ContentBlock } from "@/types/document";

export interface BlockDefinition {
  type: string;
  name: string;
  description: string;
  category: "content" | "layout" | "data" | "visual" | "ui";
  props: {
    name: string;
    type: string;
    required: boolean;
    description: string;
  }[];
  example: ContentBlock;
  /** Pour les composants UI qui ne sont pas rendus via ContentRenderer */
  isUIComponent?: boolean;
}

export const BLOCK_REGISTRY: BlockDefinition[] = [
  {
    type: "paragraph",
    name: "Paragraphe",
    description: "Texte simple ou en gras",
    category: "content",
    props: [
      { name: "text", type: "string", required: true, description: "Contenu du paragraphe" },
      { name: "bold", type: "boolean", required: false, description: "Met tout le texte en gras" },
    ],
    example: {
      type: "paragraph",
      text: "Ceci est un exemple de paragraphe avec du contenu textuel.",
    },
  },
  {
    type: "heading",
    name: "Titre",
    description: "Titre de niveau 1 (h1 - couverture), 2 (h2 - section) ou 3 (h3 - sous-section)",
    category: "content",
    props: [
      { name: "level", type: "1 | 2 | 3", required: true, description: "Niveau du titre (1=couverture, 2=section, 3=sous-section)" },
      { name: "text", type: "string", required: true, description: "Texte du titre" },
    ],
    example: {
      type: "heading",
      level: 1,
      text: "Titre Principal",
    },
  },
  {
    type: "list",
    name: "Liste",
    description: "Liste à puces ou numérotée",
    category: "content",
    props: [
      { name: "items", type: "string[]", required: true, description: "Éléments de la liste" },
      { name: "ordered", type: "boolean", required: false, description: "Liste numérotée si true" },
    ],
    example: {
      type: "list",
      items: ["Premier élément", "Deuxième élément", "Troisième élément"],
    },
  },
  {
    type: "why-block",
    name: "Bloc Pourquoi",
    description: "Analyse cause racine avec symptôme, chaîne de causes et conclusion",
    category: "visual",
    props: [
      { name: "num", type: "string", required: true, description: "Numéro du bloc (ex: '1')" },
      { name: "title", type: "string", required: true, description: "Titre du problème" },
      { name: "symptom", type: "string", required: true, description: "Symptôme observable" },
      { name: "causes", type: "{ text: string; indent: number }[]", required: true, description: "Chaîne de causes avec indentation 0-4" },
      { name: "rootCause", type: "string", required: true, description: "Cause racine identifiée" },
    ],
    example: {
      type: "why-block",
      num: "1",
      title: "La croissance externe est bloquée",
      symptom: "Chaque acquisition = projet SI de plusieurs mois",
      causes: [
        { text: "→ Parce qu'il faut refaire toute la plomberie à chaque fois", indent: 0 },
        { text: "→ Parce qu'il n'existe pas de tronc commun", indent: 1 },
        { text: "→ Parce que chaque entité a développé ses propres outils", indent: 2 },
      ],
      rootCause: "L'entreprise a priorisé la réactivité sur la cohérence architecturale.",
    },
  },
  {
    type: "insight",
    name: "Insight",
    description: "Encadré 'Notre lecture' avec analyse ou recommandation",
    category: "visual",
    props: [
      { name: "label", type: "string", required: false, description: "Label (défaut: 'Notre lecture')" },
      { name: "text", type: "string", required: true, description: "Contenu de l'analyse" },
    ],
    example: {
      type: "insight",
      label: "Notre lecture",
      text: "Ce qui vous a fait passer de 0 à 50M€ vous empêche de passer de 50 à 500M€.",
    },
  },
  {
    type: "highlight",
    name: "Highlight",
    description: "Encadré mis en valeur avec 4 variantes",
    category: "visual",
    props: [
      { name: "text", type: "string", required: true, description: "Contenu" },
      { name: "variant", type: "'default' | 'rouge' | 'info' | 'success'", required: false, description: "Style: jaune (défaut), rouge, bleu (info), vert (success)" },
    ],
    example: {
      type: "highlight",
      text: "Point important à retenir pour la suite.",
      variant: "default",
    },
  },
  {
    type: "key-question",
    name: "Question Clé",
    description: "Question centrale mise en évidence",
    category: "visual",
    props: [
      { name: "text", type: "string", required: true, description: "La question" },
    ],
    example: {
      type: "key-question",
      text: "Comment structurer un groupe capable de croître par acquisition ?",
    },
  },
  {
    type: "system-map",
    name: "Cartographie Système",
    description: "Vue des domaines interconnectés (stratégie, org, client)",
    category: "data",
    props: [
      { name: "blocks", type: "array", required: true, description: "Blocs avec id, title, items[], variant" },
    ],
    example: {
      type: "system-map",
      blocks: [
        { id: "strategy", title: "STRATÉGIE", items: ["Vision long terme", "Investissements"], variant: "strategy" as const },
        { id: "org", title: "ORGANISATION", items: ["Processus", "Équipes"], variant: "org" as const },
        { id: "client", title: "CLIENT", items: ["Satisfaction", "Fidélisation"], variant: "client" as const },
      ],
    },
  },
  {
    type: "zones-grid",
    name: "Grille de Zones",
    description: "Zones vert/orange/rouge avec descriptions",
    category: "visual",
    props: [
      { name: "zones", type: "array", required: true, description: "Zones avec title, description, example, variant" },
    ],
    example: {
      type: "zones-grid",
      zones: [
        { title: "Zone verte", description: "Liberté totale", example: "Ex: choix des outils locaux", variant: "green" as const },
        { title: "Zone orange", description: "Cadre souple", example: "Ex: process adaptables", variant: "orange" as const },
        { title: "Zone rouge", description: "Non négociable", example: "Ex: référentiels communs", variant: "red" as const },
      ],
    },
  },
  {
    type: "arch-diagram",
    name: "Diagramme Architecture",
    description: "Schéma des modules SI avec statuts",
    category: "data",
    props: [
      { name: "header", type: "{ title: string; description: string }", required: true, description: "En-tête du diagramme" },
      { name: "modules", type: "array", required: true, description: "Modules avec name, status, variant?" },
    ],
    example: {
      type: "arch-diagram",
      header: { title: "Architecture cible", description: "Vision à 3 ans" },
      modules: [
        { name: "ERP Central", status: "À déployer", variant: "refonte" as const },
        { name: "CRM", status: "Existant" },
        { name: "Legacy", status: "À migrer", variant: "nervous" as const },
      ],
    },
  },
  {
    type: "tracks",
    name: "Volets/Chantiers",
    description: "Présentation de chantiers parallèles",
    category: "layout",
    props: [
      { name: "tracks", type: "array", required: true, description: "Volets avec label, title, team, items[]" },
    ],
    example: {
      type: "tracks",
      tracks: [
        { label: "Volet A", title: "Conception", team: "Équipe produit", items: ["Ateliers métier", "Prototypes"] },
        { label: "Volet B", title: "Quick wins", team: "Équipe tech", items: ["Corrections urgentes", "Stabilisation"] },
      ],
    },
  },
  {
    type: "process-flow",
    name: "Flux de Processus",
    description: "Étapes d'un processus avec durées",
    category: "data",
    props: [
      { name: "steps", type: "array", required: true, description: "Étapes avec name et duration" },
    ],
    example: {
      type: "process-flow",
      steps: [
        { name: "Cadrage", duration: "2 sem" },
        { name: "Conception", duration: "6 sem" },
        { name: "Développement", duration: "12 sem" },
        { name: "Déploiement", duration: "4 sem" },
      ],
    },
  },
  {
    type: "options",
    name: "Options",
    description: "Présentation d'options A/B/C avec verdicts",
    category: "data",
    props: [
      { name: "items", type: "array", required: true, description: "Options avec letter, title, description, verdict, verdictText, recommended?" },
    ],
    example: {
      type: "options",
      items: [
        { letter: "A", title: "Tout refaire", description: "Repartir de zéro", verdict: "no" as const, verdictText: "Risqué" },
        { letter: "B", title: "Migration progressive", description: "Module par module", verdict: "yes" as const, verdictText: "Recommandé", recommended: true },
        { letter: "C", title: "Statu quo", description: "Ne rien changer", verdict: "partial" as const, verdictText: "Court terme" },
      ],
    },
  },
  {
    type: "table",
    name: "Tableau",
    description: "Tableau de données avec en-têtes",
    category: "data",
    props: [
      { name: "headers", type: "string[]", required: true, description: "En-têtes de colonnes" },
      { name: "rows", type: "array", required: true, description: "Lignes de données (string ou { text, tag? })" },
    ],
    example: {
      type: "table",
      headers: ["Module", "État actuel", "Priorité"],
      rows: [
        ["ERP", "Legacy", { text: "Haute", tag: "critical" as const }],
        ["CRM", "Fonctionnel", "Moyenne"],
        ["RH", "À déployer", "Basse"],
      ],
    },
  },
  {
    type: "checklist",
    name: "Checklist",
    description: "Liste de vérification avec états cochés/non cochés",
    category: "content",
    props: [
      { name: "items", type: "string[]", required: true, description: "Éléments à vérifier" },
      { name: "checked", type: "boolean[]", required: false, description: "État de chaque élément (true = coché)" },
    ],
    example: {
      type: "checklist",
      items: ["Valider le périmètre", "Identifier les parties prenantes", "Définir les KPIs"],
      checked: [true, true, false],
    },
  },
  {
    type: "commitments",
    name: "Engagements",
    description: "Liste d'engagements formels",
    category: "content",
    props: [
      { name: "items", type: "string[]", required: true, description: "Engagements" },
    ],
    example: {
      type: "commitments",
      items: ["Livraison en 3 mois", "Budget fixe", "Équipe dédiée"],
    },
  },
  {
    type: "two-cols",
    name: "Deux Colonnes",
    description: "Mise en page sur deux colonnes",
    category: "layout",
    props: [
      { name: "columns", type: "array", required: true, description: "Colonnes avec title, items[], dark?" },
    ],
    example: {
      type: "two-cols",
      columns: [
        { title: "Ce qu'on fait", items: ["Conception", "Développement", "Formation"], dark: false },
        { title: "Ce qu'on ne fait pas", items: ["Hébergement", "Support N1"], dark: true },
      ],
    },
  },
  {
    type: "footnote",
    name: "Note de bas de page",
    description: "Texte secondaire en petit",
    category: "content",
    props: [
      { name: "text", type: "string", required: true, description: "Contenu de la note" },
    ],
    example: {
      type: "footnote",
      text: "* Ces estimations sont basées sur notre expérience avec des projets similaires.",
    },
  },
  // UI Components
  {
    type: "logos",
    name: "Logos",
    description: "Variantes du logo Drakkar (blanc, noir) pour différents fonds",
    category: "ui",
    isUIComponent: true,
    props: [
      { name: "variant", type: "'blanc' | 'noir'", required: true, description: "Variante du logo" },
      { name: "height", type: "number", required: false, description: "Hauteur en pixels (défaut: 22)" },
    ],
    example: {
      type: "logos",
      variant: "blanc",
    } as ContentBlock,
  },
  {
    type: "main-navbar",
    name: "Navbar Principale",
    description: "Barre de navigation fixe avec logos Drakkar et client",
    category: "ui",
    isUIComponent: true,
    props: [
      { name: "logoSrc", type: "string", required: true, description: "Logo Drakkar" },
      { name: "clientLogoSrc", type: "string", required: false, description: "Logo client (optionnel)" },
      { name: "date", type: "string", required: false, description: "Date ou version affichée" },
    ],
    example: {
      type: "main-navbar",
      logoSrc: "/logos/logo_drakkar_blanc.png",
      date: "Novembre 2024",
    } as ContentBlock,
  },
  {
    type: "progress-bar",
    name: "Barre de Progression",
    description: "Indicateur de progression de lecture avec gradient Drakkar",
    category: "ui",
    isUIComponent: true,
    props: [
      { name: "progress", type: "number", required: true, description: "Progression 0-100" },
    ],
    example: {
      type: "progress-bar",
      progress: 45,
    } as ContentBlock,
  },
  {
    type: "toc-nav",
    name: "Navigation Sections",
    description: "Sous-navigation sticky avec liens vers les sections du document",
    category: "ui",
    isUIComponent: true,
    props: [
      { name: "items", type: "TocItem[]", required: true, description: "Sections de navigation" },
      { name: "activeId", type: "string", required: false, description: "ID de la section active" },
    ],
    example: {
      type: "toc-nav",
      items: [
        { id: "intro", num: "1", title: "Introduction" },
        { id: "analysis", num: "2", title: "Analyse" },
      ],
    } as ContentBlock,
  },
  {
    type: "toc-nav-contextual",
    name: "Navigation Contextuelle",
    description: "Sous-navigation avec crossfade animation qui change selon le scroll",
    category: "ui",
    isUIComponent: true,
    props: [
      { name: "sections", type: "TocItem[]", required: true, description: "Sections principales" },
      { name: "components", type: "BlockDefinition[]", required: true, description: "Composants à afficher" },
      { name: "categories", type: "Category[]", required: true, description: "Filtres de catégories" },
      { name: "inBlocksSection", type: "boolean", required: true, description: "État déclenché par scroll" },
    ],
    example: {
      type: "toc-nav-contextual",
      inBlocksSection: false,
    } as ContentBlock,
  },
  {
    type: "filter-tabs",
    name: "Onglets de Filtre",
    description: "Tabs pour filtrer du contenu par catégorie",
    category: "ui",
    isUIComponent: true,
    props: [
      { name: "categories", type: "{ id: string; label: string; count: number }[]", required: true, description: "Catégories disponibles" },
      { name: "active", type: "string", required: true, description: "ID de la catégorie active" },
      { name: "onChange", type: "(id: string) => void", required: true, description: "Callback au changement" },
    ],
    example: {
      type: "filter-tabs",
      categories: [
        { id: "all", label: "Tous", count: 18 },
        { id: "content", label: "Contenu", count: 6 },
      ],
      active: "all",
    } as ContentBlock,
  },
];

// Catégories pour l'affichage
export const BLOCK_CATEGORIES = {
  content: { name: "Contenu", description: "Blocs de texte et listes" },
  visual: { name: "Visuels", description: "Blocs mis en forme avec style" },
  data: { name: "Données", description: "Tableaux, diagrammes, options" },
  layout: { name: "Mise en page", description: "Organisation du contenu" },
  ui: { name: "Interface", description: "Composants de navigation et UI" },
};

// Fonction utilitaire pour obtenir un bloc par type
export function getBlockDefinition(type: string): BlockDefinition | undefined {
  return BLOCK_REGISTRY.find((b) => b.type === type);
}

// Fonction pour valider un bloc
export function validateBlock(block: ContentBlock): { valid: boolean; errors: string[] } {
  const definition = getBlockDefinition(block.type);
  if (!definition) {
    return { valid: false, errors: [`Type de bloc inconnu: ${block.type}`] };
  }

  const errors: string[] = [];
  for (const prop of definition.props) {
    if (prop.required && !(prop.name in block)) {
      errors.push(`Propriété requise manquante: ${prop.name}`);
    }
  }

  return { valid: errors.length === 0, errors };
}

// Couleurs du design system
export const COLORS = {
  noir: "#0a0a0a",
  blanc: "#ffffff",
  gris: {
    50: "#f8f8f8",
    100: "#f0f0f0",
    200: "#e0e0e0",
    300: "#d0d0d0",
    400: "#a0a0a0",
    500: "#707070",
    600: "#505050",
    700: "#333333",
    800: "#1a1a1a",
  },
  rouge: "#B22222",
  rougeVif: "#FF4A48",
  rougeSombre: "#992C2B",
};

// Typographie
export const TYPOGRAPHY = {
  fontSerif: "'Newsreader', Georgia, serif",
  fontSans: "'Inter', system-ui, sans-serif",
  sizes: {
    xs: "0.75rem",
    sm: "0.875rem",
    base: "1rem",
    lg: "1.125rem",
    xl: "1.25rem",
    "2xl": "1.5rem",
    "3xl": "2rem",
  },
};
