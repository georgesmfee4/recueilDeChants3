/**
 * Écrans 04 · Lecture et 05 · Lecture · nuit.
 *
 * Ce sont le MÊME écran : le mode nuit n'est pas une route séparée, c'est ce
 * fichier rendu avec le jeu de jetons sombre. C'est tout l'intérêt d'avoir
 * centralisé les couleurs dans le ThemeProvider.
 *
 * Structure verticale, de haut en bas :
 *   en-tête fixe (qui se colore au défilement) → colonne défilante → capsule
 *
 * Il n'y a volontairement RIEN d'autre : pas de pilule de navigation, pas de
 * pied de page, pas de compteur de strophes. En lecture, la page passe avant
 * l'application. Les seuls boutons permanents sont ceux qui servent pendant
 * un culte : chant précédent, aller à un numéro, chant suivant.
 */
import { useEffect, useRef, useState } from 'react';
import { Share, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useKeepAwake } from 'expo-keep-awake';
import Animated, { useSharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CapsuleLecture } from '@/components/CapsuleLecture';
import { FeuilleAllerA } from '@/components/FeuilleAllerA';
import { FeuillePlus } from '@/components/FeuillePlus';
import { ColonneLecture } from '@/features/lecture/ColonneLecture';
import { EnteteLecture } from '@/features/lecture/EnteteLecture';
import { useTheme } from '@/design/ThemeProvider';
import { type } from '@/design/type';
import { mise } from '@/design/tokens';
import { DERNIER, PREMIER, cantique } from '@/data/recueil';
import { useBibliotheque } from '@/store/bibliotheque';
import { usePrefs } from '@/store/prefs';

export default function EcranLecture() {
  const { c } = useTheme();
  const insets = useSafeAreaInsets();

  // Le numéro vient de l'URL : /chant/133 → n === '133'.
  const { n } = useLocalSearchParams<{ n: string }>();
  const numero = Number(n);
  const chant = cantique(numero);

  const favoris = useBibliotheque(s => s.favoris);
  const basculerFavori = useBibliotheque(s => s.basculerFavori);
  const noterLecture = useBibliotheque(s => s.noterLecture);
  const ecranAllume = usePrefs(s => s.ecranAllume);

  const [feuille, setFeuille] = useState<null | 'goto' | 'plus'>(null);
  const colonne = useRef<Animated.ScrollView>(null);
  /** Partagée entre la colonne (qui l'écrit) et l'en-tête (qui la lit). */
  const defilement = useSharedValue(0);

  // Au changement de chant, le texte repart du haut, SANS animation : on ouvre
  // une nouvelle page, on ne fait pas défiler l'ancienne.
  useEffect(() => {
    colonne.current?.scrollTo({ y: 0, animated: false });
    defilement.value = 0;
  }, [numero, defilement]);

  // Un chant absent ne doit pas laisser un écran vide.
  if (!chant) {
    return (
      <View style={{ flex: 1, backgroundColor: c.paper, justifyContent: 'center', padding: 30 }}>
        <Text style={[type.titreChant, { color: c.ink2, textAlign: 'center' }]}>
          Aucun chant n° {n}
        </Text>
      </View>
    );
  }

  const favori = favoris.includes(chant.n);

  const allerA = (cible: number) => {
    if (cible < PREMIER || cible > DERNIER) return;
    router.replace(`/chant/${cible}`);
  };

  return (
    <View style={{ flex: 1, backgroundColor: c.paper, paddingTop: insets.top }}>
      {/* Garde l'écran allumé pendant toute la lecture, si l'option est cochée. */}
      {ecranAllume ? <GarderEcranAllume /> : null}

      <EnteteLecture
        n={chant.n}
        titre={chant.title}
        favori={favori}
        defilement={defilement}
        onRetour={() => router.back()}
        onBasculerFavori={() => basculerFavori(chant.n)}
        onPlus={() => setFeuille('plus')}
      />

      <ColonneLecture
        ref={colonne}
        chant={chant}
        defilement={defilement}
        onProgression={valeur => noterLecture(chant.n, valeur)}
      />

      {/* Espace laissé libre sous la colonne pour que la capsule ne recouvre
          jamais le dernier vers. */}
      <View style={{ height: mise.capsule.hauteur + insets.bottom }} />

      <CapsuleLecture
        n={chant.n}
        onPrecedent={() => allerA(chant.n - 1)}
        onSuivant={() => allerA(chant.n + 1)}
        onAllerA={() => setFeuille('goto')}
      />

      <FeuilleAllerA
        visible={feuille === 'goto'}
        onFermer={() => setFeuille(null)}
        onOuvrir={allerA}
      />

      <FeuillePlus
        visible={feuille === 'plus'}
        onFermer={() => setFeuille(null)}
        n={chant.n}
        titre={chant.title}
        favori={favori}
        onBasculerFavori={() => basculerFavori(chant.n)}
        onPartager={() => {
          // On partage le titre puis toutes les paroles, dans l'ordre du recueil.
          const paroles = chant.parts.map(p => p.l.join('\n')).join('\n\n');
          Share.share({ message: `${chant.n} · ${chant.title}\n\n${paroles}` });
        }}
        onAllerA={() => setFeuille('goto')}
        onTailleTexte={() => router.push('/reglages')}
      />
    </View>
  );
}

/**
 * Empêche l'écran de s'éteindre.
 *
 * C'est un composant à part, et non un `if` autour du hook : les règles de
 * React interdisent d'appeler un hook conditionnellement. En le montant ou en
 * le démontant, on obtient le même résultat proprement.
 */
function GarderEcranAllume() {
  useKeepAwake();
  return null;
}
