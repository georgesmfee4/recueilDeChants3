// Configuration ESLint (format « flat config », ESLint 9).
const expoConfig = require('eslint-config-expo/flat');

module.exports = [
  ...expoConfig,
  {
    // Le dossier de remise du designer contient du HTML et du JS de prototype :
    // ce n'est pas du code de production, on ne le vérifie pas.
    ignores: ['design_handoff_recueil_chants_iii/**', 'node_modules/**', '.expo/**', 'dist/**'],
  },
];
