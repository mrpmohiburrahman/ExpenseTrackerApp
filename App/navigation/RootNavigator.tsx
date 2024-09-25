// App/navigation/RootNavigator.tsx

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from 'App/context/AuthContext';
import React from 'react';
import AuthStack from './AuthStack';
import DrawerNavigator from './DrawerNavigator';

const Stack = createNativeStackNavigator();

const RootNavigator: React.FC = () => {
  const { user, initializing } = useAuth();

  if (initializing) {
    // You can render a loading screen or spinner here
    return null;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <Stack.Screen name="AppDrawer" component={DrawerNavigator} />
      ) : (
        <Stack.Screen name="AuthStack" component={AuthStack} />
      )}
    </Stack.Navigator>
  );
};

export default RootNavigator;
