// Runs once before each test file (see jest.config.js `setupFilesAfterEnv`).
// @testing-library/react-native v13 auto-registers its matchers, so this file
// is intentionally minimal. Add global mocks/configuration here as the app grows.

// Reanimated has no native backing under jest — swap in its official mock so
// components that use shared values, animated styles, and entering animations
// render synchronously in tests (Animated.View → plain View, withTiming returns
// its target immediately, runOnJS is identity, etc.). `require` is mandatory
// inside a jest.mock factory.
// eslint-disable-next-line @typescript-eslint/no-require-imports
jest.mock('react-native-reanimated', () => require('react-native-reanimated/mock'));

export {};
