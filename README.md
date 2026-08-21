# Recueil de Chants III

Application mobile du recueil de **TCHINDEBBE Charles**, troisième édition (2025).
**302 cantiques** et **85 chœurs**, entièrement consultables **hors connexion**.

Expo SDK 54 · React Native 0.81 · TypeScript strict · expo-router

---

## Démarrer

```bash
npm ci
```

> **Expo Go ne suffit pas.** L'application utilise des modules natifs (MMKV,
> expo-updates, expo-blur, react-native-svg, expo-linear-gradient) et embarque
> ses polices dans le binaire. Il faut une **construction de développement**.

```bash
npx expo run:android      # première fois : ~10 min, ensuite quelques secondes
npx expo start            # les fois suivantes, si rien de natif n'a changé
```

### Quand faut-il reconstruire ?

| Changement | Suffit-il de recharger ? |
| --- | --- |
| Écran, composant, couleur, paroles | Oui — `npx expo start` |
| Ajout d'une bibliothèque **native** | Non — `npx expo run:android` |
| Modification de `app.json` (icône, splash, polices, barre système) | Non — `npx expo prebuild -p android` puis `run:android` |

Le dossier `android/` est **généré** à partir de `app.json`. Il n'est pas
versionné, et il ne faut jamais le modifier à la main : la prochaine
génération effacerait vos changements.

## Vérifier avant de pousser

```bash
npm run verifier          # tsc --noEmit && eslint . && jest
```

Ou séparément :

```bash
npm run typecheck
npm run lint
npm test
```

Les tests couvrent les **9 invariants du recueil** (302 cantiques, 85 chœurs,
5771 lignes de paroles, aucun numéro manquant…). Ils protègent contre une
régression lors d'une future mise à jour de contenu.

## Publier une correction

Le recueil est embarqué dans le paquet JavaScript : **corriger une parole est
une mise à jour OTA**, livrée en quelques minutes sur les téléphones déjà
installés, sans passer par les magasins.

```bash
git commit -am "fix: corrige la 3e strophe du chant 133"
git push origin main
```

L'envoi sur `main` déclenche la CI ; si elle est verte, la mise à jour est
publiée automatiquement sur le canal `production`.

Pour essayer avant diffusion, passer par `develop` (canal `preview`), ou
publier à la main :

```bash
eas update --branch preview --message "essai avant diffusion"
eas update --branch production --message "corrige la 3e strophe du chant 133"
```

### Revenir en arrière

```bash
eas update:list --branch production        # repérer le groupe précédent
eas update:republish --group <groupe-ok> --message "retour arrière"
```

## Construire pour les magasins

À réserver à ce qui **ne passe pas** en OTA : bibliothèque native, version
d'Expo, icône, nom, permissions.

```bash
eas build --profile preview --platform android      # APK interne
eas build --profile production --platform all       # magasins
```

Ou depuis GitHub : onglet **Actions** → *Build* → **Run workflow**.

## Automatisation

| Workflow | Déclenchement | Rôle |
| --- | --- | --- |
| `ci.yml` | chaque PR et chaque envoi | contrôles (types, conventions, tests, construction) **puis** publication OTA |
| `build.yml` | manuel | construit les binaires pour les magasins |

La publication est un second travail du même fichier, avec `needs: verifier` :
elle ne démarre **que** si les contrôles sont verts. Sur une proposition de
modification, elle ne démarre jamais.

Tableau de bord EAS :
<https://expo.dev/accounts/georgesmfee/projects/recueil-de-chants-iii>

Secret requis dans le dépôt (*Settings → Secrets and variables → Actions*) :

| Secret | Où l'obtenir |
| --- | --- |
| `EXPO_TOKEN` | expo.dev → Account settings → Access tokens |

## Organisation du code

```
app/              écrans (expo-router : un fichier = une route)
  index.tsx         01 · Lancement
  (tabs)/           02 Accueil · 03 Cantiques · 06 Chœurs · 09 Favoris
  chant/[n].tsx     04 · Lecture (et 05 · Lecture nuit — même écran)
  recherche.tsx     07 · Recherche
  reglages/         10 · Réglages · 11 · À propos
src/design/       jetons, typographie, thème, animations
src/data/         recueil, recherche, structure (aucune dépendance à React)
src/store/        préférences et favoris (Zustand + MMKV)
src/components/   composants partagés, dont les 12 icônes SVG
src/features/     lecture (la colonne de paroles)
src/marque/       logo SVG et motifs
tests/            intégrité des données et logique métier
```

## Design

Toutes les questions de design se règlent dans
[`design_handoff_recueil_chants_iii/`](design_handoff_recueil_chants_iii/) —
README + 7 fichiers de spécifications, mesure par mesure.

Les conventions à respecter impérativement sont résumées dans
[`CLAUDE.md`](CLAUDE.md).

---

© Tous droits réservés — TCHINDEBBE Charles
