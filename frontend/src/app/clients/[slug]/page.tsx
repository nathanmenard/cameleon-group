"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { notFound, useParams } from "next/navigation";
// Comments disabled for now
// import { SelectionPopup } from "@/components/comments/SelectionPopup";
// import { CommentsSidebar } from "@/components/comments/CommentsSidebar";

// Client data configuration
const clientsData: Record<string, {
  title: string;
  subtitle: string;
  date: string;
  logo?: string;
  tocItems: { id: string; num: string; title: string }[];
  tocGridItems: { id: string; num: string; title: string }[];
}> = {
  "cameleon-group": {
    title: "Cameleon Group",
    subtitle: "Suite à notre échange du 17 novembre 2025",
    date: "27 novembre 2025",
    logo: "/logos/logo_cameleon_group.webp",
    tocItems: [
      { id: "ambition", num: "1.", title: "Ambition" },
      { id: "forces", num: "2.", title: "Forces" },
      { id: "causes", num: "3.", title: "Causes" },
      { id: "question", num: "4.", title: "Question" },
      { id: "invariants", num: "5.", title: "Invariants" },
      { id: "architecture", num: "6.", title: "Architecture" },
      { id: "drakkar", num: "7.", title: "Drakkar" },
      { id: "approche", num: "8.", title: "Approche" },
      { id: "proposition", num: "9.", title: "Proposition" },
      { id: "apres", num: "10.", title: "Mise en œuvre" },
      { id: "attentes", num: "11.", title: "Attentes" },
      { id: "next", num: "12.", title: "Cadrage" },
    ],
    tocGridItems: [
      { id: "ambition", num: "01", title: "Votre ambition" },
      { id: "forces", num: "02", title: "Vos forces" },
      { id: "causes", num: "03", title: "Causes profondes" },
      { id: "question", num: "04", title: "Question centrale" },
      { id: "invariants", num: "05", title: "Ce qui ne change pas" },
      { id: "architecture", num: "06", title: "Architecture" },
      { id: "drakkar", num: "07", title: "Qui on est" },
      { id: "approche", num: "08", title: "Zones de liberté" },
      { id: "proposition", num: "09", title: "Notre proposition" },
      { id: "apres", num: "10", title: "Mise en œuvre" },
      { id: "attentes", num: "11", title: "Nos attentes" },
      { id: "next", num: "12", title: "Réunion de cadrage" },
    ],
  },
  "cronite": {
    title: "Cronite Group",
    subtitle: "À l'attention de Pierre Munch, Denis Viard et Édouard Lotthé",
    date: "08 décembre 2025",
    tocItems: [
      { id: "objet", num: "0.", title: "Objet" },
      { id: "avant-propos", num: "1.", title: "Avant-propos" },
      { id: "situation", num: "2.", title: "Situation" },
      { id: "gisement", num: "3.", title: "Gisement" },
      { id: "ax", num: "4.", title: "AX" },
      { id: "directus", num: "5.", title: "Directus" },
      { id: "codir", num: "6.", title: "CODIR" },
      { id: "inconnus", num: "7.", title: "Inconnus" },
      { id: "question", num: "8.", title: "Question" },
      { id: "hypotheses", num: "9.", title: "Hypothèses" },
      { id: "invariants", num: "10.", title: "Invariants" },
      { id: "proposition", num: "11.", title: "Proposition" },
      { id: "approche", num: "12.", title: "Approche" },
      { id: "apres", num: "13.", title: "Et après" },
      { id: "drakkar", num: "14.", title: "Drakkar" },
      { id: "equipe", num: "15.", title: "Équipe" },
      { id: "attentes", num: "16.", title: "Attentes" },
      { id: "investissement", num: "17.", title: "Investissement" },
      { id: "next", num: "18.", title: "Prochaine étape" },
    ],
    tocGridItems: [
      { id: "objet", num: "00", title: "À quoi sert ce document" },
      { id: "avant-propos", num: "01", title: "Avant-propos" },
      { id: "situation", num: "02", title: "Votre situation" },
      { id: "gisement", num: "03", title: "Où est le gisement" },
      { id: "ax", num: "04", title: "La contrainte AX" },
      { id: "directus", num: "05", title: "Projet Directus" },
      { id: "codir", num: "06", title: "L'enjeu CODIR" },
      { id: "inconnus", num: "07", title: "Ce qu'on ne sait pas" },
      { id: "question", num: "08", title: "La question clé" },
      { id: "hypotheses", num: "09", title: "Nos hypothèses" },
      { id: "invariants", num: "10", title: "Ce qui ne change pas" },
      { id: "proposition", num: "11", title: "Ce que vous achetez" },
      { id: "approche", num: "12", title: "L'approche proposée" },
      { id: "apres", num: "13", title: "Et après ?" },
      { id: "drakkar", num: "14", title: "Pourquoi Drakkar" },
      { id: "equipe", num: "15", title: "L'équipe" },
      { id: "attentes", num: "16", title: "Nos attentes" },
      { id: "investissement", num: "17", title: "Investissement" },
      { id: "next", num: "18", title: "Prochaine étape" },
    ],
  },
};

export default function ClientNotePage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [tocNavVisible, setTocNavVisible] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const tocNavInnerRef = useRef<HTMLDivElement>(null);

  const clientData = clientsData[slug];
  if (!clientData) {
    notFound();
  }

  const { tocItems, tocGridItems } = clientData;

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
    const handleScroll = () => {
      const tocBlock = document.getElementById("tocBlock");
      const isVisible = tocBlock ? tocBlock.getBoundingClientRect().bottom < 64 : false;
      setTocNavVisible(isVisible);

      const sections = document.querySelectorAll("section[id]");
      const targetPos = window.innerHeight * 0.3;
      let current = "";

      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= targetPos && rect.bottom > targetPos) {
          current = section.getAttribute("id") || "";
        }
      });

      if (!current) {
        sections.forEach((section) => {
          const sectionTop = section.getBoundingClientRect().top;
          if (sectionTop < 200) {
            current = section.getAttribute("id") || "";
          }
        });
      }

      setActiveSection(current);

      // Auto-scroll nav to active item
      if (isVisible && current && tocNavInnerRef.current) {
        const activeLink = tocNavInnerRef.current.querySelector(`a[href="#${current}"]`) as HTMLElement;
        if (activeLink) {
          const inner = tocNavInnerRef.current;
          const linkRect = activeLink.getBoundingClientRect();
          const navRect = inner.getBoundingClientRect();
          const linkCenter = linkRect.left + linkRect.width / 2;
          const navCenter = navRect.left + navRect.width / 2;
          inner.scrollTo({
            left: inner.scrollLeft + (linkCenter - navCenter),
            behavior: "smooth"
          });
        }
      }

      updateArrows();

      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      setScrollProgress(scrolled);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [updateArrows]);

  useEffect(() => {
    const inner = tocNavInnerRef.current;
    if (!inner) return;
    inner.addEventListener("scroll", updateArrows);
    return () => inner.removeEventListener("scroll", updateArrows);
  }, [updateArrows]);

  // Scroll hints for scrollable elements on mobile
  useEffect(() => {
    const scrollableElements = document.querySelectorAll(".arch-diagram, .table-wrap");
    const hints: HTMLDivElement[] = [];
    const resizeHandlers: (() => void)[] = [];

    scrollableElements.forEach((el) => {
      const hint = document.createElement("div");
      hint.className = "scroll-hint-text";
      hint.textContent = "← Glissez pour voir plus →";
      el.after(hint);
      hints.push(hint);

      const checkOverflow = () => {
        const hasOverflow = el.scrollWidth > el.clientWidth + 10;
        hint.style.display = hasOverflow ? "" : "none";
      };

      checkOverflow();
      resizeHandlers.push(checkOverflow);
      window.addEventListener("resize", checkOverflow);
    });

    return () => {
      hints.forEach((hint) => hint.remove());
      resizeHandlers.forEach((handler) => window.removeEventListener("resize", handler));
    };
  }, []);

  return (
    <>
      <nav>
        <a href="#" className="nav-logo" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
          <img src="/logos/logo_drakkar_blanc.png" alt="Drakkar" />
          {clientData.logo && (
            <>
              <span className="nav-collab">×</span>
              <img src={clientData.logo} alt={clientData.title} className="logo-cameleon" />
            </>
          )}
        </a>
        <span className="nav-date">{clientData.date}</span>
      </nav>

      <div className="progress-bar" id="progress" style={{ width: `${scrollProgress}%` }} />

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

      <main>
        <header className="doc-header">
          <div className="doc-type">Note stratégique</div>
          <h1 className="doc-title">{clientData.title}</h1>
          <p className="doc-subtitle">{clientData.subtitle}</p>
        </header>

        <div className="toc" id="tocBlock">
          <div className="toc-header">
            <div className="toc-title">Sommaire</div>
            <div className="toc-count">{tocGridItems.length} sections</div>
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

        {/* Render content based on client */}
        {slug === "cameleon-group" && <CameleonContent />}
        {slug === "cronite" && <CroniteContent />}
      </main>

      {/* Comments disabled for now */}
    </>
  );
}

