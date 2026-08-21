/**
 * Un bloc non numéroté en lecture : refrain, ou strophe que le recueil ne
 * numérote pas (72 chants sont dans ce cas).
 *
 * Toujours centré, entre deux filets or. L'italique n'est appliquée qu'aux
 * VRAIS refrains et seulement si le réglage est actif : une strophe sans
 * numéro n'est pas un refrain, on ne l'incline pas.
 */
import { Text, View } from 'react-native';
import { useTheme } from '@/design/ThemeProvider';
import { styleParoles, styleParolesItaliques, type CranTaille, type Interligne } from '@/design/type';
import { clair } from '@/design/tokens';

type Proprietes = {
  lignes: string[];
  taille: CranTaille;
  interligne: Interligne;
  italique: boolean;
};

export function BlocRefrain({ lignes, taille, interligne, italique }: Proprietes) {
  const { c } = useTheme();
  const style = italique
    ? styleParolesItaliques(taille, interligne)
    : styleParoles(taille, interligne);

  // L'or est une constante de la marque : il ne change pas en mode sombre.
  const filetOr = { height: 1, backgroundColor: clair.or };

  return (
    <View style={{ marginVertical: 26, marginHorizontal: 4 }}>
      <View style={filetOr} />
      <View style={{ paddingVertical: 18 }}>
        {lignes.map((ligne, i) => (
          <Text
            key={i}
            allowFontScaling={false}
            style={[style, { color: c.ink, textAlign: 'center' }]}>
            {ligne}
          </Text>
        ))}
      </View>
      <View style={filetOr} />
    </View>
  );
}
