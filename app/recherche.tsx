/**
 * Écran 07 · Recherche — dans les titres ET dans les paroles.
 *
 * Trois principes hérités du handoff :
 *
 *   1. INSENSIBLE AUX ACCENTS. « grace » trouve « grâce », « GLOIRE » trouve
 *      « Gloire ». C'est indispensable quand on tape vite sur un téléphone.
 *
 *   2. PAS DE SCORE DE PERTINENCE. On s'arrête à 7 résultats, dans l'ordre des
 *      numéros. Quelqu'un qui cherche un cantique en connaît le début : une
 *      liste courte et prévisible vaut mieux qu'un classement malin.
 *
 *   3. UNE SAISIE DE CHIFFRES EST UN NUMÉRO. Taper « 133 » propose d'abord
 *      d'aller directement au chant 133, avant tout résultat textuel.
 *
 * Le champ attend 120 ms d'immobilité avant de chercher (« debounce ») : sans
 * cela on relancerait une recherche complète à chaque lettre tapée.
 */
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChampRecherche } from '@/components/ChampRecherche';
import { PiluleNav } from '@/components/PiluleNav';
import { SqueletteListe } from '@/components/Squelette';
import { Surtitre } from '@/components/Surtitre';
import { useReservePilule } from '@/components/espacePilule';
import { IconeEffacer, IconeRecherche } from '@/components/icones';
import { useTheme } from '@/design/ThemeProvider';
import { mise, polices } from '@/design/tokens';
import { cantique, cantiques, choeurs } from '@/data/recueil';
import { useRecherchesRecentes } from '@/store/recherchesRecentes';
import {
  MIN_CARACTERES,
  numeroSaisi,
  rechercher,
  type Resultat,
} from '@/data/recherche';

/** Immobilité du doigt avant de lancer la recherche, en millisecondes. */
const ATTENTE = 120;

export default function EcranRecherche() {
  const { c } = useTheme();
  const insets = useSafeAreaInsets();
  const reserveBas = useReservePilule();

  const [requete, setRequete] = useState('');
  /**
   * Le dernier calcul terminé : POUR QUELLE requête, et ce qu'il a donné.
   *
   * On mémorise la requête avec ses résultats, et non un drapeau
   * « en cours » séparé. Comparer les deux suffit alors à savoir si
   * l'affichage est à jour — un seul état, donc jamais de désaccord entre
   * « je cherche » et « voici les résultats ».
   */
  const [calcul, setCalcul] = useState<{ requete: string; resultats: Resultat[] }>({
    requete: '',
    resultats: [],
  });

  const propre = requete.trim();
  const assezLong = propre.length >= MIN_CARACTERES;
  const numero = numeroSaisi(requete);
  const chantVise = numero === null ? undefined : cantique(numero);

  useEffect(() => {
    if (!assezLong) return;

    const minuterie = setTimeout(() => {
      setCalcul({ requete: propre, resultats: rechercher(propre) });
    }, ATTENTE);

    // Si l'utilisateur tape une lettre de plus avant la fin du délai, on
    // annule la recherche prévue et on repart pour 120 ms.
    return () => clearTimeout(minuterie);
  }, [propre, assezLong]);

  // Deux valeurs DÉRIVÉES de l'état, jamais stockées : elles ne peuvent donc
  // pas se désynchroniser de la saisie.
  const aJour = calcul.requete === propre;
  const resultats = assezLong && aJour ? calcul.resultats : [];
  const enCours = assezLong && !aJour;

  const recentes = useRecherchesRecentes(s => s.recentes);
  const ajouterRecente = useRecherchesRecentes(s => s.ajouter);
  const retirerRecente = useRecherchesRecentes(s => s.retirer);

  /**
   * Retient la recherche puis ouvre la cible.
   * On n'enregistre QUE lorsqu'un résultat est réellement ouvert : c'est le
   * seul moment où l'on sait que la recherche voulait dire quelque chose.
   */
  const ouvrirResultat = (chemin: '/choeurs' | `/chant/${number}`) => {
    ajouterRecente(propre);
    if (chemin === '/choeurs') router.navigate(chemin);
    else router.push(chemin);
  };

  /** La ligne de décompte, en capitales espacées, au-dessus des résultats. */
  const ligneDeCompte = () => {
    if (!assezLong) return `${cantiques.length} CANTIQUES · ${choeurs.length} CHŒURS`;
    if (enCours) return 'RECHERCHE…';
    if (resultats.length === 0) return 'AUCUN RÉSULTAT';
    const mot = resultats.length > 1 ? 'RÉSULTATS' : 'RÉSULTAT';
    return `${resultats.length} ${mot} POUR « ${propre.toUpperCase()} »`;
  };

  return (
    <View style={{ flex: 1, backgroundColor: c.paper, paddingTop: insets.top }}>
      <View style={{ paddingHorizontal: mise.margeEcran, marginTop: 10 }}>
        <ChampRecherche
          valeur={requete}
          onChange={setRequete}
          autoFocus
          // Valider au clavier compte aussi comme « cette recherche m'a servi ».
          onValider={() => ajouterRecente(propre)}
        />

        <Text
          style={{
            fontFamily: polices.sans.regular,
            fontSize: 11,
            letterSpacing: 1.4,
            color: c.ink3,
            marginTop: 14,
          }}>
          {ligneDeCompte()}
        </Text>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: mise.margeEcran,
          paddingBottom: reserveBas,
        }}
        showsVerticalScrollIndicator={false}
        // Fait retomber le clavier dès qu'on commence à parcourir les résultats.
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled">
        {/* Proposition numérique : toujours en tête quand la saisie est un nombre. */}
        {numero !== null ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={
              chantVise ? `Aller au chant ${numero}` : `Aucun chant numéro ${numero}`
            }
            disabled={!chantVise}
            onPress={() => router.push(`/chant/${numero}`)}
            style={({ pressed }) => ({
              flexDirection: 'row',
              alignItems: 'center',
              gap: 16,
              paddingVertical: 16,
              borderBottomWidth: 1,
              borderBottomColor: c.rule,
              backgroundColor: pressed ? c.priSoft : 'transparent',
            })}>
            <Text style={{ fontFamily: polices.serif.regular, fontSize: 38, color: c.pri }}>
              {numero}
            </Text>
            <View style={{ flex: 1 }}>
              <Surtitre>ALLER DIRECTEMENT AU CHANT</Surtitre>
              <Text
                numberOfLines={2}
                style={{
                  fontFamily: polices.serif.regular,
                  fontSize: 17,
                  lineHeight: 21,
                  color: chantVise ? c.ink : c.ink3,
                  marginTop: 5,
                }}>
                {chantVise ? chantVise.title : 'Aucun chant à ce numéro'}
              </Text>
            </View>
          </Pressable>
        ) : null}

        {/* Recherches récentes — visibles seulement quand le champ est vide
            ou trop court, c'est-à-dire quand il n'y a rien d'autre à montrer. */}
        {!assezLong && recentes.length > 0 ? (
          <View style={{ marginTop: 24 }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingBottom: 10,
                borderBottomWidth: 1,
                borderBottomColor: c.rule,
              }}>
              <Surtitre>RECHERCHES RÉCENTES</Surtitre>
            </View>

            {recentes.map(mot => (
              <View
                key={mot}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  borderBottomWidth: 1,
                  borderBottomColor: c.ruleSoft,
                }}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Rechercher ${mot} à nouveau`}
                  // Un toucher relance la recherche : on remplit le champ, le
                  // reste de l'écran suit tout seul.
                  onPress={() => setRequete(mot)}
                  style={({ pressed }) => ({
                    flex: 1,
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 14,
                    paddingVertical: 14,
                    backgroundColor: pressed ? c.priSoft : 'transparent',
                  })}>
                  <IconeRecherche size={15} color={c.ink3} />
                  <Text
                    numberOfLines={1}
                    style={{
                      flex: 1,
                      fontFamily: polices.sans.regular,
                      fontSize: 14,
                      color: c.ink,
                    }}>
                    {mot}
                  </Text>
                </Pressable>

                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Oublier la recherche ${mot}`}
                  onPress={() => retirerRecente(mot)}
                  hitSlop={12}
                  style={{ width: 26, height: 26, alignItems: 'center', justifyContent: 'center' }}>
                  <IconeEffacer size={13} color={c.ink3} />
                </Pressable>
              </View>
            ))}
          </View>
        ) : null}

        {/* Résultats — ou leur esquisse pendant que l'index se construit. */}
        {enCours ? (
          <View style={{ marginTop: 8 }}>
            <SqueletteListe lignes={5} />
          </View>
        ) : (
          resultats.map(resultat => (
            <LigneResultat
              key={`${resultat.origine}-${resultat.n}`}
              resultat={resultat}
              onPress={() =>
                ouvrirResultat(
                  resultat.origine === 'cantique' ? `/chant/${resultat.n}` : '/choeurs',
                )
              }
            />
          ))
        )}
      </ScrollView>

      {/* La pilule reste visible : le cercle violet est plein, on est bien
          dans la recherche. C'est aussi la sortie vers les autres écrans. */}
      <PiluleNav />
    </View>
  );
}

