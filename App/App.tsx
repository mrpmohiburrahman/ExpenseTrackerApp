// App/App.tsx

import React, { useEffect } from 'react';
import AppNavigator from './navigation/AppNavigator';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { GOOGLE_CLIENT_ID } from './context/AuthContext';

const App: React.FC = () => {
  return <AppNavigator />;
};

export default App;
