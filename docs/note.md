# **NOTE STRATÉGIQUE**
## **Cameleon Group**

*Suite à notre échange du 17 novembre 2025*

---

## 1. Votre ambition — et ce qui la bloque

Après notre échange dans vos locaux, une chose est claire : vous ne cherchez pas à changer de logiciel. Vous cherchez à **structurer un groupe capable de croître par acquisition, de se déployer à l'international, et de se transmettre dans les meilleures conditions**.

Le digital n'est qu'un levier. Mais c'est un levier qui, aujourd'hui, vous bloque.

### La réalité du marché

Vous faites 50 millions d'euros. Votre concurrent principal en fait 500. Ce n'est pas qu'une question de taille — c'est une question de trajectoire.

Le marché de la PLV se consolide. Quand Chanel lance un produit monde, ils consultent ceux qui peuvent répondre monde. Pendant que vous vous battez avec des concurrents locaux, les gros se partagent les appels d'offres mondiaux. Chaque année qui passe creuse l'écart.

Votre chemin vers les 500M€ passe par la croissance externe. C'est logique : l'acquisition client est longue et coûteuse. Racheter un concurrent, c'est récupérer son portefeuille clients et mutualiser les coûts fixes. Vous l'avez déjà fait. Vous voulez continuer.

### Le blocage

Sauf que chaque croissance externe devient un cauchemar d'intégration. En théorie, 1 + 1 devrait égaler 2, voire plus. Dans les faits, c'est dans la douleur. L'expérience CCI l'a démontré. Chaque intégration devient un projet SI de plusieurs mois. Au lieu de créer de la valeur rapidement, vous passez des mois à refaire la plomberie.

Tant que vous n'avez pas un socle capable d'absorber rapidement une nouvelle entité, votre stratégie de croissance externe reste théorique.

### L'enjeu transmission

Et derrière la croissance, il y a la transmission. Les fonds d'investissement ont des grilles d'analyse. Un SI maison sur des technologies obsolètes déclenche des alertes : audit approfondi, risques de dépendance à des personnes clés, coûts de remise à niveau à provisionner, décote de valorisation.

Quinze ans de développements spécifiques WinDev et du Symfony 2 en production, c'est précisément ce qui fait clignoter les voyants rouges pendant une due diligence.

---

## 2. Ce qui fait votre force

Avant de parler de ce qui coince, il faut comprendre ce qui vous a amenés là où vous êtes — et qu'il ne faut surtout pas casser.

### Le positionnement 360, voire 365 avec le recyclage

Vos clients — Chanel, LVMH, Ferrero, Samsung — ne vous choisissent pas pour le prix. Ils vous choisissent parce que vous êtes l'un des rares acteurs capables de prendre en charge l'intégralité de la chaîne : conseil en merchandising, conception, fabrication (carton, métal, plastique), installation terrain, et maintenant recyclage avec Second Life.

Ce positionnement est difficile à répliquer. Il suppose de maîtriser des métiers très différents — une agence de design, une imprimerie, une usine de métallerie, une force d'installation terrain — et de les faire travailler ensemble.

### La réactivité comme ADN

Vos grands comptes sont exigeants et souvent désorganisés. Ils vous envoient des PO de plusieurs centaines de milliers d'euros avec pour seule instruction de vous débrouiller. Ils commandent depuis le global mais veulent facturer en local. Ils changent d'avis, ajoutent des contraintes, raccourcissent les délais.

Et vous dites oui.

Parce que quand vous avez mis dix ans à rentrer chez un client comme Chanel, vous ne faites pas le difficile. Cette capacité d'absorption de la complexité client est un avantage compétitif majeur.

### Les collections : le modèle à suivre

Vous avez trouvé un équilibre subtil entre standard et sur-mesure. Vos collections — Pop, Modulo, et les autres — sont des bases standardisées qui peuvent être personnalisées pour chaque client. La structure est standard, mais le produit fini n'est quasiment jamais standard. C'est toujours personnalisé.

C'est ce qui vous permet d'être réactifs sans sacrifier la rentabilité. La collection la plus ancienne a 21 ans et se vend encore tous les jours.

