/**
 * Écran 06 · Chœurs — les 85 chœurs, classés par lettre.
 *
 * Différence importante avec les cantiques : un chœur est court, il n'a donc
 * PAS d'écran de lecture. Ses paroles sont écrites en entier dans la liste.
 * On ne touche pas un chœur pour l'ouvrir : il est déjà ouvert.
 *
 * La grande lettre en filigrane dans la colonne de gauche (Newsreader 52, en
 * `priSoft`) n'est pas décorative : c'est elle qui rend le classement lisible
 * quand on fait défiler vite.
 *
 * Côté performance, on donne à FlashList les GROUPES et non les chœurs
 * (17 éléments au lieu de 85). Deux avantages : le filigrane reste solidaire
 * de son groupe, et le saut depuis la bande alphabétique devient un simple
 * `scrollToIndex` sur le rang de la lettre.
 */
import { useRef, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { FlashList, type FlashListRef } from '@shopify/flash-list';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BoutonAllerA } from '@/components/BoutonAllerA';
import { EnTeteEcran } from '@/components/EnTeteEcran';
import { FeuilleAllerA } from '@/components/FeuilleAllerA';
import { SqueletteChoeurs } from '@/components/Squelette';
import { useReservePilule } from '@/components/espacePilule';
import { useTheme } from '@/design/ThemeProvider';
import { usePret } from '@/design/usePret';
import { mise, polices } from '@/design/tokens';
import { choeurs, choeursParLettre, type GroupeChoeurs } from '@/data/recueil';
import type { Choeur } from '@/data/types';
import { router } from 'expo-router';

export default function EcranChoeurs() {
  const { c } = useTheme();
  const insets = useSafeAreaInsets();
  const reserveBas = useReservePilule();
  const pret = usePret();

  const [feuilleOuverte, setFeuilleOuverte] = useState(false);
  const [lettreActive, setLettreActive] = useState<string>('A');
  const liste = useRef<FlashListRef<GroupeChoeurs>>(null);

  // Regroupement calculé à la première demande, puis gardé en cache.
  const groupes = choeursParLettre();

  const sauterALaLettre = (lettre: string) => {
    const index = groupes.findIndex(g => g.lettre === lettre);
    if (index < 0) return;
    setLettreActive(lettre);
    liste.current?.scrollToIndex({ index, animated: true });
  };

  return (
    <View style={{ flex: 1, backgroundColor: c.paper, paddingTop: insets.top }}>
      {/* 1 · En-tête */}
      <View style={{ paddingHorizontal: mise.margeEcran }}>
        <EnTeteEcran
          titre="Chœurs"
          sousTitre={`${choeurs.length} chœurs · classés par lettre`}
          action={<BoutonAllerA onPress={() => setFeuilleOuverte(true)} />}
        />

        {/* 2 · La bande alphabétique.
            Seules les lettres RÉELLEMENT présentes dans le recueil sont
            affichées — pas de case morte qui ne mène nulle part. */}
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 4,
            marginTop: 20,
            paddingBottom: 18,
            borderBottomWidth: 1,
            borderBottomColor: c.rule,
          }}>
          {groupes.map(g => {
            const actif = g.lettre === lettreActive;
            return (
              <Pressable
                key={g.lettre}
                accessibilityRole="button"
                accessibilityState={{ selected: actif }}
                accessibilityLabel={`Aller à la lettre ${g.lettre}`}
                onPress={() => sauterALaLettre(g.lettre)}
                hitSlop={9}
                style={{
                  width: 28,
                  height: 28,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: actif ? c.pri : 'transparent',
                }}>
                <Text
                  style={{
                    fontFamily: polices.serif.regular,
                    fontSize: 14,
                    color: actif ? c.onPri : c.ink2,
                  }}>
                  {g.lettre}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* 3 · Les groupes — ou leur esquisse pendant la transition */}
      {pret ? (
        <FlashList
          ref={liste}
          data={groupes}
          keyExtractor={g => g.lettre}
          contentContainerStyle={{
            paddingHorizontal: mise.margeEcran,
            paddingBottom: reserveBas,
          }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => <GroupeLettre groupe={item} />}
          onViewableItemsChanged={({ viewableItems }) => {
            const premier = viewableItems[0]?.item as GroupeChoeurs | undefined;
            if (premier) setLettreActive(premier.lettre);
          }}
        />
      ) : (
        <View style={{ paddingHorizontal: mise.margeEcran }}>
          <SqueletteChoeurs groupes={3} />
        </View>
      )}

      <FeuilleAllerA
        visible={feuilleOuverte}
        onFermer={() => setFeuilleOuverte(false)}
        onOuvrir={n => router.push(`/chant/${n}`)}
      />
    </View>
  );
}

/** Une lettre et tous les chœurs qui lui appartiennent. */
function GroupeLettre({ groupe }: { groupe: GroupeChoeurs }) {
  const { c } = useTheme();

  return (
    <View style={{ flexDirection: 'row', gap: 18 }}>
      {/* Colonne de gauche : la lettre en filigrane. */}
      <Text
        style={{
          width: 34,
          paddingTop: 12,
          fontFamily: polices.serif.regular,
          fontSize: 52,
          lineHeight: 56,
          color: c.priSoft,
        }}>
        {groupe.lettre}
      </Text>

      {/* Colonne de droite : les chœurs. */}
      <View style={{ flex: 1 }}>
        {groupe.items.map(item => (
          <BlocChoeur key={item.n} choeur={item} />
        ))}
      </View>
    </View>
  );
}

/**
 * Un chœur.
 *
 * Sa première ligne tient lieu de titre : elle est composée plus grande et en
 * encre pleine, avec le numéro à droite. Les lignes suivantes sont en `ink2`,
 * légèrement plus petites — c'est cette différence de graisse qui laisse
 * repérer où commence chaque chœur sans avoir besoin d'un filet supplémentaire.
 */
function BlocChoeur({ choeur }: { choeur: Choeur }) {
  const { c } = useTheme();
  const [premiere, ...suite] = choeur.l;

  return (
    <View
      style={{
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: c.ruleSoft,
      }}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12 }}>
        <Text
          style={{
            flex: 1,
            fontFamily: polices.serif.regular,
            fontSize: 17,
            lineHeight: 22.8,
            color: c.ink,
          }}>
          {premiere}
        </Text>
        <Text
          style={{
            fontFamily: polices.sans.regular,
            fontSize: 10.5,
            letterSpacing: 1.2,
            color: c.ink3,
            paddingTop: 5,
          }}>
          N° {choeur.n}
        </Text>
      </View>

      {suite.map((ligne, i) => (
        <Text
          key={i}
          style={{
            fontFamily: polices.serif.regular,
            fontSize: 15.5,
            lineHeight: 22.6,
            color: c.ink2,
          }}>
          {ligne}
        </Text>
      ))}
    </View>
  );
}
