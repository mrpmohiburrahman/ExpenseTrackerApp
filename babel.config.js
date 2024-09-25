// babel.config.js

module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    'react-native-paper/babel',
    [
      'module-resolver',
      {
        alias: {
          '@api': './App/api',
          '@assets': './App/assets',
          '@components': './App/components',
          '@config': './App/config',
          '@contexts': './App/contexts',
          '@data': './App/data',
          '@hooks': './App/hooks',
          '@i18n': './App/i18n',
          '@lang': './App/lang',
          '@lib': './App/lib',
          '@modals': './App/modals',
          '@navigation': './App/navigation',
          '@realmApi': './App/realmApi',
          '@schemas': './App/schemas',
          '@screens': './App/screens',
          '@services': './App/services',
          '@store': './App/store',
          '@styles': './App/styles',
          '@utils': './App/utils',
        },
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
        root: ['./'],
      },
    ],
  ],
};
