// App/navigation/AppNavigator.tsx

import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {AuthProvider} from '../context/AuthContext';
import RootNavigator from './RootNavigator';
import {Provider} from 'react-redux';
import {persistor, store} from '@store/store';
import {PersistGate} from 'redux-persist/integration/react';

const AppNavigator: React.FC = () => {
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