**Cette logique — un socle commun avec des adaptations périphériques — devrait inspirer votre architecture SI.**

---

## 3. Les causes profondes

Votre force historique — un SI qui s'adapte à tout et qui ne dit jamais non — est devenue votre principale vulnérabilité. Pour comprendre comment en sortir, il faut comprendre comment vous y êtes arrivés.

### Analyse des causes racines

Pour chaque symptôme que vous nous avez décrit, on a remonté le fil. Pas pour le plaisir de l'analyse — pour savoir où agir.

---

#### Pourquoi #1 — La croissance externe est bloquée

```
Symptôme : Chaque acquisition = projet SI de plusieurs mois

→ Parce qu'il faut refaire toute la plomberie à chaque fois
  → Parce qu'il n'existe pas de tronc commun où brancher une nouvelle entité
    → Parce que chaque entité a développé ses propres outils isolément
      → Parce que le SI ne dit jamais non depuis 15 ans
        → CAUSE RACINE : L'entreprise a priorisé la réactivité
          opérationnelle sur la cohérence architecturale.
          Le système s'est adapté au personnel, jamais l'inverse.
```

**Notre lecture** : Le succès historique de Cameleon repose sur une culture du "on va s'arranger". Cette culture, vertueuse commercialement, a généré une dette technique et organisationnelle qui atteint aujourd'hui son point de rupture. Ce qui vous a fait passer de 0 à 50M€ vous empêche de passer de 50 à 500M€.

---

#### Pourquoi #2 — Le pilotage manque de visibilité

```
Symptôme : Consolidation laborieuse, pas de vision temps réel

→ Parce qu'il faut aller chercher dans plusieurs systèmes et tout retraiter
  → Parce qu'il n'y a pas de référentiel unique (client, produit, projet)
    → Parce que chaque BU a sa propre définition de ces concepts
      → CAUSE RACINE : Absence de gouvernance de la donnée.
        Le groupe fonctionne comme 3 PME juxtaposées,
        pas comme une ETI intégrée.
```

**Notre lecture** : Le problème n'est pas technique. C'est un problème de définition partagée des concepts métier. Qu'est-ce qu'un "client" ? Un "projet" ? Une "affaire" ? Tant que ces définitions varient d'une entité à l'autre, aucun outil ne résoudra le problème.

---

#### Pourquoi #3 — Deux projets Odoo ont échoué

```
Symptôme : Deux tentatives, deux échecs. Méfiance généralisée.

→ Parce que les utilisateurs n'ont pas adopté l'outil
  → Parce qu'ils n'ont pas été consultés ni impliqués
    → Parce qu'on a voulu tout faire d'un coup (Big Bang)
      → Parce qu'on pensait que le problème était l'outil, pas l'organisation
        → CAUSE RACINE : Confusion entre "implémenter un ERP"
          et "transformer l'organisation".
          L'outil a été vu comme solution, pas comme levier.
```

**Notre lecture** : Les échecs Odoo ne sont pas des échecs d'Odoo. Ce sont des échecs de conduite du changement. Le système s'est adapté au personnel et non à l'inverse — et ce "choc" dont vous parliez n'a jamais été préparé. C'est pour ça que ça a échoué.

---

#### Pourquoi #4 — Le dilemme standardisation/flexibilité semble insoluble

```
Symptôme : Les commerciaux font leur "tambouille", les stats sont faussées

→ Parce que chaque commercial organise ses devis comme il veut
  → Parce que chaque client a des exigences de présentation différentes
    → Parce que Cameleon travaille avec des grands comptes qui imposent leurs standards
      → Parce que le positionnement commercial repose sur l'hyper-adaptation
        → CAUSE RACINE : La flexibilité commerciale EST l'avantage concurrentiel.
          La supprimer = perdre des clients.
          La question n'est pas "faut-il standardiser ?"
          mais "où placer le curseur ?"
```

**Les exemples que vous nous avez donnés :**
- Un commercial fait 1 devis avec 4 lignes, un autre fait 4 devis séparés pour la même situation → les stats de concrétisation sont faussées
- Les commerciaux démontent leurs prix pour les replanquer ailleurs (moins sur le design exposé à la concurrence, plus sur l'installation où le client n'a pas de référence)
- Un commercial a utilisé des quantités négatives pour faire disparaître des lignes

