/**
 * Écran 03 · Cantiques — l'index des 302 chants.
 *
 * Trois particularités de mise en page à ne pas « corriger » :
 *
 *   1. Les marges sont ASYMÉTRIQUES : 14 à gauche, 42 à droite. Les numéros
 *      débordent volontairement dans la marge gauche, comme dans un vrai
 *      recueil ; la marge droite dégagée accueille le rail.
 *
 *   2. Les titres sont VERBATIM. Ils sont déjà en capitales dans les données :
 *      aucun `textTransform`, sinon on casse les « Ô », « É » et les
 *      apostrophes typographiques.
 *
 *   3. La sous-ligne grise n'est jamais le titre répété (voir `sousLigne()`
 *      dans src/data/recueil.ts).
 *
 * Le rail de droite s'adapte au tri : les dizaines (1 · 50 · 100 …) quand on
 * classe par numéro, les lettres (A · B · C …) quand on classe de A à Z.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { router } from 'expo-router';
import { FlashList, type FlashListRef } from '@shopify/flash-list';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BoutonAllerA } from '@/components/BoutonAllerA';
import { EnTeteEcran } from '@/components/EnTeteEcran';
import { FeuilleAllerA } from '@/components/FeuilleAllerA';
import { LigneIndex } from '@/components/LigneIndex';
import { SqueletteListe } from '@/components/Squelette';
import { useReservePilule } from '@/components/espacePilule';
import { useTheme } from '@/design/ThemeProvider';
import { usePret } from '@/design/usePret';
import { mise, polices } from '@/design/tokens';
import {
  cantiques,
  cantiquesAlpha,
  lettresCantiques,
  prechaufferAlpha,
  sousLigne,
} from '@/data/recueil';
import type { Cantique } from '@/data/types';
import { useBibliotheque } from '@/store/bibliotheque';

/** Les deux façons de classer l'index. */
type Tri = 'numero' | 'alpha';

/** Les repères du rail quand on classe par numéro. */
const DIZAINES = [1, 50, 100, 150, 200, 250, 300] as const;

