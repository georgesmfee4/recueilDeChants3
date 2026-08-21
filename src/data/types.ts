/**
 * Schéma des données du recueil (voir design_handoff/04-DONNEES.md).
 *
 * Ces types décrivent EXACTEMENT le fichier `recueil-iii.json`.
 * Le contenu est immuable : on n'y corrige jamais une casse, un accent ou une
 * ponctuation depuis le code. Ce qui est écrit dans le recueil s'affiche tel quel.
 */

/** Un bloc de texte à l'intérieur d'un chant. */
export type Part =
  /** `v` = strophe NUMÉROTÉE dans le recueil (le numéro s'affiche dans la marge). */
  | { t: 'v'; n: number; l: string[] }
  /** `r` = bloc non numéroté : un refrain, ou une strophe que le recueil ne numérote pas. */
  | { t: 'r'; l: string[] };

export type Cantique = {
  /** De 1 à 302, sans trou ni doublon. */
  n: number;
  /** VERBATIM : capitales et accents tels quels dans le recueil. */
  title: string;
  /** Les blocs, dans l'ordre du recueil (beaucoup de chants commencent par le refrain). */
  parts: Part[];
};

export type Choeur = {
  /** De 1 à 85 — numérotation propre à l'application, le recueil ne numérote pas les chœurs. */
  n: number;
  /** Lettre de classement (A, C, D, …). */
  letter: string;
  l: string[];
};

export type Meta = {
  titre: string;
  edition: number;
  editionLabel: string;
  annee: number;
  auteur: string;
  nbCantiques: number;
  nbChoeurs: number;
  nbLignes: number;
  lettresChoeurs: string[];
  source: string;
  schema: number;
};

export type Recueil = {
  meta: Meta;
  cantiques: Cantique[];
  choeurs: Choeur[];
};
