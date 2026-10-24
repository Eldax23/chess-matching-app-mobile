module.exports = {
  preset: 'react-native',
  setupFiles: ['./jest.setup.js'],
  moduleNameMapper: {
    // axios's default entry is ESM; use its CommonJS build under Jest
    '^axios$': 'axios/dist/node/axios.cjs',
  },
  testPathIgnorePatterns: ['/node_modules/', '/android/', '/ios/'],
};
