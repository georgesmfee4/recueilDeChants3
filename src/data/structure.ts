/**
 * Libellé de la structure d'un chant : « 5 strophes · refrain ».
 *
 * Piège à éviter : 72 chants du recueil n'ont AUCUNE strophe numérotée
 * (que des blocs `r`). Si on comptait bêtement les `v`, on afficherait
 * « 0 strophe », ce qui est faux et interdit par la maquette.
 * Dans ce cas on compte les blocs et on précise « sans numéro ».
 */
import type { Cantique } from './types';

export function structure(c: Cantique): string {
  const strophes = c.parts.filter(p => p.t === 'v').length;
  const autres = c.parts.length - strophes;

  if (strophes > 0) {
    const mot = strophes > 1 ? 'strophes' : 'strophe';
    return `${strophes} ${mot}${autres > 0 ? ' · refrain' : ''}`;
  }

  const mot = autres > 1 ? 'strophes' : 'strophe';
  return `${autres} ${mot} · sans numéro`;
}

/** Version capitales, pour le pied de l'écran de lecture. */
export function structureCapitales(c: Cantique): string {
  return structure(c).toUpperCase();
}
