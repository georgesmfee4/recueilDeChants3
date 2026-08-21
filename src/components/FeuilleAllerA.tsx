/**
 * Feuille « Aller à un chant » (écran 08).
 *
 * On compose un numéro au clavier et le titre se résout EN DIRECT au-dessus :
 * l'utilisateur sait qu'il tape le bon numéro avant même de valider.
 *
 * Accessible depuis quatre endroits : la liste des cantiques, les chœurs, la
 * capsule de lecture et la feuille « Plus d'actions ».
 */
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useTheme } from '@/design/ThemeProvider';
import { polices } from '@/design/tokens';
import { cantique } from '@/data/recueil';
import { ClavierNumeros } from './ClavierNumeros';
import { FeuilleInferieure } from './FeuilleInferieure';
import { Surtitre } from './Surtitre';
import { IconeEffacer } from './icones';

type Proprietes = {
  visible: boolean;
  onFermer: () => void;
  /** Appelé avec un numéro valide ; c'est l'appelant qui décide de la navigation. */
  onOuvrir: (n: number) => void;
};

export function FeuilleAllerA({ visible, onFermer, onOuvrir }: Proprietes) {
  return (
    <FeuilleInferieure visible={visible} onFermer={onFermer}>
      {/* La `key` change à chaque ouverture, ce qui force React à remonter le
          contenu à neuf : la saisie repart donc vide, sans qu'on ait à la
          remettre à zéro nous-mêmes. C'est le moyen recommandé par React pour
          réinitialiser l'état d'un composant. */}
      <ContenuAllerA
        key={visible ? 'ouverte' : 'fermee'}
        onFermer={onFermer}
        onOuvrir={onOuvrir}
      />
    </FeuilleInferieure>
  );
}

/** Le contenu de la feuille : l'affichage du numéro composé et le clavier. */
function ContenuAllerA({ onFermer, onOuvrir }: Omit<Proprietes, 'visible'>) {
  const { c } = useTheme();
  const [saisie, setSaisie] = useState('');

  const numero = saisie === '' ? null : Number(saisie);
  const chant = numero === null ? undefined : cantique(numero);

  const valider = () => {
    if (!chant) return; // Numéro absent du recueil : on n'affiche pas d'erreur, on ne fait rien.
    onOuvrir(chant.n);
    onFermer();
  };

  /** Le texte gris sous le grand numéro : titre trouvé, invite, ou message d'absence. */
  const legende = () => {
    if (numero === null) return 'Composez un numéro de 1 à 302';
    if (!chant) return `Aucun chant n° ${numero}`;
    return chant.title;
  };

  return (
    <>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Surtitre>ALLER À UN CHANT</Surtitre>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Fermer"
          onPress={onFermer}
          hitSlop={12}
          style={{ width: 30, height: 30, alignItems: 'flex-end' }}>
          <IconeEffacer size={16} color={c.ink3} />
        </Pressable>
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, marginTop: 12 }}>
        <Text
          style={{
            fontFamily: polices.serif.regular,
            fontSize: 46,
            letterSpacing: -2,
            color: c.pri,
          }}>
          {saisie === '' ? '—' : saisie}
        </Text>
        <Text
          numberOfLines={2}
          style={{
            flex: 1,
            fontFamily: polices.serif.regular,
            fontSize: 17,
            lineHeight: 21,
            color: c.ink2,
          }}>
          {legende()}
        </Text>
      </View>

      <ClavierNumeros
        // Maximum 3 chiffres : au-delà, on ignore la frappe.
        onChiffre={ch => setSaisie(s => (s.length >= 3 ? s : s + ch))}
        onEffacer={() => setSaisie(s => s.slice(0, -1))}
        onValider={valider}
      />

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Ouvrir le chant"
        onPress={valider}
        style={({ pressed }) => ({
          marginTop: 14,
          paddingVertical: 16,
          alignItems: 'center',
          backgroundColor: pressed ? c.priDeep : c.pri,
        })}>
        <Text
          style={{
            fontFamily: polices.sans.semibold,
            fontSize: 14,
            letterSpacing: 0.3,
            color: c.onPri,
          }}>
          Ouvrir le chant
        </Text>
      </Pressable>
    </>
  );
}
