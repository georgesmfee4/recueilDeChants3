/**
 * L'interrupteur des Réglages — 44 × 24, à angles vifs comme tout le reste.
 *
 * On n'utilise pas le `Switch` de React Native : il impose l'apparence iOS/Android
 * (arrondi, ombre) qui casserait le système graphique du recueil.
 *
 * La pastille glisse de gauche 3 à gauche 23 en 200 ms, sur l'unique courbe du
 * produit. Aucun rebond : « le papier ne rebondit pas ».
 */
import { useEffect } from 'react';
import { Pressable } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '@/design/ThemeProvider';
import { mouvement } from '@/design/tokens';

type Proprietes = {
  active: boolean;
  onChange: () => void;
  /** Lu par les lecteurs d'écran, en français. */
  libelle: string;
};

const COURBE = Easing.bezier(...mouvement.courbe);

export function Bascule({ active, onChange, libelle }: Proprietes) {
  const { c } = useTheme();
  // 3 quand c'est éteint, 23 quand c'est allumé : la position de la pastille.
  const gauche = useSharedValue(active ? 23 : 3);

  useEffect(() => {
    gauche.value = withTiming(active ? 23 : 3, {
      duration: mouvement.bascule,
      easing: COURBE,
    });
  }, [active, gauche]);

  const stylePastille = useAnimatedStyle(() => ({ left: gauche.value }));

  return (
    <Pressable
      onPress={onChange}
      accessibilityRole="switch"
      accessibilityState={{ checked: active }}
      accessibilityLabel={libelle}
      hitSlop={12}
      style={{
        width: 44,
        height: 24,
        borderWidth: 1,
        borderColor: active ? c.pri : c.rule,
        backgroundColor: active ? c.pri : 'transparent',
        justifyContent: 'center',
      }}>
      <Animated.View
        style={[
          {
            position: 'absolute',
            width: 16,
            height: 16,
            backgroundColor: active ? c.onPri : c.ink3,
          },
          stylePastille,
        ]}
      />
    </Pressable>
  );
}