// Cameleon Group Content Component
function CameleonContent() {
  return (
    <>
        {/* Section 1 */}
        <section id="ambition">
          <div className="section-num">Section 1</div>
          <h2>Votre ambition et ce qui la bloque</h2>

          <p>Après notre échange dans vos locaux, une chose est claire : vous ne cherchez pas à changer de logiciel. Vous cherchez à <strong>structurer un groupe capable de croître par acquisition, de se déployer à l&apos;international, et de se transmettre dans les meilleures conditions</strong>.</p>

          <p>Le digital n&apos;est qu&apos;un levier. C&apos;est un levier qui a fait votre force par le passé mais qui, aujourd&apos;hui, vous bloque.</p>

          <h3>La réalité du marché</h3>

          <p>Vous faites 50 millions d&apos;euros. Votre concurrent principal en fait 500. Ce n&apos;est pas qu&apos;une question de taille ; c&apos;est une question de trajectoire.</p>

          <p>Le marché de la PLV se consolide. Quand Chanel lance un produit monde, ils consultent ceux qui peuvent répondre monde. Pendant que vous vous battez avec des concurrents locaux, les gros se partagent les appels d&apos;offres mondiaux. Chaque année qui passe creuse l&apos;écart.</p>

          <p>Votre chemin vers les 500M€ passe par la <strong>croissance externe</strong>. C&apos;est logique : l&apos;acquisition client est longue et coûteuse. Racheter un concurrent, c&apos;est récupérer son portefeuille clients et mutualiser les coûts fixes. Vous l&apos;avez déjà fait. Vous voulez continuer.</p>

          <h3>Le blocage</h3>

          <p>Sauf que chaque croissance externe devient un cauchemar d&apos;intégration. En théorie, 1 + 1 devrait égaler 2, voire plus. Dans les faits, c&apos;est dans la douleur. L&apos;expérience CCI l&apos;a démontré. Chaque intégration devient un projet SI de plusieurs mois / années. Au lieu de créer de la valeur rapidement, vous passez des mois à refaire la plomberie.</p>

          <div className="highlight">
            <p><strong>Tant que vous n&apos;avez pas un socle capable d&apos;absorber rapidement une nouvelle entité, votre stratégie de croissance externe reste théorique.</strong></p>
          </div>

          <h3>L&apos;enjeu transmission</h3>

          <p>Et derrière la croissance, il y a la transmission. Les fonds d&apos;investissement ont des grilles d&apos;analyse. Un SI maison sur des technologies obsolètes déclenche des alertes : audit approfondi, risques de dépendance à des personnes clés, coûts de remise à niveau à provisionner, décote de valorisation.</p>

          <p>Quinze ans de développements spécifiques WinDev et du Symfony 2 en production, c&apos;est précisément ce qui fait clignoter les voyants rouges pendant une due diligence.</p>
        </section>

        {/* Section 2 */}
        <section id="forces">
          <div className="section-num">Section 2</div>
          <h2>Ce qui fait votre force</h2>

          <p>Avant de parler de ce qui coince, il faut comprendre ce qui vous a amenés là où vous êtes ; et qu&apos;il ne faut surtout pas casser.</p>

          <h3>Le positionnement 360 (voir 365° avec le recyclage)</h3>

          <p>Vos clients internationaux, ne vous choisissent pas pour le prix. Ils vous choisissent parce que vous êtes l&apos;un des rares acteurs capables de prendre en charge l&apos;intégralité de la chaîne : conseil en merchandising, conception, fabrication (carton, métal, plastique), installation terrain, et maintenant recyclage avec Second Life.</p>

          <p>Ce positionnement est difficile à répliquer. Il suppose de maîtriser des métiers très différents : une agence de design, une imprimerie, une usine de métallerie, une force d&apos;installation terrain… Et de les faire travailler ensemble.</p>

          <h3>La réactivité comme ADN</h3>

          <p>Vos grands comptes sont exigeants et souvent désorganisés. Ils vous envoient des PO de plusieurs centaines de milliers d&apos;euros avec pour seule instruction de vous débrouiller. Ils commandent depuis le global mais veulent facturer en local. Ils changent d&apos;avis, ajoutent des contraintes, raccourcissent les délais.</p>

          <p><strong>Et vous dites oui.</strong></p>

          <p>Parce que quand vous avez mis dix ans à rentrer chez un client comme Chanel, vous ne faites pas le difficile. Cette capacité d&apos;absorption de la complexité client est un avantage compétitif majeur.</p>

          <h3>Les collections : le modèle à suivre</h3>

          <p>Vous avez trouvé un équilibre subtil entre standard et sur-mesure. Vos collections (Pop, Modulo, et les autres) sont des bases standardisées qui peuvent être personnalisées pour chaque client. La structure est standard, mais le produit fini n&apos;est quasiment jamais standard. C&apos;est toujours personnalisé.</p>

          <p>C&apos;est ce qui vous permet d&apos;être réactifs sans sacrifier la rentabilité. La collection la plus ancienne a 21 ans et se vend encore tous les jours.</p>

          <p><strong>Cette logique (un socle commun avec des adaptations périphériques) devrait inspirer votre architecture SI.</strong></p>
        </section>

        {/* Section 3 */}
        <section id="causes">
          <div className="section-num">Section 3</div>
          <h2>Les causes profondes</h2>

          <p>Une de vos forces historiques : un SI qui s&apos;adapte à tout et qui ne dit jamais non, est devenue votre principale vulnérabilité. Pour comprendre comment en sortir, il faut comprendre comment vous y êtes arrivés.</p>

          <h3>Analyse des causes racines</h3>

          <p>Pour chaque symptôme que vous nous avez décrit, on a remonté le fil. Pas pour le plaisir de l&apos;analyse, pour savoir où agir. Évidemment, ces analyses sont théoriques et seront à challenger / ajuster avec vous.</p>

          <div className="why-block">
            <div className="why-header">
              <span className="why-num">#1</span>
              <h4 className="why-title">La croissance externe est bloquée</h4>
            </div>
            <div className="why-content">
              <div className="symptom">
                <span className="symptom-text">Chaque acquisition = projet SI de plusieurs mois / années</span>
              </div>
              <div className="cause-chain">
                <div>→ Parce qu&apos;il faut refaire toute la plomberie à chaque fois</div>
                <div className="indent-1">→ Parce qu&apos;il n&apos;existe pas de tronc commun où brancher une nouvelle entité</div>
                <div className="indent-2">→ Parce que chaque entité a développé ses propres outils isolément</div>
                <div className="indent-3">→ Parce que le SI ne dit jamais non depuis 15 ans</div>
              </div>
              <div className="root-cause">L&apos;entreprise a priorisé la réactivité opérationnelle sur la cohérence architecturale. Le système s&apos;est adapté au personnel, jamais l&apos;inverse.</div>
            </div>
          </div>

          <div className="insight">
            <div className="insight-label">Notre lecture</div>
            <p>Le succès historique de Cameleon repose sur une culture du &quot;on va s&apos;arranger&quot;. Cette culture, vertueuse commercialement, a généré une dette technique et organisationnelle qui atteint aujourd&apos;hui son point de rupture. Ce qui vous a fait passer de 0 à 50M€ vous empêche de passer de 50 à 500M€.</p>
          </div>

          <div className="why-block">
            <div className="why-header">
              <span className="why-num">#2</span>
              <h4 className="why-title">Le pilotage manque de visibilité</h4>
            </div>
            <div className="why-content">
              <div className="symptom">
                <span className="symptom-text">Consolidation laborieuse, pas de vision temps réel</span>
              </div>
              <div className="cause-chain">
                <div>→ Parce qu&apos;il faut aller chercher dans plusieurs systèmes et tout retraiter</div>
                <div className="indent-1">→ Parce qu&apos;il n&apos;y a pas de référentiel unique (client, produit, projet)</div>
                <div className="indent-2">→ Parce que chaque BU a sa propre définition de ces concepts</div>
              </div>
              <div className="root-cause">Absence de gouvernance de la donnée. Le groupe fonctionne comme 3 PME juxtaposées, pas comme une ETI intégrée.</div>
            </div>
          </div>

          <div className="insight">
            <div className="insight-label">Notre lecture</div>
            <p>Le problème n&apos;est pas technique. C&apos;est un problème de définition partagée des concepts métier. Qu&apos;est-ce qu&apos;un &quot;client&quot; ? Un &quot;projet&quot; ? Une &quot;affaire&quot; ? Tant que ces définitions varient d&apos;une entité à l&apos;autre, aucun outil ne résoudra le problème.</p>
          </div>

          <div className="why-block">
            <div className="why-header">
              <span className="why-num">#3</span>
              <h4 className="why-title">Deux projets Odoo ont échoué</h4>
            </div>
            <div className="why-content">
              <div className="symptom">
                <span className="symptom-text">Deux tentatives, deux échecs. Méfiance généralisée.</span>
              </div>
              <div className="cause-chain">
                <div>→ Parce que les utilisateurs n&apos;ont pas adopté l&apos;outil</div>
                <div className="indent-1">→ Parce qu&apos;ils n&apos;ont pas été consultés ni impliqués</div>
                <div className="indent-2">→ Parce qu&apos;on a voulu tout faire d&apos;un coup (Big Bang)</div>
                <div className="indent-3">→ Parce qu&apos;on pensait que le problème était l&apos;outil, pas l&apos;organisation</div>
              </div>
              <div className="root-cause">Confusion entre &quot;implémenter un ERP&quot; et &quot;transformer l&apos;organisation&quot;. L&apos;outil a été vu comme solution, pas comme levier.</div>
            </div>
          </div>

          <div className="insight">
            <div className="insight-label">Notre lecture</div>
            <p>Les échecs Odoo ne sont pas des échecs d&apos;Odoo. Ce sont des échecs de conduite du changement. Le système s&apos;est adapté au personnel et non à l&apos;inverse, et ce &quot;choc&quot; dont vous parliez n&apos;a jamais été préparé. C&apos;est pour ça que ça a échoué.</p>
          </div>

          <div className="why-block">
            <div className="why-header">
              <span className="why-num">#4</span>
              <h4 className="why-title">Le dilemme standardisation/flexibilité semble insoluble</h4>
            </div>
            <div className="why-content">
              <div className="symptom">
                <span className="symptom-text">Les commerciaux font leur &quot;tambouille&quot;, les stats sont faussées</span>
              </div>
              <div className="cause-chain">
                <div>→ Parce que chaque commercial organise ses devis comme il veut</div>
                <div className="indent-1">→ Parce que chaque client a des exigences de présentation différentes</div>
                <div className="indent-2">→ Parce que Cameleon travaille avec des grands comptes qui imposent leurs standards</div>
                <div className="indent-3">→ Parce que le positionnement commercial repose sur l&apos;hyper-adaptation</div>
              </div>
              <div className="root-cause">La flexibilité commerciale EST l&apos;avantage concurrentiel. La supprimer = perdre des clients. La question n&apos;est pas &quot;faut-il standardiser ?&quot; mais &quot;où placer le curseur ?&quot;</div>
            </div>
          </div>

          <p><strong>Les exemples que vous nous avez donnés :</strong></p>
          <ul>
            <li>Un commercial fait 1 devis avec 4 lignes, un autre fait 4 devis séparés pour la même situation → les stats de concrétisation sont faussées</li>
            <li>Les commerciaux démontent leurs prix pour les replanquer ailleurs (moins sur le design exposé à la concurrence, plus sur l&apos;installation où le client n&apos;a pas de référence)</li>
            <li>Un commercial a utilisé des quantités négatives pour faire disparaître des lignes</li>
          </ul>
          <p>Et pourtant, Publidecor montre qu&apos;une standardisation forte est possible : ils ne donnent jamais le détail de leurs prix aux clients. Et ça marche.</p>

          <div className="insight">
            <div className="insight-label">Notre lecture</div>
            <p>Cette question de où placer le curseur n&apos;a jamais fait l&apos;objet d&apos;une décision explicite. Elle est tranchée différemment selon qui décide, quel jour, avec quel client. C&apos;est le vrai problème.</p>
          </div>

          <div className="why-block">
            <div className="why-header">
              <span className="why-num">#5</span>
              <h4 className="why-title">La dette technique est critique</h4>
            </div>
            <div className="why-content">
              <div className="symptom">
                <span className="symptom-text">Symfony 2 en production gère 6M€ d&apos;activité</span>
              </div>
              <div className="cause-chain">
                <div>→ Parce que personne n&apos;a osé lancer la migration</div>
                <div className="indent-1">→ Parce qu&apos;une tentative a été catastrophique</div>
                <div className="indent-2">→ Parce que le code est enchevêtré avec la logique métier non documentée</div>
                <div className="indent-3">→ Parce que le développement a été fait &quot;en pompier&quot; pendant des années</div>
              </div>
              <div className="root-cause">Absence de vision technique long terme. Le développement a toujours été piloté par l&apos;urgence opérationnelle, pas par une roadmap architecturale.</div>
            </div>
          </div>

          <div className="insight">
            <div className="insight-label">Notre lecture</div>
            <p>Ce n&apos;est pas juste 6M€ qui sont exposés. Il y a des interdépendances : si ce système disparaît, vous risquez de perdre 10%, 20%, voire 30% sur d&apos;autres activités. C&apos;est une bombe à retardement.</p>
          </div>

          <h3>Cartographie systémique : les 6 domaines de friction</h3>

          <p>Ces causes racines ne sont pas isolées. Elles forment un système interconnecté :</p>

          <div className="system-map">
            <div className="system-block system-strategy">
              <div className="system-title">STRATÉGIE D&apos;ENTREPRISE</div>
              <ul>
                <li>Croissance externe bloquée par le SI</li>
                <li>Ambition internationale (Europe 2030, Monde 2040)</li>
                <li>Valorisation groupe compromise (due diligence)</li>
              </ul>
            </div>
            <div className="system-row">
              <div className="system-block">
                <div className="system-title">DONNÉES & RÉFÉRENTIELS</div>
                <ul>
                  <li>Pas de MDM*</li>
                  <li>Client ≠ Client</li>
                  <li>Projet ≠ Projet</li>
                  <li>Pas de reporting consolidé fiable</li>
                </ul>
              </div>
              <div className="system-block">
                <div className="system-title">PROCESSUS</div>
                <ul>
                  <li>Hétérogénéité des devis</li>
                  <li>BPM débranché</li>
                  <li>1000 projets/an sans suivi</li>
                </ul>
              </div>
              <div className="system-block">
                <div className="system-title">TECHNOLOGIE</div>
                <ul>
                  <li>9 outils isolés</li>
                  <li>Symfony 2 critique</li>
                  <li>WinDev obsolète</li>
                  <li>VPN = mobilité KO</li>
                  <li>Pas d&apos;API moderne</li>
                </ul>
              </div>
            </div>
            <div className="system-block system-org">
              <div className="system-title">ORGANISATION & RH</div>
              <ul>
                <li>Expertise WinDev = dépendance à des personnes clés</li>
                <li>Pas de culture de documentation</li>
                <li>&quot;On va s&apos;arranger&quot; = frein au changement</li>
                <li>Commerciaux = coordinateurs malgré eux</li>
              </ul>
            </div>
            <div className="system-block system-client">
              <div className="system-title">RELATION CLIENT</div>
              <ul>
                <li>Clients grands comptes imposent leurs standards</li>
                <li>Multiplication des plateformes de facturation</li>
                <li>Exigence de sur-mesure croissante</li>
                <li>Passage série → customisation de masse</li>
              </ul>
            </div>
          </div>

          <p className="footnote">*MDM = Master Data Management</p>

          <div className="insight">
            <div className="insight-label">Lecture</div>
            <p>Chaque domaine impacte les autres. C&apos;est pourquoi une approche &quot;outil par outil&quot; ne fonctionne pas.</p>
          </div>

          <h3>Matrice d&apos;impact : Urgence vs Importance</h3>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Enjeu</th>
                  <th>Urgence</th>
                  <th>Importance</th>
                  <th>Commentaire</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Symfony 2 / Field</strong></td>
                  <td><span className="tag-critical">Critique</span></td>
                  <td>Haute</td>
                  <td>Risque technique immédiat, 6M€ exposés</td>
                </tr>
                <tr>
                  <td><strong>Référentiel unique</strong></td>
                  <td>Haute</td>
                  <td><span className="tag-critical">Critique</span></td>
                  <td>Pré-requis à tout projet d&apos;unification</td>
                </tr>
                <tr>
                  <td><strong>Croissance externe</strong></td>
                  <td>Moyenne</td>
                  <td><span className="tag-critical">Critique</span></td>
                  <td>Dépend de référentiel + architecture moderne</td>
                </tr>
                <tr>
                  <td><strong>Pilotage temps réel</strong></td>
                  <td>Haute</td>
                  <td>Haute</td>
                  <td>Dépend de référentiel + consolidation</td>
                </tr>
                <tr>
                  <td><strong>Standardisation devis</strong></td>
                  <td>Moyenne</td>
                  <td>Haute</td>
                  <td>Nécessite arbitrage stratégique</td>
                </tr>
                <tr>
                  <td><strong>International</strong></td>
                  <td>Basse</td>
                  <td>Haute</td>
                  <td>Dépend de tout le reste</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="highlight">
            <p><strong>Conclusion :</strong> Le référentiel unique (qui est un client ? un projet ?) est le verrou central. Sans définition partagée, rien ne fonctionne durablement.</p>
          </div>
        </section>

        {/* Section 4 */}
        <section id="question">
          <div className="section-num">Section 4</div>
          <h2>La question centrale</h2>

          <p>Lors de notre échange, Teddy a posé une question qui a provoqué un silence :</p>

          <div className="key-question">
            À partir de quel degré de standardisation des processus vous perdez un client ?
          </div>

          <p>Alexandre a reconnu que cette discussion n&apos;avait jamais vraiment eu lieu avec la direction commerciale.</p>

          <p>C&apos;est pourtant <strong>LA question structurante</strong> de tout le projet :</p>

          <div className="two-cols">
            <div className="col-card">
              <h4>Trop de standardisation</h4>
              <p style={{ margin: 0 }}>→ perte de flexibilité → perte de clients</p>
            </div>
            <div className="col-card">
              <h4>Pas assez de standardisation</h4>
              <p style={{ margin: 0 }}>→ impossibilité de piloter → croissance bloquée</p>
            </div>
          </div>

          <div className="highlight rouge">
            <p><strong>Cette discussion doit avoir lieu. C&apos;est le premier objectif de la phase de conception.</strong></p>
          </div>
        </section>

        {/* Section 5 */}
        <section id="invariants">
          <div className="section-num">Section 5</div>
          <h2>Ce qui ne change pas</h2>

          <p>Toute transformation qui ignorerait vos fondamentaux serait vouée à l&apos;échec.</p>

          <div className="two-cols">
            <div className="col-card dark">
              <h4>Ce qui ne change pas</h4>
              <ul>
                <li>Votre réactivité commerciale (vous dites oui)</li>
                <li>Votre capacité à absorber la complexité client</li>
                <li>Vos 15-20 ans de connaissance métier</li>
                <li>Vos collections (Pop, Modulo, etc.)</li>
                <li>Vos relations clients</li>
                <li>Votre positionnement 365°</li>
              </ul>
            </div>
            <div className="col-card">
              <h4>Ce qui change</h4>
              <ul>
                <li>La plomberie sous-jacente (invisible pour les clients)</li>
                <li>Le pilotage groupe (vision consolidée, temps réel)</li>
                <li>La capacité d&apos;absorption (acquisitions en semaines, pas en mois)</li>
                <li>La traçabilité (savoir ce qui a été chiffré vs vendu)</li>
                <li>La mobilité (plus de VPN, accès simple)</li>
                <li>Plus d&apos;expertises avec la croissance externe devenue possible</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 6 */}
        <section id="architecture">
          <div className="section-num">Section 6</div>
          <h2>L&apos;architecture : les options et notre lecture</h2>

          <p>L&apos;idée d&apos;un &quot;Group Manager&quot; central que vous avez décrite est la bonne direction. Mais avant de dessiner une cible, il faut comprendre les options qui s&apos;offrent à vous.</p>

          <h3>Aujourd&apos;hui : les outils qui ne se parlent pas</h3>

          <div className="arch-diagram">
            <div className="arch-modules" style={{ gridTemplateColumns: "repeat(5, 1fr)" }}>
              <div className="arch-module">
                <div className="arch-module-name">Cameleon Manager</div>
                <div className="arch-module-status">WinDev</div>
              </div>
              <div className="arch-module">
                <div className="arch-module-name">Field Manager</div>
                <div className="arch-module-status">Symfony 2</div>
              </div>
              <div className="arch-module">
                <div className="arch-module-name">Odoo (CCI)</div>
                <div className="arch-module-status">partiel</div>
              </div>
              <div className="arch-module">
                <div className="arch-module-name">Publi Manager</div>
                <div className="arch-module-status">PubliDécor</div>
              </div>
              <div className="arch-module">
                <div className="arch-module-name">Sage</div>
                <div className="arch-module-status">compta</div>
              </div>
            </div>
            <div style={{ textAlign: "center", padding: "1rem 0", fontFamily: "'Inter', sans-serif", fontSize: "0.85rem", color: "var(--gris-500)" }}>
              ↓ Excel + emails (synchro manuelle) ↓
            </div>
          </div>

          <p><strong>Plus</strong> : Store Manager, Dynamax (ancien CCI), Rhinoceros/Solidworks (design), etc.</p>

          <p><strong>Le problème</strong> : Chaque outil vit sa vie. Pour consolider, il faut tout ressaisir dans Excel. Pour intégrer une acquisition, il faut des mois de plomberie.</p>

          <h3>Les grandes options d&apos;architecture</h3>

          <p>Face à votre situation, il existe fondamentalement <strong>trois approches</strong> :</p>

          <h4>Option A : Tout refaire dans un ERP unique</h4>

          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Principe</th><th>Avantages</th><th>Inconvénients</th></tr>
              </thead>
              <tbody>
                <tr>
                  <td>Un seul outil (Odoo, SAP, Dynamics...) qui fait tout</td>
                  <td>Une seule base, un seul éditeur, formation homogène</td>
                  <td>Rigidité (l&apos;ERP impose ses process), coût de personnalisation explosif, projets de 18-36 mois, Big Bang risqué</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p><strong>Notre avis</strong> : C&apos;est l&apos;approche classique des intégrateurs. Elle fonctionne pour des entreprises aux processus standards. <strong>Pas pour Cameleon</strong> : votre métier est trop spécifique (Field Manager, chiffrages complexes, collections). Forcer tout dans un ERP standard = dénaturer ce qui fait votre force.</p>

          <div className="insight">
            <div className="insight-label">Pourquoi on peut en parler</div>
            <p>On implémente Odoo depuis des années. On connaît ses forces, et ses limites. On a vu des projets &quot;tout ERP&quot; réussir (process standards) et d&apos;autres échouer (métiers spécifiques). On sait reconnaître quand cette approche est adaptée. Pour vous, elle ne l&apos;est pas.</p>
          </div>

          <h4>Option B : Garder l&apos;existant et ajouter une couche d&apos;intelligence</h4>

          <p>Cette option a deux variantes :</p>

          <p><strong>B1 : Connecteurs point-à-point (à éviter)</strong></p>

          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Principe</th><th>Avantages</th><th>Inconvénients</th></tr>
              </thead>
              <tbody>
                <tr>
                  <td>On crée des connecteurs entre chaque outil (Cameleon Manager ↔ Field Manager ↔ Odoo...)</td>
                  <td>Rapide à mettre en place</td>
                  <td>Complexité exponentielle (N outils = N² connexions), maintenance cauchemardesque, pas de vision consolidée</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p>C&apos;est la tentation du &quot;on fait communiquer ce qui existe&quot;. Ça crée un plat de spaghettis impossible à maintenir.</p>

          <div className="insight">
            <div className="insight-label">Pourquoi on peut en parler</div>
            <p>On fait de l&apos;intégration de systèmes au quotidien. On a hérité de projets où des équipes précédentes avaient multiplié les connecteurs point-à-point. On sait ce que ça coûte à maintenir, et pourquoi ça finit toujours par casser.</p>
          </div>

          <p><strong>B2 : Data Warehouse / cerveau central (pertinent pour le pilotage)</strong></p>

          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Principe</th><th>Avantages</th><th>Inconvénients</th></tr>
              </thead>
              <tbody>
                <tr>
                  <td>Tous les outils déversent leurs données dans un entrepôt central. L&apos;intelligence est dans le DWH, pas dans les outils.</td>
                  <td>Pilotage temps réel sans toucher aux outils, setup rapide, pas de changement pour les utilisateurs</td>
                  <td>Ne crée pas de référentiel unique (chaque outil garde sa propre vérité), ne résout pas les problèmes d&apos;outils obsolètes</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p><strong>Notre avis sur B2</strong> : C&apos;est une vraie option, et c&apos;est peut-être un quick win pour Cameleon. Nicolas peut avoir son pilotage consolidé en quelques mois, sans perturber personne.</p>

          <p><strong>Mais attention</strong> : le Data Warehouse ne résout pas tout. Il consolide ce qui existe : il ne le transforme pas.</p>

          <ul>
            <li>Il ne refait pas le Field Manager (Symfony 2 reste une bombe à retardement)</li>
            <li>Il ne crée pas de référentiel client unique (chaque outil garde sa définition de &quot;client&quot;)</li>
            <li>Il ne simplifie pas l&apos;intégration des acquisitions (il faudra toujours connecter chaque nouvel outil)</li>
          </ul>

          <div className="insight">
            <div className="insight-label">Pourquoi on peut en parler</div>
            <p>On construit ce type de &quot;cerveau central&quot; pour nos clients (des solutions qui se connectent à tous les outils existants (ERP, CRM, compta, emails...)) et donnent une vision unifiée en temps réel. On sait ce que ça peut faire, et surtout ce que ça ne peut pas faire.</p>
          </div>

          <p><strong>Pour Cameleon, B2 seul ne suffit pas.</strong> Mais B2 + Option C = la combinaison gagnante.</p>

          <h4>Option C : Tronc commun + outils métiers spécialisés + Data Warehouse</h4>

          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Principe</th><th>Avantages</th><th>Inconvénients</th></tr>
              </thead>
              <tbody>
                <tr>
                  <td>Un socle central (référentiel, commerce, finance) + des outils métiers spécialisés + un Data Warehouse pour le pilotage</td>
                  <td>Le meilleur des mondes : cohérence groupe, spécificités métier préservées, pilotage temps réel</td>
                  <td>Nécessite une vraie réflexion d&apos;architecture, des compétences hybrides (ERP + dev + data)</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="highlight rouge">
            <p><strong>C&apos;est la combinaison B2 + C</strong> : le Data Warehouse donne le pilotage immédiat (quick win), pendant que le tronc commun se construit progressivement.</p>
          </div>

          <p><strong>Notre avis</strong> : C&apos;est l&apos;approche qui correspond à votre ADN, exactement comme vos collections (structure standard, habillage personnalisé). C&apos;est plus complexe à concevoir, mais c&apos;est la seule qui tienne la route à long terme.</p>

          <p>Le Data Warehouse devient le &quot;système nerveux&quot; qui :</p>
          <ul>
            <li>Connecte tout (ancien ET nouveau) dès le départ</li>
            <li>Permet à Nicolas de piloter en temps réel sans attendre</li>
            <li>Sert de filet de sécurité pendant la transition (on peut toujours comparer ancien vs nouveau)</li>
            <li>Reste pertinent après la transformation (pilotage groupe, traçabilité, prédictif)</li>
          </ul>

          <div className="insight">
            <div className="insight-label">Pourquoi Drakkar peut l&apos;exécuter</div>
            <p>voir section suivante.</p>
          </div>

          <h3>Ce qu&apos;on sait et ce qu&apos;on doit valider ensemble</h3>

          <p><strong>Ce qu&apos;on sait :</strong></p>
          <ul>
            <li>La direction semble claire (Option C)</li>
            <li>Le Field Manager (Symfony 2) est une urgence technique, à traiter indépendamment du reste</li>
            <li>Il faut un système nerveux pour piloter en temps réel</li>
          </ul>

          <p><strong>Ce qu&apos;on doit valider en conception :</strong></p>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Question</th>
                  <th>Pourquoi c&apos;est important</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Odoo ou autre chose pour le Group Manager ?</strong></td>
                  <td>Odoo est une piste sérieuse, mais vos devis complexes et votre &quot;tambouille commerciale&quot; rentrent-ils dedans ? On doit voir vos cas réels.</td>
                </tr>
                <tr>
                  <td><strong>Les outils existants sont-ils connectables ?</strong></td>
                  <td>S&apos;ils exposent des APIs, on peut construire le système nerveux rapidement. Sinon, c&apos;est un chantier en soi.</td>
                </tr>
                <tr>
                  <td><strong>Portails clients / sous-traitants ?</strong></td>
                  <td>Chanel/LVMH ont-ils besoin de suivre leurs projets en ligne ? Vos 600 sous-traitants Field ont-ils besoin d&apos;un portail dédié ?</td>
                </tr>
                <tr>
                  <td><strong>Quelle stratégie de bascule ?</strong></td>
                  <td>Ça dépend de vos contraintes (périodes creuses, interdépendances, tolérance au risque).</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3>L&apos;option C en image</h3>

          <div className="arch-diagram">
            <div className="arch-header">
              <h4>GROUP MANAGER</h4>
              <p>Référentiel unique • Cycle commercial • Pilotage groupe</p>
            </div>
            <div className="arch-connector">
              <div className="arch-connector-line" />
            </div>
            <div className="arch-modules">
              <div className="arch-module">
                <div className="arch-module-name">Think Manager</div>
                <div className="arch-module-status">existant</div>
              </div>
              <div className="arch-module">
                <div className="arch-module-name">Factory Manager</div>
                <div className="arch-module-status">existant</div>
              </div>
              <div className="arch-module refonte">
                <div className="arch-module-name">Field Manager</div>
                <div className="arch-module-status">à refondre</div>
              </div>
              <div className="arch-module">
                <div className="arch-module-name">Print & Metal</div>
                <div className="arch-module-status">existant</div>
              </div>
              <div className="arch-module nervous">
                <div className="arch-module-name">Système nerveux</div>
                <div className="arch-module-status">consolide</div>
              </div>
            </div>
          </div>

          <p>C&apos;est exactement comme vos collections Pop ou Modulo : un socle commun qui structure, des adaptations métier qui préservent ce qui fait votre force.</p>

          <h3>Sur Odoo : notre position</h3>

          <p>On implémente Odoo depuis des années. On connaît ses forces et ses limites.</p>

          <p>Votre Field Manager (600 sous-traitants, géoloc, pointage terrain) ? Ce n&apos;est pas ce qu&apos;Odoo fait bien. Forcer ça dans un module Odoo customisé = reproduire l&apos;échec.</p>

          <p>Vos devis hyper-complexes avec des règles métier évolutives ? On ne sait pas encore si Odoo peut les gérer. <strong>C&apos;est pourquoi on propose de le valider en conception.</strong></p>

          <div className="insight">
            <div className="insight-label">Notre engagement</div>
            <p>Si on découvre qu&apos;Odoo n&apos;est pas adapté, on vous le dira et on construira autrement. On n&apos;est pas là pour vendre Odoo. On est là pour trouver ce qui marche.</p>
          </div>

          <h3>Principe de bascule non négociable</h3>

          <div className="highlight">
            <p><strong>On ne coupe jamais un système qui fonctionne avant que le nouveau ait fait ses preuves.</strong></p>
          </div>

          <p>Concrètement :</p>
          <ul>
            <li>L&apos;ancien et le nouveau coexistent pendant la transition</li>
            <li>Bascule progressive par périmètre</li>
            <li>Pas de Big Bang</li>
          </ul>

          <p>Les modalités exactes (synchronisation, cut-over, double saisie temporaire) dépendent de vos contraintes réelles. <strong>C&apos;est ce qu&apos;on déterminera en conception.</strong></p>
        </section>

        {/* Section 7 */}
        <section id="drakkar">
          <div className="section-num">Section 7</div>
          <h2>Qui on est (et pourquoi on peut le faire)</h2>

          <h3>Pourquoi l&apos;option C nécessite un partenaire différent</h3>

          <p><strong>Un intégrateur ERP classique</strong> va pousser l&apos;option A. C&apos;est son métier : configurer un ERP, former les utilisateurs, facturer des jours de paramétrage. Quand ça ne rentre pas dans l&apos;ERP, il dit &quot;c&apos;est un développement spécifique&quot; et soit il le fait mal, soit il le sous-traite.</p>

          <p><strong>Une agence de développement classique</strong> va pousser du full custom. C&apos;est son métier : coder des applications. Mais elle ne connaît pas les ERP, les contraintes comptables, les flux multi-entités.</p>

          <p><strong>Un cabinet de conseil classique</strong> va vous faire de beaux slides. Mais il ne sait pas exécuter. Il vous laisse avec un PowerPoint et vous dit &quot;trouvez un intégrateur&quot;.</p>

          <h3>Ce que Drakkar apporte</h3>

          <p><strong>Trois pôles intégrés :</strong></p>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Pôle</th>
                  <th>Expertise</th>
                  <th>Pour Cameleon</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Accélérateur</strong></td>
                  <td>ERP, Odoo, process</td>
                  <td>Group Manager</td>
                </tr>
                <tr>
                  <td><strong>Studio</strong></td>
                  <td>Dev sur-mesure, web, mobile, APIs</td>
                  <td>Field Manager v2, spécificités</td>
                </tr>
                <tr>
                  <td><strong>IA</strong></td>
                  <td>Data, automatisation, pilotage</td>
                  <td>Système nerveux, consolidation</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p><strong>Un regard industriel :</strong> Thierry Ménard, associé Drakkar, est Head of Manufacturing chez Airbus. 30 ans d&apos;expérience sur les sujets qui vous concernent : intégration d&apos;entités acquises, montée en cadence, pilotage multi-sites. Ce n&apos;est pas de la théorie, c&apos;est du vécu.</p>

          <p><strong>Un focus PME/ETI :</strong> On ne travaille pas avec les grands comptes du CAC40 qui ont des budgets illimités. On travaille avec des structures comme la vôtre : entreprises en croissance, contraintes réelles, transformation sans arrêter la production.</p>
        </section>

        {/* Section 8 */}
        <section id="approche">
          <div className="section-num">Section 8</div>
          <h2>L&apos;approche : zones de liberté</h2>

          <p>Pour résoudre le dilemme standardisation/flexibilité, on propose de définir ensemble une matrice :</p>

          <div className="zones-grid">
            <div className="zone red-zone">
              <div className="zone-label">ROUGE</div>
              <div className="zone-desc">Aucune</div>
              <div className="zone-ex">Référentiel client unique, facturation comptable, données consolidées</div>
            </div>
            <div className="zone orange-zone">
              <div className="zone-label">ORANGE</div>
              <div className="zone-desc">Encadrée</div>
              <div className="zone-ex">Construction devis (liberté dans un cadre), manipulation prix (tracée)</div>
            </div>
            <div className="zone green-zone">
              <div className="zone-label">VERT</div>
              <div className="zone-desc">Totale</div>
              <div className="zone-ex">Présentation commerciale, argumentation, organisation personnelle</div>
            </div>
          </div>

          <p><strong>Le principe :</strong> Les commerciaux acceptent la contrainte si l&apos;exception reste possible.</p>

          <p><strong>Mécanisme concret :</strong> En principe le process c&apos;est X. Mais si un commercial a besoin d&apos;une exception, il peut la demander en 3 clics. C&apos;est tracé, validé rapidement, et analysé. Si 10 commerciaux demandent la même exception, on ajuste la règle.</p>

          <p>C&apos;est exactement comme vos collections : un socle commun + des adaptations.</p>

          <div className="insight">
            <div className="insight-label">Important</div>
            <p>Cette matrice sera définie avec vous, pas par nous.</p>
          </div>
        </section>

        {/* Section 9 */}
        <section id="proposition">
          <div className="section-num">Section 9</div>
          <h2>Ce qu&apos;on propose : deux volets en parallèle</h2>

          <p>On ne peut pas tout faire en séquentiel. Le commerce est le cœur du sujet, mais l&apos;urgence technique (Field Manager, outils legacy) ne peut pas attendre.</p>

          <p><strong>On propose deux volets qui avancent en parallèle :</strong></p>

          <div className="tracks">
            <div className="track">
              <div className="track-label">Volet 1</div>
              <h4>Commerce</h4>
              <div className="track-team">Drakkar Accélérateur</div>
              <ul>
                <li>Cycle commercial</li>
                <li>Modèle de données</li>
                <li>Question Odoo</li>
                <li>Matrice ROUGE/ORANGE/VERT</li>
              </ul>
            </div>
            <div className="track">
              <div className="track-label">Volet 2</div>
              <h4>Audit technique</h4>
              <div className="track-team">Drakkar Studio</div>
              <ul>
                <li>État des outils existants</li>
                <li>Connectabilité (APIs, bases)</li>
                <li>Diagnostic Field Manager</li>
                <li>Risques et dépendances</li>
              </ul>
            </div>
          </div>

          <h3>Volet 1 : commerce (Drakkar Accélérateur)</h3>

          <h4>Pourquoi le commerce</h4>

          <p>Un référentiel client n&apos;est pas une couche technique neutre. C&apos;est une modélisation métier. Un &quot;Client&quot; chez Cameleon, c&apos;est quoi ? Chanel Global ? Chanel France ? Le chef de projet Chanel qui passe la commande ?</p>

          <p>On ne le saura qu&apos;en travaillant sur le commerce, pas en faisant des ateliers abstraits.</p>

          <h4>Ce qu&apos;on va faire</h4>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Étape</th>
                  <th>Contenu</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Rencontrer vos équipes</strong></td>
                  <td>Nicolas + direction commerciale (atelier ROUGE/ORANGE/VERT), 2-3 commerciaux seniors, 1-2 chefs de projet/chiffreurs, Alexandre</td>
                </tr>
                <tr>
                  <td><strong>Analyser vos flux</strong></td>
                  <td>Exemples réels de devis (simples et complexes), commandes Chanel/LVMH, le fameux fichier Excel de chiffrage</td>
                </tr>
                <tr>
                  <td><strong>Tester Odoo</strong></td>
                  <td>Confronter vos cas réels à Odoo. Qu&apos;est-ce qui rentre ? Qu&apos;est-ce qui nécessite du custom ?</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h4>Livrables</h4>
          <ul>
            <li>Cartographie du cycle commercial (du brief à la facture)</li>
            <li>Matrice ROUGE/ORANGE/VERT validée</li>
            <li>Modèle de données commercial (définitions partagées)</li>
            <li>Analyse Odoo argumentée (pas une opinion, des faits)</li>
            <li>Recommandation architecture Group Manager</li>
          </ul>

          <h3>Volet 2 : audit technique (Drakkar Studio)</h3>

          <h4>Pourquoi en parallèle</h4>

          <p>Le Field Manager (Symfony 2) est une bombe à retardement. On ne peut pas attendre la fin de la conception commerce pour comprendre l&apos;état réel de vos outils.</p>

          <p>Et pour savoir si le &quot;système nerveux&quot; (Data Warehouse) est un quick win ou un chantier, il faut savoir si les outils existants sont connectables.</p>

          <h4>Ce qu&apos;on va faire</h4>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Étape</th>
                  <th>Contenu</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Audit Field Manager</strong></td>
                  <td>État du code, dépendances, risques. Refonte complète ou migration progressive ?</td>
                </tr>
                <tr>
                  <td><strong>Cartographie outils</strong></td>
                  <td>Cameleon Manager (WinDev), Think Manager, Factory Manager, Publi Manager : qu&apos;est-ce qui expose des données ? APIs ? Bases accessibles ?</td>
                </tr>
                <tr>
                  <td><strong>Test de connectabilité</strong></td>
                  <td>Peut-on extraire les données automatiquement ? Ou faut-il tout refaire ?</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h4>Livrables</h4>
          <ul>
            <li>Diagnostic Field Manager (état, risques, recommandation)</li>
            <li>Cartographie technique des outils existants</li>
            <li>Évaluation de connectabilité (système nerveux faisable rapidement ou pas)</li>
            <li>Recommandation stack et planning pour Field Manager v2</li>
          </ul>

          <h3>À l&apos;issue de la conception</h3>

          <p>Vous aurez :</p>
          <ul>
            <li>Une réponse claire sur Odoo (oui/non/partiellement, et pourquoi)</li>
            <li>Une réponse claire sur le Field Manager (refonte, planning, stack)</li>
            <li>Une architecture validée</li>
            <li>Une roadmap par vagues avec premier périmètre identifié</li>
            <li>Un budget réaliste pour la suite</li>
            <li>Une base factuelle pour décider Go / No-Go</li>
          </ul>
        </section>

        {/* Section 10 */}
        <section id="apres">
          <div className="section-num">Section 10</div>
          <h2>Après la conception : la mise en œuvre</h2>

          <p>Si la conception valide l&apos;approche, voici comment ça se passerait.</p>

          <h3>L&apos;approche : agile, inspirée de Scrum</h3>

          <div className="process-flow">
            <div className="process-step">
              <div className="process-name">Planning</div>
              <div className="process-duration">2-10 jours</div>
            </div>
            <div className="process-step">
              <div className="process-name">Build</div>
              <div className="process-duration">2-8 semaines</div>
            </div>
            <div className="process-step">
              <div className="process-name">Review</div>
              <div className="process-duration">2-3 jours</div>
            </div>
            <div className="process-step">
              <div className="process-name">Retro</div>
              <div className="process-duration">½ journée</div>
            </div>
          </div>

          <p><strong>Si le build dépasse 2 semaines</strong> → sprints intermédiaires avec démos pour garder le rythme et détecter les problèmes tôt.</p>

          <p><strong>Les principes clés :</strong></p>
          <ul>
            <li><strong>Deep dive process avant de coder</strong> : on comprend le métier, on définit les critères de validation</li>
            <li><strong>Démos régulières</strong> : du concret, pas des slides, validation ou ajustements</li>
            <li><strong>Rétrospective</strong> : on apprend et on améliore à chaque cycle</li>
            <li><strong>Réversibilité</strong> : on peut ajuster sans tout remettre en cause</li>
          </ul>

          <p><strong>Ce qu&apos;on mesure</strong> : pas &quot;% d&apos;avancement&quot;, mais ce qui compte : votre capacité à intégrer une acquisition rapidement.</p>

          <h3>Pourquoi ça marchera cette fois</h3>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Ce qui a foiré avant</th>
                  <th>Ce qu&apos;on fait différemment</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Big Bang</td>
                  <td>Transformation progressive, lot par lot</td>
                </tr>
                <tr>
                  <td>Outil imposé</td>
                  <td>Co-construit avec les utilisateurs</td>
                </tr>
                <tr>
                  <td>Formation théorique 6 mois avant</td>
                  <td>Formation juste-à-temps sur cas réels</td>
                </tr>
                <tr>
                  <td>Pas de pilote</td>
                  <td>Pilote systématique avant généralisation</td>
                </tr>
                <tr>
                  <td>Consultants qui repartent</td>
                  <td>Key users internes qui portent le projet</td>
                </tr>
                <tr>
                  <td>&quot;Débrouillez-vous&quot; après Go Live</td>
                  <td>Support renforcé les premières semaines</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3>M&A Ready : le fil rouge, pas une vague</h3>

          <p>On a posé dès le départ que l&apos;enjeu c&apos;est la croissance externe. Pourtant, on ne peut pas vous promettre aujourd&apos;hui une &quot;vague M&A Ready&quot; bien ficelée. <strong>On ne sait pas encore ce qu&apos;il faut construire pour que vous puissiez intégrer une acquisition en semaines.</strong></p>

          <p><strong>Ce qu&apos;on sait :</strong></p>
          <ul>
            <li>Aujourd&apos;hui, chaque acquisition = projet SI de plusieurs mois</li>
            <li>L&apos;objectif = réduire ça drastiquement</li>
          </ul>

          <p><strong>Ce qu&apos;on doit définir ensemble :</strong></p>
          <ul>
            <li>Les vrais points de friction lors d&apos;une intégration</li>
            <li>Ce qui doit être &quot;prêt&quot; côté Cameleon pour absorber une nouvelle entité</li>
            <li>La cible réaliste : 2 semaines ? 2 mois ?</li>
          </ul>

          <p><strong>C&apos;est l&apos;objet de notre réunion de cadrage.</strong></p>

          <h3>Les vagues : une hypothèse de travail</h3>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Vague</th>
                  <th>Périmètre</th>
                  <th>Contribution M&A</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>1. Commerce</strong></td>
                  <td>Group Manager MVP, workflow devis → commande, référentiel client unifié</td>
                  <td><em>À définir</em></td>
                </tr>
                <tr>
                  <td><strong>2. Pilotage</strong></td>
                  <td>Système nerveux connecté, dashboards groupe, traçabilité</td>
                  <td><em>À définir</em></td>
                </tr>
                <tr>
                  <td><strong>3. ?</strong></td>
                  <td><em>À définir en conception</em></td>
                  <td><em>À définir</em></td>
                </tr>
              </tbody>
            </table>
          </div>

          <p><strong>+ En parallèle : Field Manager v2</strong> = chantier séparé, piloté par Drakkar Studio.</p>

          <p>Le séquencement final sortira de la conception.</p>
        </section>

        {/* Section 11 */}
        <section id="attentes">
          <div className="section-num">Section 11</div>
          <h2>Ce qu&apos;on attend de vous</h2>

          <p>La transformation, c&apos;est 50% nous, 50% vous.</p>

          <div className="commitments">
            <ul>
              <li><strong>Sponsor direction visible</strong> : Nicolas présent aux moments clés, qui tranche quand il faut trancher</li>
              <li><strong>Disponibilité des personnes clés</strong> : les commerciaux, chefs de projet, Alexandre (pas 5 minutes entre deux réunions, du vrai temps)</li>
              <li><strong>Accès aux outils et aux données</strong> : les vrais devis, les vrais outils, pas une version aseptisée</li>
              <li><strong>Décisions tranchées</strong> : quand on pose une question structurante (ROUGE ou ORANGE ?), une réponse, pas &quot;on verra plus tard&quot;</li>
              <li><strong>Transparence sur les échecs passés</strong> : ce qui a vraiment foiré, pourquoi, pour ne pas répéter</li>
            </ul>
          </div>
        </section>

        {/* Section 12 */}
        <section id="next">
          <div className="section-num">Section 12</div>
          <h2>Prochaine étape : Réunion de cadrage</h2>

          <p>Cette note est notre compréhension de vos enjeux après notre rencontre. Si cette lecture vous parle, passons à l&apos;étape suivante.</p>

          <div className="highlight">
            <p><strong>Objectif :</strong> Aligner sur le scope, valider l&apos;approche, décider Go/No-Go sur la conception</p>
            <p><strong>Participants :</strong> Nicolas, Alexandre, Drakkar</p>
            <p><strong>Durée :</strong> 1h30</p>
          </div>

          <h3>Notre méthode pour cette réunion</h3>

          <p>On ne vient pas avec un PowerPoint de 50 slides. On vient avec :</p>
          <ul>
            <li>Notre lecture de vos enjeux (cette note)</li>
            <li>Des questions précises</li>
            <li>De quoi décider à la fin</li>
          </ul>

          <p><strong>Ce qu&apos;on attend de vous :</strong></p>
          <ul>
            <li>Des réponses franches, pas la version &quot;officielle&quot;</li>
            <li>Des exemples concrets (un devis qui a posé problème, une intégration qui a merdé)</li>
            <li>Vos vraies inquiétudes</li>
          </ul>

          <p><strong>Ce qu&apos;on fait ensemble :</strong></p>
          <ul>
            <li>On valide ou on corrige notre diagnostic</li>
            <li>On arbitre les priorités</li>
            <li>On cale le périmètre conception</li>
            <li>On décide : Go, No-Go, ou ajustements</li>
          </ul>

          <h3>Déroulé</h3>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Temps</th>
                  <th>Sujet</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>15 min</td>
                  <td><strong>Diagnostic</strong> : Voyons-nous la situation pareil ?</td>
                </tr>
                <tr>
                  <td>25 min</td>
                  <td><strong>Enjeux commerce</strong> : Questions clés</td>
                </tr>
                <tr>
                  <td>25 min</td>
                  <td><strong>Enjeux techniques & M&A</strong> : Questions clés</td>
                </tr>
                <tr>
                  <td>15 min</td>
                  <td><strong>Cadrage conception</strong> : Scope, planning, budget</td>
                </tr>
                <tr>
                  <td>10 min</td>
                  <td><strong>Décision</strong> : Go / No-Go</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3>Exemples questions clés : commerce</h3>
          <ul>
            <li>Combien de devis/mois ? Quelle répartition simple vs complexe ?</li>
            <li>PubliDécor impose ses prix sans détail, pourquoi ça passe là et pas ailleurs ?</li>
            <li>Les échecs Odoo : problème d&apos;outil, de méthode, ou de personnes ?</li>
            <li>Qui sont les 2-3 commerciaux à embarquer dès le départ ?</li>
          </ul>

          <h3>Questions clés : technique & M&A</h3>
          <ul>
            <li>Field Manager : qui maintient aujourd&apos;hui ? Y a un plan B si ça tombe ?</li>
            <li>Lors de l&apos;intégration CCI, qu&apos;est-ce qui a vraiment pris du temps ?</li>
            <li>Profil des cibles d&apos;acquisition : PME locales ou ETI structurées ?</li>
            <li>Accès code et bases : c&apos;est faisable rapidement ?</li>
          </ul>

          <h3>À l&apos;issue de cette réunion</h3>
          <ul>
            <li>Périmètre conception verrouillé</li>
            <li>Planning de démarrage calé</li>
            <li>Interlocuteurs identifiés côté Cameleon</li>
            <li>Décision Go / No-Go</li>
          </ul>

          <p>On ne vous demande pas de signer un projet de 18 mois. On vous propose quelques semaines pour <strong>décider ensemble</strong> si ça a du sens et, si oui, par quoi commencer.</p>

          <div className="signature">
            <div className="signature-header">
              <div className="signature-meta">
                <div className="signature-company">Drakkar Group</div>
                <div className="signature-date">27 novembre 2025</div>
              </div>
              <div className="signature-logo">
                <img src="/logos/logo_drakkar_noir.png" alt="Drakkar" />
              </div>
            </div>

            <div className="authors">
              <div className="author">
                <img src="/photos/teddy.jpg" alt="Teddy Thierry" className="author-photo" />
                <div className="author-info">
                  <div className="author-name">Teddy Thierry</div>
                  <div className="author-role">Responsable commercial</div>
                  <div className="author-contact">
                    <a href="mailto:teddy.thierry@drakkar.io">teddy.thierry@drakkar.io</a>
                    <a href="tel:+33756288261">+33 7 56 28 82 61</a>
                  </div>
                </div>
              </div>
              <div className="author">
                <img src="/photos/nathan.jpg" alt="Nathan Menard" className="author-photo" />
                <div className="author-info">
                  <div className="author-name">Nathan Menard</div>
                  <div className="author-role">CEO & co-fondateur</div>
                  <div className="author-contact">
                    <a href="mailto:nathan.menard@drakkar.io">nathan.menard@drakkar.io</a>
                    <a href="tel:+33651201858">+33 6 51 20 18 58</a>
                    <a href="sms:+33651201858" className="author-note">merci d&apos;envoyer un SMS si pas de réponse</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
    </>
  );
}

