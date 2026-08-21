/**
 * Les 12 icônes de l'interface, redessinées en SVG.
 *
 * Aucune bibliothèque d'icônes tierce : la géométrie exacte vient du dossier
 * de remise (03-COMPOSANTS-ET-MOUVEMENT.md § 2).
 *
 * Règles communes à toutes :
 *   - grille 20 × 20 (`viewBox="0 0 20 20"`)
 *   - trait 1,5, aucun remplissage
 *   - la couleur vient de la prop `color`, jamais d'une valeur en dur
 *
 * Toutes ont la même signature { size, color } : on peut les échanger.
 */
import Svg, { Circle, Ellipse, Path, Rect } from 'react-native-svg';

export type ProprietesIcone = {
  /** Côté du carré, en points. 19 dans la pilule, 14 dans la capsule, etc. */
  size: number;
  color: string;
};

const TRAIT = 1.5;

/** Enveloppe commune : évite de répéter viewBox/stroke sur chaque icône. */
function Cadre({ size, children }: { size: number; children: React.ReactNode }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      {children}
    </Svg>
  );
}

export function IconeAccueil({ size, color }: ProprietesIcone) {
  return (
    <Cadre size={size}>
      <Path d="M3.4 8.7 10 3.2l6.6 5.5V17h-4.2v-5.2H7.6V17H3.4z" stroke={color} strokeWidth={TRAIT} />
    </Cadre>
  );
}

export function IconeCantiques({ size, color }: ProprietesIcone) {
  return (
    <Cadre size={size}>
      <Path d="M3.5 5.5h13M3.5 10h13M3.5 14.5h8" stroke={color} strokeWidth={TRAIT} />
    </Cadre>
  );
}

export function IconeChoeurs({ size, color }: ProprietesIcone) {
  return (
    <Cadre size={size}>
      <Path d="M7.6 14.2V4.8l8.4-1.6v9" stroke={color} strokeWidth={TRAIT} />
      <Ellipse cx={5.4} cy={14.6} rx={2.2} ry={1.9} stroke={color} strokeWidth={TRAIT} />
      <Ellipse cx={13.8} cy={13} rx={2.2} ry={1.9} stroke={color} strokeWidth={TRAIT} />
    </Cadre>
  );
}

export function IconeRecherche({ size, color }: ProprietesIcone) {
  return (
    <Cadre size={size}>
      <Circle cx={9} cy={9} r={5.4} stroke={color} strokeWidth={TRAIT} />
      <Path d="M13.2 13.2 17 17" stroke={color} strokeWidth={TRAIT} />
    </Cadre>
  );
}

/** Le signet : `plein` quand le chant est en favori. */
export function IconeSignet({ size, color, plein = false }: ProprietesIcone & { plein?: boolean }) {
  return (
    <Cadre size={size}>
      <Path
        d="M5.5 3.4h9v13.4L10 13.1l-4.5 3.7z"
        stroke={color}
        strokeWidth={TRAIT}
        fill={plein ? color : 'none'}
      />
    </Cadre>
  );
}

export function IconeReglages({ size, color }: ProprietesIcone) {
  return (
    <Cadre size={size}>
      <Path
        d="M3.5 6.5h6M12.8 6.5h3.7M3.5 13.5h3.7M10.3 13.5h6.2"
        stroke={color}
        strokeWidth={TRAIT}
      />
      <Circle cx={11} cy={6.5} r={1.7} stroke={color} strokeWidth={TRAIT} />
      <Circle cx={8} cy={13.5} r={1.7} stroke={color} strokeWidth={TRAIT} />
    </Cadre>
  );
}

export function IconeRetour({ size, color }: ProprietesIcone) {
  return (
    <Cadre size={size}>
      <Path d="M11.5 4.5 6 10l5.5 5.5" stroke={color} strokeWidth={TRAIT} />
    </Cadre>
  );
}

export function IconeSuivant({ size, color }: ProprietesIcone) {
  return (
    <Cadre size={size}>
      <Path d="M8.5 4.5 14 10l-5.5 5.5" stroke={color} strokeWidth={TRAIT} />
    </Cadre>
  );
}

export function IconePartager({ size, color }: ProprietesIcone) {
  return (
    <Cadre size={size}>
      <Path
        d="M10 3.4v9.4M6.6 6.6 10 3.2l3.4 3.4M4.4 12.6V17h11.2v-4.4"
        stroke={color}
        strokeWidth={TRAIT}
      />
    </Cadre>
  );
}

/** « Aller à un chant » : une page avec un en-tête et une colonne. */
export function IconeAllerA({ size, color }: ProprietesIcone) {
  return (
    <Cadre size={size}>
      <Rect x={3.4} y={4.4} width={13.2} height={11.2} stroke={color} strokeWidth={TRAIT} />
      <Path d="M3.4 8.2h13.2M8.2 8.2v7.4" stroke={color} strokeWidth={TRAIT} />
    </Cadre>
  );
}

/** Les trois points : seules icônes entièrement remplies avec le signet actif. */
export function IconePlus({ size, color }: ProprietesIcone) {
  return (
    <Cadre size={size}>
      <Circle cx={4.6} cy={10} r={1.3} fill={color} />
      <Circle cx={10} cy={10} r={1.3} fill={color} />
      <Circle cx={15.4} cy={10} r={1.3} fill={color} />
    </Cadre>
  );
}

export function IconeEffacer({ size, color }: ProprietesIcone) {
  return (
    <Cadre size={size}>
      <Path d="M5.5 5.5l9 9M14.5 5.5l-9 9" stroke={color} strokeWidth={TRAIT} />
    </Cadre>
  );
}
