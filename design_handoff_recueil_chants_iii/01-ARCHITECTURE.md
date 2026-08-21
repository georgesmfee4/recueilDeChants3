# 01 — Architecture

## 1. Pile technique

| Couche | Choix | Raison |
| --- | --- | --- |
| Runtime | **Expo (SDK stable le plus récent)** + React Native | OTA natif via `expo-updates`, build géré, pas de configuration native à maintenir |
| Langage | **TypeScript strict** (`strict: true`, `noUncheckedIndexedAccess: true`) | Les données du recueil sont typées et figées : le compilateur doit garantir l'accès |
| Navigation | **expo-router** (file-based, typed routes) | Liens profonds gratuits (`recueil://chant/133`), état d'URL cohérent avec la navigation par onglets |
| État | **Zustand** + `persist` sur **MMKV** (`react-native-mmkv`) | Favoris et préférences lus au démarrage de façon synchrone : aucun clignotement de thème |
| Listes | **@shopify/flash-list** | 302 lignes + 85 chœurs : recyclage indispensable, `estimatedItemSize` connu (62) |
| Animation | **react-native-reanimated** (+ `react-native-gesture-handler`) | Feuilles inférieures et pression de ligne à 60 fps sur le fil UI |
| SVG | **react-native-svg** | Logo et les 12 icônes redessinés, pas de bibliothèque d'icônes tierce |
| Flou | `expo-blur` | Fond de la pilule de navigation et des capsules |
| Polices | `expo-font` + `assets/fonts` | Fonctionnement hors connexion |
| OTA | `expo-updates` + **EAS Update** | Voir `05-OTA-EAS-UPDATE.md` |
| Tests | `jest-expo` + `@testing-library/react-native` | Contrats de données et logique de recherche |
| Qualité | ESLint (`eslint-config-expo`) + Prettier + `tsc --noEmit` | Exécutés en CI (voir `06-GITHUB-CI.md`) |

**À ne pas installer :** aucune bibliothèque de composants UI (Paper, NativeBase, gluestack, Tamagui). Le design est fait de filets et de blancs ; un système tiers l'écraserait. Les styles se font avec `StyleSheet.create` et les jetons de `tokens.ts`.

## 2. Arborescence

```
recueilDeChants3/
├── app/                              # expo-router
│   ├── _layout.tsx                   # providers : polices, thème, MMKV, updates
│   ├── index.tsx                     # 01 Lancement (redirige vers /(tabs) après l'animation)
│   ├── (tabs)/
│   │   ├── _layout.tsx               # pilule flottante personnalisée (pas la tab bar par défaut)
│   │   ├── accueil.tsx               # 02
│   │   ├── cantiques.tsx             # 03
│   │   ├── choeurs.tsx               # 06
│   │   └── favoris.tsx               # 09
│   ├── chant/[n].tsx                 # 04 + 05 (thème résolu par le contexte)
│   ├── recherche.tsx                 # 07 (modal plein écran)
│   ├── reglages/
│   │   ├── index.tsx                 # 10
│   │   └── a-propos.tsx              # 11
│   └── +not-found.tsx
├── src/
│   ├── design/
│   │   ├── tokens.ts                 # fourni dans ce dossier
│   │   ├── type.ts                   # échelle typographique (rôles → style)
│   │   └── ThemeProvider.tsx         # résout Clair/Sombre/Système → jeu de jetons
│   ├── data/
│   │   ├── recueil-iii.json          # fourni dans ce dossier (data/)
│   │   ├── recueil.ts                # chargement, typage, accès par numéro
│   │   ├── recherche.ts              # index normalisé + requête
│   │   └── structure.ts              # libellé « n strophes · refrain » / « sans numéro »
│   ├── store/
│   │   ├── prefs.ts                  # thème, taille, interligne, options
│   │   └── bibliotheque.ts           # favoris, dernier chant lu
│   ├── components/
│   │   ├── PiluleNav.tsx
│   │   ├── CapsuleLecture.tsx
│   │   ├── LigneIndex.tsx
│   │   ├── FeuilleInferieure.tsx     # coquille commune aux deux feuilles
│   │   ├── ClavierNumeros.tsx
│   │   ├── ChampRecherche.tsx
│   │   ├── Bascule.tsx
│   │   ├── Segments.tsx
│   │   ├── Filet.tsx
│   │   ├── Surtitre.tsx
│   │   └── icones/                   # 12 composants SVG, une seule signature { size, color }
│   ├── features/
│   │   └── lecture/
│   │       ├── ColonneLecture.tsx     # défilement vertical, blocs strophe/refrain
│   │       ├── BlocStrophe.tsx
│   │       ├── BlocRefrain.tsx
│   │       └── EnteteLecture.tsx
│   └── marque/
│       ├── LogoLivre.tsx             # SVG du logo (props : size, variante)
│       └── EcranLancement.tsx
├── assets/
│   ├── fonts/                        # Newsreader*.ttf, Archivo*.ttf
│   ├── icon.png                      # assets/icon-1024.png de ce dossier
│   └── adaptive-icon.png
├── .github/workflows/                # voir 06-GITHUB-CI.md
├── app.json · eas.json · tsconfig.json · CLAUDE.md
└── tests/
```

