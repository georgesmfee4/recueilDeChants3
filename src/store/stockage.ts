/**
 * Stockage local — une seule base MMKV pour toute l'application.
 *
 * Pourquoi MMKV et pas AsyncStorage ?
 * MMKV lit de façon SYNCHRONE. Au démarrage, on connaît donc le thème choisi
 * avant même le premier rendu : pas de flash blanc puis noir. AsyncStorage est
 * asynchrone et provoquerait ce clignotement.
 *
 * Attention : MMKV contient du code natif, il ne fonctionne pas dans Expo Go.
 * Il faut un « development build » (voir le README).
 */
import { createMMKV } from 'react-native-mmkv';
import type { PersistStorage, StorageValue } from 'zustand/middleware';

const base = createMMKV({ id: 'recueil-de-chants-iii' });

/**
 * Adaptateur entre MMKV et le middleware `persist` de Zustand.
 * Zustand veut un objet {getItem, setItem, removeItem} ; MMKV parle en
 * {getString, set, remove}. Cette fonction fait la traduction.
 */
export function stockageZustand<T>(): PersistStorage<T> {
  return {
    getItem: nom => {
      const valeur = base.getString(nom);
      if (valeur === undefined) return null;
      return JSON.parse(valeur) as StorageValue<T>;
    },
    setItem: (nom, valeur) => {
      base.set(nom, JSON.stringify(valeur));
    },
    removeItem: nom => {
      base.remove(nom);
    },
  };
}
