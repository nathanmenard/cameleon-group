import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "À l'instant";
  if (diffMins < 60) return `Il y a ${diffMins} min`;
  if (diffHours < 24) return `Il y a ${diffHours}h`;
  if (diffDays < 7) return `Il y a ${diffDays}j`;

  return date.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}

export function escapeHtml(text: string): string {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

export function scrollToText(
  sectionId: string,
  selectedText: string | null
): void {
  const section = document.getElementById(sectionId);
  if (!section) return;

  // Remove any existing highlights
  document.querySelectorAll(".temp-highlight").forEach((el) => {
    const parent = el.parentNode;
    if (parent) {
      parent.replaceChild(document.createTextNode(el.textContent || ""), el);
      parent.normalize();
    }
  });

  if (!selectedText) {
    section.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }

  // Find and highlight the text
  const walker = document.createTreeWalker(section, NodeFilter.SHOW_TEXT);
  let node: Node | null;
  let found = false;

  while ((node = walker.nextNode()) && !found) {
    const textContent = node.textContent || "";
    const searchText = selectedText.substring(0, 50);
    const index = textContent.indexOf(searchText);

    if (index !== -1) {
      const range = document.createRange();
      range.setStart(node, index);
      range.setEnd(
        node,
        Math.min(index + selectedText.length, textContent.length)
      );

      const highlight = document.createElement("mark");
      highlight.className = "temp-highlight";
      range.surroundContents(highlight);

      highlight.scrollIntoView({ behavior: "smooth", block: "center" });

      // Remove highlight after 3 seconds
      setTimeout(() => {
        if (highlight.parentNode) {
          const parent = highlight.parentNode;
          parent.replaceChild(
            document.createTextNode(highlight.textContent || ""),
            highlight
          );
          parent.normalize();
        }
      }, 3000);

      found = true;
    }
  }

  if (!found) {
    section.scrollIntoView({ behavior: "smooth", block: "center" });
  }
}
