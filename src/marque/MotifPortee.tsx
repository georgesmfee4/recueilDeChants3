/**
 * Le motif de fond de la une : une portée musicale.
 *
 * Pourquoi celui-là ? Le système graphique du recueil est fait de FILETS et de
 * blancs — pas d'ombres, pas de dégradés, pas de textures. Une portée
 * musicale est justement un empilement de filets : c'est le seul motif qui
 * puisse enrichir la page sans la contredire. Et il dit ce qu'est ce livre
 * avant même qu'on lise le titre.
 *
 * Il est volontairement TRÈS discret (8 % d'opacité pour les lignes, 13 % pour
 * les notes) : un motif de fond qu'on remarque est un motif raté. Il doit se
 * deviner, pas se lire, et surtout ne jamais gêner les paroles posées dessus.
 *
 * Le composant a besoin qu'on lui donne ses dimensions en points : dessiner
 * les notes dans un carré étiré les déformerait en ovales.
 */
import { Fragment } from 'react';
import Svg, { Ellipse, Line } from 'react-native-svg';
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
/** Position horizontale des notes, en fraction de la largeur. */
const NOTES = [
  { x: 0.16, ligne: 3 },
  { x: 0.38, ligne: 1 },
  { x: 0.57, ligne: 4 },
  { x: 0.81, ligne: 2 },
];

export function MotifPortee({
  largeur,
  hauteur,
  couleurLigne,
  opaciteLigne = 0.06,
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
        // Les cinq lignes de la portée.
        <Fragment key={sommet}>
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

          {/* Une note par portée, décalée d'une portée à l'autre pour que le
              motif ne forme pas de colonnes verticales. */}
          {(() => {
            const note = NOTES[indexPortee % NOTES.length];
            if (!note) return null;
            const cy = sommet + note.ligne * ECART_LIGNE;
            if (cy > hauteur) return null;
            return (
              <Ellipse
                cx={largeur * note.x}
                cy={cy}
                rx={5}
                ry={3.6}
                fill={clair.or}
                opacity={opaciteNote}
                transform={`rotate(-20 ${largeur * note.x} ${cy})`}
              />
            );
          })()}
        </Fragment>
      ))}
    </Svg>
  );
}
