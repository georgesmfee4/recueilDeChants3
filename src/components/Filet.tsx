/**
 * Le filet : un trait de 1 point.
 *
 * C'est l'élément structurant de tout le produit — il n'y a ni ombre, ni coin
 * arrondi, ni dégradé nulle part. Ce sont ces traits qui découpent la page.
 *
 * Important : on écrit 1 et JAMAIS `StyleSheet.hairlineWidth`. Sur un écran
 * de densité 3× (iPhone), hairlineWidth vaut 0,33 et le filet disparaît.
 */
import { View, type DimensionValue } from 'react-native';

type Proprietes = {
  couleur: string;
  /** Par défaut le filet occupe toute la largeur disponible. */
  largeur?: DimensionValue;
  /** Marge au-dessus du filet, en points. */
  marge?: number;
};

export function Filet({ couleur, largeur = '100%', marge = 0 }: Proprietes) {
  return <View style={{ height: 1, width: largeur, backgroundColor: couleur, marginTop: marge }} />;
}
