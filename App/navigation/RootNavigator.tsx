// App/navigation/RootNavigator.tsx

import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

// Import your screens
import LoginScreen from '../screens/Auth/LoginScreen';
import RegisterScreen from '../screens/Auth/RegisterScreen';
import HomeScreen from '../screens/Home/HomeScreen';
import {useAuth} from '../context/AuthContext';
import AddIncomeScreen from '@screens/Income/AddIncomeScreen';
import IncomeListScreen from '@screens/Income/IncomeListScreen';
// Add other screens as needed

const Stack = createNativeStackNavigator();

const RootNavigator: React.FC = () => {
  const {user, initializing} = useAuth();

  if (initializing) {
    // You can return a loading screen here
    return null;
  }

  return (
    <Stack.Navigator>
      {user ? (
        // User is signed in
        <>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{headerShown: false}}
          />
          {/* Add other authenticated screens here */}
        </>
      ) : (
        // User is not signed in
        <>
          <Stack.Screen
            name="AddIncomeScreen"
            component={IncomeListScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Register"
            component={RegisterScreen}
            options={{headerShown: false}}
          />
          {/* Add other unauthenticated screens here */}
        </>
      )}
    </Stack.Navigator>
  );
};

export default RootNavigator;
