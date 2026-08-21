# 05 — Mises à jour OTA (EAS Update)

Objectif : pouvoir corriger une parole, un titre, une couleur ou un écran et **le livrer en quelques minutes** sur les téléphones déjà installés, sans passer par l'App Store ni le Play Store.

## 1. Ce qui passe en OTA — et ce qui n'y passe pas

| Passe en OTA | Ne passe **pas** en OTA (nécessite un build store) |
| --- | --- |
| Paroles, titres, nouvelle édition du recueil (`recueil-iii.json`) | Ajout d'une bibliothèque avec code natif |
| Tout le code JavaScript / TypeScript, tous les écrans | Changement de version d'Expo SDK |
| Couleurs, typographie, mise en page, animations | Icône d'application, nom, permissions |
| Images et polices du dossier `assets/` | Écran de lancement natif |

Conséquence pratique : **le contenu du recueil est en JavaScript** (JSON importé), donc chaque correction de texte est une mise à jour OTA. C'est le choix d'architecture qui rend le produit maintenable par l'auteur.

## 2. Installation

```bash
npx expo install expo-updates
npm i -g eas-cli
eas login
eas init            # crée le projectId dans app.json
eas update:configure
```

## 3. `app.json`

```json
{
  "expo": {
    "name": "Recueil de Chants",
    "slug": "recueil-de-chants-iii",
    "version": "3.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "scheme": "recueil",
    "userInterfaceStyle": "automatic",
    "backgroundColor": "#FBFAF7",
    "splash": {
      "image": "./assets/splash-logo.png",
      "resizeMode": "contain",
      "backgroundColor": "#4E2A84"
    },
    "ios": { "supportsTablet": false, "bundleIdentifier": "app.recueildechants.iii" },
    "android": {
      "package": "app.recueildechants.iii",
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#FBFAF7"
      }
    },
    "updates": {
      "url": "https://u.expo.dev/<projectId>",
      "enabled": true,
      "checkAutomatically": "ON_LOAD",
      "fallbackToCacheTimeout": 0
    },
    "runtimeVersion": { "policy": "fingerprint" },
    "plugins": ["expo-router", "expo-font", "expo-updates"],
    "extra": { "eas": { "projectId": "<projectId>" } }
  }
}
```

Points importants :

- **`runtimeVersion.policy: "fingerprint"`** : Expo calcule une empreinte des dépendances natives. Une update n'est proposée qu'aux binaires compatibles — impossible de « casser » une application installée en publiant du JS qui attend un module natif absent.
- **`fallbackToCacheTimeout: 0`** : démarrage instantané sur la version en cache ; la nouvelle update est téléchargée en arrière-plan et appliquée au lancement suivant (ou immédiatement, voir § 5). Un recueil doit s'ouvrir sans attendre le réseau, en pleine assemblée.
- `checkAutomatically: "ON_LOAD"` : vérification à chaque ouverture, silencieuse.

## 4. `eas.json`

```json
{
  "cli": { "version": ">= 12.0.0", "appVersionSource": "remote" },
  "build": {
    "development": { "developmentClient": true, "distribution": "internal", "channel": "development" },
    "preview":     { "distribution": "internal", "channel": "preview" },
    "production":  { "autoIncrement": true, "channel": "production" }
  },
  "submit": { "production": {} }
}
```

Trois canaux : `development` (client de dev), `preview` (APK/TestFlight interne pour l'auteur), `production` (stores). Une branche EAS Update est associée à chaque canal.

## 5. Application des updates dans le code

`src/updates/useMiseAJour.ts` — comportement volontairement discret, cohérent avec le design (aucune bannière tape-à-l'œil) :

```ts
import * as Updates from 'expo-updates';
import { useEffect, useState } from 'react';
import { AppState } from 'react-native';

export function useMiseAJour() {
  const [prete, setPrete] = useState(false);

  useEffect(() => {
    if (__DEV__) return;
    const verifier = async () => {
      try {
        const r = await Updates.checkForUpdateAsync();
        if (r.isAvailable) { await Updates.fetchUpdateAsync(); setPrete(true); }
      } catch { /* hors connexion : silence, l'app fonctionne */ }
    };
    verifier();
    const sub = AppState.addEventListener('change', s => { if (s === 'active') verifier(); });
    return () => sub.remove();
  }, []);

  return { prete, appliquer: () => Updates.reloadAsync() };
}
```

Affichage : dans **Réglages**, une ligne apparaît en bas de la section « L'application » quand `prete === true` :

- Libellé `Mise à jour disponible`, aide « Le recueil a été corrigé ou complété »
- Valeur `Installer` en `pri` (Newsreader 15) → `appliquer()`
- **Jamais** de modale pendant la lecture, jamais de rechargement automatique en cours de culte.

## 6. Publier une mise à jour

```bash
# correction de contenu ou d'interface
git commit -am "corrige la 3e strophe du chant 133"
git push origin main            # la CI publie automatiquement (voir 06-GITHUB-CI.md)

# ou manuellement
eas update --branch production --message "corrige la 3e strophe du chant 133"

# tester d'abord sur le canal interne
eas update --branch preview --message "essai avant diffusion"
```

Vérifications utiles :

```bash
eas update:list --branch production      # historique
eas channel:view production              # branche servie
eas update:republish --group <id>        # revenir à une update précédente (rollback)
```

## 7. Politique de version

| Situation | Action |
| --- | --- |
| Correction de paroles, de titre, de mise en page | OTA sur `production`, `version` inchangée |
| Nouvel écran, nouvelle fonctionnalité en JS | OTA sur `production`, incrémenter `3.0.x` |
| Nouvelle édition complète du recueil | OTA + `3.1.0` + note dans l'écran À propos |
| Nouvelle dépendance native, nouveau SDK Expo | **Build store** obligatoire, `3.x.0`, la `runtimeVersion` change |

Toujours tester sur `preview` avant `production` : une update publiée est immédiatement servie à tous les appareils du canal.

## 8. Rollback

```bash
eas update:list --branch production        # repérer le groupe précédent
eas update:republish --group <groupe-ok> --message "retour arrière"
```

L'update fautive reste dans l'historique mais n'est plus servie. Les appareils reviennent à la version saine au lancement suivant.
