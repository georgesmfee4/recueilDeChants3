/**
 * Écran 10 · Réglages.
 *
 * Principe directeur : LES RÉGLAGES SE VOIENT. Un bloc d'aperçu en haut de
 * l'écran rend de vraies paroles du recueil avec la taille et l'interligne
 * courants. On ne devine pas ce que fera « Grand » : on le voit avant de
 * quitter l'écran.
 *
 * Chaque réglage s'applique immédiatement — à l'aperçu ET à tous les écrans de
 * lecture. Il n'y a pas de bouton « Enregistrer » : le magasin `usePrefs`
 * écrit sur le disque à chaque changement.
 */
import { Pressable, ScrollView, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Bascule } from '@/components/Bascule';
import { EnTeteEcran } from '@/components/EnTeteEcran';
import { Segments } from '@/components/Segments';
import { Surtitre } from '@/components/Surtitre';
import { IconeRetour, IconeSuivant } from '@/components/icones';
import { useTheme } from '@/design/ThemeProvider';
import { clair, mise, polices } from '@/design/tokens';
import { styleParoles, tailleDuCran, type CranTaille, type Interligne } from '@/design/type';
import { cantique, cantiques, choeurs } from '@/data/recueil';
import { usePrefs, type ChoixTheme } from '@/store/prefs';
import { useMiseAJour } from '@/updates/useMiseAJour';

/** Les noms des cinq crans de taille, dans l'ordre. */
const NOMS_TAILLE = ['Compact', 'Confortable', 'Standard', 'Grand', 'Très grand'] as const;

const THEMES: readonly ChoixTheme[] = ['Clair', 'Sombre', 'Système'];
const INTERLIGNES: readonly Interligne[] = ['Serré', 'Normal', 'Aéré'];

/** Le chant dont on emprunte trois vers pour l'aperçu. */
const CHANT_APERCU = 1;

