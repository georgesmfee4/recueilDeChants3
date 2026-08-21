/**
 * Préférences de lecture — thème, taille du texte, interligne, options.
 *
 * Tout est persisté : l'utilisateur retrouve ses réglages au lancement suivant.
 * Chaque écran s'abonne au morceau qui l'intéresse, par exemple :
 *   const taille = usePrefs(s => s.taille);
 * (on ne fait jamais `usePrefs()` tout court, ça re-rendrait l'écran à chaque
 * changement de n'importe quel réglage).
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CranTaille, Interligne } from '@/design/type';
import { stockageZustand } from './stockage';

export type ChoixTheme = 'Clair' | 'Sombre' | 'Système';

type Prefs = {
  theme: ChoixTheme;
  taille: CranTaille;
  interligne: Interligne;
  numerosStrophe: boolean;
  refrainItalique: boolean;
  ecranAllume: boolean;

  setTheme: (t: ChoixTheme) => void;
  setTaille: (t: CranTaille) => void;
  /** Décale la taille d'un cran vers le haut ou vers le bas, sans sortir de 0…4. */
  decalerTaille: (pas: 1 | -1) => void;
  setInterligne: (i: Interligne) => void;
  basculerNumerosStrophe: () => void;
  basculerRefrainItalique: () => void;
  basculerEcranAllume: () => void;
};

export const usePrefs = create<Prefs>()(
  persist(
    (set, get) => ({
      // Valeurs par défaut = celles de la maquette.
      theme: 'Système',
      taille: 2,
      interligne: 'Normal',
      numerosStrophe: true,
      refrainItalique: true,
      ecranAllume: false,

      setTheme: t => set({ theme: t }),
      setTaille: t => set({ taille: t }),
      decalerTaille: pas => {
        const suivant = get().taille + pas;
        if (suivant < 0 || suivant > 4) return;
        set({ taille: suivant as CranTaille });
      },
      setInterligne: i => set({ interligne: i }),
      basculerNumerosStrophe: () => set(s => ({ numerosStrophe: !s.numerosStrophe })),
      basculerRefrainItalique: () => set(s => ({ refrainItalique: !s.refrainItalique })),
      basculerEcranAllume: () => set(s => ({ ecranAllume: !s.ecranAllume })),
    }),
    {
      name: 'prefs',
      storage: stockageZustand(),
    },
  ),
);
