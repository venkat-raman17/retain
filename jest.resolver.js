/**
 * Composed Jest resolver.
 *
 * jest-expo's preset installs the React Native resolver (module mapping, platform
 * extensions). Reanimated 4 / react-native-worklets additionally need their
 * `.native` files excluded under Jest so the JS/web-safe variants load instead of
 * the native module (which throws "Native part of Worklets isn't initialized").
 *
 * So: for worklets requests, drop `.native` extensions, then delegate to the RN
 * resolver; everything else passes straight through. (We can't just use
 * `react-native-worklets/jest/resolver` directly because that would bypass the
 * RN preset's resolver entirely.)
 */
const reactNativeResolver = require('@react-native/jest-preset/jest/resolver');

module.exports = function composedResolver(request, options) {
  const isWorklets =
    options.basedir.includes('react-native-worklets') ||
    request.includes('react-native-worklets');

  if (isWorklets) {
    return reactNativeResolver(request, {
      ...options,
      extensions: options.extensions?.filter((ext) => !ext.includes('native')),
    });
  }

  return reactNativeResolver(request, options);
};
