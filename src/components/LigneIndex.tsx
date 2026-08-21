/**
 * Une ligne de l'index des cantiques.
 *
 * Mémorisée avec `React.memo` : la liste en contient 302 et FlashList les
 * recycle en permanence. Sans mémorisation, chaque défilement re-rendrait
 * toutes les lignes visibles.
 *
 * Le numéro déborde volontairement dans la marge gauche (colonne de 44 qui
 * commence à 14 du bord) : c'est ce qui donne à la page son air de recueil.
 */
import { memo } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useTheme } from '@/design/ThemeProvider';
import { type } from '@/design/type';
import { polices } from '@/design/tokens';
import { IconeSignet } from './icones';

type Proprietes = {
  n: number;
  /** Titre VERBATIM, déjà en capitales dans les données : on ne le transforme pas. */
  titre: string;
  sousLigne: string;
  favori: boolean;
  /** Réglage « numéros géants » : 22 quand il est actif, 15 sinon. */
  grosNumero?: boolean;
  onPress: () => void;
};

export const LigneIndex = memo(function LigneIndex({
  n,
  titre,
  sousLigne,
  favori,
  grosNumero = true,
  onPress,
}: Proprietes) {
  const { c } = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Chant ${n}, ${titre}`}
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 14,
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: c.ruleSoft,
        backgroundColor: pressed ? c.priSoft : 'transparent',
      })}>
      <Text
        style={{
          width: 44,
          textAlign: 'right',
          fontFamily: polices.serif.regular,
          fontSize: grosNumero ? 22 : 15,
          lineHeight: grosNumero ? 22 : 15,
          color: c.pri,
        }}>
        {n}
      </Text>

      <View style={{ flex: 1 }}>
        <Text style={[type.titreIndex, { color: c.ink }]} numberOfLines={2}>
          {titre}
        </Text>
        <Text style={[type.sousLigne, { color: c.ink3, marginTop: 2 }]} numberOfLines={1}>
          {sousLigne}
        </Text>
      </View>

      {/* Le signet n'apparaît que si le chant est gardé. */}
      {favori ? <IconeSignet size={13} color={c.pri} plein /> : null}
    </Pressable>
  );
});
