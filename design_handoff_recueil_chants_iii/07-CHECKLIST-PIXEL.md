# 07 — Checklist de conformité au pixel

À exécuter sur un appareil ou simulateur **390 × 844** (iPhone 14/15/16), en mode clair puis sombre, en comparant côte à côte avec `references/Recueil de Chants III.dc.html`.

## Global

- [ ] Aucune ombre portée nulle part (`elevation: 0`, aucun `shadow*`).
- [ ] Aucun `borderRadius` hors pilule de navigation (100) et icône d'application.
- [ ] Aucun dégradé.
- [ ] Fond de tous les écrans : `#FBFAF7` (clair) / `#141019` (sombre).
- [ ] Tous les filets font exactement 1 px (`StyleSheet.hairlineWidth` **interdit** : il vaut 0,33 en densité 3× et efface les filets).
- [ ] Newsreader pour chiffres, titres de chants et paroles ; Archivo pour tout le reste. Aucune police système visible.
- [ ] Titres de chants en capitales verbatim, jamais transformés par le code.
- [ ] Marge latérale 28 sur tous les écrans, sauf liste des cantiques (14 à gauche / 42 à droite) et lecture (30 / 30).
- [ ] Aucune cible tactile sous 46.

## 01 Lancement

- [ ] Fond `#4E2A84` plein.
- [ ] Logo 132, couverture papier, dos `#E2D8F2`, pastille or, `III` en `#381E63`.
- [ ] Filet or 64 × 1 à 34 sous le logo ; surtitre à +22 ; pied ancré à 44 du bas.
- [ ] Séquence d'animation : livre 800 ms → filet 500 ms → surtitre 620 ms → pied 900 ms.

## 02 Accueil

- [ ] **Aucune date affichée.**
- [ ] Deux boutons d'en-tête alignés à droite, 36 × 36.
- [ ] Une sur deux lignes, Newsreader 44, interlettrage −1,6.
- [ ] Bloc « Reprendre » : numéro Newsreader 24 `pri` + titre 16,5 ; barre 2 px.
- [ ] Chant du jour : numéro Newsreader 64, deux lignes de refrain en italique 16,5 `ink2`.
- [ ] Trois accès : libellés à gauche, nombres Newsreader 22 `pri` à droite ; libellé exact **« Mes favoris »**.
- [ ] Pilule visible, onglet Accueil actif (point de 3 px).

## 03 Cantiques

- [ ] Numéros alignés à droite dans une colonne de 44 commençant à 14 du bord gauche.
- [ ] Numéro en Newsreader 22 `pri` ; titre Archivo 600 12,5 sur deux lignes si nécessaire.
- [ ] Sous-ligne toujours **différente** du titre (contrôle : chants 1, 4, 5, 6).
- [ ] Rail des dizaines à 13 du bord droit, sommet à 176, `1 · 50 · 100 · 150 · 200 · 250 · 300`.
- [ ] Onglets « Par numéro » / « A → Z » avec soulignement 2 px sur l'actif.
- [ ] Bouton « Aller à » sur une seule ligne.
- [ ] Pression d'une ligne : fond `#F3EEFB`.

## 04 / 05 Lecture

- [ ] **Défilement vertical**, une seule colonne, aucune pagination, aucun geste horizontal.
- [ ] **Aucune barre de défilement visible** ; marges gauche et droite égales à 30.
- [ ] Numéro Newsreader 56 puis titre 22 puis filet or 48.
- [ ] Numéros de strophe dans la marge, colonne de 13, Newsreader 12,5 `pri`.
- [ ] Refrain centré, italique, entre deux filets or, padding vertical 18.
- [ ] Pied : filet + structure en capitales — vérifier `5 STROPHES · REFRAIN` (chant 1) et `4 STROPHES · SANS NUMÉRO` (chant 26). **Aucun « 0 strophe » possible.**
- [ ] Capsule à trois boutons ; le bouton central ouvre le clavier de numéros.
- [ ] Changement de chant : le texte repart du haut.
- [ ] Mode sombre : filet or inchangé (`#F0C069`), paroles `#F5F2F8` sur `#141019`.

## 06 Chœurs

- [ ] 17 lettres seulement (A C D E F H I J L M N O Q S T V Y).
- [ ] Lettre en filigrane Newsreader 52 `priSoft` dans la colonne de gauche.
- [ ] Première ligne du chœur en Newsreader 17 `ink`, suite en 15,5 `ink2`, étiquette `N° x` à droite.
- [ ] Bouton « Aller à » présent dans l'en-tête.

