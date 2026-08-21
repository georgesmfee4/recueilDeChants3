/**
 * Les quatre onglets : Accueil, Cantiques, Chœurs, Favoris.
 *
 * On remplace complètement la barre d'onglets par défaut par notre pilule
 * flottante : le composant natif imposerait ses hauteurs, ses ombres et ses
 * arrondis, qui n'existent pas dans ce système graphique.
 *
 * Les écrans glissent horizontalement dans l'ordre de la pilule, comme quatre
 * pages posées côte à côte (voir src/design/transitionOnglets.ts).
 */
import { useMemo } from 'react';
import { useWindowDimensions } from 'react-native';
import { Tabs } from 'expo-router';
import { PiluleNav } from '@/components/PiluleNav';
import { useAnimationsReduites } from '@/design/animations';
import { glissementLateral, specGlissement } from '@/design/transitionOnglets';

export default function OngletsLayout() {
  const { width } = useWindowDimensions();
  const reduites = useAnimationsReduites();

  // L'interpolateur dépend de la largeur de l'écran : on ne le refabrique que
  // si celle-ci change (rotation du téléphone), pas à chaque rendu.
  const interpolateur = useMemo(() => glissementLateral(width), [width]);

  return (
    <Tabs
      tabBar={() => <PiluleNav />}
      screenOptions={{
        headerShown: false,
        // La pilule FLOTTE au-dessus du contenu : chaque écran réserve lui-même
        // l'espace du bas (jeton `mise.reservePilule`).
        tabBarStyle: { position: 'absolute', borderTopWidth: 0 },
        sceneStyle: { backgroundColor: 'transparent' },
        // « Réduire les animations » est coché dans le téléphone : on bascule
        // d'un onglet à l'autre sans transition. C'est une exigence
        // d'accessibilité, pas une option de confort.
        ...(reduites
          ? { animation: 'none' as const }
          : { transitionSpec: specGlissement, sceneStyleInterpolator: interpolateur }),
      }}>
      {/* L'ORDRE COMPTE : c'est lui qui décide de quel côté chaque écran
          glisse. Il doit rester celui de la pilule de navigation. */}
      <Tabs.Screen name="accueil" options={{ title: 'Accueil' }} />
      <Tabs.Screen name="cantiques" options={{ title: 'Cantiques' }} />
      <Tabs.Screen name="choeurs" options={{ title: 'Chœurs' }} />
      <Tabs.Screen name="favoris" options={{ title: 'Favoris' }} />
    </Tabs>
  );
}
