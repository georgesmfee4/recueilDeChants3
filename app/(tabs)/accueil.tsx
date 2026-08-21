/**
 * Écran 02 · Accueil — une « une » de journal, pas un tableau de bord.
 *
 * COMPOSITION : quatre registres visuels DIFFÉRENTS, et non quatre bandes
 * séparées par des filets. C'est ce qui distingue une une de journal d'une
 * suite de paragraphes — l'œil doit reconnaître chaque bloc à sa forme, avant
 * même de lire.
 *
 *   1. LE BANDEAU-TITRE  — grand serif. Le nom du recueil, comme une manchette.
 *   2. LE SIGNET         — un mince ruban à filet or. Discret : reprendre sa
 *                          lecture est un service, pas l'événement du jour.
 *   3. LA UNE            — un bloc PLEINE LARGEUR, qui déborde des marges,
 *                          sur une teinte de papier légèrement plus chaude et
 *                          souligné d'un filet or. Il attire l'œil par sa
 *                          largeur et sa matière, jamais par un aplat de
 *                          couleur : on lit un recueil, pas une affiche.
 *   4. L'INDEX           — trois colonnes chiffrées, séparées par des filets.
 *                          Un pied de page dense qui referme la composition.
 *
 * Aucune ombre, aucun arrondi, aucun dégradé : les blocs se distinguent par
 * leur forme et leur couleur, jamais par du relief.
 */
import { useState, type ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IconeReglages, IconeSuivant } from '@/components/icones';
import { useReservePilule } from '@/components/espacePilule';
import { useTheme } from '@/design/ThemeProvider';
import { type } from '@/design/type';
import { clair, mise, polices } from '@/design/tokens';
import { apercuDeuxLignes, cantique, cantiques, chantDuJour, choeurs } from '@/data/recueil';
import { MotifPortee } from '@/marque/MotifPortee';
import { useBibliotheque } from '@/store/bibliotheque';

