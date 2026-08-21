/**
 * Les cinq dernières recherches, gardées d'une ouverture à l'autre.
 *
 * Pourquoi c'est utile ici : dans une assemblée, on cherche souvent les mêmes
 * chants. Retrouver « gloire » ou « alléluia » d'un seul toucher évite de le
 * retaper au clavier, debout, avec un recueil dans l'autre main.
 *
 * QUAND une recherche est-elle enregistrée ? Seulement quand l'utilisateur en
 * FAIT quelque chose : il ouvre un résultat, ou il valide au clavier. Si on
 * enregistrait chaque frappe, l'historique se remplirait de « gl », « glo »,
 * « gloi »… et ne servirait plus à rien.
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { stockageZustand } from './stockage';

/** Nombre de recherches conservées. Au-delà, la plus ancienne sort. */
export const MAX_RECENTES = 5;

type RecherchesRecentes = {
  recentes: string[];
  ajouter: (requete: string) => void;
  retirer: (requete: string) => void;
  vider: () => void;
};

export const useRecherchesRecentes = create<RecherchesRecentes>()(
  persist(
    set => ({
      recentes: [],

      ajouter: requete =>
        set(etat => {
          const propre = requete.trim();
          if (propre.length < 2) return etat;

          // On retire d'abord une éventuelle occurrence précédente : rechercher
          // deux fois « gloire » doit donner UNE entrée, remontée en tête, et
          // non deux lignes identiques.
          const sansDoublon = etat.recentes.filter(
            r => r.toLocaleLowerCase() !== propre.toLocaleLowerCase(),
          );

          return { recentes: [propre, ...sansDoublon].slice(0, MAX_RECENTES) };
        }),

      retirer: requete =>
        set(etat => ({ recentes: etat.recentes.filter(r => r !== requete) })),

      vider: () => set({ recentes: [] }),
    }),
    {
      name: 'recherches-recentes',
      storage: stockageZustand(),
    },
  ),
);
