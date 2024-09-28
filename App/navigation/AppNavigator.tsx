// App/navigation/AppNavigator.tsx

import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from '../context/AuthContext';
import RootNavigator from './RootNavigator';
import { Provider } from 'react-redux';
import { persistor, store } from '../store/store';

import { PersistGate } from 'redux-persist/integration/react';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

import BootSplash from 'react-native-bootsplash';
BootSplash.isVisible()
  .then(value => console.log(value))
  .then(() => {
    BootSplash.hide();
  });

const AppNavigator: React.FC = () => {
  useEffect(() => {
    async () => {
      await BootSplash.hide({ fade: true });
      console.log('BootSplash has been hidden successfully');
    };
    GoogleSignin.configure({
      webClientId: '748775571362-v5sse68jlsjloo53quomuu5v0hg5i3q4.apps.googleusercontent.com',
    });
  }, []);
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AuthProvider>
          <NavigationContainer>
            <RootNavigator />
          </NavigationContainer>
        </AuthProvider>
      </PersistGate>
    </Provider>
  );
};

export default AppNavigator;
