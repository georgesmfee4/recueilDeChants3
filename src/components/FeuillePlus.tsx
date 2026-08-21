/**
 * Feuille « Plus d'actions » (écran 08b), ouverte par le ⋯ de la lecture.
 *
 * Quatre lignes seulement. Le repère (« + », « ↗ », « # », « A ») est composé
 * en serif violet dans une colonne de 20 : il précède le libellé comme une
 * puce, sans jamais devenir une icône décorative.
 */
import { Pressable, Text, View } from 'react-native';
import { useTheme } from '@/design/ThemeProvider';
import { polices } from '@/design/tokens';
import { FeuilleInferieure } from './FeuilleInferieure';
import { IconeAllerA, IconePartager, IconeReglages, IconeSignet } from './icones';

type Proprietes = {
  visible: boolean;
  onFermer: () => void;
  n: number;
  titre: string;
  favori: boolean;
  onBasculerFavori: () => void;
  onPartager: () => void;
  onAllerA: () => void;
  onTailleTexte: () => void;
};

export function FeuillePlus({
  visible,
  onFermer,
  n,
  titre,
  favori,
  onBasculerFavori,
  onPartager,
  onAllerA,
  onTailleTexte,
}: Proprietes) {
  const { c } = useTheme();

  /**
   * Les quatre actions. Chacune porte sa propre icône, dessinée dans une
   * colonne de 20 : le regard descend le long des icônes pour trouver
   * l'action, il n'a pas à lire les quatre libellés.
   *
   * Le signet est PLEIN quand le chant est déjà en favori : l'icône dit alors
   * « il est gardé », et le libellé dit ce que fera le toucher (« Retirer »).
   */
  const lignes = [
    {
      cle: 'favori',
      icone: <IconeSignet size={18} color={c.pri} plein={favori} />,
      libelle: favori ? 'Retirer des favoris' : 'Ajouter aux favoris',
      action: onBasculerFavori,
    },
    {
      cle: 'partager',
      icone: <IconePartager size={18} color={c.pri} />,
      libelle: 'Partager les paroles',
      action: onPartager,
    },
    {
      cle: 'aller',
      icone: <IconeAllerA size={18} color={c.pri} />,
      libelle: 'Aller à un chant',
      action: onAllerA,
    },
    {
      cle: 'taille',
      icone: <IconeReglages size={18} color={c.pri} />,
      libelle: 'Taille du texte',
      action: onTailleTexte,
    },
  ];

  return (
    <FeuilleInferieure visible={visible} onFermer={onFermer}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
          paddingBottom: 6,
        }}>
        <Text style={{ fontFamily: polices.serif.regular, fontSize: 20, color: c.pri }}>{n}</Text>
        <Text
          numberOfLines={1}
          style={{ flex: 1, fontFamily: polices.sans.regular, fontSize: 12.5, color: c.ink3 }}>
          {titre}
        </Text>
      </View>

      {lignes.map(ligne => (
        <Pressable
          key={ligne.cle}
          accessibilityRole="button"
          accessibilityLabel={ligne.libelle}
          onPress={() => {
            ligne.action();
            onFermer();
          }}
          style={({ pressed }) => ({
            flexDirection: 'row',
            alignItems: 'center',
            gap: 14,
            paddingVertical: 16,
            borderTopWidth: 1,
            borderTopColor: c.ruleSoft,
            backgroundColor: pressed ? c.priSoft : 'transparent',
          })}>
          <View style={{ width: 20, alignItems: 'center' }}>{ligne.icone}</View>
          <Text style={{ fontFamily: polices.sans.medium, fontSize: 14.5, color: c.ink }}>
            {ligne.libelle}
          </Text>
        </Pressable>
      ))}
    </FeuilleInferieure>
  );
}
