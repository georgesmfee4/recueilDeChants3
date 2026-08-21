/**
 * Intégrité des données du recueil.
 *
 * À QUOI SERVENT CES TESTS ? Le contenu du recueil part en mise à jour OTA :
 * il suffit d'un `git push` pour remplacer les paroles sur tous les téléphones
 * déjà installés. C'est puissant, et donc dangereux. Ces neuf vérifications
 * sont le garde-fou : si un futur import de document abîme les données, la CI
 * refuse la publication AVANT qu'elle n'atteigne les utilisateurs.
 *
 * Les valeurs attendues viennent du dossier de remise (04-DONNEES.md § 2) et
 * ont toutes été confirmées sur le fichier réel.
 */
import { cantiques, choeurs, meta } from '@/data/recueil';

/** Compte toutes les lignes de paroles d'un chant, tous blocs confondus. */
function nombreDeLignes(parts: { l: string[] }[]): number {
  return parts.reduce((total, part) => total + part.l.length, 0);
}

describe('intégrité du recueil', () => {
  test('1 · le recueil contient exactement 302 cantiques', () => {
    expect(cantiques).toHaveLength(302);
    expect(meta.nbCantiques).toBe(302);
  });

  test('2 · le recueil contient exactement 85 chœurs', () => {
    expect(choeurs).toHaveLength(85);
    expect(meta.nbChoeurs).toBe(85);
  });

  test('3 · les numéros vont de 1 à 302, sans trou ni doublon', () => {
    const numeros = cantiques.map(c => c.n).sort((a, b) => a - b);
    const attendus = Array.from({ length: 302 }, (_, i) => i + 1);
    expect(numeros).toEqual(attendus);
  });

  test('4 · chaque chant a au moins un bloc, et chaque bloc au moins une ligne', () => {
    for (const chant of cantiques) {
      expect(chant.parts.length).toBeGreaterThan(0);
      for (const part of chant.parts) {
        expect(part.l.length).toBeGreaterThan(0);
      }
    }
    for (const choeur of choeurs) {
      expect(choeur.l.length).toBeGreaterThan(0);
    }
  });

  test('5 · le recueil totalise 5771 lignes de paroles', () => {
    const total = cantiques.reduce((somme, c) => somme + nombreDeLignes(c.parts), 0);
    expect(total).toBe(5771);
    expect(meta.nbLignes).toBe(5771);
  });

  test('6 · 11 cantiques n’ont aucun refrain', () => {
    const sansRefrain = cantiques.filter(c => !c.parts.some(p => p.t === 'r'));
    expect(sansRefrain).toHaveLength(11);
  });

  test('7 · 72 cantiques n’ont aucune strophe numérotée', () => {
    // Ce sont eux qui imposent le libellé « n strophes · sans numéro ».
    // Sans ce cas, on afficherait « 0 strophe », ce qui est faux.
    const sansStrophe = cantiques.filter(c => !c.parts.some(p => p.t === 'v'));
    expect(sansStrophe).toHaveLength(72);
  });

  test('8 · le chant le plus long est le n° 155, avec 99 lignes', () => {
    const plusLong = cantiques.reduce((a, b) =>
      nombreDeLignes(b.parts) > nombreDeLignes(a.parts) ? b : a,
    );
    expect(plusLong.n).toBe(155);
    expect(plusLong.title).toBe('IL Y A DE L’ESPOIR POUR TOI');
    expect(nombreDeLignes(plusLong.parts)).toBe(99);
  });

  test('9 · les chœurs n’utilisent que 17 lettres de classement', () => {
    const attendues = ['A', 'C', 'D', 'E', 'F', 'H', 'I', 'J', 'L', 'M', 'N', 'O', 'Q', 'S', 'T', 'V', 'Y'];
    const utilisees = [...new Set(choeurs.map(c => c.letter))].sort();
    expect(utilisees).toEqual(attendues);
    // `meta` doit annoncer exactement ce que contiennent les données : c'est
    // `meta` qui pilote l'affichage de la bande alphabétique.
    expect([...meta.lettresChoeurs].sort()).toEqual(attendues);
  });
});

describe('immuabilité du texte', () => {
  test('les titres du recueil ne sont jamais « corrigés »', () => {
    // Quatre titres pris comme témoins : accents manquants et casse mixte
    // sont CONFORMES à la source. Si un test échoue ici, c'est que du code a
    // transformé le texte — ce qui est interdit.
    const parNumero = new Map(cantiques.map(c => [c.n, c.title]));
    expect(parNumero.get(1)).toBe('UN BEAU JOUR LE MONDE SERA CONFONDU');
    expect(parNumero.get(133)).toBe('SOYEZ TOUJOURS HEUREUX');
    expect(parNumero.get(155)).toBe('IL Y A DE L’ESPOIR POUR TOI');
    // Apostrophe typographique (’) et non droite ('), telle quelle dans la source.
    expect(parNumero.get(155)).toContain('’');
  });
});
