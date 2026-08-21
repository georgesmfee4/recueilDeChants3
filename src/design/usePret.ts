/**
 * « L'écran est-il prêt à dessiner son contenu lourd ? »
 *
 * Le problème concret : quand on touche « Cantiques », React doit à la fois
 * jouer l'animation de navigation ET construire une liste de 302 lignes. Sur
 * un téléphone lent, les deux se disputent le même fil d'exécution et
 * l'animation saccade — l'application paraît bloquée.
 *
 * La solution : `InteractionManager.runAfterInteractions` attend la fin des
 * animations en cours avant d'exécuter son callback. On affiche donc d'abord
 * un squelette (instantané), et le vrai contenu arrive une fois la transition
 * finie. L'utilisateur voit une réaction immédiate.
 *
 * LE GARDE-FOU : `runAfterInteractions` n'a aucune limite de temps. Si une
 * animation oublie de se déclarer terminée — cela arrive — le callback ne part
 * jamais et l'écran reste bloqué sur son squelette. On lance donc en parallèle
 * une minuterie de sécurité : le premier des deux qui arrive gagne.
 *
 * Usage :
 *   const pret = usePret();
 *   return pret ? <MaGrosseListe /> : <SqueletteListe />;
 */
import { useEffect, useState } from 'react';
import { InteractionManager } from 'react-native';

/** Au-delà de ce délai, on affiche le contenu quoi qu'il arrive. */
const SECURITE = 350;

export function usePret(): boolean {
  const [pret, setPret] = useState(false);

  useEffect(() => {
    let fini = false;
    const marquerPret = () => {
      if (fini) return;
      fini = true;
      setPret(true);
    };

    const tache = InteractionManager.runAfterInteractions(marquerPret);
    const secours = setTimeout(marquerPret, SECURITE);

    // Si l'utilisateur quitte l'écran avant la fin, on annule tout : inutile de
    // déclencher un rendu sur un écran qui n'existe plus.
    return () => {
      fini = true;
      tache.cancel();
      clearTimeout(secours);
    };
  }, []);

  return pret;
}
