/**
 * Le sélecteur à segments — utilisé pour le Thème (3 choix) et l'Interligne (3 choix).
 *
 * Un cadre de 1 point, des parts égales séparées par des filets de 1 point.
 * Le segment actif se remplit de violet. Aucun arrondi.
 *
 * Le composant est générique : `Segments<'Clair' | 'Sombre' | 'Système'>`.
 */
import { Pressable, Text, View } from 'react-native';
import { useTheme } from '@/design/ThemeProvider';
import { polices } from '@/design/tokens';

type Proprietes<T extends string> = {
  options: readonly T[];
  valeur: T;
  onChange: (v: T) => void;
};

export function Segments<T extends string>({ options, valeur, onChange }: Proprietes<T>) {
  const { c } = useTheme();

  return (
    <View style={{ flexDirection: 'row', borderWidth: 1, borderColor: c.rule }}>
      {options.map((option, i) => {
        const actif = option === valeur;
        return (
          <Pressable
            key={option}
            onPress={() => onChange(option)}
            accessibilityRole="radio"
            accessibilityState={{ selected: actif }}
            style={{
              flex: 1,
              paddingVertical: 11,
              alignItems: 'center',
              backgroundColor: actif ? c.pri : 'transparent',
              // Filet de séparation : sur tous les segments sauf le premier.
              borderLeftWidth: i === 0 ? 0 : 1,
              borderLeftColor: c.rule,
            }}>
            <Text
              style={{
                fontFamily: polices.sans.semibold,
                fontSize: 12.5,
                color: actif ? c.onPri : c.ink2,
              }}>
              {option}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
