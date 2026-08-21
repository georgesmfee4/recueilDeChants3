/**
 * La pilule de navigation — le seul élément arrondi de l'application.
 *
 * Cinq emplacements : [Accueil] [Cantiques] (Recherche) [Chœurs] [Favoris].
 * Le cercle violet de la recherche est au CENTRE EXACT : il y a donc deux
 * onglets à sa gauche et deux à sa droite, jamais trois d'un côté.
 *
 * Elle flotte au-dessus du contenu et se détache par un filet + un flou,
 * jamais par une ombre. Elle est absente de l'écran de lecture et de l'écran
 * À propos, qui sont des écrans « page ».
 */
import { BlurView } from 'expo-blur';
import { router, usePathname } from 'expo-router';
import { Pressable, View } from 'react-native';
import { useTheme } from '@/design/ThemeProvider';
import { mise } from '@/design/tokens';
import { useBasPilule } from './espacePilule';
import {
  IconeAccueil,
  IconeCantiques,
  IconeChoeurs,
  IconeFavorisSignet,
  IconeRecherche,
} from './icones/pilule';

/** Les quatre onglets, dans l'ordre d'affichage (la recherche s'insère au milieu). */
const ONGLETS = [
  { chemin: '/accueil', libelle: 'Accueil', Icone: IconeAccueil },
  { chemin: '/cantiques', libelle: 'Cantiques', Icone: IconeCantiques },
  { chemin: '/choeurs', libelle: 'Chœurs', Icone: IconeChoeurs },
  { chemin: '/favoris', libelle: 'Favoris', Icone: IconeFavorisSignet },
] as const;

export function PiluleNav() {
  const { c, mode } = useTheme();
  const chemin = usePathname();
  // Hauteur libre sous la pilule : elle ne doit jamais chevaucher les boutons
  // système d'Android ni la barre d'accueil de l'iPhone.
  const bas = useBasPilule();

  const onglet = (index: number) => {
    const item = ONGLETS[index];
    if (!item) return null;
    const actif = chemin === item.chemin;
    return (
      <Pressable
        key={item.chemin}
        accessibilityRole="tab"
        accessibilityState={{ selected: actif }}
        accessibilityLabel={item.libelle}
        onPress={() => router.navigate(item.chemin)}
        style={{
          width: mise.pilule.onglet,
          height: mise.pilule.onglet,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <item.Icone size={19} color={actif ? c.pri : c.ink3} />
        {/* Le point de 3 px : le seul repère de l'onglet actif. */}
        <View
          style={{
            width: mise.pilule.point,
            height: mise.pilule.point,
            marginTop: 4,
            backgroundColor: actif ? c.pri : 'transparent',
          }}
        />
      </Pressable>
    );
  };

  return (
    <View
      pointerEvents="box-none"
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: bas,
        alignItems: 'center',
      }}>
      <BlurView
        intensity={mise.pilule.flou}
        tint={mode === 'sombre' ? 'dark' : 'light'}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          padding: mise.pilule.padding,
          borderRadius: mise.rayonPilule,
          borderWidth: 1,
          borderColor: c.rule,
          backgroundColor: c.blur,
          // `overflow: hidden` fait suivre le flou à la forme arrondie.
          overflow: 'hidden',
        }}>
        {onglet(0)}
        {onglet(1)}

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Recherche"
          // On est peut-être DÉJÀ sur la recherche : la pilule y reste visible.
          // Sans cette garde, on empilerait un second écran de recherche.
          onPress={() => {
            if (chemin !== '/recherche') router.push('/recherche');
          }}
          style={{
            width: mise.pilule.recherche,
            height: mise.pilule.recherche,
            borderRadius: mise.rayonPilule,
            backgroundColor: c.pri,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <IconeRecherche size={21} color={c.onPri} />
        </Pressable>

        {onglet(2)}
        {onglet(3)}
      </BlurView>
    </View>
  );
}
