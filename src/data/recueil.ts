/**
 * Accès aux données du recueil.
 *
 * Le JSON est importé statiquement : il est donc EMBARQUÉ dans le bundle
 * JavaScript. Deux conséquences volontaires :
 *   1. l'application fonctionne hors connexion dès la première ouverture ;
 *   2. une correction de paroles part en mise à jour OTA (voir 05-OTA-EAS-UPDATE.md).
 *
 * Tout ce qui coûte cher (la Map d'accès, le tri alphabétique) est calculé
 * UNE FOIS au chargement du module, pas à chaque rendu.
 */
import brut from './recueil-iii.json';
import { normaliser } from './normaliser';
import { structure } from './structure';
import type { Cantique, Choeur, Meta, Recueil } from './types';

const recueil = brut as unknown as Recueil;

export const meta: Meta = recueil.meta;
export const cantiques: Cantique[] = recueil.cantiques;
export const choeurs: Choeur[] = recueil.choeurs;

/** Accès direct par numéro, en O(1) : `parNumero.get(133)`. */
const parNumero = new Map<number, Cantique>(cantiques.map(c => [c.n, c]));

/** Renvoie le chant demandé, ou `undefined` si le numéro n'existe pas. */
export function cantique(n: number): Cantique | undefined {
  return parNumero.get(n);
}

/** Le numéro existe-t-il dans le recueil ? Sert au clavier « Aller à un chant ». */
export function numeroValide(n: number): boolean {
  return parNumero.has(n);
}

export const PREMIER = 1;
export const DERNIER = cantiques.length;

/**
 * Sous-ligne affichée sous un titre dans l'index.
 *
 * Objectif : ne JAMAIS répéter le titre sous le titre. On cherche donc la
 * première parole qui ne soit ni contenue dans le titre ni contenante de
 * celui-ci, et qui soit assez longue pour être informative (> 6 caractères).
 * Si tout le chant reprend son titre, on retombe sur sa structure
 * (« 5 strophes · refrain »).
 */
function calculerSousLigne(c: Cantique): string {
  const titreN = normaliser(c.title);

  for (const part of c.parts) {
    for (const ligne of part.l) {
      const ligneN = normaliser(ligne);
      if (ligneN.length <= 6) continue;
      if (titreN.includes(ligneN) || ligneN.includes(titreN)) continue;
      return ligne;
    }
  }

  return structure(c);
}

/**
 * Cache des sous-lignes.
 *
 * DÉMARRAGE : on ne calcule PAS les 302 sous-lignes au chargement du module —
 * cela obligerait à normaliser des milliers de vers avant même que le premier
 * écran s'affiche. On les calcule à la demande, la première fois qu'une ligne
 * est réellement dessinée, et on garde le résultat. FlashList n'affiche qu'une
 * dizaine de lignes à la fois : le coût est réparti au lieu d'être payé
 * d'un bloc à l'ouverture.
 */
const sousLignes = new Map<number, string>();

export function sousLigne(c: Cantique): string {
  const enCache = sousLignes.get(c.n);
  if (enCache !== undefined) return enCache;

  const calculee = calculerSousLigne(c);
  sousLignes.set(c.n, calculee);
  return calculee;
}

/**
 * Les 302 chants triés de A à Z sur leur titre.
 *
 * ATTENTION — PIÈGE DE PERFORMANCE, à ne pas réintroduire.
 *
 * La façon « évidente » d'écrire ce tri serait :
 *     .sort((a, b) => a.title.localeCompare(b.title, 'fr'))
 *
 * C'est correct, et c'est instantané sur un ordinateur. Mais sur Android,
 * `localeCompare` avec une locale passe par la bibliothèque de langue du
 * système (ICU), à laquelle JavaScript doit parler à travers un pont. Trier
 * 302 titres demande environ 2 500 comparaisons, donc 2 500 allers-retours par
 * ce pont : l'application se fige plusieurs secondes, et plus AUCUN toucher
 * n'est traité pendant ce temps.
 *
 * Ce qu'on fait à la place : on calcule UNE FOIS une clé de tri par titre
 * (le titre normalisé — minuscules, accents retirés), puis on compare ces clés
 * avec de simples `<` et `>`. Aucun pont, aucune bibliothèque : environ dix
 * fois plus rapide même sur un ordinateur, et sans commune mesure sur
 * téléphone.
 *
 * Le classement reste juste en français : la normalisation ramène « É » sur
 * « e », donc « ÉTONNANT » se range bien après « ETERNEL » et non à la fin de
 * l'alphabet.
 *
 * Le résultat est gardé en cache pour toute la session.
 */
