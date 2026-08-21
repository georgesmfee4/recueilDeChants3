/**
 * Les squelettes de chargement.
 *
 * À quoi ça sert ? Les 302 cantiques sont déjà en mémoire — il n'y a aucun
 * téléchargement. Mais sur un téléphone lent, DESSINER la première page d'une
 * liste prend un instant, pendant lequel l'écran resterait blanc et l'appli
 * paraîtrait figée. On affiche donc immédiatement une esquisse de la page,
 * puis le vrai contenu la remplace.
 *
 * Fidélité au système graphique : pas de dégradé, pas d'arrondi, pas d'effet
 * de balayage brillant. Juste des blocs couleur `ruleSoft` qui respirent
 * doucement — le papier ne clignote pas.
 */
import { useEffect } from 'react';
import { View, type DimensionValue } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '@/design/ThemeProvider';
import { mise } from '@/design/tokens';

/** Durée d'une inspiration (le cycle complet fait le double). */
const RESPIRATION = 700;

type ProprietesBloc = {
  largeur: DimensionValue;
  hauteur: number;
  /** Marge au-dessus du bloc. */
  marge?: number;
};

/** Un rectangle gris qui respire. La brique de base de tous les squelettes. */
export function Squelette({ largeur, hauteur, marge = 0 }: ProprietesBloc) {
  const { c } = useTheme();
  const opacite = useSharedValue(0.55);

  useEffect(() => {
    // `withRepeat(..., -1, true)` = à l'infini, en faisant l'aller-retour.
    opacite.value = withRepeat(
      withTiming(1, { duration: RESPIRATION, easing: Easing.inOut(Easing.quad) }),
      -1,
      true,
    );
  }, [opacite]);

  const style = useAnimatedStyle(() => ({ opacity: opacite.value }));

  return (
    <Animated.View
      style={[{ width: largeur, height: hauteur, marginTop: marge, backgroundColor: c.ruleSoft }, style]}
    />
  );
}

/**
 * L'esquisse d'une liste d'index (écrans Cantiques et Recherche).
 * Reproduit la géométrie d'une vraie ligne : colonne de numéro à gauche,
 * titre et sous-ligne à droite. Les largeurs varient un peu d'une ligne à
 * l'autre pour éviter l'effet « grille » qui trahirait un faux contenu.
 */
export function SqueletteListe({ lignes = 8 }: { lignes?: number }) {
  const { c } = useTheme();
  const largeurs: DimensionValue[] = ['78%', '62%', '85%', '55%', '72%', '90%', '66%', '80%'];

  return (
    <View accessibilityLabel="Chargement de la liste">
      {Array.from({ length: lignes }, (_, i) => (
        <View
          key={i}
          style={{
            flexDirection: 'row',
            gap: 14,
            paddingVertical: 14,
            borderBottomWidth: 1,
            borderBottomColor: c.ruleSoft,
          }}>
          <Squelette largeur={44} hauteur={16} />
          <View style={{ flex: 1 }}>
            <Squelette largeur={largeurs[i % largeurs.length] ?? '75%'} hauteur={11} />
            <Squelette largeur="45%" hauteur={9} marge={7} />
          </View>
        </View>
      ))}
    </View>
  );
}

/**
 * L'esquisse d'un groupe de chœurs : la grande lettre en filigrane à gauche,
 * les chœurs à droite.
 */
export function SqueletteChoeurs({ groupes = 3 }: { groupes?: number }) {
  const { c } = useTheme();

  return (
    <View accessibilityLabel="Chargement des chœurs">
      {Array.from({ length: groupes }, (_, g) => (
        <View key={g} style={{ flexDirection: 'row', gap: 18, marginTop: 22 }}>
          <Squelette largeur={34} hauteur={38} />
          <View style={{ flex: 1 }}>
            {Array.from({ length: 2 }, (_, i) => (
              <View
                key={i}
                style={{
                  paddingVertical: 16,
                  borderBottomWidth: 1,
                  borderBottomColor: c.ruleSoft,
                }}>
                <Squelette largeur={i === 0 ? '80%' : '68%'} hauteur={14} />
                <Squelette largeur="92%" hauteur={11} marge={9} />
              </View>
            ))}
          </View>
        </View>
      ))}
    </View>
  );
}

/** L'esquisse d'une liste de favoris (numéro plus gros, titre sur une ligne). */
export function SqueletteFavoris({ lignes = 5 }: { lignes?: number }) {
  const { c } = useTheme();

  return (
    <View accessibilityLabel="Chargement des favoris">
      {Array.from({ length: lignes }, (_, i) => (
        <View
          key={i}
          style={{
            flexDirection: 'row',
            gap: 16,
            paddingVertical: 16,
            borderBottomWidth: 1,
            borderBottomColor: c.ruleSoft,
          }}>
          <Squelette largeur={40} hauteur={20} />
          <View style={{ flex: 1 }}>
            <Squelette largeur={i % 2 === 0 ? '76%' : '58%'} hauteur={13} />
            <Squelette largeur="38%" hauteur={9} marge={7} />
          </View>
        </View>
      ))}
    </View>
  );
}

/** Espace occupé par un squelette de liste, pour caler la mise en page. */
export const HAUTEUR_LIGNE_SQUELETTE = mise.hauteurLigneIndex;
