/**
 * Le champ de recherche — deux états, pas un de plus.
 *
 *   au repos : filet bas gris, loupe et texte gris ;
 *   actif    : filet bas VIOLET, loupe violette, texte encre.
 *
 * Jamais de fond, jamais de cadre complet, jamais d'arrondi : c'est le filet
 * qui signale que le champ est actif.
 */
import { useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';
import { useTheme } from '@/design/ThemeProvider';
import { polices } from '@/design/tokens';
import { IconeEffacer, IconeRecherche } from './icones';

type Proprietes = {
  valeur: string;
  onChange: (v: string) => void;
  /** Donne le focus dès l'ouverture de l'écran de recherche. */
  autoFocus?: boolean;
  /** Appelé quand l'utilisateur valide au clavier (touche « Rechercher »). */
  onValider?: () => void;
};

export function ChampRecherche({
  valeur,
  onChange,
  autoFocus = false,
  onValider,
}: Proprietes) {
  const { c } = useTheme();
  const [actif, setActif] = useState(autoFocus);

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: actif ? c.pri : c.rule,
      }}>
      <IconeRecherche size={19} color={actif ? c.pri : c.ink3} />

      <TextInput
        value={valeur}
        onChangeText={onChange}
        onFocus={() => setActif(true)}
        onBlur={() => setActif(false)}
        autoFocus={autoFocus}
        placeholder="Titre, parole ou numéro"
        placeholderTextColor={c.ink3}
        selectionColor={c.pri}
        returnKeyType="search"
        onSubmitEditing={onValider}
        autoCorrect={false}
        accessibilityLabel="Rechercher dans le recueil"
        style={{
          flex: 1,
          padding: 0,
          fontFamily: polices.sans.regular,
          fontSize: 17,
          color: c.ink,
        }}
      />

      {valeur.length > 0 ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Effacer la recherche"
          onPress={() => onChange('')}
          hitSlop={12}
          style={{ width: 24, height: 24, alignItems: 'center', justifyContent: 'center' }}>
          <IconeEffacer size={15} color={c.ink3} />
        </Pressable>
      ) : null}
    </View>
  );
}
