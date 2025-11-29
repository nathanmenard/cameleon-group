import { WhyBlock } from "@/components/strategic-note";
import type { ClientConfig, TocItem } from "@/types";

export const clientConfig: ClientConfig = {
  id: "cameleon-group",
  name: "Cameleon Group",
  logo: "/logos/icon_drk.png",
  documentId: "cameleon-group-note",
};

export const tocItems: TocItem[] = [
  { id: "ambition", title: "Ambition", icon: "🎯" },
  { id: "forces", title: "Forces", icon: "💪" },
  { id: "faiblesses", title: "Faiblesses", icon: "⚠️" },
  { id: "opportunites", title: "Opportunités", icon: "🚀" },
  { id: "menaces", title: "Menaces", icon: "🔥" },
  { id: "architectures", title: "Architectures", icon: "🏗️" },
  { id: "roadmap", title: "Roadmap", icon: "📅" },
  { id: "next-steps", title: "Prochaines étapes", icon: "✅" },
];

export const noteTitle = "Feuille de route technologique";
export const noteSubtitle =
  "Vision stratégique et plan d'action pour la transformation digitale";

// Section content components
export function AmbitionSection() {
  return (
    <>
      <p className="text-lg leading-relaxed mb-6">
        <strong>Cameleon Group</strong> ambitionne de devenir le leader
        européen de la transformation digitale des PME industrielles, en
        proposant une plateforme unifiée qui simplifie la gestion des
        opérations, optimise les processus métier et accélère la prise de
        décision grâce à l&apos;intelligence artificielle.
      </p>

      <WhyBlock title="Pourquoi cette ambition ?">
        Dans un marché fragmenté où les PME industrielles peinent à digitaliser
        leurs processus, Cameleon Group a l&apos;opportunité unique de
        capitaliser sur son expertise terrain et sa connaissance fine des
        besoins clients pour proposer une solution véritablement adaptée.
      </WhyBlock>

      <div className="grid md:grid-cols-3 gap-6 mt-8">
        <div className="bg-gris-50 p-6 rounded-xl">
          <div className="text-3xl font-bold text-rouge mb-2">+45%</div>
          <div className="text-sm text-gris-600">
            Croissance visée sur 3 ans
          </div>
        </div>
        <div className="bg-gris-50 p-6 rounded-xl">
          <div className="text-3xl font-bold text-rouge mb-2">500+</div>
          <div className="text-sm text-gris-600">PME clientes cibles</div>
        </div>
        <div className="bg-gris-50 p-6 rounded-xl">
          <div className="text-3xl font-bold text-rouge mb-2">3</div>
          <div className="text-sm text-gris-600">Nouveaux marchés européens</div>
        </div>
      </div>
    </>
  );
}

export function ForcesSection() {
  return (
    <>
      <ul className="space-y-4">
        <li className="flex gap-3">
          <span className="text-rouge font-bold">→</span>
          <div>
            <strong>Expertise métier reconnue</strong> - 15 ans d&apos;expérience
            dans l&apos;accompagnement des PME industrielles
          </div>
        </li>
        <li className="flex gap-3">
          <span className="text-rouge font-bold">→</span>
          <div>
            <strong>Base clients fidèle</strong> - Taux de rétention de 94% sur
            les 3 dernières années
          </div>
        </li>
        <li className="flex gap-3">
          <span className="text-rouge font-bold">→</span>
          <div>
            <strong>Équipe technique solide</strong> - 25 ingénieurs expérimentés
            en développement produit
          </div>
        </li>
        <li className="flex gap-3">
          <span className="text-rouge font-bold">→</span>
          <div>
            <strong>Partenariats stratégiques</strong> - Intégrations avec les
            principaux ERP du marché
          </div>
        </li>
      </ul>

      <WhyBlock title="Pourquoi c'est important ?">
        Ces atouts constituent un avantage compétitif durable et difficilement
        réplicable par de nouveaux entrants. La combinaison expertise
        métier/technique est rare sur ce segment.
      </WhyBlock>
    </>
  );
}

