# 02 — Écrans, mesure par mesure

Toutes les valeurs sont en points logiques, sur une base de **390 × 844**. « Marge » = distance au bord de l'écran. Tous les filets font 1 px.
Le prototype de référence (`references/Recueil de Chants III.dc.html`) est interactif : chaque écran y est vivant et peut être comparé côte à côte avec l'implémentation.

---

## 01 · Lancement

- Fond : `pri` plein écran (`#4E2A84`), aucune barre d'état visible (texte clair).
- Logo livre SVG **132 × 132**, centré optiquement (centre de l'écran, sans compensation).
  - Variante « lancement » : couverture `#FBFAF7`, dos `#E2D8F2`, filets `#4E2A84`, titre `#381E63`, pastille `or` avec `III` en `#381E63`, note `or`.
- Sous le logo : filet **or**, largeur 64, hauteur 1, marge supérieure 34.
- Surtitre `TROISIÈME ÉDITION` : Archivo 600, 11, interlettrage +4,4, `rgba(255,255,255,.86)`, marge supérieure 22.
- Pied : `2025` (Newsreader 15, `rgba(255,255,255,.7)`) puis `TCHINDEBBE CHARLES` (Archivo 400, 10,5, interlettrage +1,6, `rgba(255,255,255,.42)`), ancré à 44 du bas, centré, gap 8.
- Animations (voir `03-COMPOSANTS-ET-MOUVEMENT.md`) : livre 800 ms, filet 700 ms à 500 ms, surtitre 700 ms à 620 ms, pied 800 ms à 900 ms.
- Sortie : toucher n'importe où, ou automatiquement après 1 800 ms → Accueil (fondu 240 ms).

## 02 · Accueil

Marges latérales **28**. Barre d'état 50.

1. **Ligne d'outils** — alignée à droite, marge supérieure 6. Deux boutons 36 × 36, icônes 19, couleur `ink2` (→ `pri` au toucher) : Favoris, Réglages. *Aucune date, aucun texte de bienvenue.*
2. **Une** — marge supérieure 26. « Recueil » / « de Chants » sur deux lignes (Newsreader 44, interligne 0,98, interlettrage −1,6). Puis, marge supérieure 16 : filet or 26 × 1 + `TROISIÈME ÉDITION · 2025` (Archivo 600, 10, +2,6, `pri`), gap 11.
3. **Reprendre** — bouton pleine largeur, marge supérieure 30, padding bas 18, filet bas `rule`.
   - Surtitre `REPRENDRE` (10 / +2 / `ink3`).
   - Ligne : numéro (Newsreader 24, `pri`) + titre verbatim (Newsreader 16,5, interligne 1,26, +0,3), gap 12, marge supérieure 11.
   - Barre de progression : hauteur 2, fond `ruleSoft`, remplissage `pri` à la position lue, marge supérieure 14.
4. **Chant du jour** — padding 26 / 24, filet bas `rule`.
   - Surtitre `LE CHANT DU JOUR`.
   - Numéro Newsreader 64 (interligne 0,82, −3, `pri`) + titre Newsreader 19,5 (1,26, +0,3), gap 18, marge supérieure 16.
   - Deux premières lignes du refrain (ou de la première strophe) : Newsreader **italique** 16,5, interligne 1,62, `ink2`, marge supérieure 16.
   - Action texte « Lire ce chant » + flèche 16 : Archivo 600, 13, `pri`, gap 9 (gap 14 au survol), marge supérieure 18.
5. **Trois accès** — lignes pleine largeur, padding vertical 17, filet bas `ruleSoft` (aucun sur la dernière) :
   `Tous les cantiques → 302` · `Chœurs → 85` · `Mes favoris → n`
   Libellé Archivo 500 14 ; nombre Newsreader 22 `pri`, aligné à droite. Toucher : décalage de 6 vers la droite.
6. Pilule de navigation, onglet Accueil actif.

## 03 · Cantiques

1. **En-tête** — marges 28, marge supérieure 8.
   - Titre « Cantiques » (Newsreader 34, −1) + sous-titre `302 chants · édition 2025` (Archivo 400, 11,5, `ink3`, marge supérieure 7).
   - Bouton **Aller à** aligné en bas à droite : filet 1 px `rule`, padding 9 / 13, icône 15 + libellé Archivo 600 12 `pri`, `white-space: nowrap`. Fond `priSoft` au toucher.
2. **Onglets de tri** — marge supérieure 20, filet bas `rule` : « Par numéro » / « A → Z », Archivo 600 12,5, +0,3. Actif : `pri` + soulignement 2 px `pri` chevauchant le filet (`margin-bottom: -1`). Inactif : `ink3`. Espace 22 entre les deux.
3. **Lignes d'index** — conteneur : marge gauche **14**, marge droite **42** (numéros débordant dans la marge, c'est volontaire : la page paraît plus large).
   - Ligne : padding vertical 14, filet bas `ruleSoft`, gap 14.
   - Numéro : largeur fixe **44**, aligné à droite, Newsreader **22** (ou 15 si l'option « numéros géants » est désactivée), `pri`, interligne 1.
   - Titre : Archivo 600 12,5 / 1,34 / +0,4, **verbatim, capitales, sur deux lignes si nécessaire**.
   - Sous-ligne : Newsreader 13 / 1,4 / `ink3` — première ligne de paroles différente du titre.
   - Signet : icône 13 pleine `pri`, alignée à droite, uniquement si le chant est en favori.
   - Pression : fond `priSoft`.
4. **Rail des dizaines** — colonne absolue, à 13 du bord droit, sommet à 176, gap 10 : `1 · 50 · 100 · 150 · 200 · 250 · 300`, Newsreader 11. Actif (dizaine visible ± 25) : `pri`, sinon `ink3`. Toucher : `scrollToIndex`.
5. Pilule, onglet Cantiques actif.

## 04 · Lecture (et 05 · Lecture · nuit)

Aucune barre de navigation. Structure verticale : en-tête fixe → colonne défilante → pied fixe → capsule.

1. **En-tête** (fixe, hauteur ≈ 50, padding 6 / 26 / 14, gap 12)
   - Retour : 30 × 30, icône 19, `ink2`.
   - Titre courant : Archivo 600 10,5 / +1,8 / `ink3`, **titre verbatim**, coupé par ellipse sur une ligne.
   - Signet : 30 × 30, icône 17. Actif : trait et remplissage `pri`. Inactif : trait `ink3`, sans remplissage.
   - Plus (⋯) : 30 × 30, trois points de 1,3 de rayon, `ink2`.
2. **Colonne défilante** — `flex: 1`, marges **30 / 30** symétriques, padding bas 26, **barre de défilement masquée**.
   - Bloc de titre : numéro Newsreader 56 (0,88 / −2,4 / `pri`) → titre Newsreader 22 (1,24 / +0,3, marge supérieure 16) → filet or 48 × 1 (marge supérieure 20) → padding bas 6.
   - **Strophe** : marge supérieure 24, `flexDirection: row`, gap 15.
     - Numéro de strophe : largeur 13, Newsreader 12,5, `pri`, +0,5, padding haut 5 (masqué si l'option est désactivée).
     - Lignes : Newsreader, taille et interligne selon les préférences, `ink`, alignées à gauche, aucune césure.
   - **Refrain** : marge 26 / 4, padding vertical 18, filet or en haut **et** en bas, texte **centré**, italique (si l'option est active), même taille et interligne que les strophes.
   - Les strophes non numérotées dans le recueil (72 chants) sont rendues comme des refrains sans italique forcé : elles gardent l'ordre du recueil.
3. **Pied** (fixe) — padding 12 / 30 / 0 : filet `ruleSoft` pleine largeur, puis structure du chant (Archivo 400 10,5 / +1,4 / `ink3`, capitales), marge supérieure 10. Exemples : `5 STROPHES · REFRAIN`, `4 STROPHES · SANS NUMÉRO`.
4. **Capsule** (hauteur 92, centrée, gap 10) — trois boutons : filet `rule`, fond `blur` + flou 12, padding 11 / 15.
   - Précédent : icône 14 + numéro (Archivo 600 12, `ink2` → `pri`). `—` si `n = 1`.
   - Centre : icône « aller à » 14 + numéro courant (Newsreader 16, `pri`), padding 11 / 17 → **ouvre le clavier de numéros**.
   - Suivant : numéro + icône 14. `—` si `n = 302`.
   - Changement de chant : remise du défilement à 0, sans animation.
5. **Mode nuit** : mêmes mesures, jeu de jetons sombre. Le filet or reste `#F0C069`.

## 06 · Chœurs

1. **En-tête** — titre « Chœurs » (34 / −1) + `85 chœurs · classés par lettre` (11,5 / `ink3`) ; bouton **Aller à** identique à celui des cantiques, aligné en bas à droite.
2. **Bande alphabétique** — marge supérieure 20, padding bas 18, filet bas `rule`, `flex-wrap`, gap 4. Une case par lettre présente (**A C D E F H I J L M N O Q S T V Y**) : 28 × 28, Newsreader 14, centrée. Active : fond `pri`, texte `onPri`. Inactive : texte `ink2`. Les lettres absentes du recueil ne sont pas affichées.
3. **Groupe de la lettre** — `flexDirection: row`, gap 18, marges 28 :
   - Colonne gauche : la lettre en Newsreader **52**, couleur `priSoft` (filigrane), largeur 34, padding haut 12.
   - Colonne droite : chœurs de la lettre, chacun avec padding vertical 16 et filet bas `ruleSoft`.
     - Première ligne : Newsreader 17 / 1,34 / `ink` + étiquette `N° x` à droite (Archivo 400 10,5 / +1,2 / `ink3`).
     - Lignes suivantes : Newsreader 15,5 / 1,46 / `ink2`.
4. Pilule, onglet Chœurs actif.

## 07 · Recherche

1. **Champ** — marges 28, marge supérieure 10, padding bas 12, **filet bas 1 px `pri`** (le champ actif se signale par ce filet, pas par un cadre).
   - Icône loupe 19 `pri`, gap 12.
   - Saisie : Archivo 400 17, `ink`, placeholder `Titre, parole ou numéro` (`ink3`), aucun fond, aucun cadre.
   - Bouton effacer : 24 × 24, icône 15, `ink3`.
2. **Ligne de résultat** — Archivo 400 11, +1,4, `ink3`, capitales, marge supérieure 14 :
   `302 CANTIQUES · 85 CHŒURS` (moins de 2 caractères saisis) · `n RÉSULTATS POUR « GLOIRE »` · `AUCUN RÉSULTAT`.
3. **Proposition numérique** (si la saisie est 1 à 3 chiffres) — ligne pleine largeur, padding vertical 16, filet bas `rule`, gap 16 : numéro saisi en Newsreader 38 (`pri`) + surtitre `ALLER DIRECTEMENT AU CHANT` + titre résolu (Newsreader 17). Si le numéro n'existe pas : `Aucun chant à ce numéro`.
4. **Résultats** (7 maximum) — padding vertical 14, filet bas `ruleSoft`, gap 15 :
   - Numéro : largeur 32, aligné à droite, Newsreader 17, `pri`.
   - Titre verbatim : Archivo 500 13,5, une ligne, ellipse.
   - Extrait : Newsreader 13,5 / 1,4 / `ink3`, avec le terme trouvé en `pri` sur fond `priSoft`.
5. Pilule, bouton de recherche actif (cercle plein).

## 08 · Aller à un chant (feuille inférieure)

Feuille posée sur l'écran courant — accessible depuis **la liste, les chœurs, la lecture et la feuille ⋯**.

- Voile : `rgba(23,19,31,.42)`, apparition 220 ms. Toucher le voile ferme la feuille.
- Feuille : ancrée en bas, fond `paper`, filet haut `rule`, padding 22 / 26 / 30, entrée par translation verticale 340 ms.
- En-tête : surtitre `ALLER À UN CHANT` ; ligne suivante = numéro saisi (Newsreader 46, `pri`, −2) + titre résolu en direct (Newsreader 17 / 1,24 / `ink2`), gap 14, marge supérieure 12. Sans saisie : `—` et « Composez un numéro de 1 à 302 ». Numéro inexistant : « Aucun chant n° 999 ».
- Bouton fermer : 30 × 30, icône 16, `ink3`, aligné en haut à droite.
- **Clavier** : grille 3 colonnes, gap 1 sur fond `rule` (les filets sont les interstices), cadre 1 px `rule`, marge supérieure 22.
  - Touches : hauteur 56, fond `paper`, Newsreader 23, `ink`. Pression : fond `priSoft`.
  - Rangée 4 : `←` (Newsreader 14, `ink3`), `0`, `OK` (Newsreader 14, **`pri`** — c'est l'action de confirmation, jamais grisée).
  - Maximum 3 chiffres.
- Bouton principal : pleine largeur, hauteur 16 + 16 de padding, fond `pri`, texte `onPri` Archivo 600 14 / +0,3, libellé « Ouvrir le chant », marge supérieure 14. Sans numéro valide : inopérant (ne pas afficher d'erreur).

## 08b · Feuille « Plus d'actions » (depuis la lecture)

- Même voile et même animation.
- En-tête : numéro (Newsreader 20 `pri`) + titre verbatim (Archivo 400 12,5 `ink3`, une ligne), padding 0 / 26 / 6, gap 12.
- Quatre lignes, padding 16 / 26, filet haut `ruleSoft`, gap 14, Archivo 500 14,5 :
  `+ Ajouter aux favoris` (ou `✓ Retirer des favoris`) · `↗ Partager les paroles` · `# Aller à un chant` · `A Taille du texte` (→ Réglages).
  Le repère (colonne 20, Newsreader 15, `pri`) précède le libellé. Pression : fond `priSoft`.

## 09 · Favoris

- En-tête : titre « Favoris » (34 / −1) + `n chants gardés` (11,5 / `ink3`).
- Lignes (marge supérieure 22, padding vertical 16, filet bas `ruleSoft`, gap 16) :
  - Numéro : largeur 40, aligné à droite, Newsreader 26 (−0,8), `pri`.
  - Titre verbatim : Newsreader 15,5 / 1,28 / +0,3.
  - Métadonnée : Archivo 400 11,5 / `ink3`, marge supérieure 5 — structure du chant.
  - Bouton retirer : 26 × 26, icône ✕ 14, `ink3` → `pri`.
- **État vide** (aucun favori) : marge supérieure 70, centré. « Aucun favori » (Newsreader 22, `ink2`) + « Touchez le signet en haut d'un chant / pour le garder ici. » (Archivo 400 13 / 1,6 / `ink3`, deux lignes).
- Pilule, onglet Favoris actif.

## 10 · Réglages

Conteneur : du haut de l'écran utile jusqu'à **100 au-dessus du bas** (la pilule ne doit jamais couvrir la dernière ligne).

1. **En-tête** — titre « Réglages » (34 / −1) + lien **À propos** aligné en bas à droite (Archivo 600 12,5 `pri` + chevron 14, gap 6 → 11 au survol).
2. **Aperçu** — marge 16 / 28, padding 15 / 18, fond `surf2`, **filet haut or**. Surtitre `APERÇU`, puis 2 à 3 vraies lignes de paroles rendues avec la taille et l'interligne courants. C'est le principe : un réglage se voit avant d'être validé.
3. **Taille du texte** — padding 18 / 0 / 14, filet bas `ruleSoft`. Libellé + valeur (`Standard · 19,5 px`, Archivo 400 11,5 `ink3`) ; ligne de contrôle marge supérieure 14, gap 14 :
   - Bouton `A` 40 × 40, filet `rule`, Newsreader 15 (diminuer).
   - Cinq crans : segments `flex: 1`, hauteur 2, gap 3 ; remplis en `pri` jusqu'au cran actif, sinon `rule`.
   - Bouton `A` 40 × 40, Newsreader 23 (augmenter).
   - Libellés : Compact 16,5 · Confortable 18 · Standard 19,5 · Grand 21 · Très grand 23.
4. **Thème** — padding 15, filet bas `ruleSoft`. Segments : cadre 1 px `rule`, trois parts égales, padding vertical 11, Archivo 600 12,5, séparateurs 1 px `rule`. Actif : fond `pri`, texte `onPri`. `Clair` · `Sombre` · `Système`.
5. **Interligne** — même composant : `Serré` · `Normal` · `Aéré` (1,48 / 1,64 / 1,84).
6. **Trois bascules** — padding vertical 13, filet bas `ruleSoft`, gap 16 :
   - `Numéros de strophe` — « Dans la marge, en chiffres serif »
   - `Refrain en italique` — « Entre deux filets or »
   - `Garder l'écran allumé` — « Pendant toute la lecture »
   - Bascule : 44 × 24, cadre 1 px ; active → cadre et fond `pri`, pastille 16 × 16 `onPri` à gauche 23 ; inactive → cadre `rule`, fond transparent, pastille `ink3` à gauche 3. Transition 200 ms.
7. **Hors connexion** — dernière ligne, padding haut 14, sans filet bas : `Disponible hors connexion` + « 302 cantiques · 85 chœurs · 4,1 Mo » ; valeur `Tout` (Newsreader 15, `pri`) à droite.
8. Pilule visible ; **la pile de réglages s'arrête à 748** (haut de la pilule) — mesure de référence : contenu terminé à 732.

## 11 · À propos

Aucune pilule (écran de détail). Conteneur : marges 28.

1. **En-tête** — bouton retour 30 × 30 + surtitre `À PROPOS`, gap 12, marge supérieure 8.
2. **Bloc de marque** — centré, padding 20 / 0, filet bas `rule` : logo SVG **66**, puis « Recueil de Chants » (Newsreader 26, −0,6, marge supérieure 18), puis filet or 18 + `TROISIÈME ÉDITION` (Archivo 600 10 / +2,4 / `pri`) + filet or 18, gap 10.
3. **Trois sections** — chacune : surtitre (Archivo 600 9,5 / +1,8 / `ink3`, padding bas 7, filet bas `rule`), puis ses lignes (padding vertical 10, filet bas `ruleSoft`, libellé Archivo 400 12,5 `ink2` à gauche, valeur Archivo 500 13,5 alignée à droite). Marge supérieure de section 16.
   - **LE RECUEIL** : Auteur `TCHINDEBBE Charles` · Édition `Troisième — 2025` · Contenu `302 cantiques · 85 chœurs` · Langue `Français`
   - **L'APPLICATION** : Version `3.0.0` · Fonctionnement `Hors connexion` · Taille `4,1 Mo`
   - **CONTACT** : Production `699 90 14 39 · 676 63 14 31 · 696 11 51 13` · E-mail `charlestchindebbe@yahoo.fr` (valeur en `pri`, ouvre le client mail)
4. **Mention légale** — `© TOUS DROITS RÉSERVÉS`, Archivo 400 10 / +1,2 / `ink3`, centré, marge supérieure 22.
