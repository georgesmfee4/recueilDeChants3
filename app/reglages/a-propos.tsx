/**
 * Écran 11 · À propos — le colophon du recueil.
 *
 * C'est la page qui dit d'où vient ce livre : son auteur, son édition, et
 * comment le joindre. Trois sections, rien de plus.
 *
 * Pas de pilule de navigation ici : c'est un écran de détail, on en sort par
 * le bouton retour. Comme en lecture, la page passe avant l'application.
 */
import { Linking, Pressable, ScrollView, Text, View } from 'react-native';
import { router } from 'expo-router';
import Constants from 'expo-constants';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Surtitre } from '@/components/Surtitre';
import { IconeRetour } from '@/components/icones';
import { LogoLivre } from '@/marque/LogoLivre';
import { useTheme } from '@/design/ThemeProvider';
import { clair, mise, polices } from '@/design/tokens';
import { cantiques, choeurs, meta } from '@/data/recueil';

/** Les deux numéros de la production, dans l'ordre communiqué par l'auteur. */
const TELEPHONES = ['699-90-14-39', '676-63-14-31'] as const;

const COURRIEL = 'charlestchindebbe@gmail.com';

export default function EcranAPropos() {
  const { c, mode } = useTheme();
  const insets = useSafeAreaInsets();

  // La version vient d'app.json plutôt que d'être recopiée ici : une seule
  // source de vérité, et l'écran ne peut pas mentir après une mise à jour.
  const version = Constants.expoConfig?.version ?? '3.0.0';

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: c.paper }}
      contentContainerStyle={{
        paddingTop: insets.top,
        paddingHorizontal: mise.margeEcran,
        paddingBottom: insets.bottom + 40,
      }}
      showsVerticalScrollIndicator={false}>
      {/* 1 · En-tête */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 8 }}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Retour"
          onPress={() => router.back()}
          hitSlop={10}
          style={{ width: 30, height: 30, alignItems: 'center', justifyContent: 'center' }}>
          <IconeRetour size={19} color={c.ink2} />
        </Pressable>
        <Surtitre>À PROPOS</Surtitre>
      </View>

      {/* 2 · Bloc de marque */}
      <View
        style={{
          alignItems: 'center',
          paddingVertical: 30,
          borderBottomWidth: 1,
          borderBottomColor: c.rule,
        }}>
        {/* En mode nuit, la couverture du logo s'éclaircit pour rester lisible. */}
        <LogoLivre size={66} variante={mode === 'sombre' ? 'sombre' : 'marque'} />

        <Text
          style={{
            fontFamily: polices.serif.regular,
            fontSize: 26,
            letterSpacing: -0.6,
            color: c.ink,
            marginTop: 18,
          }}>
          {meta.titre}
        </Text>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 10 }}>
          <View style={{ width: 18, height: 1, backgroundColor: clair.or }} />
          <Text
            style={{
              fontFamily: polices.sans.semibold,
              fontSize: 10,
              letterSpacing: 2.4,
              color: c.pri,
            }}>
            TROISIÈME ÉDITION
          </Text>
          <View style={{ width: 18, height: 1, backgroundColor: clair.or }} />
        </View>
      </View>

      {/* 3 · Les trois sections */}
      <Section titre="LE RECUEIL">
        <Ligne libelle="Auteur" valeur={meta.auteur} />
        <Ligne libelle="Édition" valeur={`Troisième — ${meta.annee}`} />
        <Ligne libelle="Contenu" valeur={`${cantiques.length} cantiques · ${choeurs.length} chœurs`} />
        <Ligne libelle="Langue" valeur="Français" derniere />
      </Section>

      <Section titre="L'APPLICATION">
        <Ligne libelle="Version" valeur={version} />
        <Ligne libelle="Fonctionnement" valeur="Hors connexion" />
        <Ligne libelle="Taille" valeur="4,1 Mo" derniere />
      </Section>

      <Section titre="CONTACT">
        {/* Les valeurs qui DÉCLENCHENT une action sont en violet : c'est la
            règle déjà posée pour le courriel, on l'étend aux numéros. Un
            numéro qu'on ne peut pas appeler depuis un téléphone n'aurait
            aucun sens. */}
        <LigneActions
          libelle="Production"
          actions={TELEPHONES.map(numero => ({
            texte: numero,
            // `tel:` sans les tirets : c'est ce que le composeur attend.
            lien: `tel:${numero.replace(/-/g, '')}`,
            description: `Appeler le ${numero}`,
          }))}
        />
        <LigneActions
          libelle="E-mail"
          derniere
          actions={[
            {
              texte: COURRIEL,
              lien: `mailto:${COURRIEL}`,
              description: 'Écrire à l’auteur',
            },
          ]}
        />
      </Section>

      {/* 4 · Mention légale */}
      <Text
        style={{
          fontFamily: polices.sans.regular,
          fontSize: 10,
          letterSpacing: 1.2,
          color: c.ink3,
          textAlign: 'center',
          marginTop: 44,
        }}>
        © TOUS DROITS RÉSERVÉS
      </Text>
    </ScrollView>
  );
}