Règle : **un écran = un fichier de route** qui compose des composants ; aucune logique de données dans les routes (tout passe par `src/data` et `src/store`).

## 3. Thème

`ThemeProvider` expose `useTheme(): { c: Couleurs; mode: 'clair' | 'sombre' }`.

```ts
// résolution
const systeme = useColorScheme();               // 'light' | 'dark' | null
const choix = usePrefs(s => s.theme);           // 'Clair' | 'Sombre' | 'Système'
const mode = choix === 'Système' ? (systeme === 'dark' ? 'sombre' : 'clair')
                                 : (choix === 'Sombre' ? 'sombre' : 'clair');
```

- Les jetons ne sont **jamais** écrits en dur dans un composant : toujours `c.pri`, `c.ink3`, `c.rule`…
- L'écran « Lecture · nuit » du prototype n'est pas un écran séparé : c'est `chant/[n]` en mode sombre.
- `StatusBar` : `style={mode === 'sombre' ? 'light' : 'dark'}`.

## 4. Typographie

`src/design/type.ts` expose un rôle par usage, jamais des tailles nues :

```ts
export const type = {
  une:          { fontFamily: 'Newsreader_400Regular', fontSize: 44,   lineHeight: 43,  letterSpacing: -1.6 },
  titreEcran:   { fontFamily: 'Newsreader_400Regular', fontSize: 34,   lineHeight: 34,  letterSpacing: -1 },
  numeroChant:  { fontFamily: 'Newsreader_400Regular', fontSize: 56,   lineHeight: 49,  letterSpacing: -2.4 },
  numeroJour:   { fontFamily: 'Newsreader_400Regular', fontSize: 64,   lineHeight: 52,  letterSpacing: -3 },
  titreChant:   { fontFamily: 'Newsreader_400Regular', fontSize: 22,   lineHeight: 27,  letterSpacing: 0.3 },
  titreIndex:   { fontFamily: 'Archivo_600SemiBold',   fontSize: 12.5, lineHeight: 17,  letterSpacing: 0.4 },
  sousLigne:    { fontFamily: 'Newsreader_400Regular', fontSize: 13,   lineHeight: 18 },
  libelle:      { fontFamily: 'Archivo_500Medium',     fontSize: 14,   lineHeight: 18 },
  aide:         { fontFamily: 'Archivo_400Regular',    fontSize: 11.5, lineHeight: 15 },
  surtitre:     { fontFamily: 'Archivo_600SemiBold',   fontSize: 10,   lineHeight: 13,  letterSpacing: 2 },
  titreCourant: { fontFamily: 'Archivo_600SemiBold',   fontSize: 10.5, lineHeight: 14,  letterSpacing: 1.8 },
  pied:         { fontFamily: 'Archivo_400Regular',    fontSize: 10.5, lineHeight: 14,  letterSpacing: 1.4 },
} as const;

// paroles : dérivé des préférences
export const paroles = (taille: 0|1|2|3|4, interligne: 'Serré'|'Normal'|'Aéré') => {
  const size = [16.5, 18, 19.5, 21, 23][taille];
  const ratio = { 'Serré': 1.48, 'Normal': 1.64, 'Aéré': 1.84 }[interligne];
  return { fontFamily: 'Newsreader_400Regular', fontSize: size, lineHeight: Math.round(size * ratio * 10) / 10 };
};
```

