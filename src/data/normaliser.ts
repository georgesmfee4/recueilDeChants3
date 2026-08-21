/**
 * Normalisation du texte pour la recherche.
 *
 * On veut que « grace » trouve « grâce » et que « GLOIRE » trouve « Gloire ».
 * La recette : tout en minuscules, puis on décompose les caractères accentués
 * (NFD transforme « â » en « a » + accent circonflexe) et on supprime les
 * accents devenus des caractères séparés (plage Unicode U+0300 → U+036F).
 *
 * Cette fonction est appelée UNE SEULE FOIS par ligne, au démarrage, pour
 * construire l'index. Jamais pendant le rendu : ce serait beaucoup trop lent.
 */
export function normaliser(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}
