/**
 * Thème de l'application.
 *
 * Un seul endroit décide quelles couleurs sont actives. Les composants ne
 * connaissent que des NOMS de jetons (`c.pri`, `c.ink3`…), jamais des codes
 * hexadécimaux. Résultat : le mode sombre est gratuit.
 *
 * Usage dans un écran :
 *   const { c, mode } = useTheme();
 *   <View style={{ backgroundColor: c.paper }} />
 */
import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { usePrefs } from '@/store/prefs';
import { clair, sombre, type Couleurs } from './tokens';

export type ModeTheme = 'clair' | 'sombre';

type ValeurTheme = { c: Couleurs; mode: ModeTheme };

// Valeur par défaut : le mode clair. Elle ne sert que si un composant était
// rendu hors du Provider, ce qui ne doit pas arriver.
const ContexteTheme = createContext<ValeurTheme>({ c: clair, mode: 'clair' });

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Le réglage du téléphone ('light' | 'dark' | null).
  const systeme = useColorScheme();
  // Le choix explicite de l'utilisateur dans les Réglages.
  const choix = usePrefs(s => s.theme);

  const valeur = useMemo<ValeurTheme>(() => {
    const mode: ModeTheme =
      choix === 'Système' ? (systeme === 'dark' ? 'sombre' : 'clair') : choix === 'Sombre' ? 'sombre' : 'clair';
    return { c: mode === 'sombre' ? sombre : clair, mode };
  }, [choix, systeme]);

  return <ContexteTheme.Provider value={valeur}>{children}</ContexteTheme.Provider>;
}

export function useTheme(): ValeurTheme {
  return useContext(ContexteTheme);
}