**Attention React Native :** `letterSpacing` est en points (pas en em) — les valeurs ci-dessus sont déjà converties. `lineHeight` est absolu, pas un ratio : toujours passer par ces helpers.

Les capitales des titres du recueil **ne doivent pas** être obtenues par `textTransform: 'uppercase'` : les titres sont déjà en capitales dans les données. Ne rien transformer, sous peine de casser « Ô », « É » et les apostrophes typographiques.

## 5. Données

Voir `04-DONNEES.md` pour le schéma. Points d'architecture :

- Le JSON (≈ 245 Ko) est importé statiquement (`import recueil from './recueil-iii.json'`) : il est embarqué dans le bundle, donc **mis à jour par OTA**.
- Construire **une seule fois** au démarrage un index de recherche normalisé (`{ n, titreN, lignesN }`), mémorisé dans un module ; ne jamais normaliser dans le rendu.
- Accès par numéro en `O(1)` : `Map<number, Cantique>` construite au chargement.
- Aucune base de données : SQLite/AsyncStorage sont inutiles pour un contenu figé et rendraient les mises à jour OTA de contenu inopérantes.

## 6. Performance

| Point | Exigence |
| --- | --- |
| Index des cantiques | FlashList, `estimatedItemSize={62}`, `keyExtractor` sur `n`, ligne mémorisée (`React.memo`) |
| Tri A→Z | Calculé une fois et mis en cache (`useMemo` au niveau module), jamais à chaque rendu |
| Lecture | `ScrollView` simple : le chant le plus long fait 99 lignes (chant 155), inutile de virtualiser |
| Recherche | Debounce 120 ms, arrêt à 7 résultats, boucle `for` sur l'index normalisé (pas de `filter`/`map` chaînés) |
| Rail des dizaines | `scrollToIndex` sur la FlashList, pas de re-render de la liste |
| Défilement de lecture | `scrollTo({ y: 0, animated: false })` au changement de chant |
| Écran allumé | `expo-keep-awake` activé uniquement pendant la lecture si l'option est cochée |

## 7. Accessibilité

- Contraste : `ink3` est déjà calibré (5,1:1 en clair, 5,2:1 en sombre) — **ne pas éclaircir**.
- `accessibilityLabel` sur tous les boutons icône : « Favoris », « Réglages », « Aller à un chant », « Chant précédent », « Chant suivant », « Plus d'actions », « Effacer la recherche ».
- Cibles tactiles ≥ 46 (`hitSlop` si le visuel est plus petit).
- Respecter `AccessibilityInfo.isReduceMotionEnabled()` : supprimer l'animation d'ouverture du lancement et les translations de feuille.
- Le réglage de taille de texte de l'application est indépendant de `fontScale` du système ; ne pas empiler les deux (`allowFontScaling={false}` sur les paroles, la taille est déjà réglable dans l'app).

## 8. Conventions de code (à mettre dans `CLAUDE.md` du dépôt)

1. Français pour les noms de domaine (`cantique`, `choeur`, `strophe`, `refrain`, `favoris`), anglais pour les termes techniques.
2. Pas de valeur littérale de couleur, de taille ou d'espacement hors de `src/design/`.
3. Un composant par fichier, export nommé, props typées explicitement.
4. Pas d'ombre, pas de `borderRadius` hors pilule/icône, pas de dégradé : toute PR qui en introduit est refusée.
5. Les données du recueil sont **immuables** : aucune correction de casse, d'accent ou de ponctuation dans le code.