export default function EcranCantiques() {
  const { c } = useTheme();
  const insets = useSafeAreaInsets();
  const reserveBas = useReservePilule();
  const favoris = useBibliotheque(s => s.favoris);

  // Tant que la transition de navigation n'est pas finie, on affiche une
  // esquisse : l'écran réagit instantanément, même sur un téléphone lent.
  const pret = usePret();

  const [tri, setTri] = useState<Tri>('numero');
  const [feuilleOuverte, setFeuilleOuverte] = useState(false);
  /** Repère actif dans le rail : un numéro de dizaine, ou une lettre. */
  const [repereActif, setRepereActif] = useState<string>('1');

  const liste = useRef<FlashListRef<Cantique>>(null);

  // Le tri A→Z et le rail des lettres sont préparés dès que la liste est posée
  // et que l'utilisateur la parcourt. Quand il touchera « A → Z », le travail
  // sera déjà fait : la bascule est instantanée au lieu de bloquer le toucher.
  useEffect(() => {
    if (pret) prechaufferAlpha();
  }, [pret]);

  // `cantiquesAlpha()` trie à la première demande puis garde son résultat :
  // on ne refait donc jamais le tri, mais on ne le paie pas non plus au
  // démarrage de l'application si l'utilisateur reste sur « Par numéro ».
  const donnees = tri === 'numero' ? cantiques : cantiquesAlpha();

  // On transforme la liste des favoris en Set : `has()` est instantané, alors
  // qu'un `includes()` sur un tableau reparcourrait tout, pour chacune des
  // 302 lignes, à chaque rendu.
  const favorisSet = useMemo(() => new Set(favoris), [favoris]);

  const ouvrir = useCallback((n: number) => router.push(`/chant/${n}`), []);

  /** Le contenu du rail dépend du tri en cours. */
  const repere =
    tri === 'numero'
      ? DIZAINES.map(d => ({
          etiquette: String(d),
          // Position du chant dans la liste : ici l'ordre est celui des
          // numéros, donc le chant n° 50 est à l'index 49.
          index: d - 1,
        }))
      : lettresCantiques().map(l => ({ etiquette: l.lettre, index: l.index }));

  const sauterAu = (etiquette: string, index: number) => {
    setRepereActif(etiquette);
    liste.current?.scrollToIndex({ index, animated: true });
  };

  /** Change de tri et remet le rail sur son premier repère. */
  const changerTri = (nouveau: Tri) => {
    setTri(nouveau);
    setRepereActif(nouveau === 'numero' ? '1' : 'A');
  };

  return (
    <View style={{ flex: 1, backgroundColor: c.paper, paddingTop: insets.top }}>
      {/* 1 · En-tête */}
      <View style={{ paddingHorizontal: mise.margeEcran }}>
        <EnTeteEcran
          titre="Cantiques"
          sousTitre={`${cantiques.length} chants · édition 2025`}
          action={<BoutonAllerA onPress={() => setFeuilleOuverte(true)} />}
        />

        {/* 2 · Les deux onglets de tri */}
        <View
          style={{
            flexDirection: 'row',
            gap: 22,
            marginTop: 20,
            borderBottomWidth: 1,
            borderBottomColor: c.rule,
          }}>
          <OngletTri
            libelle="Par numéro"
            actif={tri === 'numero'}
            onPress={() => changerTri('numero')}
          />
          <OngletTri libelle="A → Z" actif={tri === 'alpha'} onPress={() => changerTri('alpha')} />
        </View>
      </View>

      {/* 3 · Les 302 lignes — ou leur esquisse pendant la transition */}
      {pret ? (
        <FlashList
          ref={liste}
          data={donnees}
          keyExtractor={item => String(item.n)}
          contentContainerStyle={{
            paddingLeft: mise.margeListeGauche,
            paddingRight: mise.margeListeDroite,
            paddingBottom: reserveBas,
          }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <LigneIndex
              n={item.n}
              titre={item.title}
              sousLigne={sousLigne(item)}
              favori={favorisSet.has(item.n)}
              onPress={() => ouvrir(item.n)}
            />
          )}
          // Le rail suit le défilement : on regarde quel chant est en haut de
          // l'écran et on allume le repère qui le précède.
          onViewableItemsChanged={({ viewableItems }) => {
            const premier = viewableItems[0];
            if (!premier || premier.index === null) return;
            const atteint = [...repere].reverse().find(r => premier.index! >= r.index);
            if (atteint) setRepereActif(atteint.etiquette);
          }}
        />
      ) : (
        <View
          style={{
            paddingLeft: mise.margeListeGauche,
            paddingRight: mise.margeListeDroite,
          }}>
          <SqueletteListe lignes={9} />
        </View>
      )}

      {/* 4 · Le rail, posé par-dessus la liste dans la marge droite */}
      {pret ? (
        <View
          pointerEvents="box-none"
          style={{ position: 'absolute', right: 13, top: insets.top + 176, gap: 10 }}>
          {repere.map(r => (
            <Pressable
              key={r.etiquette}
              accessibilityRole="button"
              accessibilityLabel={
                tri === 'numero' ? `Aller au chant ${r.etiquette}` : `Aller à la lettre ${r.etiquette}`
              }
              onPress={() => sauterAu(r.etiquette, r.index)}
              hitSlop={10}>
              <Text
                style={{
                  fontFamily: polices.serif.regular,
                  fontSize: 11,
                  textAlign: 'right',
                  color: repereActif === r.etiquette ? c.pri : c.ink3,
                }}>
                {r.etiquette}
              </Text>
            </Pressable>
          ))}
        </View>
      ) : null}

      <FeuilleAllerA
        visible={feuilleOuverte}
        onFermer={() => setFeuilleOuverte(false)}
        onOuvrir={ouvrir}
      />
    </View>
  );
}

/**
 * Un onglet de tri.
 *
 * Le soulignement de l'onglet actif fait 2 points et chevauche le filet de
 * l'en-tête (`marginBottom: -1`) : sans ce décalage, on verrait deux traits
 * empilés au lieu d'un seul trait épaissi.
 */
function OngletTri({
  libelle,
  actif,
  onPress,
}: {
  libelle: string;
  actif: boolean;
  onPress: () => void;
}) {
  const { c } = useTheme();
  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityState={{ selected: actif }}
      onPress={onPress}
      style={{
        paddingBottom: 10,
        marginBottom: -1,
        borderBottomWidth: 2,
        borderBottomColor: actif ? c.pri : 'transparent',
      }}>
      <Text
        style={{
          fontFamily: polices.sans.semibold,
          fontSize: 12.5,
          letterSpacing: 0.3,
          color: actif ? c.pri : c.ink3,
        }}>
        {libelle}
      </Text>
    </Pressable>
  );
}
