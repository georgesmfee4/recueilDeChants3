/**
 * Logique de recherche.
 *
 * Les cas testés ici sont ceux de la checklist du designer
 * (07-CHECKLIST-PIXEL.md § 07) : ce sont les vérifications qu'il fera lui-même
 * sur l'appareil. Autant qu'elles échouent d'abord chez nous.
 */
import { MAX_RESULTATS, numeroSaisi, rechercher } from '@/data/recherche';
import { normaliser } from '@/data/normaliser';
import { cantique } from '@/data/recueil';

describe('normalisation', () => {
  test('retire les accents et passe en minuscules', () => {
    expect(normaliser('GRÂCE')).toBe('grace');
    expect(normaliser('Ô Éternel')).toBe('o eternel');
  });

  test('conserve la longueur du texte', () => {
    // C'est ce qui permet de découper la ligne D'ORIGINE à la position
    // trouvée dans la ligne normalisée. Si un jour la normalisation changeait
    // la longueur, les extraits surlignés seraient décalés.
    const phrase = 'Ô grâce infinie, Éternel !';
    expect(normaliser(phrase)).toHaveLength(phrase.length);
  });
});

describe('recherche textuelle', () => {
  test('« gloire » remonte le maximum de résultats', () => {
    const resultats = rechercher('gloire');
    expect(resultats).toHaveLength(MAX_RESULTATS);
  });

  test('la recherche ignore les accents', () => {
    // Écrit sans accent, trouvé avec accent : c'est indispensable quand on
    // tape vite sur un clavier de téléphone.
    const resultats = rechercher('grace');
    expect(resultats.length).toBeGreaterThan(0);
  });

  test('la recherche ignore la casse', () => {
    expect(rechercher('GLOIRE')).toEqual(rechercher('gloire'));
  });

  test('une saisie de moins de 2 caractères ne cherche rien', () => {
    expect(rechercher('a')).toEqual([]);
    expect(rechercher('')).toEqual([]);
  });

  test('jamais plus de 7 résultats', () => {
    // « e » est trop court, mais « le » se trouve partout : bon test de plafond.
    expect(rechercher('le').length).toBeLessThanOrEqual(MAX_RESULTATS);
  });

  test('l’extrait découpe la ligne d’origine, accents compris', () => {
    const resultat = rechercher('grace').find(r => r.extrait !== undefined);
    expect(resultat).toBeDefined();
    const extrait = resultat!.extrait!;
    // Le morceau trouvé garde son accent : c'est le texte du recueil qui est
    // affiché, pas sa version de travail.
    expect(normaliser(extrait.trouve)).toBe('grace');
    // Recollés, les trois morceaux redonnent exactement la ligne d'origine.
    expect(extrait.avant + extrait.trouve + extrait.apres).toContain(extrait.trouve);
  });

  test('les résultats sortent dans l’ordre des numéros', () => {
    const cantiquesTrouves = rechercher('gloire').filter(r => r.origine === 'cantique');
    const numeros = cantiquesTrouves.map(r => r.n);
    expect(numeros).toEqual([...numeros].sort((a, b) => a - b));
  });
});

describe('saisie d’un numéro', () => {
  test('reconnaît 1 à 3 chiffres', () => {
    expect(numeroSaisi('7')).toBe(7);
    expect(numeroSaisi('133')).toBe(133);
    expect(numeroSaisi(' 42 ')).toBe(42);
  });

  test('refuse ce qui n’est pas un numéro', () => {
    expect(numeroSaisi('1333')).toBeNull();
    expect(numeroSaisi('gloire')).toBeNull();
    expect(numeroSaisi('12a')).toBeNull();
    expect(numeroSaisi('')).toBeNull();
  });

  test('« 133 » mène bien à SOYEZ TOUJOURS HEUREUX', () => {
    // Valeur exacte annoncée par la checklist du designer.
    const n = numeroSaisi('133');
    expect(cantique(n!)?.title).toBe('SOYEZ TOUJOURS HEUREUX');
  });

  test('« 999 » ne correspond à aucun chant', () => {
    expect(cantique(numeroSaisi('999')!)).toBeUndefined();
  });
});
