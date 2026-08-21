/**
 * La feuille inférieure — coquille commune aux deux feuilles de l'application
 * (« Aller à un chant » et « Plus d'actions »).
 *
 * Comportement : un voile sombre apparaît en fondu, puis le panneau monte
 * depuis le bas. On ferme en touchant le voile, la croix, ou en tirant la
 * feuille vers le bas.
 *
 * LA DIFFICULTÉ : quand le parent passe `visible` à `false`, il faut que la
 * feuille reste À L'ÉCRAN le temps de redescendre. Si on la démontait tout de
 * suite, elle disparaîtrait d'un coup. On garde donc un drapeau `enSortie`,
 * levé au moment exact où `visible` change, et baissé par l'animation quand
 * elle a fini. La feuille est montée tant que l'un des deux est vrai.
 */
import { useEffect, useState, type ReactNode } from 'react';
import { Modal, Pressable, View, useWindowDimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { COURBE, useAnimationsReduites } from '@/design/animations';
import { useTheme } from '@/design/ThemeProvider';
import { mise, mouvement } from '@/design/tokens';

type Proprietes = {
  visible: boolean;
  onFermer: () => void;
  children: ReactNode;
};

/** Distance à tirer vers le bas, en points, pour que la feuille se referme. */
const SEUIL_FERMETURE = 90;

export function FeuilleInferieure({ visible, onFermer, children }: Proprietes) {
  const { c } = useTheme();
  const { height } = useWindowDimensions();
  const reduites = useAnimationsReduites();
  // La feuille descend jusqu'au bord physique de l'écran : sans ce rembourrage,
  // son dernier bouton se retrouverait sous les boutons système d'Android.
  const insets = useSafeAreaInsets();

  const [enSortie, setEnSortie] = useState(false);
  const [visiblePrecedent, setVisiblePrecedent] = useState(visible);

  // Ajustement d'état PENDANT LE RENDU. C'est le motif recommandé par React
  // pour réagir au changement d'une prop : plus direct et plus sûr qu'un
  // `useEffect`, qui ne s'exécuterait qu'après un premier affichage — la
  // feuille aurait déjà clignoté.
  if (visiblePrecedent !== visible) {
    setVisiblePrecedent(visible);
    if (!visible) setEnSortie(true);
  }

  const monte = visible || enSortie;

  // 0 = feuille en bas hors écran, 1 = feuille en place.
  const ouverture = useSharedValue(0);
  const opaciteVoile = useSharedValue(0);
  // Décalage ajouté par le doigt quand on tire la feuille vers le bas.
  const glissement = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      ouverture.value = withTiming(1, {
        duration: reduites ? 0 : mouvement.feuilleEntree,
        easing: COURBE,
      });
      opaciteVoile.value = withTiming(1, { duration: reduites ? 0 : mouvement.voile });
      return;
    }

    opaciteVoile.value = withTiming(0, { duration: reduites ? 0 : mouvement.voile });
    ouverture.value = withTiming(
      0,
      { duration: reduites ? 0 : mouvement.feuilleSortie, easing: COURBE },
      fini => {
        // L'animation est terminée : on peut démonter la feuille.
        if (fini) runOnJS(setEnSortie)(false);
      },
    );
  }, [visible, reduites, ouverture, opaciteVoile]);

  const styleVoile = useAnimatedStyle(() => ({ opacity: opaciteVoile.value }));

  const stylePanneau = useAnimatedStyle(() => ({
    // À l'ouverture 0 la feuille est descendue hors de l'écran ; à 1 elle est en place.
    transform: [{ translateY: (1 - ouverture.value) * height * 0.6 + glissement.value }],
  }));

  // Tirer vers le bas ferme la feuille ; un geste trop court la fait remonter.
  const glisser = Gesture.Pan()
    // On repart de zéro à chaque geste : c'est ici, et nulle part ailleurs,
    // que ce décalage se réinitialise.
    .onBegin(() => {
      glissement.value = 0;
    })
    .onChange(e => {
      if (e.translationY > 0) glissement.value = e.translationY;
    })
    .onEnd(() => {
      if (glissement.value > SEUIL_FERMETURE) {
        runOnJS(onFermer)();
      } else {
        glissement.value = withTiming(0, { duration: mouvement.feuilleSortie, easing: COURBE });
      }
    });

  if (!monte) return null;

  return (
    <Modal transparent visible animationType="none" onRequestClose={onFermer} statusBarTranslucent>
      <View style={{ flex: 1, justifyContent: 'flex-end' }}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Fermer"
          onPress={onFermer}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
          <Animated.View style={[{ flex: 1, backgroundColor: c.voile }, styleVoile]} />
        </Pressable>

        <GestureDetector gesture={glisser}>
          <Animated.View
            style={[
              {
                backgroundColor: c.paper,
                borderTopWidth: 1,
                borderTopColor: c.rule,
                paddingTop: mise.feuille.padding[0],
                paddingHorizontal: mise.feuille.padding[1],
                paddingBottom: mise.feuille.padding[2] + insets.bottom,
              },
              stylePanneau,
            ]}>
            {children}
          </Animated.View>
        </GestureDetector>
      </View>
    </Modal>
  );
}
