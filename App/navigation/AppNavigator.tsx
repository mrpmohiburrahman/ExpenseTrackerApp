// App/navigation/AppNavigator.tsx

import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from '../context/AuthContext';
import RootNavigator from './RootNavigator';
import { Provider } from 'react-redux';
import { persistor, store } from '@store/store';
import { PersistGate } from 'redux-persist/integration/react';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

const AppNavigator: React.FC = () => {
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '1036316123714-3b6b5kgpdtcaq840jfp0joen21uta10u.apps.googleusercontent.com',
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