let cacheAlpha: Cantique[] | null = null;

export function cantiquesAlpha(): Cantique[] {
  if (!cacheAlpha) {
    // Une clé par chant, calculée une seule fois avant le tri.
    const cles = new Map<number, string>(cantiques.map(c => [c.n, normaliser(c.title)]));
    cacheAlpha = [...cantiques].sort((a, b) => {
      const ca = cles.get(a.n) ?? '';
      const cb = cles.get(b.n) ?? '';
      return ca < cb ? -1 : ca > cb ? 1 : 0;
    });
  }
  return cacheAlpha;
}

/**
 * Prépare à l'avance les calculs de l'onglet « A → Z ».
 *
 * À appeler quand l'écran des cantiques est posé et que l'utilisateur lit sa
 * liste : le tri est alors déjà fait lorsqu'il touche « A → Z », et la bascule
 * est immédiate. C'est une optimisation de confort, pas une obligation — la
 * fonction ne fait rien si le travail a déjà été fait.
 */
export function prechaufferAlpha(): void {
  cantiquesAlpha();
  lettresCantiques();
}

/**
 * Les lettres du rail de l'onglet « A → Z », avec la position à laquelle
 * chacune commence dans la liste alphabétique.
 *
 * On ne montre que les lettres RÉELLEMENT présentes : afficher un « K » qui
 * ne mène nulle part serait une fausse promesse. La première lettre est prise
 * sur le titre normalisé, sinon « ÉTERNEL » et « ETERNEL » finiraient dans
 * deux rubriques différentes.
 *
 * Paresseux : seul l'onglet A → Z en a besoin.
 */
export type ReperLettre = { lettre: string; index: number };

let cacheLettres: ReperLettre[] | null = null;

export function lettresCantiques(): ReperLettre[] {
  if (!cacheLettres) {
    const vues = new Set<string>();
    cacheLettres = [];
    cantiquesAlpha().forEach((c, index) => {
      const lettre = normaliser(c.title).charAt(0).toUpperCase();
      // On écarte les titres qui ne commencent pas par une lettre (chiffre, guillemet…).
      if (!/^[A-Z]$/.test(lettre) || vues.has(lettre)) return;
      vues.add(lettre);
      cacheLettres!.push({ lettre, index });
    });
  }
  return cacheLettres;
}

/** Les chœurs regroupés par lettre, dans l'ordre des lettres réellement présentes. */
export type GroupeChoeurs = { lettre: string; items: Choeur[] };

/** Paresseux lui aussi : seul l'écran Chœurs en a besoin. */
let cacheGroupes: GroupeChoeurs[] | null = null;

export function choeursParLettre(): GroupeChoeurs[] {
  if (!cacheGroupes) {
    cacheGroupes = meta.lettresChoeurs.map(lettre => ({
      lettre,
      items: choeurs.filter(ch => ch.letter === lettre),
    }));
  }
  return cacheGroupes;
}

/**
 * Le « chant du jour » : le même pour tout le monde pendant 24 h, et qui change
 * chaque jour. On prend le numéro du jour dans l'année (le « quantième ») et on
 * le ramène dans l'intervalle 1…302 par un modulo. Aucun hasard : deux
 * personnes assises côte à côte voient le même chant.
 */
export function chantDuJour(date: Date = new Date()): Cantique {
  const debutAnnee = new Date(date.getFullYear(), 0, 0);
  const millisecondesParJour = 86_400_000;
  const quantieme = Math.floor((date.getTime() - debutAnnee.getTime()) / millisecondesParJour);
  const index = quantieme % cantiques.length;
  // `cantiques` n'est jamais vide (302 entrées garanties par les tests).
  return cantiques[index] ?? cantiques[0]!;
}

/**
 * Les deux premières lignes à montrer en aperçu sur l'accueil :
 * le refrain si le chant en a un, sinon sa première strophe.
 */
export function apercuDeuxLignes(c: Cantique): string[] {
  const bloc = c.parts.find(p => p.t === 'r') ?? c.parts[0];
  return bloc ? bloc.l.slice(0, 2) : [];
}
