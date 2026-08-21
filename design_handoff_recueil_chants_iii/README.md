# Handoff — Recueil de Chants III (application mobile)

**Auteur du recueil :** TCHINDEBBE Charles · **Édition :** troisième, 2025 · **Contenu :** 302 cantiques + 85 chœurs
**Dépôt cible :** `georgesmfee4/recueilDeChants3` (branche `main`) — vide au moment de la remise.
**Marque :** Recueil de Chants III · violet royal `#4E2A84` · Newsreader + Archivo.

---

## 1. Objectif

Reconstruire **à l'identique** (pixel près) l'application dessinée dans ce dossier, en **Expo + React Native + TypeScript**, avec :

1. la meilleure architecture possible (voir `01-ARCHITECTURE.md`) ;
2. les **mises à jour OTA** opérationnelles dès le premier build (voir `05-OTA-EAS-UPDATE.md`) ;
3. le projet **connecté à GitHub** avec intégration continue (voir `06-GITHUB-CI.md`).

Ordre de lecture conseillé : ce README → `01-ARCHITECTURE.md` → `02-ECRANS.md` → `03-COMPOSANTS-ET-MOUVEMENT.md` → `04-DONNEES.md` → `05-OTA-EAS-UPDATE.md` → `06-GITHUB-CI.md` → `07-CHECKLIST-PIXEL.md`.

## 2. Nature des fichiers de ce dossier

Les fichiers de `references/` sont des **références de conception écrites en HTML** : des prototypes qui montrent l'apparence et le comportement attendus. **Ce n'est pas du code de production à copier.** Le travail consiste à **recréer ces écrans dans l'environnement cible** (Expo / React Native / TypeScript) avec ses propres conventions — composants natifs, `StyleSheet`, navigation, listes virtualisées.

| Fichier | Rôle |
| --- | --- |
| **`references/Recueil de Chants III (hors ligne).html`** | **À ouvrir en premier.** Fichier unique, autonome : les 11 écrans interactifs + le design system, polices et données incluses. Double-clic, aucun serveur, aucune connexion nécessaire. |
| **`references/Logo Recueil de Chants III (hors ligne).html`** | Idem pour la planche d'identité (marque, icône, variantes, règles). |
| `references/Recueil de Chants III.dc.html` | Source du prototype (à ouvrir avec `support.js`, `recueil-iii-global.js` et `recueil-iii-data.js` dans le même dossier) |
| `references/Logo Recueil de Chants III.dc.html` | Source de la planche d'identité |
| `data/recueil-iii.json` | **Les données réelles à embarquer** dans l'application (schéma en `04-DONNEES.md`) |
| `assets/icon-1024.png` | Icône d'application prête (1024×1024, sans transparence) |
| `assets/adaptive-icon-foreground-1024.png` | Avant-plan de l'icône adaptative Android |
| `assets/logo-edition-ii-source.png` | Logo de l'Édition II fourni par l'auteur — la version III en dérive (chiffre et couleur) |
| `tokens.ts` | Jetons de design prêts à déposer dans le projet |

Les deux fichiers « hors ligne » sont la référence visuelle : ils contiennent les polices Newsreader et Archivo et les 302 cantiques, et s'affichent à l'identique sur n'importe quelle machine. Les `.dc.html` ne servent qu'à relire la structure du prototype.

## 3. Fidélité

