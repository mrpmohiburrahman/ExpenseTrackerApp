// App/screens/Logout/LogoutScreen.tsx

import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '@context/AuthContext';

const LogoutScreen: React.FC = () => {
  const { signOut } = useAuth();
  const dispatch = useDispatch();
  const navigation = useNavigation();

  useEffect(() => {
    const performLogout = async () => {
      await signOut();
    };

    performLogout();
  }, [dispatch, navigation]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#6200ee" />
    </View>
  );
};

export default LogoutScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
