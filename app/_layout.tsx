/**
 * Racine de l'application — tout ce qui doit exister avant le premier écran.
 *
 * Ordre des enveloppes, de l'extérieur vers l'intérieur :
 *   1. GestureHandlerRootView : nécessaire aux gestes (glisser une feuille) ;
 *   2. SafeAreaProvider       : encoche et barres système ;
 *   3. ThemeProvider          : résout Clair / Sombre / Système ;
 *   4. Stack (expo-router)    : la pile de navigation.
 *
 * DÉMARRAGE : ce fichier ne fait AUCUN travail asynchrone. Les polices sont
 * embarquées dans le binaire par le plugin `expo-font` (voir app.json), donc
 * il n'y a rien à charger, rien à attendre, et aucun écran blanc entre
 * l'écran de lancement natif et l'écran 01. C'est ce qui rend l'ouverture
 * immédiate.
 */
import { View } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, useTheme } from '@/design/ThemeProvider';
import { useBarreSysteme } from '@/design/barreSysteme';

export default function RacineLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <Navigation />
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

/**
 * La pile de navigation. Composant séparé parce qu'il a besoin de `useTheme()`,
 * qui n'est disponible qu'à l'INTÉRIEUR du ThemeProvider.
 */
function Navigation() {
  const { c, mode } = useTheme();

  // Accorde la couleur des boutons Android au thème courant.
  useBarreSysteme();

  return (
    <View style={{ flex: 1, backgroundColor: c.paper }}>
      <StatusBar style={mode === 'sombre' ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          // Aucun écran n'utilise l'en-tête natif : ils dessinent tous le leur.
          headerShown: false,
          contentStyle: { backgroundColor: c.paper },
          // Glissement latéral plutôt qu'un fondu : c'est le geste d'ouvrir un
          // livre par le côté. L'animation est jouée par le système, jamais en
          // JavaScript, elle reste donc fluide même pendant un gros calcul.
          animation: 'slide_from_right',
          // Le retour par glissement du bord de l'écran, gratuit avec ce mode.
          gestureEnabled: true,
        }}>
        {/* Le lancement et l'entrée dans l'application se font en fondu : il
            n'y a pas de « page précédente » d'où glisser. */}
        <Stack.Screen name="index" options={{ animation: 'fade' }} />
        <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
        <Stack.Screen name="chant/[n]" />
        {/* La recherche est un écran plein, pas une feuille modale : sur iOS
            une modale arrive avec des coins arrondis et un décrochement en
            haut, deux choses que ce système graphique n'admet pas. */}
        <Stack.Screen name="recherche" />
        <Stack.Screen name="reglages/index" />
        <Stack.Screen name="reglages/a-propos" />
      </Stack>
    </View>
  );
}
