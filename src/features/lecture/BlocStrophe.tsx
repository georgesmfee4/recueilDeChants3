/**
 * Une strophe numérotée en lecture.
 *
 * Deux colonnes : le numéro dans la marge (colonne de 13, serif violet) puis
 * les vers. Le numéro se masque si l'utilisateur a décoché « Numéros de
 * strophe » dans les Réglages, mais la colonne de gauche reste : sans elle,
 * le texte sauterait de 28 points à chaque bascule du réglage.
 */
import { Text, View } from 'react-native';
import { useTheme } from '@/design/ThemeProvider';
import { styleParoles, type CranTaille, type Interligne } from '@/design/type';
import { polices } from '@/design/tokens';

type Proprietes = {
  numero: number;
  lignes: string[];
  taille: CranTaille;
  interligne: Interligne;
  afficherNumero: boolean;
};

export function BlocStrophe({
  numero,
  lignes,
  taille,
  interligne,
  afficherNumero,
}: Proprietes) {
  const { c } = useTheme();
  const style = styleParoles(taille, interligne);

  return (
    <View style={{ flexDirection: 'row', gap: 15, marginTop: 24 }}>
      <View style={{ width: 13, paddingTop: 5 }}>
        {afficherNumero ? (
          <Text
            style={{
              fontFamily: polices.serif.regular,
              fontSize: 12.5,
              letterSpacing: 0.5,
              color: c.pri,
            }}>
            {numero}
          </Text>
        ) : null}
      </View>

      <View style={{ flex: 1 }}>
        {lignes.map((ligne, i) => (
          // La taille est déjà réglable dans l'application : on coupe `fontScale`
          // du système pour ne pas cumuler les deux agrandissements.
          <Text key={i} allowFontScaling={false} style={[style, { color: c.ink }]}>
            {ligne}
          </Text>
        ))}
      </View>
    </View>
  );
}