Et pourtant, PubliDécor montre qu'une standardisation forte est possible : ils ne donnent jamais le détail de leurs prix aux clients. Et ça marche.

**Notre lecture** : Cette question — où placer le curseur — n'a jamais fait l'objet d'une décision explicite. Elle est tranchée différemment selon qui décide, quel jour, avec quel client. C'est ça le vrai problème.

---

#### Pourquoi #5 — La dette technique est critique

```
Symptôme : Symfony 2 en production gère 6M€ d'activité

→ Parce que personne n'a osé lancer la migration
  → Parce qu'une tentative a été catastrophique
    → Parce que le code est enchevêtré avec la logique métier non documentée
      → Parce que le développement a été fait "en pompier" pendant des années
        → CAUSE RACINE : Absence de vision technique long terme.
          Le développement a toujours été piloté par l'urgence opérationnelle,
          pas par une roadmap architecturale.
```

**Notre lecture** : Ce n'est pas juste 6M€ qui sont exposés. Il y a des interdépendances : si ce système disparaît, vous risquez de perdre 10%, 20%, voire 30% sur d'autres activités. C'est une bombe à retardement.

---

### Cartographie systémique : les 6 domaines de friction

Ces causes racines ne sont pas isolées. Elles forment un système interconnecté :

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         STRATÉGIE D'ENTREPRISE                              │
│   • Croissance externe bloquée par le SI                                    │
│   • Ambition internationale (Europe 2030, Monde 2040)                       │
│   • Valorisation groupe compromise (due diligence)                          │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    ▼               ▼               ▼
┌──────────────────────────┐ ┌─────────────────┐ ┌──────────────────────────┐
│   DONNÉES & RÉFÉRENTIELS │ │    PROCESSUS    │ │       TECHNOLOGIE        │
│                          │ │                 │ │                          │
│ • Pas de référentiel     │ │ • Hétérogénéité │ │ • 9 outils isolés        │
│ • Client ≠ Client        │ │   des devis     │ │ • Symfony 2 critique     │
│ • Projet ≠ Projet        │ │ • BPM débranché │ │ • WinDev obsolète        │
│ • Pas de reporting       │ │ • 1000 projets/ │ │ • VPN = mobilité KO      │
│   consolidé fiable       │ │   an sans suivi │ │ • Pas d'API moderne      │
└──────────────────────────┘ └─────────────────┘ └──────────────────────────┘
                    │               │               │
                    └───────────────┼───────────────┘
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                            ORGANISATION & RH                                │
│   • Expertise WinDev = dépendance à des personnes clés                      │
│   • Pas de culture de documentation                                         │
│   • "On va s'arranger" = frein au changement                                │
│   • Commerciaux = coordinateurs malgré eux                                  │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                          RELATION CLIENT                                    │
│   • Clients grands comptes imposent leurs standards                         │
│   • Multiplication des plateformes de facturation                           │
│   • Exigence de sur-mesure croissante                                       │
│   • Passage série → customisation de masse                                  │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Lecture** : Chaque domaine impacte les autres. C'est pourquoi une approche "outil par outil" ne fonctionne pas.

---

### Matrice d'impact : Urgence vs Importance

| Enjeu | Urgence | Importance | Commentaire |
|-------|---------|------------|-------------|
| **Symfony 2 / Field** | CRITIQUE | Haute | Risque technique immédiat, 6M€ exposés |
| **Référentiel unique** | Haute | CRITIQUE | Pré-requis à tout projet d'unification |
| **Croissance externe** | Moyenne | CRITIQUE | Dépend de référentiel + architecture moderne |
| **Pilotage temps réel** | Haute | Haute | Dépend de référentiel + consolidation |
| **Standardisation devis** | Moyenne | Haute | Nécessite arbitrage stratégique |
| **International** | Basse | Haute | Dépend de tout le reste |

**Conclusion** : Le référentiel unique (qui est un client ? un projet ?) est le verrou central. Sans définition partagée, rien ne fonctionne durablement.

---

## 4. La question centrale

