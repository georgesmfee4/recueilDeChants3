// Configuration Babel du projet.
// babel-preset-expo suffit : il branche tout seul le plugin Reanimated
// (react-native-worklets) et la résolution des routes expo-router.
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
  };
};