**Haute fidélité (hifi).** Couleurs, typographie, échelles, marges, filets, états et animations sont définitifs. Il faut les reproduire au pixel — pas les réinterpréter avec une bibliothèque de composants. Aucune ombre, aucun coin arrondi (sauf la pilule de navigation et l'icône), aucun dégradé : ce sont des choix structurants, leur suppression change le produit.

**Contexte de conception :** maquettes calibrées sur **390 × 844 pt** (iPhone 14/15/16 non Plus, densité 3×). Toutes les valeurs de ce dossier sont en **points logiques (dp/pt)**, pas en pixels physiques.

## 4. Identité de marque

| Élément | Valeur |
| --- | --- |
| Nom | Recueil de Chants (jamais « Recueil de Cantiques ») |
| Mention d'édition | « Troisième édition » / `TROISIÈME ÉDITION` en capitales espacées |
| Couleur principale | Violet royal `#4E2A84` |
| Couleur de reliure | `#381E63` (dos du livre, états pressés) |
| Accent | Or `#F0C069` — pastille du numéro, filets de refrain, filets de marque. Identique en clair et en sombre. |
| Logo | Livre relié vertical, dos plus foncé à gauche, pastille or au coin supérieur droit portant `III`, filets or au-dessus et au-dessous du titre, note de musique or en bas |
| Règles logo | Zone de respect = largeur du dos ; la pastille ne se recadre jamais ; trois couleurs de couverture autorisées (violet royal, papier, encre) ; jamais d'ombre ni de dégradé |

Le logo doit être **redessiné en SVG** dans l'application (`react-native-svg`) pour l'écran de lancement et l'écran À propos — géométrie exacte dans `03-COMPOSANTS-ET-MOUVEMENT.md § Logo`.

## 5. Jetons de design

Le fichier `tokens.ts` est la source de vérité ; tableau de contrôle ci-dessous.

### Couleurs — mode clair

| Jeton | Hex | Usage |
| --- | --- | --- |
| `ink` | `#17131F` | Paroles, titres, valeurs |
| `ink2` | `#5A5566` | Textes secondaires, libellés de lignes |
| `ink3` | `#6E687C` | Métadonnées, surtitres, indices (contraste 5,1:1 — ne pas éclaircir) |
| `paper` | `#FBFAF7` | Fond de tous les écrans |
| `surf` | `#FFFFFF` | Surfaces posées sur le papier |
| `surf2` | `#F5F2EC` | Bloc d'aperçu des réglages |
| `rule` | `#E4DFD6` | Filet 1 px structurant |
| `ruleSoft` | `#F0ECE4` | Filet 1 px de séparation de lignes |
| `pri` | `#4E2A84` | Chiffres, actions, onglet actif |
| `priDeep` | `#381E63` | Survol / pression du primaire |
| `priSoft` | `#F3EEFB` | Surlignage de résultat, pression de ligne |
| `onPri` | `#FFFFFF` | Texte sur violet |
| `or` | `#F0C069` | Accent de marque |
| `blur` | `rgba(251,250,247,0.90)` | Fond de la pilule et des capsules (avec flou) |

### Couleurs — mode sombre

| Jeton | Hex |
| --- | --- |
| `ink` | `#F5F2F8` |
| `ink2` | `#ADA5BB` |
| `ink3` | `#8B8399` (contraste 5,2:1) |
| `paper` | `#141019` |
| `surf` | `#1C1626` |
| `surf2` | `#1F1829` |
| `rule` | `#2C2439` |
| `ruleSoft` | `#221B2E` |
| `pri` | `#B79AE6` |
| `priDeep` | `#C9B2F0` |
| `priSoft` | `#251D36` |
| `onPri` | `#1A1424` |
| `or` | `#F0C069` |
| `blur` | `rgba(20,16,25,0.86)` |

### Typographie

Deux familles, une règle : **Newsreader pour le recueil** (chiffres, titres de chants, paroles), **Archivo pour l'application** (libellés, réglages, index). Jamais l'inverse.

| Rôle | Famille | Taille / interligne / interlettrage |
| --- | --- | --- |
| Une d'accueil | Newsreader 400 | 44 / 0,98 / −1,6 |
| Titre d'écran | Newsreader 400 | 34 / 1,0 / −1,0 |
| Numéro de chant (lecture) | Newsreader 400 | 56 / 0,88 / −2,4 |
| Numéro du chant du jour | Newsreader 400 | 64 / 0,82 / −3,0 |
| Titre de chant (lecture) | Newsreader 400 | 22 / 1,24 / +0,3 |
| Paroles | Newsreader 400 | 19,5 (réglable 16,5 / 18 / 19,5 / 21 / 23) / 1,64 (réglable 1,48 / 1,64 / 1,84) |
| Refrain | Newsreader 400 *italique* | même taille et interligne que les paroles, centré |
| Numéro de strophe (marge) | Newsreader 400 | 12,5 / +0,5 · couleur `pri` |
| Numéro d'index | Newsreader 400 | 22 (15 si l'option « numéros géants » est désactivée) |
| Titre d'index | Archivo 600 | 12,5 / 1,34 / +0,4 — **capitales du recueil, verbatim** |
| Sous-ligne d'index | Newsreader 400 | 13 / 1,4 · couleur `ink3` |
| Libellé de réglage | Archivo 500 | 14 |
| Aide de réglage | Archivo 400 | 11,5 · couleur `ink3` |
| Surtitre | Archivo 600 | 10 / +2,0 · capitales · `ink3` |
| Titre courant (lecture) | Archivo 600 | 10,5 / +1,8 · capitales · `ink3` |
| Métadonnée de pied | Archivo 400 | 10,5 / +1,4 · capitales · `ink3` |