Lors de notre échange, Teddy a posé une question qui a provoqué un silence :

**"À partir de quel degré de standardisation des processus vous perdez un client ?"**

Alexandre a reconnu que cette discussion n'avait jamais vraiment eu lieu avec la direction commerciale.

C'est pourtant LA question structurante de tout le projet :
- Trop de standardisation → perte de flexibilité → perte de clients
- Pas assez de standardisation → impossibilité de piloter → croissance bloquée

**Cette discussion doit avoir lieu. C'est le premier objectif de la phase de conception.**

---

## 5. Ce qui ne change pas (et c'est important)

Toute transformation qui ignorerait vos fondamentaux serait vouée à l'échec.

| Ce qui ne change pas | Ce qui change |
|---------------------|---------------|
| Votre réactivité commerciale (vous dites oui) | La plomberie sous-jacente (invisible pour les clients) |
| Votre capacité à absorber la complexité client | Le pilotage groupe (vision consolidée, temps réel) |
| Vos 15-20 ans de connaissance métier | La capacité d'absorption (acquisitions en semaines, pas en mois) |
| Vos collections (Pop, Modulo, etc.) | La traçabilité (savoir ce qui a été chiffré vs vendu) |
| Vos relations clients | La mobilité (plus de VPN, accès simple) |
| Votre positionnement 365 | + d'expertises avec la croissance externe devenue possible |

---

## 6. L'architecture : notre recommandation

### Trois approches possibles

| Option | Principe | Notre avis |
|--------|----------|------------|
| **A — Tout dans un ERP** | Un seul outil (Odoo, SAP...) qui fait tout | **NON.** Votre métier est trop spécifique. Le Field Manager, les chiffrages complexes, les collections — ça ne rentre pas dans un ERP standard. C'est ce qui a échoué deux fois. |
| **B — Data Warehouse seul** | On connecte tout à un cerveau central pour piloter | **Utile, mais insuffisant.** Ça donne la visibilité, mais ça ne refait pas le Field Manager (Symfony 2), ça ne crée pas de référentiel unique, ça ne simplifie pas les acquisitions. |
| **C — Tronc commun + outils métiers + système nerveux** | Un socle central (commerce, référentiel) + des outils métiers spécialisés + un DWH pour piloter | **NOTRE RECOMMANDATION.** C'est votre modèle collections appliqué au SI : structure standard, habillage personnalisé. |

### L'option C en image

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           GROUP MANAGER                                     │
│        Référentiel unique • Cycle commercial • Pilotage groupe              │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
        ┌───────────┬───────────────┼───────────────┬───────────┐
        ▼           ▼               ▼               ▼           ▼
     THINK      FACTORY         FIELD          PRINT       SYSTÈME
    MANAGER     MANAGER        MANAGER        & METAL      NERVEUX
   (existant)  (existant)    (à refondre)   (existant)   (consolide)
