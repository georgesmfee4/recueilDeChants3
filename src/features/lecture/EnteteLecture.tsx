/**
 * L'en-tête fixe de l'écran de lecture.
 *
 * Deux visages, liés au défilement :
 *
 *   EN HAUT DE PAGE  — transparent sur le papier, texte encre. L'en-tête
 *                      s'efface, la page respire.
 *   DÈS QU'ON DESCEND — un dégradé violet monte derrière, le texte passe en
 *                      blanc, et LE NUMÉRO DU CHANT vient se placer devant le
 *                      titre. Le grand numéro du haut de page est alors sorti
 *                      de l'écran : on garde ainsi toujours sous les yeux
 *                      « quel chant je suis en train de lire ».
 *
 * Comment la bascule est faite : on ne redessine RIEN en JavaScript pendant le
 * défilement. On empile deux copies de l'en-tête (une encre, une blanche) et
 * on croise leurs opacités sur le fil d'affichage, à partir de la position de
 * défilement. C'est ce qui garde 60 images par seconde même sur un téléphone
 * lent.
 *
 * La copie blanche est toujours celle du dessus et porte les vrais boutons :
 * une vue transparente reçoit quand même les touchers, la copie encre est donc
 * neutralisée (`pointerEvents="none"`).
 */
import type { ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  interpolate,
  useAnimatedStyle,
  type SharedValue,
} from 'react-native-reanimated';
import { useTheme } from '@/design/ThemeProvider';
import { type } from '@/design/type';
import { clair, polices } from '@/design/tokens';
import { IconePlus, IconeRetour, IconeSignet } from '@/components/icones';

/**
 * Course du défilement pendant laquelle la bascule s'opère, en points.
 * En dessous : en-tête transparent. Au-delà : en-tête violet.
 * 90 correspond à peu près au moment où le grand numéro quitte l'écran.
 */
const COURSE = 90;

type Proprietes = {
  n: number;
  titre: string;
  favori: boolean;
  /** Position de défilement de la colonne, partagée avec le fil d'affichage. */
  defilement: SharedValue<number>;
  onRetour: () => void;
  onBasculerFavori: () => void;
  onPlus: () => void;
};

export function EnteteLecture({
  n,
  titre,
  favori,
  defilement,
  onRetour,
  onBasculerFavori,
  onPlus,
}: Proprietes) {
  const { c } = useTheme();

  // 0 en haut de page → 1 une fois descendu. Toutes les animations en dérivent.
  const styleVoile = useAnimatedStyle(() => ({
    opacity: interpolate(defilement.value, [0, COURSE], [0, 1], 'clamp'),
  }));
  const styleEncre = useAnimatedStyle(() => ({
    opacity: interpolate(defilement.value, [0, COURSE], [1, 0], 'clamp'),
  }));
  // Le numéro ne se contente pas d'apparaître : il MONTE de 10 points, comme
  // s'il venait chercher sa place devant le titre.
  const styleNumero = useAnimatedStyle(() => ({
    opacity: interpolate(defilement.value, [COURSE * 0.45, COURSE], [0, 1], 'clamp'),
    transform: [
      { translateY: interpolate(defilement.value, [COURSE * 0.45, COURSE], [10, 0], 'clamp') },
    ],
  }));

  /**
   * Le contenu de l'en-tête, dessiné deux fois avec des couleurs différentes.
   * `interactif` distingue la copie qui porte réellement les boutons.
   */
  const contenu = (couleur: string, couleurTitre: string, interactif: boolean): ReactNode => (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingTop: 6,
        paddingHorizontal: 26,
        paddingBottom: 14,
      }}>
      <Bouton
        libelle="Retour"
        onPress={onRetour}
        interactif={interactif}
        icone={<IconeRetour size={19} color={couleur} />}
      />

      {/* Le numéro n'existe que sur la copie blanche : sur le papier, il est
          déjà écrit en grand au-dessus des paroles. */}
      {interactif ? (
        <Animated.Text
          style={[
            {
              fontFamily: polices.serif.regular,
              fontSize: 17,
              color: clair.or,
            },
            styleNumero,
          ]}>
          {n}
        </Animated.Text>
      ) : null}

      <Text numberOfLines={1} style={[type.titreCourant, { flex: 1, color: couleurTitre }]}>
        {titre}
      </Text>

      <Bouton
        libelle={favori ? 'Retirer des favoris' : 'Ajouter aux favoris'}
        onPress={onBasculerFavori}
        interactif={interactif}
        icone={<IconeSignet size={17} color={couleur} plein={favori} />}
      />
      <Bouton
        libelle="Plus d'actions"
        onPress={onPlus}
        interactif={interactif}
        icone={<IconePlus size={19} color={couleur} />}
      />
    </View>
  );

  return (
    <View>
      {/* Le dégradé violet, révélé par le défilement. */}
      <Animated.View
        pointerEvents="none"
        style={[{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }, styleVoile]}>
        <LinearGradient
          colors={[c.priDeep, c.pri]}
          start={{ x: 0.1, y: 0 }}
          end={{ x: 0.9, y: 1 }}
          style={{ flex: 1 }}
        />
      </Animated.View>

      {/* Copie encre : visible en haut de page, purement décorative. */}
      <Animated.View
        pointerEvents="none"
        style={[{ position: 'absolute', top: 0, left: 0, right: 0 }, styleEncre]}>
        {contenu(c.ink2, c.ink3, false)}
      </Animated.View>

      {/* Copie blanche : toujours au-dessus, c'est elle qui reçoit les touchers. */}
      <Animated.View style={styleVoile}>{contenu(c.onPri, c.onPri, true)}</Animated.View>
    </View>
  );
}

/**
 * Un bouton de l'en-tête. La copie décorative ne monte pas de `Pressable` :
 * inutile de créer des zones tactiles en double.
 */
function Bouton({
  libelle,
  onPress,
  icone,
  interactif,
}: {
  libelle: string;
  onPress: () => void;
  icone: ReactNode;
  interactif: boolean;
}) {
  const cadre = {
    width: 30,
    height: 30,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  };

  if (!interactif) return <View style={cadre}>{icone}</View>;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={libelle}
      onPress={onPress}
      hitSlop={10}
      style={cadre}>
      {icone}
    </Pressable>
  );
}
