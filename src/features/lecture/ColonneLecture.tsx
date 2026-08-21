/**
 * La colonne de lecture : le cœur de l'application.
 *
 * Une seule colonne, un seul défilement vertical, aucune pagination et aucun
 * geste horizontal. Marges 30 à gauche ET à droite : la symétrie est
 * obligatoire, c'est ce qui fait « page » plutôt qu'« écran ».
 *
 * On utilise un ScrollView, pas une liste virtualisée : le chant le plus long
 * du recueil (le n° 155) fait 99 lignes, c'est largement à la portée d'un
 * rendu direct — et cela garantit un défilement parfaitement continu.
 *
 * Deux choses sortent d'ici :
 *   - `defilement`, une valeur partagée avec le fil d'affichage, que l'en-tête
 *     utilise pour se colorer sans repasser par JavaScript ;
 *   - `onProgression`, appelé seulement à l'ARRÊT du doigt, pour mémoriser où
 *     on en était (bloc « Reprendre » de l'accueil). L'appeler à chaque image
 *     écrirait des centaines de fois sur le disque pour rien.
 */
import { forwardRef } from 'react';
import { Text, View, type NativeScrollEvent, type NativeSyntheticEvent } from 'react-native';
import Animated, { useAnimatedScrollHandler, type SharedValue } from 'react-native-reanimated';
import { useTheme } from '@/design/ThemeProvider';
import { type } from '@/design/type';
import { clair, mise } from '@/design/tokens';
import type { Cantique } from '@/data/types';
import { usePrefs } from '@/store/prefs';
import { BlocRefrain } from './BlocRefrain';
import { BlocStrophe } from './BlocStrophe';

type Proprietes = {
  chant: Cantique;
  /** Position de défilement, écrite ici et lue par l'en-tête. */
  defilement: SharedValue<number>;
  /** Appelé à l'arrêt du défilement, avec une valeur entre 0 et 1. */
  onProgression: (valeur: number) => void;
};

export const ColonneLecture = forwardRef<Animated.ScrollView, Proprietes>(function ColonneLecture(
  { chant, defilement, onProgression },
  ref,
) {
  const { c } = useTheme();
  const taille = usePrefs(s => s.taille);
  const interligne = usePrefs(s => s.interligne);
  const numerosStrophe = usePrefs(s => s.numerosStrophe);
  const refrainItalique = usePrefs(s => s.refrainItalique);

  // 72 chants du recueil n'ont aucune strophe numérotée : tous leurs blocs sont
  // de type 'r'. Ce ne sont pas des refrains, on ne les incline donc pas.
  const aDesStrophes = chant.parts.some(p => p.t === 'v');

  // Ce gestionnaire s'exécute sur le fil d'affichage, pas en JavaScript :
  // l'en-tête suit le doigt même si le fil JS est occupé.
  const suivreDefilement = useAnimatedScrollHandler(e => {
    defilement.value = e.contentOffset.y;
  });

  /** Convertit la position de défilement en fraction lue, entre 0 et 1. */
  const noterPosition = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent;
    const defilable = contentSize.height - layoutMeasurement.height;
    onProgression(defilable > 0 ? Math.min(1, contentOffset.y / defilable) : 0);
  };

  return (
    <Animated.ScrollView
      ref={ref}
      style={{ flex: 1 }}
      contentContainerStyle={{
        paddingHorizontal: mise.margeLecture,
        paddingBottom: 26,
      }}
      // Aucune barre de défilement : rien ne doit distraire de la page.
      showsVerticalScrollIndicator={false}
      scrollEventThrottle={16}
      onScroll={suivreDefilement}
      onMomentumScrollEnd={noterPosition}
      onScrollEndDrag={noterPosition}>
      {/* Bloc de titre : le numéro, puis le titre, puis un filet or. */}
      <Text style={[type.numeroChant, { color: c.pri }]}>{chant.n}</Text>
      <Text style={[type.titreChant, { color: c.ink, marginTop: 16 }]}>{chant.title}</Text>
      <View style={{ width: 48, height: 1, backgroundColor: clair.or, marginTop: 20 }} />

      <View style={{ paddingBottom: 6 }} />

      {chant.parts.map((part, i) =>
        part.t === 'v' ? (
          <BlocStrophe
            key={i}
            numero={part.n}
            lignes={part.l}
            taille={taille}
            interligne={interligne}
            afficherNumero={numerosStrophe}
          />
        ) : (
          <BlocRefrain
            key={i}
            lignes={part.l}
            taille={taille}
            interligne={interligne}
            italique={refrainItalique && aDesStrophes}
          />
        ),
      )}
    </Animated.ScrollView>
  );
});
