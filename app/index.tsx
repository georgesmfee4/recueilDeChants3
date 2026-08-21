/**
 * Écran 01 · Lancement — l'ouverture du livre.
 *
 * Fond violet plein, logo en couverture papier, filet or, mention d'édition,
 * puis la signature de l'auteur. Les quatre éléments arrivent en cascade :
 * le livre d'abord, puis ce qui l'entoure. Aucun rebond, jamais.
 *
 * On quitte l'écran en touchant n'importe où, ou automatiquement après 1,8 s.
 */
import { useEffect } from 'react';
import { Pressable, Text, View } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { COURBE, useAnimationsReduites } from '@/design/animations';
import { clair, mouvement, polices } from '@/design/tokens';
import { LogoLivre } from '@/marque/LogoLivre';

/** Durée d'affichage avant le passage automatique à l'accueil. */
const DUREE_TOTALE = 1800;

export default function EcranLancement() {
  const reduites = useAnimationsReduites();

  // Une valeur d'avancement par élément : 0 = pas encore là, 1 = en place.
  const livre = useSharedValue(0);
  const filet = useSharedValue(0);
  const surtitre = useSharedValue(0);
  const pied = useSharedValue(0);

  /** Passage à l'accueil. `replace` : on ne revient jamais sur le lancement. */
  const entrer = () => router.replace('/accueil');

  useEffect(() => {
    if (reduites) {
      // « Réduire les animations » : tout est déjà en place, on n'anime rien.
      livre.value = 1;
      filet.value = 1;
      surtitre.value = 1;
      pied.value = 1;
    } else {
      const { lancement } = mouvement;
      livre.value = withTiming(1, { duration: lancement.livre, easing: COURBE });
      filet.value = withDelay(
        lancement.filet[1],
        withTiming(1, { duration: lancement.filet[0], easing: COURBE }),
      );
      surtitre.value = withDelay(
        lancement.surtitre[1],
        withTiming(1, { duration: lancement.surtitre[0], easing: COURBE }),
      );
      pied.value = withDelay(
        lancement.pied[1],
        withTiming(1, { duration: lancement.pied[0], easing: COURBE }),
      );
    }

    const minuterie = setTimeout(entrer, DUREE_TOTALE);
    return () => clearTimeout(minuterie);
  }, [reduites, livre, filet, surtitre, pied]);

  const styleLivre = useAnimatedStyle(() => ({
    opacity: livre.value,
    transform: [
      { translateY: (1 - livre.value) * 10 },
      { rotate: `${(1 - livre.value) * -1.5}deg` },
    ],
  }));
  // Le filet se déploie depuis son centre (scaleX 0 → 1), il n'apparaît pas en fondu.
  const styleFilet = useAnimatedStyle(() => ({ transform: [{ scaleX: filet.value }] }));
  const styleSurtitre = useAnimatedStyle(() => ({ opacity: surtitre.value }));
  const stylePied = useAnimatedStyle(() => ({ opacity: pied.value }));

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Ouvrir le recueil"
      onPress={entrer}
      style={{ flex: 1, backgroundColor: clair.pri, alignItems: 'center', justifyContent: 'center' }}>
      <StatusBar style="light" />

      <Animated.View style={styleLivre}>
        <LogoLivre size={132} variante="lancement" />
      </Animated.View>

      <Animated.View
        style={[{ width: 64, height: 1, backgroundColor: clair.or, marginTop: 34 }, styleFilet]}
      />

      <Animated.Text
        style={[
          {
            marginTop: 22,
            fontFamily: polices.sans.semibold,
            fontSize: 11,
            letterSpacing: 4.4,
            color: 'rgba(255,255,255,0.86)',
          },
          styleSurtitre,
        ]}>
        TROISIÈME ÉDITION
      </Animated.Text>

      <Animated.View
        style={[
          { position: 'absolute', bottom: 44, alignItems: 'center', gap: 8 },
          stylePied,
        ]}>
        <Text
          style={{ fontFamily: polices.serif.regular, fontSize: 15, color: 'rgba(255,255,255,0.7)' }}>
          2025
        </Text>
        <Text
          style={{
            fontFamily: polices.sans.regular,
            fontSize: 10.5,
            letterSpacing: 1.6,
            color: 'rgba(255,255,255,0.42)',
          }}>
          TCHINDEBBE CHARLES
        </Text>
      </Animated.View>

      {/* Espace réservé sous le surtitre pour équilibrer le centrage optique. */}
      <View style={{ height: 40 }} />
    </Pressable>
  );
}
