// eslint-disable-next-line import/no-commonjs
module.exports = {
  roots: ["<rootDir>/src"],
  moduleDirectories: ["node_modules", "src"],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  coverageThreshold: {
    global: {
      statements: 95,
    },
  },
  maxConcurrency: 100,
  testTimeout: 120000,
}
