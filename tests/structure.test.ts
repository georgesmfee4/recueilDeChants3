/**
 * Libellé de structure et sous-lignes d'index.
 *
 * Deux règles d'affichage faciles à casser sans s'en rendre compte :
 *   - on n'écrit JAMAIS « 0 strophe » ;
 *   - la sous-ligne d'index ne répète JAMAIS le titre.
 */
import { structure, structureCapitales } from '@/data/structure';
import { cantiques, cantiquesAlpha, lettresCantiques, sousLigne } from '@/data/recueil';
import { normaliser } from '@/data/normaliser';
import type { Cantique } from '@/data/types';

/** Fabrique un chant de test, sans toucher aux vraies données. */
function chantFactice(parts: Cantique['parts']): Cantique {
  return { n: 1, title: 'ESSAI', parts };
}

describe('libellé de structure', () => {
  test('strophes numérotées, avec refrain', () => {
    const c = chantFactice([
      { t: 'v', n: 1, l: ['a'] },
      { t: 'r', l: ['b'] },
      { t: 'v', n: 2, l: ['c'] },
    ]);
    expect(structure(c)).toBe('2 strophes · refrain');
  });

  test('une seule strophe : le mot reste au singulier', () => {
    const c = chantFactice([{ t: 'v', n: 1, l: ['a'] }]);
    expect(structure(c)).toBe('1 strophe');
  });

  test('aucune strophe numérotée : « sans numéro », jamais « 0 strophe »', () => {
    const c = chantFactice([
      { t: 'r', l: ['a'] },
      { t: 'r', l: ['b'] },
    ]);
    expect(structure(c)).toBe('2 strophes · sans numéro');
  });

  test('AUCUN chant du recueil ne produit « 0 strophe »', () => {
    // Le test qui compte vraiment : il passe sur les 302 chants réels.
    for (const chant of cantiques) {
      expect(structure(chant)).not.toMatch(/^0 /);
    }
  });

  test('la version capitales sert au pied de lecture', () => {
    const c = chantFactice([
      { t: 'v', n: 1, l: ['a'] },
      { t: 'r', l: ['b'] },
    ]);
    expect(structureCapitales(c)).toBe('1 STROPHE · REFRAIN');
  });
});

describe('sous-ligne d’index', () => {
  test('elle ne répète jamais le titre', () => {
    for (const chant of cantiques) {
      const titre = normaliser(chant.title);
      const sous = normaliser(sousLigne(chant));
      expect(sous).not.toBe(titre);
    }
  });

  test('elle n’est jamais vide', () => {
    for (const chant of cantiques) {
      expect(sousLigne(chant).length).toBeGreaterThan(0);
    }
  });
});

describe('classement alphabétique', () => {
  test('les 302 chants sont tous présents une fois', () => {
    const alpha = cantiquesAlpha();
    expect(alpha).toHaveLength(302);
    expect(new Set(alpha.map(c => c.n)).size).toBe(302);
  });

  test('l’ordre est croissant sur le titre normalisé', () => {
    // C'est le contrat du tri : on compare des clés normalisées, pas des
    // titres bruts. « ÉTONNANT » doit suivre « ETERNEL », pas finir en Z.
    const cles = cantiquesAlpha().map(c => normaliser(c.title));
    expect(cles).toEqual([...cles].sort());
  });

  test('le rail des lettres pointe sur de vraies positions', () => {
    const alpha = cantiquesAlpha();
    for (const repere of lettresCantiques()) {
      const chant = alpha[repere.index];
      expect(chant).toBeDefined();
      expect(normaliser(chant!.title).charAt(0).toUpperCase()).toBe(repere.lettre);
    }
  });
});
