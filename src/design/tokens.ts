/**
 * Recueil de Chants III — jetons de design
 * Source de vérité. Aucune valeur de couleur, taille ou espacement ne doit
 * apparaître ailleurs que dans ce fichier et src/design/type.ts.
 *
 * Toutes les valeurs sont en points logiques (dp/pt), calibrées sur 390 × 844.
 */

export const clair = {
  ink: '#17131F',
  ink2: '#5A5566',
  ink3: '#6E687C',      // contraste 5,1:1 sur paper — ne pas éclaircir
  paper: '#FBFAF7',
  surf: '#FFFFFF',
  surf2: '#F5F2EC',
  rule: '#E4DFD6',
  ruleSoft: '#F0ECE4',
  pri: '#4E2A84',
  priDeep: '#381E63',
  priSoft: '#F3EEFB',
  onPri: '#FFFFFF',
  or: '#F0C069',
  blur: 'rgba(251,250,247,0.90)',
  voile: 'rgba(23,19,31,0.42)',
  inactif: '#EDE9E1',
  inactifTexte: '#A9A3B0',
} as const;

export const sombre = {
  ink: '#F5F2F8',
  ink2: '#ADA5BB',
  ink3: '#8B8399',      // contraste 5,2:1 sur paper — ne pas assombrir
  paper: '#141019',
  surf: '#1C1626',
  surf2: '#1F1829',
  rule: '#2C2439',
  ruleSoft: '#221B2E',
  pri: '#B79AE6',
  priDeep: '#C9B2F0',
  priSoft: '#251D36',
  onPri: '#1A1424',
  or: '#F0C069',        // l'or ne change jamais : constante de la marque
  blur: 'rgba(20,16,25,0.86)',
  voile: 'rgba(0,0,0,0.55)',
  inactif: '#241D31',
  inactifTexte: '#6B6479',
} as const;

/**
 * Le jeu de couleurs actif, quel que soit le mode.
 *
 * Attention au piège : `typeof clair` donnerait des types LITTÉRAUX
 * (`ink: '#17131F'`), et le mode sombre — dont `ink` vaut '#F5F2F8' — ne
 * serait alors pas du même type. On élargit donc chaque jeton en `string`,
 * tout en gardant la liste exacte des noms de jetons autorisés.
 */
export type Couleurs = { readonly [Jeton in keyof typeof clair]: string };

/** Couverture, dos, titre et filets du logo selon la variante. */
export const logo = {
  marque:     { couverture: '#4E2A84', dos: '#381E63', titre: '#FFFFFF', filet: '#F0C069' },
  lancement:  { couverture: '#FBFAF7', dos: '#E2D8F2', titre: '#381E63', filet: '#4E2A84' },
  sombre:     { couverture: '#6B3FAE', dos: '#4E2A84', titre: '#FFFFFF', filet: '#F0C069' },
  monochrome: { couverture: '#17131F', dos: '#000000', titre: '#FFFFFF', filet: '#FBFAF7' },
} as const;

/** Base 4. Échelle réellement utilisée dans les écrans. */
export const espace = { xs: 4, sm: 8, md: 14, lg: 22, xl: 34 } as const;

export const mise = {
  margeEcran: 28,
  margeLecture: 30,        // symétrique, obligatoire
  margeListeGauche: 14,    // numéros débordant dans la marge
  margeListeDroite: 42,    // rail des dizaines
  hauteurBarreEtat: 50,
  hauteurLigneIndex: 62,
  cibleMin: 46,
  filet: 1,
  rayon: 0,                // partout, sauf ci-dessous
  rayonPilule: 100,
  reservePilule: 100,      // espace bas à réserver quand la pilule est visible
  pilule: { padding: 8, onglet: 46, recherche: 54, basEcran: 24, flou: 16, point: 3 },
  capsule: { hauteur: 92, padding: [11, 15] as const, flou: 12 },
  feuille: { padding: [22, 26, 30] as const, touche: 56, interstice: 1 },
} as const;

/** Paroles : 5 crans de taille × 3 crans d'interligne. */
export const paroles = {
  tailles: [16.5, 18, 19.5, 21, 23] as const,
  taillesLabels: ['Compact', 'Confortable', 'Standard', 'Grand', 'Très grand'] as const,
  tailleDefaut: 2,
  interlignes: { 'Serré': 1.48, 'Normal': 1.64, 'Aéré': 1.84 } as const,
  interligneDefaut: 'Normal' as const,
};

/** Une seule courbe dans tout le produit. Le papier ne rebondit pas. */
export const mouvement = {
  courbe: [0.2, 0.8, 0.16, 1] as const,
  feuilleEntree: 340,
  feuilleSortie: 240,
  voile: 220,
  pression: 120,
  bascule: 200,
  segments: 160,
  piluleCapsule: 260,
  lancement: { livre: 800, filet: [700, 500] as const, surtitre: [700, 620] as const, pied: [800, 900] as const },
} as const;

/**
 * Noms des familles de police.
 *
 * Ce sont les NOMS POSTSCRIPT des fichiers (`Newsreader-Regular`, et non
 * `Newsreader_400Regular`). C'est volontaire et important :
 *
 * Les polices sont embarquées dans l'application au moment de la compilation,
 * par le plugin `expo-font` déclaré dans app.json. Or ce plugin nomme les
 * familles différemment selon la plateforme : sur Android c'est le NOM DU
 * FICHIER, sur iOS c'est le NOM POSTSCRIPT inscrit dans le fichier. En
 * nommant chaque fichier comme son nom PostScript, les deux coïncident et on
 * n'écrit qu'un seul nom pour les deux plateformes.
 *
 * Conséquence : plus aucun chargement de police au démarrage. L'application
 * s'ouvre directement avec la bonne typographie.
 */
export const polices = {
  serif: {
    regular: 'Newsreader-Regular',
    medium: 'Newsreader-Medium',
    semibold: 'Newsreader-SemiBold',
    italic: 'Newsreader-Italic',
  },
  sans: {
    regular: 'Archivo-Regular',
    medium: 'Archivo-Medium',
    semibold: 'Archivo-SemiBold',
    bold: 'Archivo-Bold',
  },
} as const;
