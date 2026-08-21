/**
 * Le clavier de la feuille « Aller à un chant ».
 *
 * Grille 3 colonnes × 4 rangées : 1…9, puis ← 0 OK.
 * Astuce de mise en page : les filets entre les touches ne sont pas des
 * bordures mais des INTERSTICES de 1 point. On peint le fond de la grille en
 * `rule` et on laisse 1 point de vide entre des touches couleur papier.
 *
 * `OK` est toujours en violet, jamais grisé : c'est l'action de confirmation.
 */
import { Pressable, Text, View } from 'react-native';
import { useTheme } from '@/design/ThemeProvider';
import { mise, polices } from '@/design/tokens';

type Proprietes = {
  onChiffre: (chiffre: string) => void;
  onEffacer: () => void;
  onValider: () => void;
};

/** Le contenu des 12 touches, dans l'ordre de lecture. */
const TOUCHES = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '←', '0', 'OK'] as const;

export function ClavierNumeros({ onChiffre, onEffacer, onValider }: Proprietes) {
  const { c } = useTheme();

  const appuyer = (touche: string) => {
    if (touche === '←') return onEffacer();
    if (touche === 'OK') return onValider();
    onChiffre(touche);
  };

  return (
    <View
      style={{
        marginTop: 22,
        borderWidth: 1,
        borderColor: c.rule,
        // Ce fond ne se voit que dans les interstices de 1 point.
        backgroundColor: c.rule,
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: mise.feuille.interstice,
      }}>
      {TOUCHES.map(touche => {
        const estCommande = touche === '←' || touche === 'OK';
        return (
          <Pressable
            key={touche}
            accessibilityRole="button"
            accessibilityLabel={touche === '←' ? 'Effacer un chiffre' : touche}
            onPress={() => appuyer(touche)}
            style={({ pressed }) => ({
              // 3 colonnes : chaque touche occupe un tiers, moins les 2 interstices.
              width: `${100 / 3}%`,
              flexBasis: '32.9%',
              flexGrow: 1,
              height: mise.feuille.touche,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: pressed ? c.priSoft : c.paper,
            })}>
            <Text
              style={{
                fontFamily: polices.serif.regular,
                fontSize: estCommande ? 14 : 23,
                color: touche === 'OK' ? c.pri : estCommande ? c.ink3 : c.ink,
              }}>
              {touche}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