Polices : `Newsreader` (400, 500, 600 + italique 400) et `Archivo` (400, 500, 600, 700), embarquées avec `expo-font` — **pas** de chargement réseau, l'application fonctionne hors connexion.

### Espacements et grille

Base 4. Échelle utilisée : 4 · 8 · 14 · 22 · 34.

| Mesure | Valeur |
| --- | --- |
| Marge latérale d'écran | 28 |
| Marge de la colonne de lecture | 30 (symétrique, obligatoire) |
| Marge gauche de la liste des cantiques | 14 (numéros débordant dans la marge) |
| Marge droite de la liste | 42 (rail des dizaines) |
| Hauteur de barre d'état | 50 |
| Hauteur de ligne d'index | ~62 (padding vertical 14 + contenu) |
| Cible tactile minimale | 46 |
| Rayon | 0 partout — sauf pilule de navigation 100 et icône d'application |
| Filet | 1 px `rule` ou `ruleSoft`, jamais d'ombre |

## 6. Les 11 écrans

| # | Écran | Rôle |
| --- | --- | --- |
| 01 | Lancement | Ouverture du livre, marque sur violet plein |
| 02 | Accueil | Une éditoriale : reprendre, chant du jour, trois accès |
| 03 | Cantiques | Index des 302 chants, par numéro ou A→Z, rail des dizaines |
| 04 | Lecture | Colonne unique en défilement vertical continu |
| 05 | Lecture · nuit | Même écran, encre inversée |
| 06 | Chœurs | 85 chœurs classés par lettre |
| 07 | Recherche | Titres et paroles, insensible aux accents, détection de numéro |
| 08 | Aller à un chant | Clavier de numéros en feuille inférieure |
| 09 | Favoris | Chants gardés |
| 10 | Réglages | Taille, thème, interligne, options, hors connexion |
| 11 | À propos | Colophon en trois sections |

Spécifications détaillées, mesure par mesure : **`02-ECRANS.md`**.

## 7. Navigation

**Pilule flottante** centrée en bas, à 24 du bord : `[Accueil] [Cantiques] (Recherche) [Chœurs] [Favoris]`.

- Conteneur : padding 8, rayon 100, fond `blur` + flou 16, filet 1 px `rule`, **aucune ombre**.
- Onglets : 46 × 46, icône 19, point de 3 px sous l'icône active (couleur `pri`), inactif `ink3`.
- Recherche : cercle 54 plein `pri`, icône 21 `onPri`, au centre exact de la pilule.
- **La pilule disparaît en lecture** et à l'écran À propos. En lecture elle est remplacée par une capsule : `[‹ numéro précédent] [# numéro courant] [numéro suivant ›]`.
- Réglages et Favoris sont aussi accessibles depuis les deux boutons d'en-tête de l'accueil.

## 8. Comportements clés

