module.exports = {
  preset: 'ts-jest',
  // reporters: [
  //   'default',
  //   [
  //     'jest-junit',
  //     {
  //       outputDirectory: '.',
  //       outputName: 'test-report.integration.xml',
  //     },
  //   ],
  // ],
  testEnvironment: 'node',
  // testMatch: ['*/.integration.spec.ts'],
  transform: {
    'node_modules/variables/.+\\.(j|t)sx?$': 'ts-jest',
  },
  transformIgnorePatterns: ['node_modules/(?!variables/.*)'],
};