// Cronite Group Content Component
function CroniteContent() {
  return (
    <>
      {/* Section 0 - Objet */}
      <section id="objet">
        <div className="section-num">Introduction</div>
        <h2>À quoi sert ce document</h2>

        <p>Vous voulez transformer votre structure de coûts. Passer de 50/50 à 60/40, puis 70/30. Rester compétitifs.</p>

        <p>Une formation IA ne fera pas ça.</p>

        <p>Ce qui le fera : comprendre où passe le temps dans votre chaîne de valeur, identifier les bons chantiers, et embarquer votre CODIR pour qu&apos;ils aient envie de les mener.</p>

        <p>Dans cet ordre, pas dans l&apos;autre.</p>

        <p>Or, vous avez trois propositions sur la table et deux sont probablement des propositions de formations. La nôtre commence par la compréhension de CRONITE. C&apos;est plus long, c&apos;est moins sexy, mais c&apos;est comme ça qu&apos;on passe d&apos;un CODIR qui repart en disant &quot;c&apos;était intéressant&quot; à un CODIR averti et armé d&apos;une roadmap claire pour faire gagner son équipe en performance grâce à l&apos;IA.</p>

        <div className="highlight">
          <p><strong>Concrètement, ce qu&apos;on propose :</strong> envoyer une équipe pilotée par Thierry, notre expert industriel avec 27 ans d&apos;expérience chez Airbus, épaulé par des profils qui ont accompagné des ETI comme la vôtre dans la transformation qui vous attend. Ensemble, on va interviewer vos équipes, visiter votre usine, cartographier votre chaîne de valeur. Objectif : détecter les quick wins par pôle qui deviendront le cœur de la formation CODIR.</p>
        </div>

        <p>Proposer une formation sans avoir fait ce travail avant, c&apos;est compter sur la chance pour vous donner ce dont vous avez besoin.</p>

        <p>Les pages qui suivent détaillent notre raisonnement et notre offre. Si cette approche fait sens pour vous, on vous invite à les parcourir. Ensuite, prenons 30 minutes ensemble pour valider ou invalider nos hypothèses et vous permettre de faire votre choix en pleine connaissance de vos options.</p>
      </section>

      {/* Section 1 - Avant-propos */}
      <section id="avant-propos">
        <div className="section-num">Section 1</div>
        <h2>Avant-propos</h2>

        <p>Ce qui suit repose sur deux échanges de 45 minutes. C&apos;est forcément incomplet, forcément spéculatif.</p>

        <p>On ne prétend pas avoir compris votre entreprise en une heure et demie. On a capté des signaux, formulé des hypothèses, tiré des fils. Certaines de nos lectures sont probablement justes. D&apos;autres sont peut-être à côté de la plaque.</p>

        <div className="insight">
          <div className="insight-label">Important</div>
          <p>Cette note n&apos;est pas un diagnostic définitif. C&apos;est une base d&apos;alignement. On veut votre réaction : ce qu&apos;on a vu juste, ce qu&apos;on a mal compris, ce qui manque.</p>
        </div>

        <p>Si notre lecture vous parle, on avance. Si elle est fausse, dites-le, c&apos;est le moment.</p>
      </section>

      {/* Section 2 - Situation */}
      <section id="situation">
        <div className="section-num">Section 2</div>
        <h2>Ce qu&apos;on a compris de votre situation</h2>

        <h3>Le contexte stratégique</h3>

        <p>Vous êtes leader sur une niche mondiale, équipements pour fours de traitement thermique et incinération. Alliages haute résistance, R&amp;D propriétaire, nouvel alliage tous les 2-3 ans. Des clients comme Tesla, Mercedes, BYD, Volkswagen.</p>

        <p>Votre modèle économique est intelligent : vous créez un parc installé, puis vous prenez une rente sur le renouvellement. Comme Otis avec les ascenseurs. C&apos;est ce qui génère de la récurrence et de la prévisibilité.</p>

        <p>Cette position, vous l&apos;avez construite par l&apos;excellence technologique. Pas par les coûts.</p>

        <h3>La menace</h3>

        <p>Vos concurrents chinois n&apos;attaquent pas sur la qualité, ils attaquent sur les coûts. Et le gap qualité se réduit chaque année.</p>

        <p>Chez un concurrent chinois, le patron cumule directeur commercial, chef comptable et responsable marketing. Quasiment pas de coûts fixes. Ratio variable/fixe de 70/30.</p>

        <p>Chez Cronite Europe : <strong>50/50</strong>.</p>

        <p>Votre usine chinoise, elle, est déjà à 70/30. La preuve que c&apos;est possible.</p>

        <h3>L&apos;enjeu réel</h3>

        <div className="highlight rouge">
          <p>Vous ne cherchez pas une formation IA. Vous cherchez à <strong>transformer votre structure de coûts</strong> pour rester compétitifs. L&apos;IA n&apos;est qu&apos;un levier, peut-être le premier levier accessible pour attaquer vos coûts fixes sans restructuration sociale lourde.</p>
        </div>

        <p>L&apos;objectif que vous avez formulé : passer de 50/50 à 60/40, puis à 70/30.</p>

        <div className="key-question">
          Question qu&apos;on se pose : le 60/40, c&apos;est à quel horizon ? 2 ans ? 5 ans ? Et qu&apos;est-ce que ça représente en valeur absolue, combien d&apos;ETP équivalent, combien d&apos;euros ?
        </div>
      </section>

      {/* Section 3 - Gisement */}
      <section id="gisement">
        <div className="section-num">Section 3</div>
        <h2>Où est le gisement</h2>

        <h3>Ce qu&apos;on sait du flux</h3>

        <p>Sur un cycle de vente de 6 mois, vous passez 2 mois à faire &quot;du papier et des échanges d&apos;intelligence avec le client&quot;. Plus de temps en amont qu&apos;en production (3 semaines).</p>

        <p>Le flux tel qu&apos;on l&apos;a compris :</p>

        <div className="highlight">
          <p>Consultation → Saisie AX → Offre → Commande (PDF) → Ressaisie AX → Revue contrat → Méthodes → Production → Expédition → Facturation</p>
        </div>

        <p><strong>C&apos;est là que se trouve le gisement. Pas dans l&apos;usine.</strong></p>

        <h3>Un premier cas concret</h3>

        <p>Denis a évoqué la saisie des commandes depuis les RFQ (Request For Quotation) : aujourd&apos;hui, quand un devis est validé par le client, la commande est ressaisie manuellement dans AX. C&apos;est exactement le type de tâche répétitive, à faible valeur ajoutée, qui peut être automatisée rapidement.</p>

        <div className="insight">
          <div className="insight-label">Quick win identifié</div>
          <p>Ce quick win pourrait servir de première démonstration concrète pour le CODIR.</p>
        </div>

        <h3>Ce qu&apos;on ne sait pas (et qui change tout)</h3>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Question</th>
                <th>Pourquoi c&apos;est clé</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Décomposition du lead time par étape ?</strong></td>
                <td>On sait que le cycle fait 6 mois, dont 2 mois de &quot;papier&quot;. Mais où exactement ? Sans cette décomposition, on ne sait pas où taper.</td>
              </tr>
              <tr>
                <td><strong>Lead time vs cycle time ?</strong></td>
                <td>Sur les 6 semaines d&apos;amont, combien de temps réel de travail vs temps où le dossier dort dans une boîte mail ? C&apos;est souvent là que se cachent les vrais gains.</td>
              </tr>
              <tr>
                <td><strong>Où sont les goulots ?</strong></td>
                <td>Bureau d&apos;études ? Méthodes ? Validation client ? Le goulot dicte le débit. Optimiser ailleurs, c&apos;est du gaspillage.</td>
              </tr>
              <tr>
                <td><strong>Volume de consultations / mois ?</strong></td>
                <td>Pour dimensionner l&apos;impact. 10 consultations/mois ≠ 200.</td>
              </tr>
              <tr>
                <td><strong>Taux de transformation consultation → commande ?</strong></td>
                <td>Si c&apos;est 80%, on optimise le flux. Si c&apos;est 20%, on se demande d&apos;abord pourquoi on perd 80% des affaires.</td>
              </tr>
              <tr>
                <td><strong>Mix nouveaux produits vs renouvellement ?</strong></td>
                <td>Le renouvellement va plus vite. Quel est le ratio ? Ça change la priorité.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3>Estimation grossière</h3>

        <p>Si on prend les données disponibles :</p>

        <ul>
          <li>2 mois sur 6 = 33% du cycle en administratif</li>
          <li>Sur 500 personnes, hypothèse 20% sur des fonctions admin/support = 100 personnes</li>
          <li>Si on gagne 20% de leur temps = 20 ETP équivalent</li>
          <li><strong>À 50K€ chargé/an = ~1M€/an de gisement potentiel</strong></li>
        </ul>

        <div className="insight">
          <div className="insight-label">À affiner</div>
          <p>C&apos;est une estimation très grossière. On a besoin de vos vrais chiffres pour affiner.</p>
        </div>
      </section>

      {/* Section 4 - AX */}
      <section id="ax">
        <div className="section-num">Section 4</div>
        <h2>La contrainte AX</h2>

        <h3>Pourquoi c&apos;est structurant</h3>

        <p>Tout ce qu&apos;on veut automatiser passe par Dynamics AX 2012. C&apos;est votre colonne vertébrale.</p>

        <p>AX est en fin de vie, plus de support Microsoft, plus de développement. Denis Viard l&apos;a dit clairement : &quot;Il n&apos;est pas question d&apos;aller développer dans AX des modules nouveaux. C&apos;est du travail perdu à moyen terme.&quot;</p>

        <div className="highlight">
          <p>Décision sage. Mais ça crée une contrainte forte : <strong>on doit travailler AVEC AX, pas DANS AX.</strong></p>
        </div>

        <h3>Ce que ça implique</h3>

        <p>Toute automatisation qu&apos;on construira devra :</p>

        <ul>
          <li>Lire les données dans AX (sans le modifier)</li>
          <li>Traiter à l&apos;extérieur (Directus, n8n, outils IA)</li>
          <li>Éventuellement réécrire dans AX via les interfaces existantes</li>
        </ul>

        <p>C&apos;est faisable. C&apos;est d&apos;ailleurs exactement ce que fait le projet Directus/n8n en cours. Mais ça conditionne l&apos;architecture de tout ce qu&apos;on fera ensemble.</p>

        <div className="key-question">
          Question qu&apos;on se pose : quelles sont les interfaces disponibles sur AX aujourd&apos;hui ? API ? Exports automatisés ? Ou on est sur du fichier Excel manuel ?
        </div>

        <h3>Le remplacement d&apos;AX</h3>

        <p>Vous avez dit : remplacement prévu dans les 5 ans, pas de décision prise.</p>

        <p>Ce n&apos;est pas le sujet de cette mission. Mais ce qu&apos;on construira ensemble devra être pensé pour survivre à la migration, ou au moins pour ne pas la compliquer.</p>
      </section>

      {/* Section 5 - Directus */}
      <section id="directus">
        <div className="section-num">Section 5</div>
        <h2>Le projet Directus : votre preuve de concept</h2>

        <p>Denis Viard a lancé un projet de workflow digital pour la revue de contrats clients. Directus + n8n, interfacé avec AX. Livraison prévue fin 2025 / début janvier 2026.</p>

        <h3>Pourquoi ce projet est stratégique</h3>

        <p>Ce n&apos;est pas juste un projet IT. C&apos;est votre <strong>test grandeur nature</strong>.</p>

        <div className="two-cols">
          <div className="col-card dark">
            <h4>Si ça marche</h4>
            <ul>
              <li>Preuve que la transformation digitale est possible chez Cronite</li>
              <li>Modèle réplicable pour les autres process</li>
              <li>Argument concret pour le CODIR : &quot;Regardez, ça fonctionne&quot;</li>
            </ul>
          </div>
          <div className="col-card">
            <h4>Si ça échoue ou traîne</h4>
            <ul>
              <li>Le CODIR dira &quot;vous voyez, ça ne marche pas chez nous&quot;</li>
              <li>Crédibilité de la transformation entamée avant même de commencer</li>
            </ul>
          </div>
        </div>

        <h3>État réel du projet</h3>

        <p>Denis Viard nous a confirmé que le projet sera livré en janvier. Le blocage identifié n&apos;est pas technique mais organisationnel : le responsable méthodes peine à formaliser ses process de manière stable, ce qui génère des allers-retours sur le cahier des charges.</p>

        <div className="insight">
          <div className="insight-label">Pattern classique</div>
          <p>50% des projets livrés en retard le sont par manque de disponibilité ou de clarté côté métier, pas par défaillance technique.</p>
        </div>

        <p><strong>Ce que ça confirme :</strong> la transformation chez Cronite se jouera autant sur l&apos;accompagnement humain que sur les outils.</p>

        <h3>Notre proposition</h3>

        <p>Si ce projet a besoin d&apos;un coup de pouce pour atterrir avant la formation du CODIR, on peut aider. Pas pour le refaire, pour le faire aboutir.</p>

        <div className="highlight rouge">
          <p><strong>Un quick win visible avant la formation changerait la donne.</strong></p>
        </div>
      </section>

      {/* Section 6 - CODIR */}
      <section id="codir">
        <div className="section-num">Section 6</div>
        <h2>L&apos;enjeu CODIR</h2>

        <h3>Ce qu&apos;on a entendu</h3>

        <p>Pierre Munch veut &quot;péter les coûts fixes&quot; via l&apos;IA. L&apos;initiative vient de la direction générale, &quot;il n&apos;y a que ça qui peut fonctionner dans une entreprise&quot;.</p>

        <p>Pierre Munch décrit le CODIR comme &quot;en boule de défense&quot;. Denis Viard nuance : selon lui, les membres du CODIR ne sont pas dans le rejet. Ils sont à l&apos;écoute, mais ont besoin d&apos;être convaincus, ce qui est légitime.</p>

        <p>Édouard Lotthé, le CFO, s&apos;est invité de lui-même au dernier call. Il veut comprendre le sujet.</p>

        <h3>Notre lecture</h3>

        <div className="highlight">
          <p><strong>Ce ne sont pas des résistants. Ce sont des pragmatiques en attente de preuves.</strong></p>
        </div>

        <p>Moyenne d&apos;âge ~50+ ans. Des experts métier qui ont construit leur carrière sur le savoir-faire industriel. L&apos;IT a souvent été &quot;un outil qui ne marche jamais bien&quot;. L&apos;IA, c&apos;est encore abstrait.</p>

        <p>Leur demander de s&apos;engager sur quelque chose qu&apos;ils n&apos;ont jamais vu fonctionner dans leur contexte, c&apos;est leur demander un acte de foi. C&apos;est beaucoup.</p>

        <p>Ce qu&apos;il leur faut, ce n&apos;est pas des discours, c&apos;est une démonstration.</p>

        <h3>La vraie question</h3>

        <p>Pas &quot;comment convaincre le CODIR&quot;. Mais :</p>

        <div className="key-question">
          &quot;Qu&apos;est-ce qui leur fera dire : je veux ça pour mon périmètre ?&quot;
        </div>

        <p>Hypothèse : des résultats visibles sur leurs vrais irritants. Pas des cas d&apos;usage génériques. Leurs cas à eux.</p>

        <h3>Questions qu&apos;on se pose</h3>

        <ul>
          <li>Quels sont les irritants quotidiens de chaque membre du CODIR ? Ce qui leur fait perdre du temps, ce qui les frustre ?</li>
          <li>Y a-t-il des &quot;alliés naturels&quot; dans le CODIR, des gens déjà curieux de ces sujets ?</li>
          <li>Pierre Munch a mentionné un &quot;passionné IA&quot; au bureau design, exclu de la première formation. Qui d&apos;autre pourrait être un relais ?</li>
        </ul>
      </section>

      {/* Section 7 - Inconnus */}
      <section id="inconnus">
        <div className="section-num">Section 7</div>
        <h2>Ce qu&apos;on ne sait pas encore</h2>

        <h3>Sur le business</h3>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Question</th>
                <th>Pourquoi on la pose</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>CA groupe et tendance 3 ans ?</strong></td>
                <td>Pour dimensionner l&apos;enjeu. Et savoir si la pression coûts est urgente ou anticipatoire.</td>
              </tr>
              <tr>
                <td><strong>Marge actuelle et évolution ?</strong></td>
                <td>Même logique. Si les marges s&apos;érodent, l&apos;urgence n&apos;est pas la même.</td>
              </tr>
              <tr>
                <td><strong>Qui détient Cronite ? Quelle gouvernance ?</strong></td>
                <td>Pour comprendre les contraintes de décision.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3>Sur les opérations</h3>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Question</th>
                <th>Pourquoi on la pose</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Répartition ETP par fonction ?</strong></td>
                <td>Combien en bureau d&apos;études ? Méthodes ? ADV ? Compta ? C&apos;est là qu&apos;on voit où sont vraiment les coûts fixes.</td>
              </tr>
              <tr>
                <td><strong>Coût des 2 mois de &quot;papier&quot; en €/an ?</strong></td>
                <td>Pour quantifier le gisement et calculer un ROI.</td>
              </tr>
              <tr>
                <td><strong>Quels quick wins déjà identifiés ?</strong></td>
                <td>Pour ne pas réinventer ce qui existe.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3>Sur l&apos;historique</h3>

        <p><strong>Y a-t-il eu d&apos;autres tentatives de transformation avant ?</strong></p>

        <p>Pour comprendre le track record. Et les cicatrices éventuelles.</p>

        <h3>Ce qui a échoué avec Allegria</h3>

        <p>Allegria proposait une offre packagée à 50K€, sans capacité à personnaliser. Malgré plusieurs tentatives, ils revenaient systématiquement à leur offre standard. Les bons interlocuteurs n&apos;étaient jamais en face.</p>

        <div className="insight">
          <div className="insight-label">Ce qu&apos;on en retient</div>
          <p>Cronite a besoin d&apos;un partenaire capable de s&apos;adapter à sa réalité, pas d&apos;un prestataire qui déroule un catalogue.</p>
        </div>
      </section>

      {/* Section 8 - Question */}
      <section id="question">
        <div className="section-num">Section 8</div>
        <h2>La question qu&apos;on devra adresser</h2>

        <p>L&apos;IA permet d&apos;avoir un premier jet de tout un tas de choses, ce qui fait gagner du temps. C&apos;est vrai. Mais ça pose une question que personne n&apos;a encore adressée :</p>

        <div className="key-question">
          Que fait-on du temps gagné ?
        </div>

        <p>Si l&apos;IA fait gagner 2h par jour à quelqu&apos;un, trois scénarios possibles :</p>

        <ol>
          <li>La personne fait 2h de plus de travail à valeur ajoutée</li>
          <li>La personne absorbe 2h de nouvelles tâches (effet rebond)</li>
          <li>La personne part 2h plus tôt</li>
        </ol>

        <div className="highlight">
          <p><strong>Le scénario 1 ne se produit pas naturellement.</strong> Il nécessite une intention managériale.</p>
        </div>

        <p>Cette question n&apos;est pas technique. Elle est organisationnelle. Si la réponse n&apos;est pas claire avant de lancer les projets d&apos;automatisation, les gains risquent d&apos;être absorbés par l&apos;inertie naturelle des organisations.</p>

        <p>C&apos;est un sujet que la journée CODIR devra traiter frontalement.</p>

        <h3>Une question connexe</h3>

        <p><strong>Qui porte les automatisations après la formation ?</strong></p>

        <p>La DSI ne peut pas construire seule des workflows métier qu&apos;elle ne maîtrise pas. Les métiers ne peuvent pas tout faire seuls sans appui technique. Il faudra définir une organisation hybride : des &quot;champions&quot; métier appuyés par la DSI, ou un binôme structuré.</p>

        <p>C&apos;est un sujet que la journée CODIR devra également adresser.</p>
      </section>

      {/* Section 9 - Hypothèses */}
      <section id="hypotheses">
        <div className="section-num">Section 9</div>
        <h2>Nos hypothèses (à valider)</h2>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Hypothèse</th>
                <th>Ce qui nous la confirmerait</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>La pression coûts est urgente, pas juste anticipatoire</strong></td>
                <td>Tendance marge 3 ans en baisse</td>
              </tr>
              <tr>
                <td><strong>Le CODIR basculera s&apos;il voit des résultats concrets</strong></td>
                <td>Réactions pendant la formation, on observe</td>
              </tr>
              <tr>
                <td><strong>Le gisement principal est dans les 2 mois de &quot;papier&quot; amont</strong></td>
                <td>Immersion terrain, chronométrer les tâches</td>
              </tr>
              <tr>
                <td><strong>Le projet Directus est sur les rails</strong></td>
                <td>État réel du projet, blocages identifiés</td>
              </tr>
              <tr>
                <td><strong>AX est une contrainte mais pas un blocage</strong></td>
                <td>Interfaces disponibles pour automatiser autour</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Section 10 - Invariants */}
      <section id="invariants">
        <div className="section-num">Section 10</div>
        <h2>Ce qui ne doit pas changer</h2>

        <p>Toute intervention qui ignorerait vos fondamentaux serait vouée à l&apos;échec.</p>

        <div className="two-cols">
          <div className="col-card dark">
            <h4>Ce qui fait votre force (on n&apos;y touche pas)</h4>
            <ul>
              <li>Excellence technologique (R&amp;D, innovation)</li>
              <li>Positionnement premium</li>
              <li>Culture industrielle, expertise métier</li>
              <li>Modèle de rente (parc + renouvellement)</li>
            </ul>
          </div>
          <div className="col-card">
            <h4>Ce qu&apos;on peut transformer</h4>
            <ul>
              <li>Productivité des process amont</li>
              <li>Capacité à gagner les nouvelles affaires sur le prix</li>
              <li>Perception de l&apos;IA (abstrait → outil concret)</li>
              <li>Efficience du cycle commercial</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Section 11 - Proposition */}
      <section id="proposition">
        <div className="section-num">Section 11</div>
        <h2>Ce que vous achetez vraiment</h2>

        <p>Pas une formation.</p>

        <p>Un <strong>premier pas concret</strong> dans une transformation décidée au plus haut niveau.</p>

        <p>Denis Viard l&apos;a formulé clairement : &quot;Ce qu&apos;on veut obtenir à la fin de cette formation, c&apos;est qu&apos;on voie des paillettes dans leurs yeux.&quot;</p>

        <div className="highlight rouge">
          <p>Traduction : il faut que le CODIR reparte en se disant &quot;je veux ça pour mon périmètre&quot;, pas &quot;c&apos;était intéressant&quot;.</p>
        </div>

        <p>Notre mission n&apos;est pas de transmettre des connaissances. C&apos;est de <strong>créer une expérience qui donne envie d&apos;aller plus loin.</strong></p>
      </section>

      {/* Section 12 - Approche */}
      <section id="approche">
        <div className="section-num">Section 12</div>
        <h2>L&apos;approche proposée</h2>

        <h3>Principe</h3>

        <p>Une formation &quot;froide&quot;, où on débarque sans connaître les gens ni leur réalité, a peu de chances de fonctionner. Pour que le CODIR accroche, il faut que les cas d&apos;usage soient les leurs, pas des exemples génériques.</p>

        <p>Ça demande du travail en amont.</p>

        <h3>Phase 1 : Immersion (avant la formation)</h3>

        <p><strong>Entretiens individuels</strong>, 45 min par membre du CODIR</p>
        <ul>
          <li>Objectif : comprendre leur quotidien, leurs irritants, leur perception de l&apos;IA</li>
          <li>Ce qu&apos;ils passent du temps à faire, ce qui les frustre</li>
          <li>Identifier un cas d&apos;usage concret pour chacun</li>
        </ul>

        <p><strong>Cartographie SI</strong>, 1h visio avec Denis Viard</p>
        <ul>
          <li>État des outils, interconnexions, projets en cours</li>
          <li>Interfaces AX disponibles</li>
          <li>Projet Directus : où en est-on vraiment ?</li>
        </ul>

        <p><strong>Immersion terrain</strong>, ½ journée sur site</p>
        <ul>
          <li>Observer les process réels, pas les process théoriques</li>
          <li>Chronométrer : où passe vraiment le temps ?</li>
          <li>Identifier les quick wins</li>
        </ul>

        <h3>Phase 2 : Formation CODIR (1 jour)</h3>

        <p><strong>Dates pressenties :</strong> 18-19 ou 19-20 février (à confirmer). Le CODIR a déjà bloqué ces créneaux.</p>

        <p><strong>Pourquoi 1 jour et pas 2 :</strong></p>
        <ul>
          <li>On teste la dynamique avant d&apos;aller plus loin</li>
          <li>Si ça prend, on programme un J2 avec les cas d&apos;usage identifiés</li>
          <li>Si ça ne prend pas, on n&apos;a pas tout cramé</li>
        </ul>

        <h3>Le programme</h3>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Bloc</th>
                <th>Contenu</th>
                <th>Objectif</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Matin</strong></td>
                <td>L&apos;IA dans l&apos;industrie : ce qui marche, ce qui ne marche pas</td>
                <td>Sortir des fantasmes et des peurs</td>
              </tr>
              <tr>
                <td><strong>Matin</strong></td>
                <td>Vos cas d&apos;usage : sur données réelles Cronite</td>
                <td>Prouver que c&apos;est applicable ici</td>
              </tr>
              <tr>
                <td><strong>Après-midi</strong></td>
                <td>Prise en main des outils (chacun sur son laptop)</td>
                <td>Démystifier par la pratique</td>
              </tr>
              <tr>
                <td><strong>Après-midi</strong></td>
                <td>Construction d&apos;une première automatisation simple</td>
                <td>Créer le &quot;je peux le faire&quot;</td>
              </tr>
              <tr>
                <td><strong>Fin de journée</strong></td>
                <td>Quick wins identifiés + décision Go/No-Go pour J2</td>
                <td>Transformer l&apos;intention en action</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3>Ce que vous aurez à l&apos;issue</h3>

        <ul>
          <li>Un CODIR qui a touché, testé, compris</li>
          <li>Une première liste de cas d&apos;usage priorisés</li>
          <li>Une décision claire : on continue ou pas</li>
        </ul>

        <h3>Phase 3 : Ancrage (après la formation)</h3>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Délai</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>J+7</strong></td>
                <td>Synthèse écrite, ce qui a émergé, priorisation</td>
              </tr>
              <tr>
                <td><strong>J+30</strong></td>
                <td>Call de suivi, où en sont les initiatives lancées ? qu&apos;est-ce qui bloque ?</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Section 13 - Et après */}
      <section id="apres">
        <div className="section-num">Section 13</div>
        <h2>Et après ?</h2>

        <p>Pierre Munch l&apos;a dit clairement : &quot;L&apos;objectif après, c&apos;est de faire une deuxième formation et de prendre l&apos;élément élargi en dessous du comité de direction. Ça sera au comité de direction de dire qui doit être formé.&quot;</p>

        <h3>Le scénario si ça prend</h3>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Horizon</th>
                <th>Ce qui se passe</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Après J1</strong></td>
                <td>Le CODIR identifie qui doit être formé dans leurs équipes</td>
              </tr>
              <tr>
                <td><strong>1-3 mois</strong></td>
                <td>Formation J2 : équipes élargies (managers terrain, DSI)</td>
              </tr>
              <tr>
                <td><strong>3-6 mois</strong></td>
                <td>Premiers projets d&apos;automatisation lancés (les quick wins identifiés)</td>
              </tr>
              <tr>
                <td><strong>6-12 mois</strong></td>
                <td>Projet Directus déployé, premiers gains mesurables</td>
              </tr>
              <tr>
                <td><strong>12-24 mois</strong></td>
                <td>Ratio 60/40 en vue</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3>Le scénario si ça ne prend pas</h3>

        <p>Si après la formation, le CODIR reste en attente, si on ne voit pas les paillettes, on fait le point honnêtement :</p>

        <ul>
          <li>Qu&apos;est-ce qui n&apos;a pas fonctionné ?</li>
          <li>Est-ce le format ? Le contenu ? Le timing ?</li>
          <li>Faut-il une autre approche ou faut-il attendre ?</li>
        </ul>

        <p>On ne vous poussera pas à continuer si les conditions ne sont pas réunies.</p>

        <h3>Ce qu&apos;on ne fera pas</h3>

        <ul>
          <li>Vous vendre des jours de consulting sans fin</li>
          <li>Créer de la dépendance</li>
          <li>Faire à votre place ce que vos équipes peuvent apprendre à faire</li>
        </ul>

        <p><strong>L&apos;objectif, c&apos;est l&apos;autonomie.</strong> Qu&apos;à terme, Denis Viard et son équipe puissent piloter la transformation sans nous.</p>
      </section>

      {/* Section 14 - Drakkar */}
      <section id="drakkar">
        <div className="section-num">Section 14</div>
        <h2>Pourquoi Drakkar</h2>

        <h3>Notre positionnement</h3>

        <p>Drakkar est un collectif de 23 personnes, autofinancé depuis 2020. On fait de la transformation digitale pour des PME et ETI, principalement industrielles.</p>

        <p>Notre particularité : on ne sépare pas le conseil de l&apos;exécution. On pense et on fait. Ça évite les slides qui finissent dans un tiroir.</p>

        <h3>Trois pôles d&apos;intervention</h3>

        <ul>
          <li><strong>Drakkar Studio :</strong> Développement sur-mesure. Web, mobile, API. Quand il faut construire quelque chose qui n&apos;existe pas sur étagère.</li>
          <li><strong>Drakkar Accélérateur :</strong> Déploiement et optimisation ERP (Odoo). Process, flux, automatisation.</li>
          <li><strong>Drakkar IA :</strong> Déploiement stratégique d&apos;IA en entreprise. Pas des POC qui restent dans un coin. Des usages qui tiennent, adoptés par les équipes.</li>
        </ul>

        <h3>Deux expertises transverses</h3>

        <p><strong>Conseil &amp; Stratégie</strong> : Diagnostic, feuille de route, arbitrages technologiques.</p>

        <p><strong>Conduite du changement</strong> : Former, embarquer, ancrer. La meilleure solution technique ne sert à rien si personne ne l&apos;utilise.</p>

        <h3>Ce qu&apos;on n&apos;est pas</h3>

        <p>On n&apos;est pas un cabinet de conseil qui déroule des frameworks sans mettre les mains dedans. On n&apos;est pas une ESN qui vend des jours-homme. On n&apos;est pas un organisme de formation qui récite des slides.</p>

        <div className="insight">
          <div className="insight-label">Pourquoi c&apos;est pertinent</div>
          <p>Un de nos associés est encore en poste chez Airbus. Ce n&apos;est pas un hasard : on croit qu&apos;on ne peut pas transformer ce qu&apos;on ne comprend pas de l&apos;intérieur.</p>
        </div>
      </section>

      {/* Section 15 - Équipe */}
      <section id="equipe">
        <div className="section-num">Section 15</div>
        <h2>L&apos;équipe sur cette mission</h2>

        <h3>Qui</h3>

        <p><strong>Nathan Ménard, CEO, 26 ans</strong> — Double champion d&apos;Europe et n°1 mondial en roller slalom. A fondé Drakkar à 20 ans. Triple casquette tech / stratégie / sales &amp; marketing. Six ans à confronter les promesses IA au réel.</p>

        <p><strong>Thierry Ménard, Associé, 53 ans</strong> — 27 ans chez Airbus, toujours en poste. De technicien à Senior Industrial Architect, en charge du développement du futur A320. Expert en efficience industrielle, ayant augmenté la cadence de production de +25% sur un an grâce au déploiement LEAN.</p>

        <p><strong>Teddy Thierry, Directeur de projet, 30 ans</strong> — Ancien équipe de France de roller slalom. Autodidacte, expertise en conduite du changement construite sur le terrain.</p>

        <p><strong>Jean Le Tulzo, Co-fondateur &amp; associé, 38 ans</strong> — Ancien analyste financier. A piloté la transformation complète d&apos;une entreprise de 30 ans. Sait parler aux CFO.</p>

        <p><strong>Matthis Ruel, Product Manager, 25 ans</strong> — Le lien entre tech et métier. Lead sur un projet Drakkar passé de 0 à 5M€ de valorisation.</p>

        <h3>Qui fait quoi</h3>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Phase</th>
                <th>Qui</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Cadrage initial</strong></td>
                <td>Nathan</td>
              </tr>
              <tr>
                <td><strong>Entretiens CODIR</strong></td>
                <td>Nathan + Thierry</td>
              </tr>
              <tr>
                <td><strong>Entretien Direction Financière</strong></td>
                <td>Thierry + Jean</td>
              </tr>
              <tr>
                <td><strong>Immersion terrain</strong></td>
                <td>Thierry + Teddy</td>
              </tr>
              <tr>
                <td><strong>Cartographie SI</strong></td>
                <td>Nathan + Matthis</td>
              </tr>
              <tr>
                <td><strong>Journée CODIR</strong></td>
                <td>Nathan + Thierry + Teddy</td>
              </tr>
              <tr>
                <td><strong>Suivi</strong></td>
                <td>Thierry + Teddy</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3>Pourquoi cette composition pour Cronite</h3>

        <p>Votre CODIR est composé d&apos;industriels expérimentés. Ils ont vu passer des consultants. Ils savent reconnaître ceux qui n&apos;ont jamais mis les pieds dans une usine.</p>

        <p><strong>Thierry</strong> a passé 27 ans chez Airbus. Il ne parlera pas de &quot;transformation digitale&quot;, il parlera process, temps cycle, goulots, gaspillages. C&apos;est votre langue.</p>

        <p><strong>Jean</strong> interviendra spécifiquement sur l&apos;entretien Direction Financière. Un ancien analyste face à un CFO : même langage.</p>
      </section>

      {/* Section 16 - Attentes */}
      <section id="attentes">
        <div className="section-num">Section 16</div>
        <h2>Ce qu&apos;on attend de vous</h2>

        <p>La transformation, c&apos;est 50% nous, 50% vous.</p>

        <div className="commitments">
          <ul>
            <li><strong>Disponibilité des membres du CODIR</strong> : 45 min par personne pour les entretiens, pas entre deux réunions</li>
            <li><strong>Accès terrain</strong> : pouvoir observer les vrais process, pas une version aseptisée</li>
            <li><strong>Accès aux données</strong> : volumétrie, temps cycle, ce qu&apos;on peut partager</li>
            <li><strong>Sponsor visible</strong> : Pierre Munch présent aux moments clés</li>
            <li><strong>Décisions tranchées</strong> : quand on pose une question, une réponse</li>
          </ul>
        </div>
      </section>

      {/* Section 17 - Investissement */}
      <section id="investissement">
        <div className="section-num">Section 17</div>
        <h2>Investissement</h2>

        <p>Vous nous avez dit que vous négocieriez. On a anticipé.</p>

        <h3>Ce qu&apos;on investit</h3>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Personne</th>
                <th>Activité</th>
                <th>Temps estimé</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Nathan Ménard</strong></td>
                <td>Pilotage, entretiens, SI, formation J1</td>
                <td>~15h</td>
              </tr>
              <tr>
                <td><strong>Thierry Ménard</strong></td>
                <td>Entretiens, immersion terrain, formation J1</td>
                <td>~14h</td>
              </tr>
              <tr>
                <td><strong>Jean Le Tulzo</strong></td>
                <td>Entretien Direction Financière</td>
                <td>1h</td>
              </tr>
              <tr>
                <td><strong>Teddy Thierry</strong></td>
                <td>Coordination, retraitement entretiens</td>
                <td>~12h</td>
              </tr>
              <tr>
                <td><strong>Matthis Ruel</strong></td>
                <td>Cartographie SI</td>
                <td>2h</td>
              </tr>
              <tr>
                <td colSpan={2}><strong>Total</strong></td>
                <td><strong>~44h</strong></td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3>Ce qu&apos;on vous facture</h3>

        <p><strong>Phase 1 (Immersion + Formation J1)</strong></p>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Poste</th>
                <th>Montant</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Préparation (entretiens, immersion, cartographie)</td>
                <td>Inclus</td>
              </tr>
              <tr>
                <td>Formation 1 jour CODIR</td>
                <td>Inclus</td>
              </tr>
              <tr>
                <td>Suivi (restitution + call J+30)</td>
                <td>Inclus</td>
              </tr>
              <tr>
                <td><strong>Total</strong></td>
                <td><strong>9 000€ HT</strong></td>
              </tr>
            </tbody>
          </table>
        </div>

        <p><em>Option Qualiopi (Drakkar Académie) : 10 000€ HT</em></p>
        <p><em>Frais de déplacement facturés au réel.</em></p>

        <h3>Phase 2 (optionnel, après validation J1)</h3>

        <p>À définir ensemble après le J1.</p>

        <h3>Pourquoi ce prix</h3>

        <p>Nathan facture ses conférences IA 10 000€ l&apos;intervention. Thierry est Senior Industrial Architect chez Airbus. Ce ne sont pas des consultants juniors.</p>

        <div className="insight">
          <div className="insight-label">Notre logique</div>
          <p>C&apos;est un investissement dans une relation, pas une prestation isolée. On sait que si ça se passe bien, on travaillera ensemble sur la durée.</p>
        </div>
      </section>

      {/* Section 18 - Prochaine étape */}
      <section id="next">
        <div className="section-num">Section 18</div>
        <h2>Prochaine étape</h2>

        <p>Si cette lecture vous parle, passons à l&apos;étape suivante.</p>

        <div className="highlight">
          <p><strong>Réunion de cadrage</strong>, 1h</p>
          <ul style={{ marginBottom: 0 }}>
            <li>Valider le diagnostic (ce qu&apos;on a vu juste, ce qu&apos;on a raté)</li>
            <li>Répondre aux questions ouvertes</li>
            <li>Caler le planning des entretiens</li>
            <li>Go / No-Go</li>
          </ul>
        </div>

        <p><strong>On attend votre retour.</strong></p>

        <div className="signature">
          <div className="signature-header">
            <div className="signature-meta">
              <div className="signature-company">Drakkar Group</div>
              <div className="signature-date">08 décembre 2025</div>
            </div>
            <div className="signature-logo">
              <img src="/logos/logo_drakkar_noir.png" alt="Drakkar" />
            </div>
          </div>

          <div className="authors">
            <div className="author">
              <img src="/photos/teddy.jpg" alt="Teddy Music" className="author-photo" />
              <div className="author-info">
                <div className="author-name">Teddy Music</div>
                <div className="author-role">Responsable commercial</div>
                <div className="author-contact">
                  <a href="mailto:teddy.music@drakkar.io">teddy.music@drakkar.io</a>
                  <a href="tel:+33756288261">+33 7 56 28 82 61</a>
                </div>
              </div>
            </div>
            <div className="author">
              <img src="/photos/nathan.jpg" alt="Nathan Menard" className="author-photo" />
              <div className="author-info">
                <div className="author-name">Nathan Menard</div>
                <div className="author-role">CEO &amp; co-fondateur</div>
                <div className="author-contact">
                  <a href="mailto:nathan.menard@drakkar.io">nathan.menard@drakkar.io</a>
                  <a href="tel:+33651201858">+33 6 51 20 18 58</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
