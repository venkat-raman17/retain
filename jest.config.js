/** @type {import('jest').Config} */
module.exports = {
  preset: 'jest-expo',
  // Compose the RN resolver with worklets' `.native`-stripping so Reanimated 4
  // loads its Jest-safe variant (see jest.resolver.js).
  resolver: '<rootDir>/jest.resolver.js',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  // Keep path aliases working inside tests. Order matters: the more specific
  // `@/assets` mapping must come before the catch-all `@/` mapping.
  moduleNameMapper: {
    '^@/assets/(.*)$': '<rootDir>/assets/$1',
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testMatch: ['**/?(*.)+(test).ts?(x)'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/testing/**',
    '!src/**/index.ts',
  ],
  clearMocks: true,
};