/**
 * Une ligne de résultat.
 *
 * L'extrait arrive déjà découpé en trois morceaux — avant / trouvé / après —
 * par le module de recherche. On n'a plus qu'à colorer celui du milieu. Ce
 * découpage se fait sur la ligne D'ORIGINE (avec ses accents), pas sur la
 * ligne normalisée : l'utilisateur lit le texte du recueil, pas sa version
 * de travail.
 */
function LigneResultat({ resultat, onPress }: { resultat: Resultat; onPress: () => void }) {
  const { c } = useTheme();
  const estChoeur = resultat.origine === 'choeur';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${estChoeur ? 'Chœur' : 'Chant'} ${resultat.n}, ${resultat.titre}`}
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 15,
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: c.ruleSoft,
        backgroundColor: pressed ? c.priSoft : 'transparent',
      })}>
      <Text
        style={{
          width: 32,
          textAlign: 'right',
          fontFamily: polices.serif.regular,
          fontSize: 17,
          color: c.pri,
        }}>
        {resultat.n}
      </Text>

      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Text
            numberOfLines={1}
            style={{ flex: 1, fontFamily: polices.sans.medium, fontSize: 13.5, color: c.ink }}>
            {resultat.titre}
          </Text>
          {/* Sans ce repère, le « 12 » d'un chœur se confondrait avec le
              cantique n° 12 : les deux numérotations sont indépendantes. */}
          {estChoeur ? (
            <Text
              style={{
                fontFamily: polices.sans.regular,
                fontSize: 9.5,
                letterSpacing: 1.2,
                color: c.ink3,
              }}>
              CHŒUR
            </Text>
          ) : null}
        </View>

        {resultat.extrait ? (
          <Text
            numberOfLines={2}
            style={{
              fontFamily: polices.serif.regular,
              fontSize: 13.5,
              lineHeight: 18.9,
              color: c.ink3,
              marginTop: 3,
            }}>
            {resultat.extrait.avant}
            <Text style={{ color: c.pri, backgroundColor: c.priSoft }}>
              {resultat.extrait.trouve}
            </Text>
            {resultat.extrait.apres}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}