export function FaiblessesSection() {
  return (
    <>
      <ul className="space-y-4">
        <li className="flex gap-3">
          <span className="text-orange-500 font-bold">⚡</span>
          <div>
            <strong>Dette technique</strong> - Architecture legacy qui freine
            l&apos;innovation produit
          </div>
        </li>
        <li className="flex gap-3">
          <span className="text-orange-500 font-bold">⚡</span>
          <div>
            <strong>Time-to-market</strong> - Cycles de développement trop longs
            (6-9 mois par feature majeure)
          </div>
        </li>
        <li className="flex gap-3">
          <span className="text-orange-500 font-bold">⚡</span>
          <div>
            <strong>Scalabilité</strong> - Infrastructure non optimisée pour une
            croissance x3
          </div>
        </li>
      </ul>

      <WhyBlock title="Plan d'action">
        Un programme de modernisation technique sur 18 mois permettra de
        résorber cette dette tout en maintenant la vélocité commerciale.
      </WhyBlock>
    </>
  );
}

export function OpportunitesSection() {
  return (
    <>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="border border-gris-200 rounded-xl p-6">
          <div className="text-2xl mb-3">🤖</div>
          <h4 className="font-semibold text-noir mb-2">IA & Automatisation</h4>
          <p className="text-sm text-gris-600">
            Intégrer des capacités d&apos;IA pour automatiser les tâches
            répétitives et améliorer la prise de décision
          </p>
        </div>
        <div className="border border-gris-200 rounded-xl p-6">
          <div className="text-2xl mb-3">🌍</div>
          <h4 className="font-semibold text-noir mb-2">Expansion européenne</h4>
          <p className="text-sm text-gris-600">
            Marchés allemand et espagnol sous-équipés en solutions adaptées aux
            PME
          </p>
        </div>
        <div className="border border-gris-200 rounded-xl p-6">
          <div className="text-2xl mb-3">📱</div>
          <h4 className="font-semibold text-noir mb-2">Mobile-first</h4>
          <p className="text-sm text-gris-600">
            Développer une expérience mobile native pour les opérateurs terrain
          </p>
        </div>
        <div className="border border-gris-200 rounded-xl p-6">
          <div className="text-2xl mb-3">🔗</div>
          <h4 className="font-semibold text-noir mb-2">API Economy</h4>
          <p className="text-sm text-gris-600">
            Ouvrir la plateforme via des APIs pour créer un écosystème de
            partenaires
          </p>
        </div>
      </div>
    </>
  );
}

export function MenacesSection() {
  return (
    <>
      <ul className="space-y-4">
        <li className="flex gap-3">
          <span className="text-rouge font-bold">🔴</span>
          <div>
            <strong>Concurrence SaaS</strong> - Arrivée de pure players
            américains avec des moyens importants
          </div>
        </li>
        <li className="flex gap-3">
          <span className="text-rouge font-bold">🔴</span>
          <div>
            <strong>Pénurie de talents</strong> - Difficulté à recruter des
            profils tech seniors
          </div>
        </li>
        <li className="flex gap-3">
          <span className="text-rouge font-bold">🔴</span>
          <div>
            <strong>Réglementation</strong> - Évolutions RGPD et NIS2 nécessitant
            des investissements compliance
          </div>
        </li>
      </ul>

      <WhyBlock title="Stratégie de mitigation">
        Une veille concurrentielle active et un programme de fidélisation des
        talents permettront de maintenir l&apos;avantage compétitif.
      </WhyBlock>
    </>
  );
}

export function ArchitecturesSection() {
  return (
    <>
      <p className="mb-6">
        L&apos;architecture cible repose sur une approche microservices avec les
        principes suivants :
      </p>

      <div className="bg-gris-50 rounded-xl p-6 font-mono text-sm overflow-x-auto">
        <pre className="text-gris-700">
          {`┌─────────────────────────────────────────────┐
│                   CLIENTS                    │
│  Web App │ Mobile App │ API Partners         │
└─────────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────┐
│              API GATEWAY                     │
│   Auth │ Rate Limiting │ Load Balancing     │
└─────────────────────────────────────────────┘
                      │
        ┌─────────────┼─────────────┐
        ▼             ▼             ▼
┌───────────┐ ┌───────────┐ ┌───────────┐
│  Service  │ │  Service  │ │  Service  │
│  Clients  │ │  Orders   │ │ Analytics │
└───────────┘ └───────────┘ └───────────┘
        │             │             │
        └─────────────┼─────────────┘
                      ▼
┌─────────────────────────────────────────────┐
│              DATA LAYER                      │
│   PostgreSQL │ Redis │ Elasticsearch        │
└─────────────────────────────────────────────┘`}
        </pre>
      </div>

      <WhyBlock title="Bénéfices attendus">
        Cette architecture permettra une scalabilité horizontale, une meilleure
        résilience et des déploiements indépendants par équipe.
      </WhyBlock>
    </>
  );
}

