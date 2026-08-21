/**
 * L'en-tête commun aux écrans de liste (Cantiques, Chœurs, Favoris, Réglages).
 *
 * Un grand titre serif à gauche, un sous-titre gris en dessous, et un
 * emplacement libre aligné en BAS à droite (bouton « Aller à », lien
 * « À propos »…). L'alignement sur la ligne de base du sous-titre est ce qui
 * donne son assise à la page.
 */
import type { ReactNode } from 'react';
import { Text, View } from 'react-native';
import { useTheme } from '@/design/ThemeProvider';
import { type } from '@/design/type';
import { polices } from '@/design/tokens';

type Proprietes = {
  titre: string;
  sousTitre?: string;
  /** Rendu en bas à droite : bouton, lien… */
  action?: ReactNode;
};

export function EnTeteEcran({ titre, sousTitre, action }: Proprietes) {
  const { c } = useTheme();

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        marginTop: 8,
      }}>
      <View style={{ flex: 1 }}>
        <Text style={[type.titreEcran, { color: c.ink }]}>{titre}</Text>
        {sousTitre ? (
          <Text
            style={{
              fontFamily: polices.sans.regular,
              fontSize: 11.5,
              color: c.ink3,
              marginTop: 7,
            }}>
            {sousTitre}
          </Text>
        ) : null}
      </View>
      {action}
    </View>
  );
}
