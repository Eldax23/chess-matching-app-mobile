const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const config = {
  project: {
    ios: {},
    android: {},
  },
  resolver: {
    extraNodeModules: {
      // Add module resolvers here if needed
    },
  },
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
