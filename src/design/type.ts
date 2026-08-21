/**
 * Échelle typographique — un rôle par usage.
 *
 * Règle du recueil : on n'écrit JAMAIS une taille de police à la main dans un
 * écran. On pioche un rôle ici. Comme ça, si le designer change « le titre
 * d'écran », on le change à un seul endroit.
 *
 * Deux familles, jamais mélangées :
 *   - Newsreader (serif) = le recueil  -> chiffres, titres de chants, paroles
 *   - Archivo   (sans)  = l'application -> libellés, réglages, index
 *
 * À savoir sur React Native :
 *   - `lineHeight` est une valeur ABSOLUE en points, pas un ratio.
 *     (44 × 0,98 = 43, on écrit donc 43.)
 *   - `letterSpacing` est en points, pas en `em`. Les valeurs ci-dessous sont
 *     déjà converties depuis la maquette.
 */
import { polices } from './tokens';

export const type = {
  /** « Recueil / de Chants » sur l'accueil. */
  une: { fontFamily: polices.serif.regular, fontSize: 44, lineHeight: 43, letterSpacing: -1.6 },
  /** « Cantiques », « Chœurs », « Favoris », « Réglages ». */
  titreEcran: { fontFamily: polices.serif.regular, fontSize: 34, lineHeight: 34, letterSpacing: -1 },
  /** Le grand numéro en haut d'un chant en lecture. */
  numeroChant: {
    fontFamily: polices.serif.regular,
    fontSize: 56,
    lineHeight: 49,
    letterSpacing: -2.4,
  },
  /** Le numéro du « chant du jour » sur l'accueil (encore plus grand). */
  numeroJour: { fontFamily: polices.serif.regular, fontSize: 64, lineHeight: 52, letterSpacing: -3 },
  /** Titre du chant sous le grand numéro, en lecture. */
  titreChant: {
    fontFamily: polices.serif.regular,
    fontSize: 22,
    lineHeight: 27,
    letterSpacing: 0.3,
  },
  /** Titre d'une ligne de l'index des cantiques. */
  titreIndex: {
    fontFamily: polices.sans.semibold,
    fontSize: 12.5,
    lineHeight: 17,
    letterSpacing: 0.4,
  },
  /** Sous-ligne grise d'une ligne d'index (première parole du chant). */
  sousLigne: { fontFamily: polices.serif.regular, fontSize: 13, lineHeight: 18 },
  /** Libellé d'un réglage, d'une action, d'un accès. */
  libelle: { fontFamily: polices.sans.medium, fontSize: 14, lineHeight: 18 },
  /** Petite phrase d'aide sous un libellé de réglage. */
  aide: { fontFamily: polices.sans.regular, fontSize: 11.5, lineHeight: 15 },
  /** Petite capitale espacée au-dessus d'un bloc (« REPRENDRE », « APERÇU »). */
  surtitre: { fontFamily: polices.sans.semibold, fontSize: 10, lineHeight: 13, letterSpacing: 2 },
  /** Titre courant en haut de l'écran de lecture. */
  titreCourant: {
    fontFamily: polices.sans.semibold,
    fontSize: 10.5,
    lineHeight: 14,
    letterSpacing: 1.8,
  },
  /** Pied de l'écran de lecture (« 5 STROPHES · REFRAIN »). */
  pied: { fontFamily: polices.sans.regular, fontSize: 10.5, lineHeight: 14, letterSpacing: 1.4 },
} as const;

export type CranTaille = 0 | 1 | 2 | 3 | 4;
export type Interligne = 'Serré' | 'Normal' | 'Aéré';

/** Les 5 tailles de paroles réglables, dans l'ordre des crans. */
const TAILLES = [16.5, 18, 19.5, 21, 23] as const;
/** Les 3 interlignes réglables. */
const RATIOS: Record<Interligne, number> = { 'Serré': 1.48, 'Normal': 1.64, 'Aéré': 1.84 };

/**
 * Style des paroles — le seul style calculé, parce qu'il dépend des réglages
 * de l'utilisateur (taille du texte + interligne).
 *
 * On arrondit au dixième pour éviter des `lineHeight` à 12 décimales qui
 * feraient sauter le texte d'un pixel d'un rendu à l'autre.
 */
export function styleParoles(taille: CranTaille, interligne: Interligne) {
  const size = TAILLES[taille];
  const ratio = RATIOS[interligne];
  return {
    fontFamily: polices.serif.regular,
    fontSize: size,
    lineHeight: Math.round(size * ratio * 10) / 10,
  };
}

/** Même chose mais en italique : utilisé par les refrains. */
export function styleParolesItaliques(taille: CranTaille, interligne: Interligne) {
  return { ...styleParoles(taille, interligne), fontFamily: polices.serif.italic };
}

/** Taille en points du cran demandé — sert à afficher « Standard · 19,5 px ». */
export function tailleDuCran(taille: CranTaille): number {
  return TAILLES[taille];
}
