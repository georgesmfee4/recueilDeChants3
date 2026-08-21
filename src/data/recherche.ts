/**
 * Recherche dans le recueil — titres et paroles, insensible aux accents.
 *
 * Principe : on prépare UN SEUL index normalisé au chargement du module
 * (302 titres + 5771 lignes). Ensuite chaque frappe ne fait qu'une boucle
 * simple sur cet index, et s'arrête dès 7 résultats. Pas de score de
 * pertinence : quelqu'un qui cherche un cantique connaît son début, l'ordre
 * des numéros est le plus lisible.
 */
import { cantiques, choeurs } from './recueil';
import { normaliser } from './normaliser';

/** Nombre maximum de résultats affichés (maquette 07 · Recherche). */
export const MAX_RESULTATS = 7;
/** En dessous de 2 caractères, on n'affiche que le décompte du recueil. */
export const MIN_CARACTERES = 2;

type Entree = {
  n: number;
  /** Titre affiché (verbatim) et sa version normalisée pour la comparaison. */
  titre: string;
  titreN: string;
  /** Lignes de paroles : version affichable et version normalisée, même index. */
  lignes: string[];
  lignesN: string[];
};

/**
 * Les deux index, construits PARESSEUSEMENT.
 *
 * Normaliser les 302 titres et les 5771 vers coûte cher. Le faire au
 * chargement du module retarderait l'ouverture de l'application pour un
 * service dont la plupart des ouvertures ne se servent jamais. On attend donc
 * la première recherche — et l'écran affiche un squelette pendant ce
 * court instant. Une fois construits, les index restent en mémoire.
 */
let cacheIndex: { cantiques: Entree[]; choeurs: Entree[] } | null = null;

function index() {
  if (!cacheIndex) {
    cacheIndex = {
      cantiques: cantiques.map(c => {
        const lignes = c.parts.flatMap(p => p.l);
        return {
          n: c.n,
          titre: c.title,
          titreN: normaliser(c.title),
          lignes,
          lignesN: lignes.map(normaliser),
        };
      }),
      // Pour un chœur, le « titre » est sa première ligne.
      choeurs: choeurs.map(ch => {
        const titre = ch.l[0] ?? '';
        return {
          n: ch.n,
          titre,
          titreN: normaliser(titre),
          lignes: ch.l,
          lignesN: ch.l.map(normaliser),
        };
      }),
    };
  }
  return cacheIndex;
}

/** Un extrait de parole découpé en trois morceaux pour surligner le terme trouvé. */
export type Extrait = { avant: string; trouve: string; apres: string };

export type Resultat = {
  n: number;
  titre: string;
  /** Absent quand la correspondance est sur le titre lui-même. */
  extrait?: Extrait;
  origine: 'cantique' | 'choeur';
};

/**
 * Découpe la ligne d'origine autour du terme trouvé.
 * On travaille sur la ligne normalisée pour trouver la POSITION, puis on
 * découpe la ligne d'ORIGINE à cette même position : la normalisation
 * conserve la longueur des chaînes, les index restent donc alignés.
 */
function decouper(ligne: string, ligneN: string, requeteN: string): Extrait {
  const i = ligneN.indexOf(requeteN);
  return {
    avant: ligne.slice(0, i),
    trouve: ligne.slice(i, i + requeteN.length),
    apres: ligne.slice(i + requeteN.length),
  };
}

/** Cherche dans un index donné et empile les résultats jusqu'à la limite. */
function chercherDans(
  index: Entree[],
  requeteN: string,
  origine: Resultat['origine'],
  resultats: Resultat[],
): void {
  for (const entree of index) {
    if (resultats.length >= MAX_RESULTATS) return;

    // 1. Le titre d'abord : c'est la correspondance la plus parlante.
    if (entree.titreN.includes(requeteN)) {
      resultats.push({ n: entree.n, titre: entree.titre, origine });
      continue;
    }

    // 2. Sinon, la première ligne de paroles qui contient le terme.
    for (let i = 0; i < entree.lignesN.length; i++) {
      const ligneN = entree.lignesN[i]!;
      if (!ligneN.includes(requeteN)) continue;
      resultats.push({
        n: entree.n,
        titre: entree.titre,
        extrait: decouper(entree.lignes[i]!, ligneN, requeteN),
        origine,
      });
      break;
    }
  }
}

/** Lance la recherche. Renvoie au plus `MAX_RESULTATS` résultats, cantiques d'abord. */
export function rechercher(requete: string): Resultat[] {
  const requeteN = normaliser(requete.trim());
  if (requeteN.length < MIN_CARACTERES) return [];

  const { cantiques: idxCantiques, choeurs: idxChoeurs } = index();
  const resultats: Resultat[] = [];
  // Les cantiques d'abord : c'est ce qu'on cherche neuf fois sur dix.
  chercherDans(idxCantiques, requeteN, 'cantique', resultats);
  chercherDans(idxChoeurs, requeteN, 'choeur', resultats);
  return resultats;
}

/**
 * La saisie est-elle un numéro de chant (1 à 3 chiffres) ?
 * Si oui, la recherche propose en tête « Aller directement au chant ».
 */
export function numeroSaisi(requete: string): number | null {
  const t = requete.trim();
  if (!/^\d{1,3}$/.test(t)) return null;
  return Number(t);
}
