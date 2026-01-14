module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src', '<rootDir>/test'],
  setupFiles: ['<rootDir>/test/jest.setup.ts'],
  // We keep a single orchestrator test file for readability.
  // It can import and run suite classes (e.g. UserTest).
  testMatch: ['<rootDir>/test/index.test.ts'],
  transform: {
    '^.+\\.(ts|js)$': ['ts-jest', {
      tsconfig: 'tsconfig.json',
    }],
  },
  transformIgnorePatterns: [
    'node_modules/(?!(@faker-js)/)',
  ],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
  ],
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
};