/**
 * Ré-export des icônes utilisées par la pilule de navigation.
 *
 * L'onglet « Favoris » réutilise le signet, toujours en version vide : le
 * remplissage du signet a un autre sens (« ce chant est gardé »), on ne le
 * mélange pas avec « voici l'onglet des favoris ».
 */
import { IconeSignet, type ProprietesIcone } from './index';

export { IconeAccueil, IconeCantiques, IconeChoeurs, IconeRecherche } from './index';

export function IconeFavorisSignet(props: ProprietesIcone) {
  return <IconeSignet {...props} plein={false} />;
}
