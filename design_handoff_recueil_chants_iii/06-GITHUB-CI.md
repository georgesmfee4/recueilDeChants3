# 06 — GitHub et intégration continue

Dépôt : **`georgesmfee4/recueilDeChants3`**, branche par défaut `main` (dépôt vide au moment de la remise : le premier commit crée le projet).

## 1. Premier envoi

```bash
npx create-expo-app@latest recueilDeChants3 --template blank-typescript
cd recueilDeChants3
# … implémenter le projet selon 01-ARCHITECTURE.md …

git init -b main
git remote add origin git@github.com:georgesmfee4/recueilDeChants3.git
git add .
git commit -m "feat: première version de l'application Recueil de Chants III"
git push -u origin main
```

`.gitignore` : ajouter `node_modules/`, `.expo/`, `dist/`, `*.log`, `.env*.local`, `ios/`, `android/` (les dossiers natifs sont générés par prebuild ; ne pas les versionner tant que le projet reste géré par Expo).

## 2. Branches et conventions

| Branche | Rôle | Canal EAS |
| --- | --- | --- |
| `main` | Ce qui est en production | `production` |
| `develop` | Intégration | `preview` |
| `feat/…`, `fix/…` | Travail en cours | aucun |

Commits en **Conventional Commits** (`feat:`, `fix:`, `chore:`, `docs:`, `refactor:`) — ils servent de journal des mises à jour OTA (`--message` reprend le sujet du commit).

Règles de protection sur `main` : PR obligatoire, CI verte, pas de push direct.

## 3. Secrets à créer

`Settings → Secrets and variables → Actions` :

| Secret | Obtention |
| --- | --- |
| `EXPO_TOKEN` | `expo.dev` → Account settings → Access tokens → *Create token* (portée : Robot user recommandé) |

Aucun autre secret n'est nécessaire pour les updates OTA. Pour la soumission aux stores, ajouter plus tard `APPLE_APP_SPECIFIC_PASSWORD` et le JSON de service Google Play (via `eas credentials`, jamais dans le dépôt).

## 4. `.github/workflows/ci.yml` — contrôles sur chaque PR

```yaml
name: CI
on:
  pull_request:
  push:
    branches: [main, develop]

jobs:
  verifier:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: npm }
      - run: npm ci
      - name: Types
        run: npx tsc --noEmit
      - name: Lint
        run: npx eslint .
      - name: Tests
        run: npm test -- --ci
      - name: Intégrité des données du recueil
        run: npm test -- tests/donnees.test.ts --ci
```

## 5. `.github/workflows/ota.yml` — publication OTA automatique

```yaml
name: OTA
on:
  push:
    branches: [main, develop]

jobs:
  publier:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: npm }
      - uses: expo/expo-github-action@v8
        with:
          eas-version: latest
          token: ${{ secrets.EXPO_TOKEN }}
      - run: npm ci
      - name: Publier sur production
        if: github.ref == 'refs/heads/main'
        run: eas update --branch production --message "${{ github.event.head_commit.message }}" --non-interactive
      - name: Publier sur preview
        if: github.ref == 'refs/heads/develop'
        run: eas update --branch preview --message "${{ github.event.head_commit.message }}" --non-interactive
```

Enchaînement : `needs: verifier` si l'on veut bloquer la publication quand la CI échoue — recommandé, à activer dès que les tests existent.

## 6. `.github/workflows/build.yml` — builds store, à la demande

```yaml
name: Build
on:
  workflow_dispatch:
    inputs:
      profil:
        description: Profil EAS
        required: true
        default: preview
        type: choice
        options: [preview, production]
      plateforme:
        description: Plateforme
        required: true
        default: all
        type: choice
        options: [android, ios, all]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: npm }
      - uses: expo/expo-github-action@v8
        with: { eas-version: latest, token: ${{ secrets.EXPO_TOKEN }} }
      - run: npm ci
      - run: eas build --profile ${{ inputs.profil }} --platform ${{ inputs.plateforme }} --non-interactive --no-wait
```

## 7. `CLAUDE.md` à la racine du dépôt

À créer pour que les sessions Claude Code suivantes respectent le système :

```markdown
# Recueil de Chants III — conventions

- Design de référence : dossier `design_handoff_recueil_chants_iii/` (README + 07 fichiers).
- Aucune valeur de couleur, taille ou espacement hors de `src/design/`.
- Aucune ombre, aucun rayon (sauf pilule de navigation et icône), aucun dégradé.
- Newsreader = le recueil (chiffres, titres, paroles). Archivo = l'application (libellés, réglages).
- Les données du recueil sont immuables : ni casse, ni accent, ni ponctuation modifiés.
- Le contraste de `ink3` est calibré (5,1:1) : ne pas éclaircir.
- Lecture = défilement vertical simple. Pas de pagination, pas de geste horizontal.
- Toute modification de contenu ou de JS part en OTA : `git push origin main`.
- Avant de pousser : `npx tsc --noEmit && npx eslint . && npm test`.
```

## 8. Fichier `README.md` du dépôt — contenu minimum

Installation (`npm ci`, `npx expo start`), lancement sur appareil, publication OTA (`eas update --branch production`), build store (`eas build --profile production`), et un renvoi vers `design_handoff_recueil_chants_iii/` pour toute question de design.
