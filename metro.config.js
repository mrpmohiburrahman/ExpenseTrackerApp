// metro.config.js

const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const path = require('path');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  resolver: {
    // Define alias mappings
    alias: {
      '@api': path.resolve(__dirname, 'app/api'),
      '@assets': path.resolve(__dirname, 'app/assets'),
      '@components': path.resolve(__dirname, 'app/components'),
      '@constants': path.resolve(__dirname, 'app/constants'),
      '@config': path.resolve(__dirname, 'app/config'),
      '@context': path.resolve(__dirname, 'app/context'),
      '@data': path.resolve(__dirname, 'app/data'),
      '@hooks': path.resolve(__dirname, 'app/hooks'),
      '@i18n': path.resolve(__dirname, 'app/i18n'),
      '@lang': path.resolve(__dirname, 'app/lang'),
      '@lib': path.resolve(__dirname, 'app/lib'),
      '@modals': path.resolve(__dirname, 'app/modals'),
      '@navigation': path.resolve(__dirname, 'app/navigation'),
      '@realmApi': path.resolve(__dirname, 'app/realmApi'),
      '@schemas': path.resolve(__dirname, 'app/schemas'),
      '@screens': path.resolve(__dirname, 'app/screens'),
      '@services': path.resolve(__dirname, 'app/services'),
      '@store': path.resolve(__dirname, 'app/store'),
      '@styles': path.resolve(__dirname, 'app/styles'),
      '@utils': path.resolve(__dirname, 'app/utils'),
    },
    // Specify file extensions for module resolution
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
  },
  // Optionally, you can include additional Metro configurations here
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