## 07 Recherche

- [ ] Filet bas du champ en `pri` quand il est actif.
- [ ] « gloire » → au moins 7 résultats, terme surligné `pri` sur `priSoft`.
- [ ] « 133 » → proposition « Aller directement au chant » avec `SOYEZ TOUJOURS HEUREUX`.
- [ ] « 999 » → « Aucun chant à ce numéro ».
- [ ] Recherche insensible aux accents : « grace » trouve « grâce ».
- [ ] Ligne de compte en capitales espacées.

## 08 Aller à un chant

- [ ] Accessible depuis : liste, chœurs, lecture (bouton numéro), feuille ⋯.
- [ ] Voile `rgba(23,19,31,.42)`, feuille sans rayon, entrée 340 ms.
- [ ] Clavier 3 × 4, touches de 56 de haut, interstices de 1 px `rule`.
- [ ] `←` et `OK` en Newsreader 14 ; **`OK` en violet**, jamais gris.
- [ ] Maximum 3 chiffres ; titre résolu en direct ; « Aucun chant n° 999 » hors plage.
- [ ] Bouton « Ouvrir le chant » pleine largeur, fond `pri`, sans rayon.

## 09 Favoris

- [ ] Titre d'écran **« Favoris »**.
- [ ] Numéro Newsreader 26 dans une colonne de 40.
- [ ] Métadonnée = structure du chant.
- [ ] Bouton ✕ par ligne.
- [ ] État vide : « Aucun favori » + deux lignes d'explication.

## 10 Réglages

- [ ] Lien « À propos » dans l'en-tête (pas en bas de pile).
- [ ] Bloc d'aperçu avec filet **haut** or, fond `surf2`, vraies paroles.
- [ ] Taille : 5 crans, boutons `A` 40 × 40, libellés Compact → Très grand.
- [ ] Thème : Clair / Sombre / Système — le changement s'applique immédiatement à toute l'application.
- [ ] Interligne : Serré / Normal / Aéré → 1,48 / 1,64 / 1,84 mesurés sur les paroles.
- [ ] Trois bascules 44 × 24, pastille à gauche 3 ou 23, transition 200 ms.
- [ ] Dernière ligne (« Disponible hors connexion ») **entièrement visible au-dessus de la pilule** : contenu terminé à 732, pilule à partir de 748.
- [ ] Chaque réglage modifie l'aperçu **et** les écrans de lecture.

## 11 À propos

- [ ] Aucune pilule de navigation.
- [ ] Logo 66, titre Newsreader 26, mention d'édition entre deux filets or.
- [ ] Trois sections : **LE RECUEIL**, **L'APPLICATION**, **CONTACT**.
- [ ] Valeurs exactes : `TCHINDEBBE Charles` · `Troisième — 2025` · `302 cantiques · 85 chœurs` · `Français` · `3.0.0` · `Hors connexion` · `4,1 Mo` · `699 90 14 39 · 676 63 14 31 · 696 11 51 13` · `charlestchindebbe@yahoo.fr` (en `pri`).
- [ ] Mention `© TOUS DROITS RÉSERVÉS` centrée.

## Données et hors connexion

- [ ] Mode avion, première ouverture après installation : les 302 cantiques et 85 chœurs sont lisibles.
- [ ] Aucun indicateur de chargement nulle part.
- [ ] Tests d'intégrité du § 2 de `04-DONNEES.md` au vert.

## OTA

- [ ] `eas update --branch preview` puis ouverture de l'application interne : la modification apparaît au lancement suivant.
- [ ] Réglages affiche « Mise à jour disponible → Installer » **uniquement** quand une update est téléchargée.
- [ ] Aucune interruption pendant la lecture.
- [ ] `eas update:republish` ramène la version précédente.

## Accessibilité

- [ ] Contrastes : `ink3` 5,1:1 (clair) et 5,2:1 (sombre) — mesurer avec un vérificateur.
- [ ] Tous les boutons icône ont un `accessibilityLabel` en français.
- [ ] `Réduire les animations` activé : l'ouverture et les feuilles n'animent plus.
- [ ] Le réglage de taille de l'application ne se cumule pas avec `fontScale` du système.