/**
 * Une section : son surtitre souligné, puis ses lignes.
 *
 * L'espace au-dessus (38) est nettement plus grand que celui qui sépare deux
 * lignes à l'intérieur (14). C'est ce RAPPORT qui fait lire trois blocs
 * distincts plutôt qu'une longue liste : sans lui, l'œil ne sait plus où
 * s'arrête « LE RECUEIL » et où commence « L'APPLICATION ».
 */
function Section({ titre, children }: { titre: string; children: React.ReactNode }) {
  const { c } = useTheme();
  return (
    <View style={{ marginTop: 38 }}>
      <View style={{ paddingBottom: 11, borderBottomWidth: 1, borderBottomColor: c.rule }}>
        <Text
          style={{
            fontFamily: polices.sans.semibold,
            fontSize: 9.5,
            letterSpacing: 1.8,
            color: c.ink3,
          }}>
          {titre}
        </Text>
      </View>
      {children}
    </View>
  );
}

/** Une ligne simple : libellé à gauche, valeur à droite. */
function Ligne({
  libelle,
  valeur,
  derniere = false,
}: {
  libelle: string;
  valeur: string;
  derniere?: boolean;
}) {
  const { c } = useTheme();
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: 16,
        paddingVertical: 14,
        borderBottomWidth: derniere ? 0 : 1,
        borderBottomColor: c.ruleSoft,
      }}>
      <Text style={{ fontFamily: polices.sans.regular, fontSize: 12.5, color: c.ink2 }}>
        {libelle}
      </Text>
      <Text
        style={{
          flex: 1,
          textAlign: 'right',
          fontFamily: polices.sans.medium,
          fontSize: 13.5,
          color: c.ink,
        }}>
        {valeur}
      </Text>
    </View>
  );
}

/**
 * Une ligne dont la ou les valeurs sont touchables (appeler, écrire).
 *
 * Chaque valeur est son propre bouton : deux numéros sur une même ligne
 * seraient impossibles à viser. Le rembourrage vertical et le `hitSlop`
 * amènent chaque cible à environ 46 points de haut, le minimum du produit.
 */
function LigneActions({
  libelle,
  actions,
  derniere = false,
}: {
  libelle: string;
  actions: { texte: string; lien: string; description: string }[];
  derniere?: boolean;
}) {
  const { c } = useTheme();
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: 16,
        paddingVertical: 14,
        borderBottomWidth: derniere ? 0 : 1,
        borderBottomColor: c.ruleSoft,
      }}>
      <Text
        style={{
          fontFamily: polices.sans.regular,
          fontSize: 12.5,
          color: c.ink2,
          paddingTop: 5,
        }}>
        {libelle}
      </Text>

      <View style={{ flex: 1, alignItems: 'flex-end' }}>
        {actions.map(action => (
          <Pressable
            key={action.lien}
            accessibilityRole="link"
            accessibilityLabel={action.description}
            onPress={() => Linking.openURL(action.lien)}
            hitSlop={10}
            style={{ paddingVertical: 5 }}>
            <Text
              style={{
                textAlign: 'right',
                fontFamily: polices.sans.medium,
                fontSize: 13.5,
                color: c.pri,
              }}>
              {action.texte}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