1. **Lecture = défilement vertical**, une seule colonne, aucune pagination, aucun geste horizontal. Le changement de chant remet le défilement en haut.
2. **Aller à un chant** est disponible depuis la liste, les chœurs, la lecture (bouton numéro de la capsule) et la feuille ⋯. Clavier 3 × 4, maximum 3 chiffres, titre résolu en direct, `OK` en violet.
3. **Recherche** : normalisation `NFD` + suppression des diacritiques, recherche dans le titre puis dans les paroles, 7 résultats maximum, extrait avec le terme surligné (`pri` sur `priSoft`). Une saisie de 1 à 3 chiffres propose en tête « aller directement au chant ».
4. **Favoris** : bascule depuis l'en-tête de lecture (signet plein / vide) ou la feuille ⋯ ; liste triée par numéro ; état vide rédigé.
5. **Réglages en direct** : chaque réglage modifie immédiatement le bloc d'aperçu **et** les écrans de lecture (taille 5 crans, interligne 3 crans, numéros de strophe, refrain en italique, écran allumé, thème clair/sombre/système).
6. **Titres verbatim** : les titres s'affichent exactement comme dans le recueil, en capitales, accents compris ou absents comme dans la source. Ne jamais « corriger » la casse.
7. **Sous-ligne d'index** : première ligne de paroles **différente** du titre ; si toutes les lignes reprennent le titre, afficher la structure (« 5 strophes · refrain »).
8. **Structure d'un chant** : `n strophes · refrain` ; si le recueil ne numérote pas les strophes (72 chants), afficher `n strophes · sans numéro` — **jamais « 0 strophe »**.

## 9. État applicatif

| État | Portée | Persistance |
| --- | --- | --- |
| `favoris: number[]` | global | oui |
| `dernierChant: { n: number, offset: number }` | global | oui (alimente « Reprendre » sur l'accueil) |
| `prefs.theme: 'Clair' \| 'Sombre' \| 'Système'` | global | oui |
| `prefs.taille: 0…4` | global | oui |
| `prefs.interligne: 'Serré' \| 'Normal' \| 'Aéré'` | global | oui |
| `prefs.numerosStrophe: boolean` | global | oui |
| `prefs.refrainItalique: boolean` | global | oui |
| `prefs.ecranAllume: boolean` | global | oui |
| `liste.tri: 'numero' \| 'alpha'`, `liste.dizaine` | écran | non |
| `recherche.requete` | écran | non |
| `feuille: null \| 'goto' \| 'plus'`, `goto.saisie` | écran | non |
| Position de défilement de lecture | écran | non (remise à zéro au changement de chant) |

Aucune requête réseau : les 302 cantiques et 85 chœurs sont embarqués. Aucun écran de chargement, aucun état vide involontaire.

## 10. Assets

| Asset | Provenance |
| --- | --- |
| `assets/icon-1024.png` | Rendu de la marque conçue ici (livre violet sur papier) — prêt pour `app.json > icon` |
| `assets/adaptive-icon-foreground-1024.png` | Même marque à 62 % sur fond `#FBFAF7` — `android.adaptiveIcon.foregroundImage` (couleur de fond `#FBFAF7`) |
| `assets/logo-edition-ii-source.png` | Logo de l'Édition II fourni par l'auteur, conservé comme référence d'architecture |
| Écran de lancement | Fond `#4E2A84` + logo SVG redessiné dans l'app (ne pas utiliser une image bitmap) |
| Polices | Newsreader et Archivo, à télécharger depuis Google Fonts et embarquer dans `assets/fonts/` |
| Icônes d'interface | 12 icônes à redessiner en SVG, grille 20, trait 1,5 — géométrie exacte dans `03-COMPOSANTS-ET-MOUVEMENT.md` |

## 11. Definition of done

- [ ] Les 11 écrans passent la checklist de `07-CHECKLIST-PIXEL.md`.
- [ ] 302 cantiques et 85 chœurs consultables hors connexion, avion activé, dès la première ouverture.
- [ ] Recherche « gloire » → au moins 7 résultats avec extrait surligné ; saisie « 133 » → proposition d'aller au chant 133.
- [ ] Aucun texte inférieur à 4,5:1 de contraste ; cibles tactiles ≥ 46.
- [ ] `eas update --branch production` livre une modification de contenu sur un appareil installé, sans passer par les stores.
- [ ] Chaque `push` sur `main` déclenche typecheck + lint + tests, puis publie l'update OTA.
- [ ] Le dépôt `georgesmfee4/recueilDeChants3` contient le projet, les workflows et le fichier `CLAUDE.md` de conventions.
