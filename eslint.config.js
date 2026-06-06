// Flat ESLint config (ESLint 9) for Expo SDK 56.
// - eslint-config-expo provides the React Native / Expo rule baseline.
// - eslint-config-prettier disables stylistic rules that Prettier owns.
// `[].concat(...)` normalizes eslint-config-expo's export to a flat array,
// so this works whether it exports an array or a single config object.
const expoConfig = require('eslint-config-expo/flat');
const eslintConfigPrettier = require('eslint-config-prettier');

module.exports = [
  ...[].concat(expoConfig),
  eslintConfigPrettier,
  {
    ignores: [
      'dist/*',
      '.expo/*',
      'coverage/*',
      'node_modules/*',
      'android/*',
      'ios/*',
      'eslint.config.js',
      'jest.config.js',
      'babel.config.js',
      'metro.config.js',
    ],
  },
  {
    rules: {
      // The logger is the only sanctioned console user; everything else is a smell.
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },
];