export default function EcranReglages() {
  const { c } = useTheme();
  const insets = useSafeAreaInsets();
  // Les Réglages n'affichent PAS la pilule de navigation : c'est un écran de
  // détail, on en sort par le retour du système ou par « À propos ». Il n'y a
  // donc rien à réserver en bas, hormis la zone des boutons système.
  const reserveBas = insets.bottom + 40;

  const taille = usePrefs(s => s.taille);
  const interligne = usePrefs(s => s.interligne);
  const theme = usePrefs(s => s.theme);
  const numerosStrophe = usePrefs(s => s.numerosStrophe);
  const refrainItalique = usePrefs(s => s.refrainItalique);
  const ecranAllume = usePrefs(s => s.ecranAllume);

  const setTaille = usePrefs(s => s.setTaille);
  const decalerTaille = usePrefs(s => s.decalerTaille);
  const setInterligne = usePrefs(s => s.setInterligne);
  const setTheme = usePrefs(s => s.setTheme);
  const basculerNumerosStrophe = usePrefs(s => s.basculerNumerosStrophe);
  const basculerRefrainItalique = usePrefs(s => s.basculerRefrainItalique);
  const basculerEcranAllume = usePrefs(s => s.basculerEcranAllume);

  const miseAJour = useMiseAJour();

  // Trois vraies lignes du recueil pour l'aperçu — jamais du faux texte.
  const apercu = cantique(CHANT_APERCU)?.parts[0]?.l.slice(0, 3) ?? [];

  return (
    <View style={{ flex: 1, backgroundColor: c.paper }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingTop: insets.top,
          paddingHorizontal: mise.margeEcran,
          paddingBottom: reserveBas,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* 1 · Bouton retour.
          Sans la pilule de navigation, c'est la seule sortie VISIBLE de
          l'écran. Compter sur le bouton retour du système serait une impasse
          sur iOS, qui n'en a pas. */}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Retour"
          onPress={() => router.back()}
          hitSlop={10}
          style={{ width: 30, height: 30, alignItems: 'flex-start', justifyContent: 'center' }}
        >
          <IconeRetour size={19} color={c.ink2} />
        </Pressable>

        {/* 2 · En-tête, avec le lien « À propos » en bas à droite */}
        <EnTeteEcran
          titre="Réglages"
          action={
            <Pressable
              accessibilityRole="link"
              accessibilityLabel="À propos"
              onPress={() => router.push('/reglages/a-propos')}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 6 }}
            >
              <Text style={{ fontFamily: polices.sans.semibold, fontSize: 12.5, color: c.pri }}>
                À propos
              </Text>
              <IconeSuivant size={14} color={c.pri} />
            </Pressable>
          }
        />

        {/* 3 · L'aperçu — filet OR en haut, c'est le bloc du recueil */}
        <View
          style={{
            marginTop: 16,
            marginBottom: 28,
            paddingVertical: 15,
            paddingHorizontal: 18,
            backgroundColor: c.surf2,
            borderTopWidth: 1,
            borderTopColor: clair.or,
          }}
        >
          <Surtitre>APERÇU</Surtitre>
          <View style={{ marginTop: 8 }}>
            {apercu.map((ligne, i) => (
              <Text
                key={i}
                allowFontScaling={false}
                style={[styleParoles(taille, interligne), { color: c.ink }]}
              >
                {ligne}
              </Text>
            ))}
          </View>
        </View>

        {/* 4 · Taille du texte */}
        <View style={{ paddingBottom: 14, borderBottomWidth: 1, borderBottomColor: c.ruleSoft }}>
          <LigneTitre
            libelle="Taille du texte"
            valeur={`${NOMS_TAILLE[taille]} · ${String(tailleDuCran(taille)).replace('.', ',')} px`}
          />

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, marginTop: 14 }}>
            <BoutonTaille
              lettre={15}
              onPress={() => decalerTaille(-1)}
              libelle="Réduire le texte"
            />

            {/* Les cinq crans : des segments pleins jusqu'au cran actif. */}
            <View style={{ flex: 1, flexDirection: 'row', gap: 3 }}>
              {NOMS_TAILLE.map((_, i) => (
                <Pressable
                  key={i}
                  accessibilityRole="button"
                  accessibilityLabel={`Taille ${NOMS_TAILLE[i]}`}
                  onPress={() => setTaille(i as CranTaille)}
                  hitSlop={{ top: 16, bottom: 16 }}
                  style={{ flex: 1 }}
                >
                  <View style={{ height: 2, backgroundColor: i <= taille ? c.pri : c.rule }} />
                </Pressable>
              ))}
            </View>

            <BoutonTaille
              lettre={23}
              onPress={() => decalerTaille(1)}
              libelle="Agrandir le texte"
            />
          </View>
        </View>

        {/* 5 · Thème */}
        <View style={{ paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: c.ruleSoft }}>
          <LigneTitre libelle="Thème" />
          <View style={{ marginTop: 12 }}>
            <Segments options={THEMES} valeur={theme} onChange={setTheme} />
          </View>
        </View>

        {/* 6 · Interligne */}
        <View style={{ paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: c.ruleSoft }}>
          <LigneTitre libelle="Interligne" />
          <View style={{ marginTop: 12 }}>
            <Segments options={INTERLIGNES} valeur={interligne} onChange={setInterligne} />
          </View>
        </View>

        {/* 7 · Les trois options */}
        <LigneBascule
          libelle="Numéros de strophe"
          aide="Dans la marge, en chiffres serif"
          active={numerosStrophe}
          onChange={basculerNumerosStrophe}
        />
        <LigneBascule
          libelle="Refrain en italique"
          aide="Entre deux filets or"
          active={refrainItalique}
          onChange={basculerRefrainItalique}
        />
        <LigneBascule
          libelle="Garder l'écran allumé"
          aide="Pendant toute la lecture"
          active={ecranAllume}
          onChange={basculerEcranAllume}
        />

        {/* 8 · Hors connexion — dernière ligne, sans filet bas */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: 14,
          }}
        >
          <View style={{ flex: 1 }}>
            <Text style={{ fontFamily: polices.sans.medium, fontSize: 14, color: c.ink }}>
              Disponible hors connexion
            </Text>
            <Text
              style={{
                fontFamily: polices.sans.regular,
                fontSize: 11.5,
                color: c.ink3,
                marginTop: 3,
              }}
            >
              {cantiques.length} cantiques · {choeurs.length} chœurs · 4,1 Mo
            </Text>
          </View>
          <Text style={{ fontFamily: polices.serif.regular, fontSize: 15, color: c.pri }}>
            Tout
          </Text>
        </View>

        {/* 9 · Mise à jour — n'apparaît QUE si une update est déjà téléchargée.
          Jamais de modale, jamais de rechargement pendant une lecture. */}
        {miseAJour.prete ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Installer la mise à jour"
            onPress={miseAJour.appliquer}
            style={({ pressed }) => ({
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingVertical: 14,
              marginTop: 14,
              borderTopWidth: 1,
              borderTopColor: c.ruleSoft,
              backgroundColor: pressed ? c.priSoft : 'transparent',
            })}
          >
            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: polices.sans.medium, fontSize: 14, color: c.ink }}>
                Mise à jour disponible
              </Text>
              <Text
                style={{
                  fontFamily: polices.sans.regular,
                  fontSize: 11.5,
                  color: c.ink3,
                  marginTop: 3,
                }}
              >
                Le recueil a été corrigé ou complété
              </Text>
            </View>
            <Text style={{ fontFamily: polices.serif.regular, fontSize: 15, color: c.pri }}>
              Installer
            </Text>
          </Pressable>
        ) : null}
      </ScrollView>
    </View>
  );
}

