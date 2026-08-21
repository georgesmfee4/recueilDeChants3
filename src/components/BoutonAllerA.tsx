/**
 * Le bouton « Aller à » des en-têtes Cantiques et Chœurs.
 *
 * Bouton de type « contour » : un filet, pas de fond, pas d'arrondi.
 * Le libellé tient sur une seule ligne (`numberOfLines={1}`), c'est un point
 * de la checklist pixel.
 */
import { Pressable, Text } from 'react-native';
import { useTheme } from '@/design/ThemeProvider';
import { polices } from '@/design/tokens';
import { IconeAllerA } from './icones';

export function BoutonAllerA({ onPress }: { onPress: () => void }) {
  const { c } = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Aller à un chant"
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        gap: 7,
        paddingVertical: 9,
        paddingHorizontal: 13,
        borderWidth: 1,
        borderColor: c.rule,
        backgroundColor: pressed ? c.priSoft : 'transparent',
      })}>
      <IconeAllerA size={15} color={c.pri} />
      <Text
        numberOfLines={1}
        style={{ fontFamily: polices.sans.semibold, fontSize: 12, color: c.pri }}>
        Aller à
      </Text>
    </Pressable>
  );
}
