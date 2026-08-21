# Recueil de Chants III — conventions du projet

Application mobile du recueil de **TCHINDEBBE Charles**, troisième édition (2025).
302 cantiques et 85 chœurs, entièrement hors connexion.

## Avant d'écrire du code

Expo évolue vite. **Lire la documentation de la version exacte** avant de coder :
<https://docs.expo.dev/versions/v54.0.0/>

Le design de référence est dans `design_handoff_recueil_chants_iii/`
(README + 7 fichiers numérotés). En cas de doute sur une mesure, une couleur ou
un comportement, c'est lui qui tranche.

## Règles de design — non négociables

1. **Aucune valeur de couleur, de taille ou d'espacement hors de `src/design/`.**
   On écrit `c.pri`, jamais `'#4E2A84'`.
2. **Aucune ombre, aucun `borderRadius`** (sauf la pilule de navigation et
   l'icône de l'application), **aucun dégradé** — à la seule exception de
   l'en-tête de lecture, demandée explicitement.
3. **Les filets font exactement 1 point.** `StyleSheet.hairlineWidth` est
   **interdit** : il vaut 0,33 en densité 3× et le filet disparaît.
4. **Newsreader = le recueil** (chiffres, titres de chants, paroles).
   **Archivo = l'application** (libellés, réglages, index). Jamais l'inverse.
5. Le contraste de `ink3` est calibré (5,1:1) : **ne pas l'éclaircir**.
6. Cibles tactiles **≥ 46 points** (`hitSlop` si le visuel est plus petit).

## Règles de données — non négociables

7. **Les données du recueil sont immuables.** Aucune correction de casse,
   d'accent ou de ponctuation dans le code. `LA GRACE FINIRA` et `ALLELUIA Ô !`
   sont conformes à la source.
8. **Jamais de `textTransform: 'uppercase'`** sur un titre de chant : les
   titres sont DÉJÀ en capitales dans les données, et la transformation casse
   les « Ô », « É » et les apostrophes typographiques.
9. **Jamais « 0 strophe ».** 72 chants n'ont aucune strophe numérotée : ils
   affichent « n strophes · sans numéro » (voir `src/data/structure.ts`).

## Règles de performance

10. **Jamais de `localeCompare` avec une locale.** Sur Android, il traverse un
    pont JNI vers la bibliothèque système : trier 302 titres fige
    l'application plusieurs secondes. Comparer des clés normalisées
    pré-calculées (voir `cantiquesAlpha()` dans `src/data/recueil.ts`).
11. **Les gros calculs sont paresseux** : tri alphabétique, index de recherche,
    sous-lignes, regroupement des chœurs. Rien de lourd au chargement d'un
    module — l'application doit s'ouvrir instantanément.
12. **Rien de coûteux pendant le rendu.** La normalisation, les tris et les
    regroupements se font une fois et sont mis en cache.
13. **Les animations n'utilisent que `transform` et `opacity`**, pour rester
    sur le fil natif. Animer une propriété de mise en page fait retomber
    l'animation en JavaScript, et elle saccade.

## Conventions de code

- **Français** pour les noms de domaine (`cantique`, `choeur`, `strophe`,
  `refrain`, `favoris`), **anglais** pour les termes techniques.
- Un composant par fichier, export nommé, props typées explicitement.
- Les commentaires expliquent **pourquoi**, pas **quoi** — et sont rédigés pour
  quelqu'un qui découvre React Native.
- Alias `@/` vers `src/`. Pas de `../../../`.

## Avant de pousser

```bash
npm run verifier      # tsc --noEmit && eslint . && jest
```

## Mises à jour

- Paroles, écrans, couleurs, mise en page → **OTA** : `git push origin main`
  publie automatiquement (voir `.github/workflows/ota.yml`).
- Nouvelle bibliothèque native, nouveau SDK Expo, icône, nom, permissions →
  **construction pour les magasins** obligatoire (workflow `build.yml`).

## Structure

```
app/            écrans (expo-router, un fichier = une route)
src/design/     jetons, typographie, thème, animations
src/data/       recueil, recherche, structure — aucune dépendance à React
src/store/      préférences et favoris (Zustand + MMKV)
src/components/ composants partagés
src/features/   lecture (la colonne de paroles)
src/marque/     logo et motifs
tests/          intégrité des données et logique métier
```

Règle d'or : **une route compose des composants, elle ne contient aucune
logique de données.** Tout passe par `src/data` et `src/store`.
