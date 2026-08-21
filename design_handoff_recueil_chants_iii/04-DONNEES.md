# 04 — Données du recueil

Fichier : `data/recueil-iii.json` (≈ 245 Ko, UTF-8, une seule ligne).
Extrait du document de l'auteur `3 Edition Recueil de Chants 2025.docx` — **aucun texte n'a été réécrit.**

## 1. Schéma

```ts
type Recueil = {
  meta: {
    titre: 'Recueil de Chants';
    edition: 3;
    editionLabel: 'Troisième édition';
    annee: 2025;
    auteur: 'TCHINDEBBE Charles';
    nbCantiques: 302;
    nbChoeurs: 85;
    nbLignes: 5771;
    lettresChoeurs: string[];   // ['A','C','D','E','F','H','I','J','L','M','N','O','Q','S','T','V','Y']
    source: string;
    schema: 1;
  };
  cantiques: Cantique[];
  choeurs: Choeur[];
};

type Cantique = {
  n: number;        // 1 à 302, sans trou ni doublon
  title: string;    // VERBATIM, capitales du recueil, accents tels quels
  parts: Part[];    // dans l'ordre du recueil
};

type Part =
  | { t: 'v'; n: number; l: string[] }   // strophe numérotée dans le recueil
  | { t: 'r'; l: string[] };             // bloc non numérotée : refrain, ou strophe sans numéro

type Choeur = {
  n: number;        // 1 à 85, numérotation de l'application (le recueil ne numérote pas les chœurs)
  letter: string;   // lettre de classement
  l: string[];      // lignes
};
```

## 2. Invariants (à couvrir par des tests)

```
cantiques.length === 302
choeurs.length === 85
numéros de 1 à 302, aucun manquant, aucun doublon
toutes les entrées ont au moins une part, et chaque part au moins une ligne
somme des lignes de paroles = 5771
11 cantiques sans aucun bloc de type 'r'
72 cantiques sans aucun bloc de type 'v'  → afficher « n strophes · sans numéro »
chant le plus long : n° 155 « IL Y A DE L’ESPOIR POUR TOI », 99 lignes
lettres de chœurs utilisées : A C D E F H I J L M N O Q S T V Y (B, G, K, P, R, U, W, X, Z absentes)
```

Test conseillé (`tests/donnees.test.ts`) : charger le JSON, vérifier ces neuf assertions. Elles protègent contre une régression lors d'une future mise à jour de contenu par OTA.

## 3. Règles d'affichage

1. **Titres verbatim.** Ne jamais appliquer `textTransform`, ne jamais « corriger » la casse ni les accents manquants (`LA GRACE FINIRA`, `ALLELUIA Ô !` sont conformes à la source). Deux titres sont en casse mixte dans le recueil (n° 220 et 221) : les afficher tels quels.
2. **Ordre des parts.** Beaucoup de chants commencent par leur refrain (n° 3, 4, 133…). Respecter l'ordre du tableau, ne pas remonter les strophes.
3. **Marqueurs de répétition** conservés dans le texte : `(bis)`, `(ter)`, `(x3)`, `ALLELUIA x2`. Ce sont des indications de chant, ne pas les interpréter.
4. **Structure affichée** (`src/data/structure.ts`) :

```ts
export function structure(c: Cantique): string {
  const v = c.parts.filter(p => p.t === 'v').length;
  const r = c.parts.length - v;
  if (v > 0) return `${v} ${v > 1 ? 'strophes' : 'strophe'}${r ? ' · refrain' : ''}`;
  return `${r} ${r > 1 ? 'strophes' : 'strophe'} · sans numéro`;
}
```

Jamais « 0 strophe ». Version capitales pour le pied de lecture : `structure(c).toUpperCase()`.

5. **Sous-ligne d'index** (`src/data/recueil.ts`) : première ligne de paroles dont la forme normalisée n'est ni contenue dans le titre ni contenante de celui-ci, longueur > 6 ; à défaut, la structure du chant. Objectif : ne jamais répéter le titre sous le titre.

## 4. Recherche

```ts
const norm = (s: string) =>
  s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
```

- Index construit **une fois** au démarrage : `{ n, titre: norm(title), lignes: string[] /* normalisées */, brut: string[] }`.
- Ordre de correspondance : titre d'abord, puis première ligne trouvée dans les paroles.
- 7 résultats maximum, dans l'ordre des numéros (pas de score : les utilisateurs cherchent un chant précis).
- Extrait : découper la ligne d'origine en `avant / trouvé / après` sur l'index de correspondance, et n'appliquer la couleur qu'au segment trouvé (`pri` sur `priSoft`).
- Requête de 1 à 3 chiffres → proposer en tête « aller directement au chant » avec le titre résolu.
- Debounce 120 ms ; requête de moins de 2 caractères → n'afficher que la ligne `302 CANTIQUES · 85 CHŒURS`.
- Le corpus des chœurs est cherché de la même manière (première ligne comme titre).

## 5. Mise à jour du contenu (nouvelle édition, corrections)

Le JSON est embarqué dans le bundle JavaScript : **toute correction de paroles part en OTA**, sans passer par les stores (voir `05-OTA-EAS-UPDATE.md`).

Procédure recommandée :

1. L'auteur fournit le nouveau `.docx`.
2. Un script `scripts/importer-recueil.ts` (à écrire, ~80 lignes) extrait `word/document.xml`, découpe sur les numéros isolés, détecte le titre (ligne en capitales avant ou après le numéro), regroupe les blocs séparés par une ligne vide et marque comme strophe tout bloc débutant par `n-`, `n.`, `n)`.
3. Le script écrit `src/data/recueil-iii.json` et **échoue** si un invariant du § 2 n'est plus vérifié.
4. `git commit` + push sur `main` → la CI publie l'update OTA.

Anomalies déjà corrigées par l'import initial (à conserver dans le script) : la ligne `133»3zaz` du document source vaut `133` ; un `bis` collé au début d'un vers est isolé en `(bis)` ; les espaces multiples sont réduits.
