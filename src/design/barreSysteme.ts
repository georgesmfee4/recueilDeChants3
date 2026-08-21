/**
 * Barre de navigation système d'Android (les trois boutons du bas).
 *
 * Le problème : par défaut Android peint un voile opaque derrière ces boutons
 * — blanc en mode clair, noir en mode sombre — qui coupe le bas de l'écran et
 * jure avec notre papier `#FBFAF7`.
 *
 * La solution tient en deux morceaux :
 *
 *   1. `androidNavigationBar.enforceContrast: false` dans app.json supprime ce
 *      voile. La barre devient réellement transparente et laisse voir le fond
 *      de l'application. (C'est un réglage de compilation : il n'a d'effet
 *      qu'après `npx expo prebuild` + reconstruction.)
 *
 *   2. Ce hook accorde ensuite la COULEUR DES BOUTONS au thème : boutons
 *      sombres sur papier clair, boutons clairs sur papier sombre. Sans lui,
 *      des boutons blancs deviendraient invisibles sur notre fond clair.
 *
 * Sur iOS et sur les Android en navigation par gestes, il n'y a rien à
 * régler : le hook ne fait alors rien du tout.
 */
import { useEffect } from 'react';
import { Platform } from 'react-native';
import * as NavigationBar from 'expo-navigation-bar';
import { useTheme } from './ThemeProvider';

export function useBarreSysteme(): void {
  const { mode } = useTheme();

  useEffect(() => {
    if (Platform.OS !== 'android') return;

    // Attention au vocabulaire d'Expo, qui décrit la BARRE et non les boutons :
    //   'light' = barre claire à contenu sombre  -> boutons sombres, pour notre papier ;
    //   'dark'  = barre sombre à contenu clair   -> boutons clairs, pour le mode nuit.
    NavigationBar.setStyle(mode === 'sombre' ? 'dark' : 'light');
  }, [mode]);
}
