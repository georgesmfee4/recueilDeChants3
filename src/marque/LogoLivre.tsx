/**
 * Le logo « Recueil de Chants III » — un livre relié vu de face.
 *
 * Il est REDESSINÉ en SVG (jamais une image PNG) pour rester net à toutes les
 * tailles : 132 sur l'écran de lancement, 66 sur l'écran À propos.
 * Géométrie exacte : 03-COMPOSANTS-ET-MOUVEMENT.md § 3.
 *
 * Anatomie, de gauche à droite :
 *   - le dos du livre, plus foncé, avec ses coins arrondis à gauche ;
 *   - la couverture ;
 *   - deux filets or encadrant le titre en trois mots ;
 *   - une note de musique or en bas ;
 *   - la pastille or portant « III » en haut à droite. Cette pastille est le
 *     seul élément qui distingue les trois éditions : elle ne disparaît jamais.
 */
import Svg, { Circle, Ellipse, G, Path, Rect, Text as SvgText } from 'react-native-svg';
import { logo, polices } from '@/design/tokens';

export type VarianteLogo = keyof typeof logo;

type Proprietes = {
  /** Côté du carré en points (le logo est toujours carré). */
  size: number;
  /** `marque` par défaut ; `lancement` sur fond violet ; `sombre` en mode nuit. */
  variante?: VarianteLogo;
};

export function LogoLivre({ size, variante = 'marque' }: Proprietes) {
  const couleurs = logo[variante];

  // En dessous de 44 pt, « DE » et la note deviennent illisibles : on les retire.
  const compact = size < 44;
  // En dessous de 40 pt, même le titre ne tient plus : trois filets le remplacent
  // et la pastille grossit pour rester lisible.
  const minuscule = size < 40;

  return (
    <Svg width={size} height={size} viewBox="0 0 240 240" fill="none">
      {/* Couverture */}
      <Rect x={44} y={18} width={152} height={204} rx={9} fill={couleurs.couverture} />
      {/* Dos, plus foncé, arrondi côté reliure */}
      <Path
        d="M62 18 H53 a9 9 0 0 0 -9 9 V213 a9 9 0 0 0 9 9 h9 Z"
        fill={couleurs.dos}
      />

      {minuscule ? (
        // Version réduite : trois filets à la place des trois mots.
        <G>
          <Rect x={92} y={86} width={56} height={6} fill={couleurs.titre} />
          <Rect x={92} y={112} width={56} height={6} fill={couleurs.titre} />
          <Rect x={102} y={138} width={36} height={6} fill={couleurs.filet} />
        </G>
      ) : (
        <G>
          <Rect x={107} y={58.4} width={42} height={2.4} fill={couleurs.filet} />
          <SvgText
            x={130}
            y={90}
            textAnchor="middle"
            fontFamily={polices.serif.semibold}
            fontSize={19.5}
            letterSpacing={3.7}
            fill={couleurs.titre}>
            RECUEIL
          </SvgText>
          {!compact && (
            <SvgText
              x={129}
              y={108}
              textAnchor="middle"
              fontFamily={polices.serif.medium}
              fontSize={7.6}
              letterSpacing={2.4}
              fill={couleurs.titre}>
              DE
            </SvgText>
          )}
          <SvgText
            x={130}
            y={130.5}
            textAnchor="middle"
            fontFamily={polices.serif.semibold}
            fontSize={19.5}
            letterSpacing={3.7}
            fill={couleurs.titre}>
            CHANTS
          </SvgText>
          <Rect x={107} y={145} width={42} height={2.4} fill={couleurs.filet} />
        </G>
      )}

      {/* Note de musique */}
      {!compact && (
        <G transform="translate(60.9,145.6) scale(1.1)">
          <Ellipse
            cx={53.5}
            cy={38}
            rx={8.2}
            ry={6.3}
            fill={couleurs.filet}
            transform="rotate(-20 53.5 38)"
          />
          <Rect x={60} y={13} width={3.6} height={26} rx={1.8} fill={couleurs.filet} />
          <Path
            d="M63.6 14 C 72 18 77.5 24 75.5 32.5 C 74.5 26.5 70 22 63.6 20 Z"
            fill={couleurs.filet}
          />
        </G>
      )}

      {/* Pastille de l'édition — présente dans toutes les variantes */}
      <Circle cx={173} cy={43} r={minuscule ? 24 : 19.5} fill={couleurs.filet} />
      <SvgText
        x={173.5}
        y={minuscule ? 51 : 50}
        textAnchor="middle"
        fontFamily={polices.serif.semibold}
        fontSize={minuscule ? 23 : 19}
        letterSpacing={1}
        fill={couleurs.dos}>
        III
      </SvgText>
    </Svg>
  );
}
