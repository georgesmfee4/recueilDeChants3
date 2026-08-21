# 03 — Composants, icônes, logo et mouvement

## 1. Composants

### Boutons

| Variante | Spécification |
| --- | --- |
| **Principal** | Padding 15 / 26, fond `pri`, texte `onPri` Archivo 600 14, rayon **0**. Pression : fond `priDeep`. |
| **Contour** | Padding 14 / 22, filet 1 px `rule`, texte `pri` Archivo 600 13. Pression : fond `priSoft`. |
| **Texte + flèche** | Aucun fond, aucun cadre. Texte `pri` Archivo 600 13 + icône 15, gap 9 → **14 au survol** (le gap est l'animation). |
| **Icône** | 46 × 46, filet 1 px `rule`, icône 18 `ink2`. Pression : icône et cadre `pri`. |
| **Indisponible** | Fond `#EDE9E1`, texte `#A9A3B0`, aucun cadre, non cliquable. |

### Champ de recherche

Deux états seulement. Repos : filet bas `rule`, icône et texte `ink3`. Actif : filet bas `pri`, icône `pri`, texte `ink`, curseur `pri`. Jamais de fond, jamais de cadre complet, jamais de rayon.

### Ligne d'index

Trois états : repos · **pressée** (fond `priSoft`) · **avec favori** (icône signet pleine 13 `pri` à droite). Le titre est verbatim en capitales, la sous-ligne toujours différente du titre.

### Bascule

44 × 24, rayon 0. Active : cadre et fond `pri`, pastille 16 × 16 `onPri` à `left: 23`. Inactive : cadre `rule`, fond transparent, pastille `ink3` à `left: 3`. Transition `left` 200 ms `cubic-bezier(.2,.8,.16,1)`.

### Segments

Cadre 1 px `rule`, parts égales, séparateurs 1 px `rule`, padding vertical 11, Archivo 600 12,5. Actif : fond `pri`, texte `onPri`. Utilisé pour Thème (3) et Interligne (3).

### Case de lettre (chœurs)

28 × 28, Newsreader 14, rayon 0. Active : fond `pri` / texte `onPri`. Disponible : `ink2`. Absente du recueil : non affichée (`#C9C3BA` dans la planche de composants documente l'état désactivé, non utilisé en production).

### Feuille inférieure

Coquille commune aux deux feuilles : voile `rgba(23,19,31,.42)` (fondu 220 ms), panneau ancré en bas, fond `paper`, filet haut `rule`, **aucun rayon**, entrée par translation verticale 340 ms `cubic-bezier(.2,.8,.16,1)`, sortie 240 ms. Fermeture : toucher le voile, le bouton ✕, ou glisser vers le bas.

### Pilule de navigation

Voir `02-ECRANS.md § 07 Navigation` du README. Points critiques : **aucune ombre** (c'est le filet + le flou qui la détachent), le cercle de recherche est exactement au centre, et la pilule disparaît en lecture et à l'écran À propos.

## 2. Les 12 icônes

À redessiner en `react-native-svg`. Grille **20 × 20**, trait **1,5**, `fill="none"`, `stroke="currentColor"`, extrémités et jointures par défaut (droites). Aucun remplissage, sauf le signet actif et les trois points.

| Nom | Chemin SVG (viewBox `0 0 20 20`) |
| --- | --- |
| Accueil | `M3.4 8.7 10 3.2l6.6 5.5V17h-4.2v-5.2H7.6V17H3.4z` |
| Cantiques | `M3.5 5.5h13M3.5 10h13M3.5 14.5h8` |
| Chœurs | `M7.6 14.2V4.8l8.4-1.6v9` + `ellipse cx=5.4 cy=14.6 rx=2.2 ry=1.9` + `ellipse cx=13.8 cy=13 rx=2.2 ry=1.9` |
| Recherche | `circle cx=9 cy=9 r=5.4` + `M13.2 13.2 17 17` |
| Signet | `M5.5 3.4h9v13.4L10 13.1l-4.5 3.7z` (actif : ajouter `fill="currentColor"`) |
| Réglages | `M3.5 6.5h6M12.8 6.5h3.7M3.5 13.5h3.7M10.3 13.5h6.2` + `circle cx=11 cy=6.5 r=1.7` + `circle cx=8 cy=13.5 r=1.7` |
| Retour | `M11.5 4.5 6 10l5.5 5.5` |
| Suivant | `M8.5 4.5 14 10l-5.5 5.5` |
| Partager | `M10 3.4v9.4M6.6 6.6 10 3.2l3.4 3.4M4.4 12.6V17h11.2v-4.4` |
| Aller à | `rect x=3.4 y=4.4 w=13.2 h=11.2` + `M3.4 8.2h13.2M8.2 8.2v7.4` |
| Plus (⋯) | trois `circle r=1.3` à `cx=4.6 / 10 / 15.4`, `cy=10`, `fill="currentColor"` |
| Effacer (✕) | `M5.5 5.5l9 9M14.5 5.5l-9 9` |

Tailles d'usage : 19 (pilule), 18 (bouton icône), 17 (signet de lecture), 16 (fermer), 15 (bouton contour), 14 (capsule, chevrons), 13 (signet d'index).

## 3. Logo — géométrie exacte

`viewBox="0 0 240 240"`, à rendre en `react-native-svg`. Le texte doit être composé en **Newsreader 600** ; si la police n'est pas disponible dans le contexte SVG, convertir les trois mots en chemins à l'export (ne jamais substituer une autre police).

```
Couverture      rect  x=44  y=18  w=152 h=204 rx=9    fill=couverture
Dos             path  M62 18 H53 a9 9 0 0 0 -9 9 V213 a9 9 0 0 0 9 9 h9 Z   fill=dos
Filet haut      rect  x=107 y=58.4 w=42 h=2.4        fill=or
« RECUEIL »     text  x=130 y=90     ancre=milieu  Newsreader 600  19.5  interlettrage 3.7
« DE »          text  x=129 y=108    ancre=milieu  Newsreader 500  7.6   interlettrage 2.4
« CHANTS »      text  x=130 y=130.5  ancre=milieu  Newsreader 600  19.5  interlettrage 3.7
Filet bas       rect  x=107 y=145  w=42 h=2.4        fill=or
Note (groupe)   translate(60.9,145.6) scale(1.1)
  tête          ellipse cx=53.5 cy=38 rx=8.2 ry=6.3  rotate(-20 53.5 38)   fill=or
  hampe         rect x=60 y=13 w=3.6 h=26 rx=1.8                            fill=or
  hampe drapeau path M63.6 14 C 72 18 77.5 24 75.5 32.5 C 74.5 26.5 70 22 63.6 20 Z  fill=or
Pastille        circle cx=173 cy=43 r=19.5            fill=or
« III »         text  x=173.5 y=50  ancre=milieu  Newsreader 600  19  interlettrage 1  fill=dos
```

| Variante | couverture | dos | titre | filets |
| --- | --- | --- | --- | --- |
| Marque principale | `#4E2A84` | `#381E63` | `#FFFFFF` | `or` |
| Lancement (sur violet) | `#FBFAF7` | `#E2D8F2` | `#381E63` | `#4E2A84` |
| Mode sombre | `#6B3FAE` | `#4E2A84` | `#FFFFFF` | `or` |
| Monochrome | `#17131F` | `#000000` | `#FFFFFF` | `#FBFAF7` |

Sous **44** : supprimer « DE » et la note. Sous **40** : remplacer le titre par trois filets (deux blancs de 6, un or de 6, largeurs 56 / 56 / 36 aux positions y 86 / 112 / 138) et porter la pastille à `r=24`. La pastille ne disparaît jamais : c'est le seul élément qui distingue les trois éditions.

## 4. Mouvement

| Mouvement | Durée · courbe | Détail |
| --- | --- | --- |
| Défilement de lecture | natif, inertie système | Une seule colonne continue, aucune pagination |
| Changement de chant | 0 ms | Le défilement revient en haut sans animation ; le texte ne glisse jamais latéralement |
| Feuille inférieure | entrée 340 ms, sortie 240 ms · `cubic-bezier(.2,.8,.16,1)` | Translation verticale ; voile en fondu 220 ms |
| Pilule → capsule de lecture | 260 ms | Largeur et opacité |
| Ouverture (lancement) | livre 800 ms ; filet 700 ms à 500 ms ; surtitre 700 ms à 620 ms ; pied 800 ms à 900 ms | Livre : opacité + 10 de translation + rotation −1,5° → 0 ; filet : `scaleX` 0 → 1 |
| Pression | 120 ms | Surlignage `priSoft`. **Aucun changement d'échelle, aucun rebond.** |
| Bascule | 200 ms · `cubic-bezier(.2,.8,.16,1)` | Position de la pastille |
| Segments / onglets | 160 ms | Couleur de fond et de texte |

Courbe unique du produit : `cubic-bezier(.2, .8, .16, 1)` (Reanimated : `Easing.bezier(0.2, 0.8, 0.16, 1)`).
Règle : **le papier ne rebondit pas.** Aucun `spring` avec dépassement, aucun `scale` sur les pressions, aucun effet de parallaxe.

## 5. Principes UX à respecter dans l'implémentation

1. **La page avant l'application.** En lecture, aucune barre, aucun bouton permanent hors capsule.
2. **Le numéro est le nom.** On annonce « chant 133 » : le chiffre est composé grand, en serif, partout.
3. **Une information, un seul endroit.** Aucun compteur répété d'écran en écran, aucun résumé de ce qui est déjà visible.
4. **Trois touchers maximum** entre l'ouverture et la première parole.
5. **Les réglages se voient** : chaque réglage montre son effet sur un vrai verset.
6. **Hors connexion par défaut** : tout est embarqué, aucun écran de chargement.
