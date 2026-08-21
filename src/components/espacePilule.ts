/**
 * Où poser la pilule de navigation, et combien d'espace lui réserver.
 *
 * Le problème : l'application est en « edge-to-edge », c'est-à-dire qu'elle
 * dessine jusqu'au bord physique de l'écran, sous les boutons système
 * d'Android et sous la barre d'accueil de l'iPhone. Si on posait bêtement la
 * pilule à 24 du bord, elle se retrouverait PAR-DESSUS ces boutons.
 *
 * La solution : `useSafeAreaInsets()` nous donne la hauteur occupée par le
 * système en bas de l'écran (`insets.bottom`), qui vaut typiquement :
 *   - 0 sur un vieil Android sans barre système ;
 *   - ~16 avec la navigation par gestes (le petit trait) ;
 *   - ~48 avec les trois boutons Android ;
 *   - 34 sur un iPhone à encoche.
 *
 * On regroupe ce calcul ici pour que la pilule, la capsule de lecture et le
 * bas de chaque écran utilisent tous LA MÊME valeur. Sinon on obtient des
 * décalages d'un écran à l'autre.
 */
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { mise } from '@/design/tokens';

/** Petit jeu laissé entre la barre système et la pilule, quand il y a une barre. */
const JEU = 8;

/**
 * Distance entre le bas de l'écran et le bas de la pilule.
 *
 * Sans barre système, on retombe exactement sur les 24 de la maquette.
 * Avec la navigation par gestes (16 + 8 = 24), on retombe dessus aussi.
 */
export function useBasPilule(): number {
  const insets = useSafeAreaInsets();
  return insets.bottom > 0 ? insets.bottom + JEU : mise.pilule.basEcran;
}

/**
 * Espace à réserver en bas du contenu d'un écran qui affiche la pilule.
 *
 * À utiliser dans `contentContainerStyle` : sans lui, la dernière ligne d'une
 * liste passerait sous la pilule et deviendrait illisible (c'est un point
 * explicite de la checklist pixel, § 10 Réglages).
 */
export function useReservePilule(): number {
  const insets = useSafeAreaInsets();
  return mise.reservePilule + insets.bottom;
}