```

C'est exactement comme vos collections Pop ou Modulo : un socle commun qui structure, des adaptations métier qui préservent ce qui fait votre force.

### Ce qu'on sait — et ce qu'on doit valider ensemble

**Ce qu'on sait :**
- La direction est claire (Option C)
- Le Field Manager (Symfony 2) est une urgence technique — à traiter indépendamment du reste
- Il faut un système nerveux pour piloter en temps réel

**Ce qu'on doit valider en conception :**

| Question | Pourquoi c'est important |
|----------|-------------------------|
| **Odoo ou autre chose pour le Group Manager ?** | Odoo est une piste sérieuse, mais vos devis complexes et votre "tambouille commerciale" rentrent-ils dedans ? On doit voir vos cas réels. |
| **Les outils existants sont-ils connectables ?** | S'ils exposent des APIs, on peut construire le système nerveux rapidement. Sinon, c'est un chantier en soi. |
| **Portails clients / sous-traitants ?** | Chanel/LVMH ont-ils besoin de suivre leurs projets en ligne ? Vos 600 sous-traitants Field ont-ils besoin d'un portail dédié ? |
| **Quelle stratégie de bascule ?** | Ça dépend de vos contraintes (périodes creuses, interdépendances, tolérance au risque). |

### Sur Odoo : notre position

On implémente Odoo depuis des années. On connaît ses forces — et ses limites.

Votre Field Manager (600 sous-traitants, géoloc, pointage terrain) ? Ce n'est pas ce qu'Odoo fait bien. Forcer ça dans un module Odoo customisé = reproduire l'échec.

Vos devis hyper-complexes avec des règles métier évolutives ? On ne sait pas encore si Odoo peut les gérer. **C'est pourquoi on propose de le valider en conception.**

**Si on découvre qu'Odoo n'est pas adapté, on vous le dira — et on construira autrement.** On n'est pas là pour vendre Odoo. On est là pour trouver ce qui marche.

### Principe de bascule non négociable

On ne coupe jamais un système qui fonctionne avant que le nouveau ait fait ses preuves.

Concrètement :
- L'ancien et le nouveau coexistent pendant la transition
- Bascule progressive par périmètre
- Pas de Big Bang

Les modalités exactes (synchronisation, cut-over, double saisie temporaire) dépendent de vos contraintes réelles. **C'est ce qu'on déterminera en conception.**

---

## 7. Qui on est (et pourquoi on peut le faire)

### Pourquoi l'option C nécessite un partenaire différent

**Un intégrateur ERP classique** va pousser l'option A. C'est son métier : configurer un ERP, former les utilisateurs, facturer des jours de paramétrage. Quand ça ne rentre pas dans l'ERP, il dit "c'est un développement spécifique" — et soit il le fait mal, soit il le sous-traite.

**Une agence de développement classique** va pousser du full custom. C'est son métier : coder des applications. Mais elle ne connaît pas les ERP, les contraintes comptables, les flux multi-entités.

**Un cabinet de conseil classique** va vous faire de beaux slides. Mais il ne sait pas exécuter. Il vous laisse avec un PowerPoint et vous dit "trouvez un intégrateur".

### Ce que Drakkar apporte

**Trois pôles intégrés :**

| Pôle | Expertise | Pour Cameleon |
|------|-----------|---------------|
| **Accélérateur** | ERP, Odoo, process | Group Manager |
| **Studio** | Dev sur-mesure, web, mobile, APIs | Field Manager v2, spécificités |
| **IA** | Data, automatisation, pilotage | Système nerveux, consolidation |

**Un regard industriel :**

Thierry Ménard, associé Drakkar, est Head of Manufacturing chez Airbus. 30 ans d'expérience sur les sujets qui vous concernent : intégration d'entités acquises, montée en cadence, pilotage multi-sites. Ce n'est pas de la théorie — c'est du vécu.

**Un focus PME/ETI :**

On ne travaille pas avec les grands comptes du CAC40 qui ont des budgets illimités. On travaille avec des structures comme la vôtre : entreprises en croissance, contraintes réelles, transformation sans arrêter la production.

---

## 8. L'approche : Zones de liberté

Pour résoudre le dilemme standardisation/flexibilité, on propose de définir ensemble une matrice :

| Zone | Liberté | Exemples |
|------|---------|----------|
| **ROUGE** | Aucune | Référentiel client unique, facturation comptable, données consolidées |
| **ORANGE** | Encadrée | Construction devis (liberté dans un cadre), manipulation prix (tracée) |
| **VERT** | Totale | Présentation commerciale, argumentation, organisation personnelle |

**Le principe** : Les commerciaux acceptent la contrainte si l'exception reste possible.

**Mécanisme concret** : En principe le process c'est X. Mais si un commercial a besoin d'une exception, il peut la demander en 3 clics. C'est tracé, validé rapidement, et analysé. Si 10 commerciaux demandent la même exception, on ajuste la règle.

C'est exactement comme vos collections : un socle commun + des adaptations.

**Cette matrice sera définie avec vous — pas par nous.**

---

## 9. Ce qu'on propose : Phase de conception (deux volets en parallèle)

On ne peut pas tout faire en séquentiel. Le commerce est le cœur du sujet, mais l'urgence technique (Field Manager, outils legacy) ne peut pas attendre.

**On propose deux volets qui avancent en parallèle :**

```
┌─────────────────────────────────────┐  ┌─────────────────────────────────────┐
│  VOLET 1 — COMMERCE                 │  │  VOLET 2 — AUDIT TECHNIQUE          │
│  (Drakkar Accélérateur)             │  │  (Drakkar Studio)                   │
│                                     │  │                                     │
│  • Cycle commercial                 │  │  • État des outils existants        │
│  • Modèle de données                │  │  • Connectabilité (APIs, bases)     │
│  • Question Odoo                    │  │  • Diagnostic Field Manager         │
│  • Matrice ROUGE/ORANGE/VERT        │  │  • Risques et dépendances           │
└─────────────────────────────────────┘  └─────────────────────────────────────┘
                          │                              │
                          └──────────────┬───────────────┘
                                         ▼
                          ┌─────────────────────────────────────┐
                          │  SYNTHÈSE & RECOMMANDATIONS         │
                          │                                     │
                          │  • Architecture cible validée       │
                          │  • Roadmap par vagues               │
                          │  • Plan Field Manager               │
                          │  • Budget et planning               │
                          └─────────────────────────────────────┘
