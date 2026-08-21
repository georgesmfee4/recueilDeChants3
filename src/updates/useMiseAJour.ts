/**
 * Mises à jour par les airs (OTA, « over the air »).
 *
 * Le contenu du recueil étant embarqué dans le bundle JavaScript, corriger une
 * parole revient à publier une mise à jour EAS — sans repasser par l'App Store
 * ni le Play Store (voir 05-OTA-EAS-UPDATE.md).
 *
 * Comportement volontairement DISCRET :
 *   - on vérifie en silence à l'ouverture et au retour au premier plan ;
 *   - hors connexion, on ne dit rien : l'application marche déjà ;
 *   - on ne recharge JAMAIS tout seul. Une ligne apparaît dans les Réglages,
 *     et c'est l'utilisateur qui décide. Pas question d'interrompre une lecture
 *     en plein culte.
 */
import { useEffect, useState } from 'react';
import { AppState } from 'react-native';
import * as Updates from 'expo-updates';

export function useMiseAJour() {
  const [prete, setPrete] = useState(false);

  useEffect(() => {
    // En développement, le bundle vient de Metro : rien à vérifier.
    if (__DEV__) return;

    const verifier = async () => {
      try {
        const resultat = await Updates.checkForUpdateAsync();
        if (resultat.isAvailable) {
          await Updates.fetchUpdateAsync();
          setPrete(true);
        }
      } catch {
        // Pas de réseau, ou serveur injoignable : on ne dérange pas l'utilisateur.
      }
    };

    verifier();
    const sub = AppState.addEventListener('change', etat => {
      if (etat === 'active') verifier();
    });
    return () => sub.remove();
  }, []);

  return {
    /** Vrai quand une mise à jour est TÉLÉCHARGÉE et attend d'être appliquée. */
    prete,
    /** Redémarre l'application sur la nouvelle version. */
    appliquer: () => Updates.reloadAsync(),
  };
}
