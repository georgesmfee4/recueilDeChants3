/**
 * Le glissement latéral entre les quatre onglets.
 *
 * React Navigation ne propose que trois animations d'onglet toutes faites :
 * `none`, `fade` et `shift` (un décalage de 50 points en fondu). Aucune n'est
 * un vrai glissement. On écrit donc le nôtre.
 *
 * COMMENT ÇA MARCHE
 * Chaque écran d'onglet reçoit une valeur `progress` qui vaut :
 *     -1  si son onglet est À GAUCHE de l'onglet actif
 *      0  s'il EST l'onglet actif
 *     +1  si son onglet est À DROITE de l'onglet actif
 *
 * Il suffit donc de traduire cette valeur en déplacement horizontal : l'écran
 * de gauche attend hors de l'écran à gauche, celui de droite hors de l'écran
 * à droite, et l'actif est au centre. Les quatre onglets se comportent alors
 * comme quatre pages posées côte à côte, dans l'ordre de la pilule :
 * Accueil · Cantiques · Chœurs · Favoris.
 *
 * POURQUOI C'EST SÛR SUR UN TÉLÉPHONE LENT
 *   1. On n'anime QUE `translateX`. React Navigation confie alors l'animation
 *      au fil natif (`useNativeDriver`), qui continue de tourner même pendant
 *      que JavaScript construit une liste de 302 lignes. L'animation ne
 *      saccade donc pas, quoi que fasse l'application.
 *   2. Aucune propriété de mise en page n'est animée (ni largeur, ni marge) :
 *      ce sont elles qui coûtent cher, parce qu'elles obligent à recalculer
 *      toute la page à chaque image.
 *   3. La durée reste courte (240 ms) : une animation lente sur un appareil
 *      lent donne l'impression que l'appareil rame encore plus.
 *   4. On garde la courbe unique du produit — celle qui démarre vite et
 *      s'arrête net, sans rebond.
 */
import { Animated, Easing } from 'react-native';
import { mouvement } from './tokens';

/**
 * React Navigation n'exporte pas ces deux types depuis la racine de son
 * paquet. Plutôt que d'aller les chercher dans ses fichiers internes — ce qui
 * casserait à la première mise à jour — on les redécrit ici. TypeScript
 * compare les formes, pas les noms : tant que la structure correspond, le
 * navigateur les accepte.
 */
type SpecTransition = {
  animation: 'timing';
  config: { duration: number; easing: (valeur: number) => number };
};

type PropsInterpolation = {
  /** `progress` vaut -1 (onglet à gauche), 0 (actif) ou +1 (à droite). */
  current: { progress: Animated.Value };
};

type Interpolateur = (props: PropsInterpolation) => {
  sceneStyle: { transform: { translateX: Animated.AnimatedInterpolation<number> }[] };
};

/** Durée du glissement, en millisecondes. */
const DUREE = 240;

/** La courbe du produit, traduite pour l'API `Animated` de React Native. */
const COURBE_RN = Easing.bezier(...mouvement.courbe);

export const specGlissement: SpecTransition = {
  animation: 'timing',
  config: {
    duration: DUREE,
    easing: COURBE_RN,
  },
};

/**
 * Fabrique l'interpolateur pour une largeur d'écran donnée.
 *
 * C'est une fabrique et non une constante parce que la largeur n'est connue
 * qu'à l'exécution — et qu'elle change si le téléphone est tourné.
 */
export function glissementLateral(largeur: number): Interpolateur {
  return ({ current }) => ({
    sceneStyle: {
      transform: [
        {
          translateX: current.progress.interpolate({
            inputRange: [-1, 0, 1],
            outputRange: [-largeur, 0, largeur],
          }),
        },
      ],
    },
  });
}
