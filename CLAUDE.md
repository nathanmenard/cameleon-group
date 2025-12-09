# Cameleon Group - Notes de projet

## Branches

| Branche | Description | Déploiement |
|---------|-------------|-------------|
| `main` | V1 stable | VPS actuel (prod) |
| `v2` | Développement V2 | - |
| `clever-cloud-main` | V2 prête pour Clever Cloud | Clever Cloud (future prod) |

**IMPORTANT** : Ne jamais merger `clever-cloud-main` ou `v2` dans `main` sans validation explicite. La V1 est en production sur un autre VPS.

## Déploiement Clever Cloud

Le frontend est configuré pour Docker :
- `frontend/Dockerfile` : Build multi-stage optimisé
- `frontend/next.config.ts` : `output: "standalone"`
- Port : 8080

Pour déployer sur Clever Cloud, pusher la branche `clever-cloud-main`.

## Structure

- `/frontend` : Next.js 16 (React 19, Tailwind v4)
- `/backend` : Python FastAPI (commentaires - désactivé temporairement)
- `/docs` : Notes stratégiques clients (Markdown source)

## Clients

Les notes stratégiques sont accessibles via `/clients/[slug]` :
- `/clients/cameleon-group` : Note Cameleon Group
- `/clients/cronite` : Note Cronite Group

## Design System Drakkar

Le design system utilise des classes CSS custom dans `globals.css`.
Ne pas migrer vers Tailwind inline sans validation - le visual existant doit être préservé.
