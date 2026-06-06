/**
 * Babel config. `babel-preset-expo` is the single source of truth: it injects the
 * React Compiler (enabled via `experiments.reactCompiler` in app.json) and — when
 * `react-native-reanimated`/`react-native-worklets` are installed — the worklets
 * plugin that powers Reanimated. The worklets plugin must run last; the preset
 * handles that ordering, so do not add it manually here.
 */
module.exports = function babelConfig(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
  };
};
