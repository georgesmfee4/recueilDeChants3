/**
 * Le motif de fond de la une : une portée musicale semée de croches.
 *
 * Pourquoi celui-là ? Le système graphique du recueil est fait de FILETS et de
 * blancs — pas d'ombres, pas de dégradés, pas de textures. Une portée
 * musicale est justement un empilement de filets : c'est le seul motif qui
 * puisse enrichir la page sans la contredire. Et il dit ce qu'est ce livre
 * avant même qu'on lise le titre.
 *
 * Les notes ne sont pas de simples ovales : c'est EXACTEMENT la croche du
 * logo — tête inclinée, hampe, drapeau — reprise trait pour trait
 * (03-COMPOSANTS-ET-MOUVEMENT.md § 3). Le fond de la une et l'icône de
 * l'application dessinent ainsi la même chose.
 *
 * Il est volontairement TRÈS discret : les lignes et les notes restent sous
 * les 20 % d'opacité. Un motif de fond qu'on remarque est un motif raté ; il
 * doit se deviner, et ne jamais gêner les paroles posées dessus.
 *
 * Le composant a besoin qu'on lui donne ses dimensions en points : dessiner
 * les notes dans un carré étiré les déformerait.
 */
import { Fragment } from 'react';
import Svg, { Ellipse, G, Line, Path, Rect } from 'react-native-svg';
import { clair } from '@/design/tokens';

type Proprietes = {
  largeur: number;
  hauteur: number;
  /**
   * Couleur des lignes de portée. On passe l'encre du thème courant : le motif
   * fonctionne alors aussi bien sur un fond clair que sur un fond sombre.
   */
  couleurLigne: string;
  /** À ajuster selon le contraste du fond. Par défaut : à peine perceptible. */
  opaciteLigne?: number;
  opaciteNote?: number;
};

/** Écart entre deux des cinq lignes d'une même portée. */
const ECART_LIGNE = 6;
/** Écart entre deux portées successives. */
const ECART_PORTEE = 52;

/**
 * Les croches semées sur les portées.
 *
 * `x` est une fraction de la largeur (0 = bord gauche, 1 = bord droit),
 * `ligne` désigne l'une des cinq lignes de la portée, `taille` et `angle`
 * varient d'une note à l'autre pour éviter l'effet de tampon répété.
 *
 * Le tableau est parcouru en boucle : la portée suivante prend les positions
 * suivantes, si bien que les notes ne s'alignent jamais en colonnes.
 */
const NOTES = [
  { x: 0.13, ligne: 3, taille: 0.5, angle: 0 },
  { x: 0.34, ligne: 1, taille: 0.42, angle: -6 },
  { x: 0.52, ligne: 4, taille: 0.55, angle: 4 },
  { x: 0.71, ligne: 2, taille: 0.45, angle: -3 },
  { x: 0.88, ligne: 3, taille: 0.48, angle: 5 },
  { x: 0.24, ligne: 0, taille: 0.4, angle: 3 },
  // La 7e note n'est pas decorative : elle rend le cycle IMPAIR.
  // Avec 6 notes prises deux par deux, le motif se repetait a l'identique
  // toutes les trois portees, et la repetition se voyait. Avec 7, il faut
  // sept portees pour revenir au point de depart : bien plus que ce qu'un
  // ecran affiche.
  { x: 0.62, ligne: 1, taille: 0.46, angle: -5 },
];

/**
 * Le centre approximatif de la croche dans son propre repère.
 * On s'en sert pour la ramener sur son point d'ancrage avant de la déplacer :
 * sans cela, une note grossie s'éloignerait de la ligne au lieu de rester
 * posée dessus.
 */
const CENTRE_NOTE = { x: 61.5, y: 29 };

/**
 * Une croche, dessinée avec la géométrie exacte du logo.
 * Positionnée par son centre, en points.
 */
function Croche({
  x,
  y,
  taille,
  angle,
  couleur,
  opacite,
}: {
  x: number;
  y: number;
  taille: number;
  angle: number;
  couleur: string;
  opacite: number;
}) {
  // Les transformations se lisent de DROITE à GAUCHE : on recentre la note sur
  // l'origine, on la met à l'échelle, on l'incline, puis on la déplace.
  const transform = `translate(${x},${y}) rotate(${angle}) scale(${taille}) translate(${-CENTRE_NOTE.x},${-CENTRE_NOTE.y})`;

  return (
    <G transform={transform} opacity={opacite}>
      {/* La tête, inclinée à −20° comme sur le logo. */}
      <Ellipse
        cx={53.5}
        cy={38}
        rx={8.2}
        ry={6.3}
        fill={couleur}
        transform="rotate(-20 53.5 38)"
      />
      {/* La hampe. */}
      <Rect x={60} y={13} width={3.6} height={26} rx={1.8} fill={couleur} />
      {/* Le drapeau. */}
      <Path
        d="M63.6 14 C 72 18 77.5 24 75.5 32.5 C 74.5 26.5 70 22 63.6 20 Z"
        fill={couleur}
      />
    </G>
  );
}

export function MotifPortee({
  largeur,
  hauteur,
  couleurLigne,
  opaciteLigne = 0.05,
  opaciteNote = 0.16,
}: Proprietes) {
  // La première mesure arrive à zéro : on ne dessine rien tant qu'on ne
  // connaît pas la taille réelle du bloc.
  if (largeur <= 0 || hauteur <= 0) return null;

  // On calcule les ordonnées de chaque portée avant de dessiner.
  const portees: number[] = [];
  for (let y = 20; y < hauteur; y += ECART_PORTEE) portees.push(y);

  return (
    <Svg width={largeur} height={hauteur}>
      {portees.map((sommet, indexPortee) => (
        <Fragment key={sommet}>
          {/* Les cinq lignes de la portée. */}
          {[0, 1, 2, 3, 4].map(i => {
            const y = sommet + i * ECART_LIGNE;
            if (y > hauteur) return null;
            return (
              <Line
                key={i}
                x1={0}
                y1={y}
                x2={largeur}
                y2={y}
                stroke={couleurLigne}
                strokeWidth={1}
                opacity={opaciteLigne}
              />
            );
          })}

          {/* Deux croches par portée, prises à la suite dans le tableau pour
              que le motif ne se répète pas d'une portée à l'autre. */}
          {[0, 1].map(rang => {
            const note = NOTES[(indexPortee * 2 + rang) % NOTES.length];
            if (!note) return null;
            const cy = sommet + note.ligne * ECART_LIGNE;
            if (cy > hauteur) return null;
            return (
              <Croche
                key={rang}
                x={largeur * note.x}
                y={cy}
                taille={note.taille}
                angle={note.angle}
                couleur={clair.or}
                opacite={opaciteNote}
              />
            );
          })}
        </Fragment>
      ))}
    </Svg>
  );
}
