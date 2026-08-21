/**
 * Le surtitre : la petite capitale espacée posée au-dessus d'un bloc.
 * Exemples : « REPRENDRE », « LE CHANT DU JOUR », « APERÇU ».
 *
 * Ici le texte est déjà écrit en capitales par l'appelant : on n'utilise pas
 * `textTransform`, qui abîmerait les accents (« Ô », « É »).
 */
import { Text, type StyleProp, type TextStyle } from 'react-native';
import { useTheme } from '@/design/ThemeProvider';
import { type } from '@/design/type';

type Proprietes = {
  children: string;
  /** Par défaut `ink3` (gris de métadonnée), parfois `pri` sur l'accueil. */
  couleur?: string;
  style?: StyleProp<TextStyle>;
};

export function Surtitre({ children, couleur, style }: Proprietes) {
  const { c } = useTheme();
  return <Text style={[type.surtitre, { color: couleur ?? c.ink3 }, style]}>{children}</Text>;
}
