/**
 * Réglages d'animation partagés.
 *
 * Le produit n'a qu'UNE SEULE courbe : cubic-bezier(.2, .8, .16, 1).
 * Elle démarre vite et s'arrête net, comme une page qu'on repose.
 * Aucun `withSpring`, aucun rebond, aucun changement d'échelle sur les pressions.
 */
import { useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';
import { Easing } from 'react-native-reanimated';
import { mouvement } from './tokens';

export const COURBE = Easing.bezier(...mouvement.courbe);

/**
 * L'utilisateur a-t-il coché « Réduire les animations » dans son téléphone ?
 * Si oui, on saute les translations et les fondus (durée 0) : c'est une
 * exigence d'accessibilité, pas une option.
 */
export function useAnimationsReduites(): boolean {
  const [reduites, setReduites] = useState(false);

  useEffect(() => {
    let vivant = true;
    AccessibilityInfo.isReduceMotionEnabled().then(v => {
      if (vivant) setReduites(v);
    });
    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduites);
    return () => {
      vivant = false;
      sub.remove();
    };
  }, []);

  return reduites;
}
