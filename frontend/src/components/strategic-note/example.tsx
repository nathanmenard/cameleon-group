/**
 * EXEMPLE D'UTILISATION DES COMPOSANTS STRATEGIC-NOTE
 *
 * Ce fichier montre comment utiliser les composants réutilisables
 * pour créer une note stratégique Drakkar.
 *
 * Pour l'utiliser, copiez ce code dans votre page et adaptez-le.
 */

"use client";

import { useState, useEffect } from "react";
import {
  Navigation,
  ProgressBar,
  TocNav,
  DocHeader,
  Section,
} from "@/components/strategic-note";

// Configuration de la table des matières
const tocItems = [
  { id: "section-1", num: "1.", title: "Première section" },
  { id: "section-2", num: "2.", title: "Deuxième section" },
  { id: "section-3", num: "3.", title: "Troisième section" },
];

const tocGridItems = [
  { id: "section-1", num: "01", title: "Première section" },
  { id: "section-2", num: "02", title: "Deuxième section" },
  { id: "section-3", num: "03", title: "Troisième section" },
];

export default function StrategicNoteExample() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState("");
  const [tocNavVisible, setTocNavVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // 1. Calcul de la progression du scroll
      const winScroll = document.documentElement.scrollTop;
      const height =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      setScrollProgress(scrolled);

      // 2. Détection de la section active
      const sections = document.querySelectorAll("section[id]");
      const targetPos = window.innerHeight * 0.3;
      let current = "";

      for (const section of sections) {
        const rect = section.getBoundingClientRect();
        if (rect.top <= targetPos && rect.bottom > targetPos) {
          current = section.getAttribute("id") || "";
        }
      }

      // Fallback si aucune section n'est détectée
      if (!current) {
        for (const section of sections) {
          const sectionTop = section.getBoundingClientRect().top;
          if (sectionTop < 200) {
            current = section.getAttribute("id") || "";
          }
        }
      }

      setActiveSection(current);

      // 3. Affichage du TocNav après le scroll du header
      const tocBlock = document.getElementById("tocBlock");
      if (tocBlock) {
        const isVisible = tocBlock.getBoundingClientRect().bottom < 64;
        setTocNavVisible(isVisible);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial call
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Navigation fixe en haut */}
      <Navigation
        clientLogo={{
          src: "/logos/logo_cameleon_group.webp",
          alt: "Cameleon Group",
        }}
        date="27 novembre 2025"
        onLogoClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      />

      {/* Barre de progression */}
      <ProgressBar progress={scrollProgress} />

      {/* Navigation des sections (apparaît après scroll) */}
      <TocNav
        items={tocItems}
        activeId={activeSection}
        visible={tocNavVisible}
      />

      {/* Contenu principal */}
      <main className="max-w-[720px] mx-auto px-8 md:px-5 pt-[120px] md:pt-20 pb-12">
        {/* En-tête du document */}
        <DocHeader
          type="Note stratégique"
          title="Exemple de note Drakkar"
          subtitle="Guide d'utilisation des composants"
          tocItems={tocGridItems}
        />

        {/* Section 1 */}
        <Section id="section-1" num="Section 1" title="Première section">
          <p>
            Ceci est un exemple de contenu. Les sections utilisent la
            typographie et les espacements définis dans le design system
            Drakkar.
          </p>
          <p>
            Les paragraphes sont automatiquement stylisés avec la bonne
            couleur, le bon line-height et les bons espacements.
          </p>
          <h3>Sous-titre de section</h3>
          <p>
            Vous pouvez utiliser tous les éléments HTML standards :
            paragraphes, titres, listes, etc.
          </p>
          <ul>
            <li>Premier élément de liste</li>
            <li>Deuxième élément de liste</li>
            <li>Troisième élément de liste</li>
          </ul>
        </Section>

        {/* Section 2 */}
        <Section id="section-2" num="Section 2" title="Deuxième section">
          <p>
            Les composants sont entièrement construits avec{" "}
            <strong>Tailwind CSS</strong>. Aucune classe CSS custom n'est
            utilisée.
          </p>
          <p>
            Cela garantit la cohérence du design system et facilite la
            maintenance.
          </p>

          <div className="bg-noir text-blanc p-8 rounded-lg my-6">
            <p className="mb-0">
              <strong>Note importante :</strong> Vous pouvez créer vos propres
              blocs stylisés en utilisant directement les classes Tailwind.
            </p>
          </div>
        </Section>

        {/* Section 3 */}
        <Section id="section-3" num="Section 3" title="Troisième section">
          <p>
            Les composants sont responsive et s'adaptent automatiquement aux
            différentes tailles d'écran.
          </p>
          <p>
            Sur mobile, la navigation des sections passe en bas de l'écran, les
            titres deviennent plus petits, et les marges sont réduites.
          </p>

          <h3>Couleurs disponibles</h3>
          <div className="grid grid-cols-3 md:grid-cols-2 gap-4 my-6">
            <div className="bg-noir p-4 rounded text-blanc text-center">
              noir
            </div>
            <div className="bg-gris-800 p-4 rounded text-blanc text-center">
              gris-800
            </div>
            <div className="bg-gris-700 p-4 rounded text-blanc text-center">
              gris-700
            </div>
            <div className="bg-gris-500 p-4 rounded text-blanc text-center">
              gris-500
            </div>
            <div className="bg-gris-300 p-4 rounded text-noir text-center">
              gris-300
            </div>
            <div className="bg-gris-100 p-4 rounded text-noir text-center border border-gris-200">
              gris-100
            </div>
            <div className="bg-rouge p-4 rounded text-blanc text-center">
              rouge
            </div>
            <div className="bg-rouge-vif p-4 rounded text-blanc text-center">
              rouge-vif
            </div>
            <div className="bg-rouge-sombre p-4 rounded text-blanc text-center">
              rouge-sombre
            </div>
          </div>
        </Section>
      </main>
    </>
  );
}
