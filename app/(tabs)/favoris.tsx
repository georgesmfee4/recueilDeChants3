/**
 * Écran 09 · Favoris — les chants gardés.
 *
 * Liste triée par numéro (le tri est fait à l'ajout, voir src/store/bibliotheque.ts).
 * Chaque ligne se retire d'un seul toucher sur la croix : pas de confirmation,
 * pas de glissement à découvrir. Remettre un favori coûte un toucher, il n'y a
 * donc rien à protéger.
 *
 * L'état vide n'est pas un accident à cacher : c'est le premier écran que
 * verra l'utilisateur, et il doit lui expliquer comment le remplir.
 */
import { useMemo } from 'react';
import { Pressable, Text, View } from 'react-native';
import { router } from 'expo-router';
import { FlashList } from '@shopify/flash-list';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { EnTeteEcran } from '@/components/EnTeteEcran';
import { SqueletteFavoris } from '@/components/Squelette';
import { useReservePilule } from '@/components/espacePilule';
import { IconeEffacer } from '@/components/icones';
import { useTheme } from '@/design/ThemeProvider';
import { usePret } from '@/design/usePret';
import { mise, polices } from '@/design/tokens';
import { cantique, sousLigne } from '@/data/recueil';
import type { Cantique } from '@/data/types';
import { useBibliotheque } from '@/store/bibliotheque';

export default function EcranFavoris() {
  const { c } = useTheme();
  const insets = useSafeAreaInsets();
  const reserveBas = useReservePilule();
  const pret = usePret();

  const favoris = useBibliotheque(s => s.favoris);
  const retirerFavori = useBibliotheque(s => s.retirerFavori);

  // On convertit les numéros gardés en vrais cantiques. `filter` élimine un
  // éventuel numéro devenu introuvable : si une future édition du recueil
  // arrivait par mise à jour OTA avec moins de chants, l'écran ne planterait pas.
  const chants = useMemo(
    () => favoris.map(n => cantique(n)).filter((ch): ch is Cantique => ch !== undefined),
    [favoris],
  );

  return (
    <View style={{ flex: 1, backgroundColor: c.paper, paddingTop: insets.top }}>
      <View style={{ paddingHorizontal: mise.margeEcran }}>
        <EnTeteEcran
          titre="Favoris"
          sousTitre={
            chants.length > 1 ? `${chants.length} chants gardés` : `${chants.length} chant gardé`
          }
        />
      </View>

      {!pret ? (
        <View style={{ paddingHorizontal: mise.margeEcran, marginTop: 22 }}>
          <SqueletteFavoris lignes={4} />
        </View>
      ) : chants.length === 0 ? (
        <EtatVide />
      ) : (
        <FlashList
          data={chants}
          keyExtractor={ch => String(ch.n)}
          contentContainerStyle={{
            paddingHorizontal: mise.margeEcran,
            paddingBottom: reserveBas,
          }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <LigneFavori
              chant={item}
              onOuvrir={() => router.push(`/chant/${item.n}`)}
              onRetirer={() => retirerFavori(item.n)}
            />
          )}
        />
      )}
    </View>
  );
}

/** Une ligne de la liste des favoris. */
function LigneFavori({
  chant,
  onOuvrir,
  onRetirer,
}: {
  chant: Cantique;
  onOuvrir: () => void;
  onRetirer: () => void;
}) {
  const { c } = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Chant ${chant.n}, ${chant.title}`}
      onPress={onOuvrir}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 16,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: c.ruleSoft,
        backgroundColor: pressed ? c.priSoft : 'transparent',
      })}>
      <Text
        style={{
          width: 40,
          textAlign: 'right',
          fontFamily: polices.serif.regular,
          fontSize: 26,
          lineHeight: 28,
          letterSpacing: -0.8,
          color: c.pri,
        }}>
        {chant.n}
      </Text>

      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontFamily: polices.serif.regular,
            fontSize: 15.5,
            lineHeight: 19.8,
            letterSpacing: 0.3,
            color: c.ink,
          }}>
          {chant.title}
        </Text>
        {/* La première parole du chant, pas sa structure : savoir qu'un chant
            a « 5 strophes · refrain » n'aide personne à le reconnaître. */}
        <Text
          numberOfLines={1}
          style={{
            fontFamily: polices.sans.regular,
            fontSize: 11.5,
            color: c.ink3,
            marginTop: 5,
          }}>
          {sousLigne(chant)}
        </Text>
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Retirer le chant ${chant.n} des favoris`}
        onPress={onRetirer}
        hitSlop={12}
        style={{ width: 26, height: 26, alignItems: 'center', justifyContent: 'center' }}>
        {({ pressed }) => <IconeEffacer size={14} color={pressed ? c.pri : c.ink3} />}
      </Pressable>
    </Pressable>
  );
}

/** Ce qu'on voit quand aucun chant n'a encore été gardé. */
function EtatVide() {
  const { c } = useTheme();

  return (
    <View style={{ marginTop: 70, alignItems: 'center', paddingHorizontal: mise.margeEcran }}>
      <Text style={{ fontFamily: polices.serif.regular, fontSize: 22, color: c.ink2 }}>
        Aucun favori
      </Text>
      <Text
        style={{
          fontFamily: polices.sans.regular,
          fontSize: 13,
          lineHeight: 20.8,
          color: c.ink3,
          textAlign: 'center',
          marginTop: 10,
        }}>
        Touchez le signet en haut d&apos;un chant{'\n'}pour le garder ici.
      </Text>
    </View>
  );
}