export function RoadmapSection() {
  return (
    <>
      <div className="space-y-6">
        <div className="relative pl-8 pb-8 border-l-2 border-rouge">
          <div className="absolute left-0 top-0 w-4 h-4 -translate-x-1/2 bg-rouge rounded-full" />
          <div className="font-semibold text-noir mb-1">T1 2025 - Fondations</div>
          <p className="text-sm text-gris-600">
            Migration infrastructure cloud, mise en place CI/CD, refactoring
            modules critiques
          </p>
        </div>

        <div className="relative pl-8 pb-8 border-l-2 border-gris-300">
          <div className="absolute left-0 top-0 w-4 h-4 -translate-x-1/2 bg-gris-300 rounded-full" />
          <div className="font-semibold text-noir mb-1">T2 2025 - API Platform</div>
          <p className="text-sm text-gris-600">
            Développement API publique, documentation, programme partenaires
            beta
          </p>
        </div>

        <div className="relative pl-8 pb-8 border-l-2 border-gris-300">
          <div className="absolute left-0 top-0 w-4 h-4 -translate-x-1/2 bg-gris-300 rounded-full" />
          <div className="font-semibold text-noir mb-1">T3 2025 - Mobile & IA</div>
          <p className="text-sm text-gris-600">
            Application mobile v1, premiers modules IA (prédiction, automatisation)
          </p>
        </div>

        <div className="relative pl-8 border-l-2 border-gris-300">
          <div className="absolute left-0 top-0 w-4 h-4 -translate-x-1/2 bg-gris-300 rounded-full" />
          <div className="font-semibold text-noir mb-1">T4 2025 - Expansion</div>
          <p className="text-sm text-gris-600">
            Lancement Allemagne, marketplace intégrations, analytics avancés
          </p>
        </div>
      </div>
    </>
  );
}

export function NextStepsSection() {
  return (
    <>
      <div className="bg-rouge/5 border border-rouge/20 rounded-xl p-6">
        <h4 className="font-semibold text-noir mb-4">
          Actions immédiates (30 jours)
        </h4>
        <ul className="space-y-3">
          <li className="flex items-start gap-3">
            <input
              type="checkbox"
              className="mt-1 w-4 h-4 rounded border-gris-300"
              disabled
            />
            <span>Valider le budget infrastructure cloud (estimation: 45k€/an)</span>
          </li>
          <li className="flex items-start gap-3">
            <input
              type="checkbox"
              className="mt-1 w-4 h-4 rounded border-gris-300"
              disabled
            />
            <span>Recruter un Tech Lead senior pour piloter la modernisation</span>
          </li>
          <li className="flex items-start gap-3">
            <input
              type="checkbox"
              className="mt-1 w-4 h-4 rounded border-gris-300"
              disabled
            />
            <span>Planifier les ateliers architecture avec les équipes</span>
          </li>
          <li className="flex items-start gap-3">
            <input
              type="checkbox"
              className="mt-1 w-4 h-4 rounded border-gris-300"
              disabled
            />
            <span>Définir les KPIs de succès du programme</span>
          </li>
        </ul>
      </div>

      <div className="mt-8 text-center">
        <p className="text-gris-600 mb-4">
          Des questions ? Besoin de précisions ?
        </p>
        <p className="font-semibold text-noir">
          Contactez l&apos;équipe Drakkar à{" "}
          <a
            href="mailto:contact@drakkar.io"
            className="text-rouge hover:underline"
          >
            contact@drakkar.io
          </a>
        </p>
      </div>
    </>
  );
}