/** Le libellé d'un réglage, avec sa valeur courante en gris à droite. */
function LigneTitre({ libelle, valeur }: { libelle: string; valeur?: string }) {
  const { c } = useTheme();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
      <Text style={{ fontFamily: polices.sans.medium, fontSize: 14, color: c.ink }}>{libelle}</Text>
      {valeur ? (
        <Text style={{ fontFamily: polices.sans.regular, fontSize: 11.5, color: c.ink3 }}>
          {valeur}
        </Text>
      ) : null}
    </View>
  );
}

/**
 * Les deux boutons « A » qui encadrent les crans de taille.
 * Le petit A réduit, le grand A augmente : la taille de la lettre annonce ce
 * que fait le bouton, aucun libellé n'est nécessaire.
 */
function BoutonTaille({
  lettre,
  onPress,
  libelle,
}: {
  lettre: number;
  onPress: () => void;
  libelle: string;
}) {
  const { c } = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={libelle}
      onPress={onPress}
      hitSlop={6}
      style={({ pressed }) => ({
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: c.rule,
        backgroundColor: pressed ? c.priSoft : 'transparent',
      })}
    >
      <Text style={{ fontFamily: polices.serif.regular, fontSize: lettre, color: c.ink }}>A</Text>
    </Pressable>
  );
}

/** Une ligne d'option : libellé, phrase d'aide, et l'interrupteur à droite. */
function LigneBascule({
  libelle,
  aide,
  active,
  onChange,
}: {
  libelle: string;
  aide: string;
  active: boolean;
  onChange: () => void;
}) {
  const { c } = useTheme();
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        paddingVertical: 13,
        borderBottomWidth: 1,
        borderBottomColor: c.ruleSoft,
      }}
    >
      <View style={{ flex: 1 }}>
        <Text style={{ fontFamily: polices.sans.medium, fontSize: 14, color: c.ink }}>
          {libelle}
        </Text>
        <Text
          style={{ fontFamily: polices.sans.regular, fontSize: 11.5, color: c.ink3, marginTop: 3 }}
        >
          {aide}
        </Text>
      </View>
      <Bascule active={active} onChange={onChange} libelle={libelle} />
    </View>
  );
}
