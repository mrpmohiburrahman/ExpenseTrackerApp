// babel.config.js

module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    'react-native-paper/babel',
    [
      'module-resolver',
      {
        alias: {
          '@api': './app/api',
          '@assets': './app/assets',
          '@components': './app/components',
          '@constants': './app/constants',
          '@config': './app/config',
          '@context': './app/context',
          '@data': './app/data',
          '@hooks': './app/hooks',
          '@i18n': './app/i18n',
          '@lang': './app/lang',
          '@lib': './app/lib',
          '@modals': './app/modals',
          '@navigation': './app/navigation',
          '@realmApi': './app/realmApi',
          '@schemas': './app/schemas',
          '@screens': './app/screens',
          '@services': './app/services',
          '@store': './app/store',
          '@styles': './app/styles',
          '@utils': './app/utils',
        },
        root: ['./'],
      },
    ],
    'react-native-reanimated/plugin',
  ],
};