```

---

### Volet 1 — Commerce (Drakkar Accélérateur)

**Pourquoi le commerce**

Un référentiel client n'est pas une couche technique neutre. C'est une modélisation métier. Un "Client" chez Cameleon, c'est quoi ? Chanel Global ? Chanel France ? Le chef de projet Chanel qui passe la commande ?

On ne le saura qu'en travaillant sur le commerce, pas en faisant des ateliers abstraits.

**Ce qu'on va faire**

| Étape | Contenu |
|-------|---------|
| **Rencontrer vos équipes** | Nicolas + direction commerciale (atelier ROUGE/ORANGE/VERT), 2-3 commerciaux seniors, 1-2 chefs de projet/chiffreurs, Alexandre |
| **Analyser vos flux** | Exemples réels de devis (simples et complexes), commandes Chanel/LVMH, le fameux fichier Excel de chiffrage |
| **Tester Odoo** | Confronter vos cas réels à Odoo. Qu'est-ce qui rentre ? Qu'est-ce qui nécessite du custom ? |

**Ce qu'on a besoin de comprendre avant de démarrer**

| Question | Impact sur le cadrage |
|----------|----------------------|
| **Combien de devis/mois ? Quelle répartition simple vs complexe ?** | Dimensionne l'effort de modélisation. 80% de devis simples ≠ 80% de devis complexes. |
| **Le fichier Excel de chiffrage — c'est un outil de 2 personnes ou de 15 ?** | Si c'est central, c'est un sujet en soi. Si c'est périphérique, on peut le traiter plus tard. |
| **PubliDécor ne donne jamais le détail des prix. Pourquoi ça passe là-bas et pas ailleurs ?** | Pour comprendre si c'est une question de client, de commercial, ou de culture. |
| **Qui sont les 2-3 commerciaux qu'il faut absolument embarquer pour que ça prenne ?** | On ne veut pas les "gentils". On veut ceux qui vont challenger. |
| **Y a-t-il eu des départs ou des tensions lors des précédentes tentatives Odoo ?** | Pour calibrer la conduite du changement. |

**Livrables**

- Cartographie du cycle commercial (du brief à la facture)
- Matrice ROUGE/ORANGE/VERT validée
- Modèle de données commercial (définitions partagées)
- Analyse Odoo argumentée (pas une opinion — des faits)
- Recommandation architecture Group Manager

---

### Volet 2 — Audit technique (Drakkar Studio)

**Pourquoi en parallèle**

Le Field Manager (Symfony 2) est une bombe à retardement. On ne peut pas attendre la fin de la conception commerce pour comprendre l'état réel de vos outils.

Et pour savoir si le "système nerveux" (Data Warehouse) est un quick win ou un chantier, il faut savoir si les outils existants sont connectables.

**Ce qu'on va faire**

| Étape | Contenu |
|-------|---------|
| **Audit Field Manager** | État du code, dépendances, risques. Refonte complète ou migration progressive ? |
| **Cartographie outils** | Cameleon Manager (WinDev), Think Manager, Factory Manager, Publi Manager — qu'est-ce qui expose des données ? APIs ? Bases accessibles ? |
| **Test de connectabilité** | Peut-on extraire les données automatiquement ? Ou faut-il tout refaire ? |

**Ce qu'on a besoin de comprendre avant de démarrer**

| Question | Impact sur le cadrage |
|----------|----------------------|
| **Qui maintient le Field Manager aujourd'hui ? Une personne ? Plusieurs ?** | Risque homme-clé. Si c'est une personne, l'urgence est différente. |
| **Il y a de la documentation ? Des tests automatisés ?** | Change complètement l'estimation de la refonte. |
| **Si le Field Manager tombe demain matin, c'est quoi le plan B ?** | Pour mesurer le niveau de criticité réel, pas perçu. |
| **Les outils WinDev — qui a accès au code source ? C'est versionné ?** | Même question : dépendance, réversibilité. |
| **Il y a déjà eu des tentatives de connexion entre outils ? Ça a donné quoi ?** | Pour ne pas refaire ce qui a déjà échoué. |
| **Vous avez des périodes creuses où on peut intervenir sur les systèmes ?** | Contraintes de planning réelles. |

**Livrables**

- Diagnostic Field Manager (état, risques, recommandation)
- Cartographie technique des outils existants
- Évaluation de connectabilité (système nerveux faisable rapidement ou pas)
- Recommandation stack et planning pour Field Manager v2

---

### Ce qu'on attend avant de chiffrer précisément

On peut vous donner une enveloppe aujourd'hui. Mais pour un chiffrage précis des deux volets, on a besoin de :

- [ ] Réponses aux questions ci-dessus
- [ ] Accès à 2-3 exemples de devis (simple, complexe, cas limite)
- [ ] 1h avec la personne qui maintient le Field Manager
- [ ] Liste des outils avec qui les utilise / qui les maintient

---

### À l'issue de la conception

Vous aurez :
- Une réponse claire sur Odoo (oui/non/partiellement, et pourquoi)
- Une réponse claire sur le Field Manager (refonte, planning, stack)
- Une architecture validée
- Une roadmap par vagues avec premier périmètre identifié
- Un budget réaliste pour la suite
- Une base factuelle pour décider Go / No-Go

---

## 10. Après la conception : la mise en œuvre

Si la conception valide l'approche, voici comment ça se passerait.

### L'approche : agile, inspirée de Scrum

On s'inspire des méthodes agiles (Scrum) adaptées à la transformation SI :

```
┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐    ┌──────────────┐
│ PROCESS/PLANNING │ →  │      BUILD       │ →  │      REVIEW      │ →  │    RETRO     │
│   (2-10 jours)   │    │  (2-8 semaines)  │    │   (2-3 jours)    │    │ (1/2 journée)│
│                  │    │                  │    │                  │    │              │
│ Deep dive process│    │ Développement    │    │ Démo métier      │    │ Ce qui a     │
│ Backlog priori-  │    │ Points hebdo     │    │ Tests users      │    │   marché     │
│   sation         │    │ Intégration      │    │ Validation       │    │ Ce qu'on     │
│ Definition of    │    │   continue       │    │ Go/No-Go         │    │   améliore   │
│   Done           │    │                  │    │                  │    │              │
└──────────────────┘    └──────────────────┘    └──────────────────┘    └──────────────┘
```

**Si le build dépasse 2 semaines** → sprints intermédiaires avec démos pour garder le rythme et détecter les problèmes tôt.

**Les principes clés :**
- **Deep dive process avant de coder** : on comprend le métier, on définit les critères de validation
- **Démos régulières** : du concret, pas des slides — validation ou ajustements
- **Rétrospective** : on apprend et on améliore à chaque cycle
- **Réversibilité** : on peut ajuster sans tout remettre en cause

**Ce qu'on mesure** : pas "% d'avancement", mais ce qui compte — votre capacité à intégrer une acquisition rapidement.

### Pourquoi ça marchera cette fois

| Ce qui a foiré avant | Ce qu'on fait différemment |
|---------------------|---------------------------|
| Big Bang | Transformation progressive, lot par lot |
| Outil imposé | Co-construit avec les utilisateurs |
| Formation théorique 6 mois avant | Formation juste-à-temps sur cas réels |
| Pas de pilote | Pilote systématique avant généralisation |
| Consultants qui repartent | Key users internes qui portent le projet |
| "Débrouillez-vous" après Go Live | Support renforcé les premières semaines |

### M&A Ready : le fil rouge, pas une vague

On a posé dès le départ que l'enjeu c'est la croissance externe. Pourtant, on ne peut pas vous promettre aujourd'hui une "vague M&A Ready" bien ficelée. **On ne sait pas encore ce qu'il faut construire pour que vous puissiez intégrer une acquisition en semaines.**

**Ce qu'on sait :**
- Aujourd'hui, chaque acquisition = projet SI de plusieurs mois
- L'objectif = réduire ça drastiquement

**Ce qu'on ne sait pas encore :**
- Quels sont les vrais points de friction lors d'une intégration ? (Référentiel client ? Comptabilité ? Outils terrain ?)
- Qu'est-ce qui doit être "prêt" côté Cameleon pour absorber une nouvelle entité ?
- Quelle est la cible réaliste : 2 semaines ? 2 mois ? Ça dépend de quoi ?

**Questions pour l'échange :**

| Question | Pourquoi on la pose |
|----------|---------------------|
| **Lors de l'intégration CCI, qu'est-ce qui a pris le plus de temps ?** | Pour identifier les vrais goulots d'étranglement — pas ceux qu'on imagine |
| **Si vous rachetiez une boîte demain, qu'est-ce qui devrait être en place côté Cameleon pour que ça se passe bien ?** | Pour définir ensemble ce que "M&A Ready" veut dire concrètement |
| **Quel est le profil type de vos cibles d'acquisition ?** | Une PME locale avec un Excel ≠ une ETI avec son propre ERP. Les prérequis changent. |
| **Qu'est-ce qu'un fonds regarderait en premier dans une due diligence SI ?** | Pour prioriser ce qui impacte la valorisation |
| **Accepteriez-vous qu'une acquisition garde temporairement ses outils, connectés au système nerveux ?** | Ça change complètement l'architecture cible |

### Les vagues : une hypothèse de travail

| Vague | Périmètre | Contribution M&A |
|-------|-----------|------------------|
| **1 — Commerce** | Group Manager MVP, workflow devis → commande, référentiel client unifié | *À définir : qu'est-ce que ça débloque pour une acquisition ?* |
| **2 — Pilotage** | Système nerveux connecté, dashboards groupe, traçabilité chiffré vs vendu | *À définir : une nouvelle entité peut-elle être "branchée" facilement ?* |
| **3 — ?** | *À définir en conception* | *À définir* |

**+ En parallèle : Field Manager v2** — chantier séparé, piloté par Drakkar Studio.

**Le séquencement final dépendra de vos réponses à ces questions.**

---

## 11. Ce qu'on attend de vous

La transformation, c'est 50% nous, 50% vous.

- **Sponsor direction visible** : Nicolas présent aux moments clés, qui tranche quand il faut trancher
- **Disponibilité des personnes clés** : les commerciaux, chefs de projet, Alexandre — pas 5 minutes entre deux réunions, du vrai temps
- **Accès aux outils et aux données** : les vrais devis, les vrais outils, pas une version aseptisée
- **Décisions tranchées** : quand on pose une question structurante (ROUGE ou ORANGE ?), une réponse — pas "on verra plus tard"
- **Transparence sur les échecs passés** : ce qui a vraiment foiré, pourquoi, pour ne pas répéter

---

## 12. Prochaine étape

Cette note est notre compréhension de vos enjeux après notre rencontre.

**Si cette lecture vous parle**, proposons un point pour :
- Valider le périmètre des deux volets (commerce + audit technique)
- Cadrer précisément le budget et le planning
- Identifier les personnes à mobiliser de votre côté

On ne vous demande pas de signer un projet de 18 mois. On vous propose quelques semaines pour **décider ensemble** si ça a du sens — et si oui, par quoi commencer.

La seule chose qu'on ne peut pas se permettre, c'est de se planter. On est d'accord là-dessus.

---

**Drakkar**
Nathan Ménard, Teddy Thierry

*25 novembre 2025*
