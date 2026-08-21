/**
 * Bibliothèque personnelle — favoris et dernier chant lu.
 *
 * `dernierChant` alimente le bloc « Reprendre » de l'accueil : on garde le
 * numéro ET la progression (0 → 1) pour dessiner la petite barre violette.
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { stockageZustand } from './stockage';

export type DernierChant = { n: number; progression: number };

type Bibliotheque = {
  /** Numéros des chants gardés, toujours triés par ordre croissant. */
  favoris: number[];
  dernierChant: DernierChant | null;

  estFavori: (n: number) => boolean;
  basculerFavori: (n: number) => void;
  retirerFavori: (n: number) => void;
  noterLecture: (n: number, progression: number) => void;
};

export const useBibliotheque = create<Bibliotheque>()(
  persist(
    (set, get) => ({
      favoris: [],
      dernierChant: null,

      estFavori: n => get().favoris.includes(n),

      basculerFavori: n =>
        set(s => ({
          favoris: s.favoris.includes(n)
            ? s.favoris.filter(x => x !== n)
            : // On retrie après ajout : la liste des favoris s'affiche par numéro.
              [...s.favoris, n].sort((a, b) => a - b),
        })),

      retirerFavori: n => set(s => ({ favoris: s.favoris.filter(x => x !== n) })),

      noterLecture: (n, progression) => set({ dernierChant: { n, progression } }),
    }),
    {
      name: 'bibliotheque',
      storage: stockageZustand(),
    },
  ),
);
