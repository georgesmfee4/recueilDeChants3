/**
 * La capsule de lecture — remplace la pilule de navigation pendant la lecture.
 *
 * Trois boutons : [‹ chant précédent] [# chant courant] [chant suivant ›].
 * Le bouton du milieu ouvre le clavier « Aller à un chant ».
 * Aux extrémités du recueil (chant 1, chant 302) le bouton devient un tiret
 * cadratin « — » : il reste visible mais inopérant, la capsule ne change pas
 * de largeur d'un chant à l'autre.
 */
import { BlurView } from 'expo-blur';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/design/ThemeProvider';
import { mise, polices } from '@/design/tokens';
import { DERNIER, PREMIER } from '@/data/recueil';
import { IconeAllerA, IconeRetour, IconeSuivant } from './icones';

type Proprietes = {
  n: number;
  onPrecedent: () => void;
  onSuivant: () => void;
  onAllerA: () => void;
};

export function CapsuleLecture({ n, onPrecedent, onSuivant, onAllerA }: Proprietes) {
  const { c, mode } = useTheme();
  // Même précaution que pour la pilule : on remonte la capsule au-dessus des
  // boutons système, sinon les flèches ‹ › tombent dessus.
  const insets = useSafeAreaInsets();

  const aPrecedent = n > PREMIER;
  const aSuivant = n < DERNIER;
  const tinte = mode === 'sombre' ? 'dark' : 'light';

  /** Cadre commun aux trois boutons : filet + flou, jamais d'ombre. */
  const cadre = {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 7,
    paddingVertical: mise.capsule.padding[0],
    paddingHorizontal: mise.capsule.padding[1],
    borderWidth: 1,
    borderColor: c.rule,
    backgroundColor: c.blur,
    overflow: 'hidden' as const,
  };

  const styleNumero = { fontFamily: polices.sans.semibold, fontSize: 12 };

  return (
    <View
      pointerEvents="box-none"
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: insets.bottom,
        height: mise.capsule.hauteur,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
      }}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Chant précédent"
        disabled={!aPrecedent}
        onPress={onPrecedent}>
        <BlurView intensity={mise.capsule.flou} tint={tinte} style={cadre}>
          <IconeRetour size={14} color={aPrecedent ? c.ink2 : c.inactifTexte} />
          <Text style={[styleNumero, { color: aPrecedent ? c.ink2 : c.inactifTexte }]}>
            {aPrecedent ? n - 1 : '—'}
          </Text>
        </BlurView>
      </Pressable>

      <Pressable accessibilityRole="button" accessibilityLabel="Aller à un chant" onPress={onAllerA}>
        <BlurView
          intensity={mise.capsule.flou}
          tint={tinte}
          style={[cadre, { paddingVertical: 11, paddingHorizontal: 17 }]}>
          <IconeAllerA size={14} color={c.pri} />
          <Text style={{ fontFamily: polices.serif.regular, fontSize: 16, color: c.pri }}>{n}</Text>
        </BlurView>
      </Pressable>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Chant suivant"
        disabled={!aSuivant}
        onPress={onSuivant}>
        <BlurView intensity={mise.capsule.flou} tint={tinte} style={cadre}>
          <Text style={[styleNumero, { color: aSuivant ? c.ink2 : c.inactifTexte }]}>
            {aSuivant ? n + 1 : '—'}
          </Text>
          <IconeSuivant size={14} color={aSuivant ? c.ink2 : c.inactifTexte} />
        </BlurView>
      </Pressable>
    </View>
  );
}