export default function EcranAccueil() {
  const { c } = useTheme();
  const insets = useSafeAreaInsets();
  const reserveBas = useReservePilule();
  const favoris = useBibliotheque(s => s.favoris);
  const dernierChant = useBibliotheque(s => s.dernierChant);

  // Le chant du jour est calculé UNE fois à l'arrivée sur l'écran : il ne doit
  // pas changer parce qu'un autre état a provoqué un nouveau rendu.
  const [chantJour] = useState(() => chantDuJour());
  const reprise = dernierChant ? cantique(dernierChant.n) : undefined;

  // Dimensions réelles du bloc de une, mesurées à l'affichage. Le motif de
  // portée en a besoin : dessiner ses notes dans un carré étiré les
  // déformerait en ovales.
  const [taillUne, setTailleUne] = useState({ largeur: 0, hauteur: 0 });

  const ouvrir = (n: number) => router.push(`/chant/${n}`);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: c.paper }}
      contentContainerStyle={{
        paddingTop: insets.top,
        paddingHorizontal: mise.margeEcran,
        paddingBottom: reserveBas,
      }}
      showsVerticalScrollIndicator={false}>
      {/* Un seul bouton d'outils. Les favoris ne sont pas repris ici : ils ont
          déjà leur onglet dans la pilule. « Une information, un seul endroit. » */}
      <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 6 }}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Réglages"
          onPress={() => router.push('/reglages')}
          hitSlop={10}
          style={{ width: 36, height: 36, alignItems: 'flex-end', justifyContent: 'center' }}>
          {({ pressed }) => <IconeReglages size={22} color={pressed ? c.pri : c.ink} />}
        </Pressable>
      </View>

      {/* ─── 1 · Le bandeau-titre ─────────────────────────────────────────── */}
      <View style={{ marginTop: 22 }}>
        <Text style={[type.une, { color: c.ink }]}>Recueil</Text>
        <Text style={[type.une, { color: c.ink }]}>de Chants</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 11, marginTop: 16 }}>
          <View style={{ width: 26, height: 1, backgroundColor: clair.or }} />
          <Text
            style={{
              fontFamily: polices.sans.semibold,
              fontSize: 10,
              letterSpacing: 2.6,
              color: c.pri,
            }}>
            TROISIÈME ÉDITION
          </Text>
        </View>
      </View>

      {/* ─── 2 · Le signet ────────────────────────────────────────────────── */}
      {reprise && dernierChant ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Reprendre le chant ${reprise.n}, ${reprise.title}`}
          onPress={() => ouvrir(reprise.n)}
          style={({ pressed }) => ({
            flexDirection: 'row',
            gap: 14,
            marginTop: 30,
            paddingVertical: 12,
            paddingRight: 8,
            backgroundColor: pressed ? c.priSoft : 'transparent',
          })}>
          {/* Le ruban : un filet or vertical, comme le signet d'un livre. */}
          <View style={{ width: 2, backgroundColor: clair.or }} />

          <View style={{ flex: 1 }}>
            <Text style={[type.surtitre, { color: c.ink3 }]}>REPRENDRE</Text>

            <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 10, marginTop: 8 }}>
              <Text style={{ fontFamily: polices.serif.regular, fontSize: 21, color: c.pri }}>
                {reprise.n}
              </Text>
              <Text
                numberOfLines={1}
                style={{
                  flex: 1,
                  fontFamily: polices.serif.regular,
                  fontSize: 15.5,
                  letterSpacing: 0.3,
                  color: c.ink,
                }}>
                {reprise.title}
              </Text>
            </View>

            {/* Progression : un trait fin, presque un repère de page. */}
            <View style={{ height: 2, backgroundColor: c.ruleSoft, marginTop: 11 }}>
              <View
                style={{
                  height: 2,
                  width: `${Math.round(dernierChant.progression * 100)}%`,
                  backgroundColor: c.pri,
                }}
              />
            </View>
          </View>
        </Pressable>
      ) : null}

      {/* ─── 3 · La une ───────────────────────────────────────────────────── */}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Chant du jour : ${chantJour.n}, ${chantJour.title}`}
        onPress={() => ouvrir(chantJour.n)}
        onLayout={e => {
          const { width, height } = e.nativeEvent.layout;
          setTailleUne({ largeur: width, hauteur: height });
        }}
        style={({ pressed }) => ({
          // Marges négatives : le bloc déborde de la colonne de texte et va
          // toucher les deux bords de l'écran. C'est ce débordement qui le
          // fait lire comme une image de une, et non comme un paragraphe.
          marginTop: 34,
          marginHorizontal: -mise.margeEcran,
          paddingHorizontal: mise.margeEcran,
          paddingTop: 26,
          paddingBottom: 26,
          // Une teinte de papier, à peine plus chaude que le fond — et non un
          // aplat de couleur. Le bloc se distingue par son débordement, son
          // filet or et son motif ; il n'a pas besoin de crier.
          backgroundColor: pressed ? c.priSoft : c.surf2,
          borderTopWidth: 1,
          borderTopColor: clair.or,
          borderBottomWidth: 1,
          borderBottomColor: c.rule,
          // Le motif est dessiné plus grand que le bloc : on le recadre.
          overflow: 'hidden',
        })}>
        {/* Le motif de portée, sous le texte et insensible aux touchers. */}
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          <MotifPortee
            largeur={taillUne.largeur}
            hauteur={taillUne.hauteur}
            couleurLigne={c.ink}
            opaciteLigne={0.05}
            opaciteNote={0.14}
          />
        </View>

        <Text style={[type.surtitre, { color: c.ink3 }]}>LE CHANT DU JOUR</Text>

        <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 18, marginTop: 14 }}>
          {/* Le numéro est le nom du chant : c'est lui qu'on annonce à voix
              haute, donc lui qu'on compose en grand. */}
          <Text style={[type.numeroJour, { color: c.pri }]}>{chantJour.n}</Text>
          <Text
            style={{
              flex: 1,
              fontFamily: polices.serif.regular,
              fontSize: 20,
              lineHeight: 25.2,
              letterSpacing: 0.3,
              color: c.ink,
              paddingTop: 4,
            }}>
            {chantJour.title}
          </Text>
        </View>

        <View style={{ marginTop: 18 }}>
          {apercuDeuxLignes(chantJour).map((ligne, i) => (
            <Text
              key={i}
              numberOfLines={1}
              style={{
                fontFamily: polices.serif.italic,
                fontSize: 16,
                lineHeight: 25.9,
                color: c.ink2,
              }}>
              {ligne}
            </Text>
          ))}
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 9, marginTop: 20 }}>
          <Text
            style={{
              fontFamily: polices.sans.semibold,
              fontSize: 12,
              letterSpacing: 1.4,
              color: c.pri,
            }}>
            LIRE CE CHANT
          </Text>
          <IconeSuivant size={14} color={c.pri} />
        </View>
      </Pressable>

      {/* ─── 4 · L'index ──────────────────────────────────────────────────── */}
      <View
        style={{
          flexDirection: 'row',
          marginTop: 34,
          borderTopWidth: 1,
          borderTopColor: c.rule,
        }}>
        <ColonneIndex
          nombre={cantiques.length}
          libelle="CANTIQUES"
          onPress={() => router.navigate('/cantiques')}
          premiere
        />
        <ColonneIndex
          nombre={choeurs.length}
          libelle="CHŒURS"
          onPress={() => router.navigate('/choeurs')}
        />
        <ColonneIndex
          nombre={favoris.length}
          libelle="FAVORIS"
          onPress={() => router.navigate('/favoris')}
        />
      </View>
    </ScrollView>
  );
}

/**
 * Une colonne de l'index : un nombre en serif, son libellé en petites
 * capitales dessous.
 *
 * Les trois colonnes sont séparées par un filet vertical de 1 point — sauf la
 * première, sans quoi le filet doublerait le bord de l'écran. La hauteur
 * (76) place la cible tactile bien au-delà du minimum de 46.
 */
function ColonneIndex({
  nombre,
  libelle,
  onPress,
  premiere = false,
}: {
  nombre: number;
  libelle: string;
  onPress: () => void;
  premiere?: boolean;
}): ReactNode {
  const { c } = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${libelle}, ${nombre}`}
      onPress={onPress}
      style={({ pressed }) => ({
        flex: 1,
        height: 76,
        justifyContent: 'center',
        alignItems: 'center',
        borderLeftWidth: premiere ? 0 : 1,
        borderLeftColor: c.rule,
        backgroundColor: pressed ? c.priSoft : 'transparent',
      })}>
      <Text
        style={{
          fontFamily: polices.serif.regular,
          fontSize: 30,
          lineHeight: 32,
          letterSpacing: -0.8,
          color: c.pri,
        }}>
        {nombre}
      </Text>
      <Text
        style={{
          fontFamily: polices.sans.semibold,
          fontSize: 9,
          letterSpacing: 1.6,
          color: c.ink3,
          marginTop: 7,
        }}>
        {libelle}
      </Text>
    </Pressable>
  );
}
