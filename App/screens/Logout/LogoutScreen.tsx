// App/screens/Logout/LogoutScreen.tsx

import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
// import { logoutUser } from '@redux/slices/authSlice'; // Assuming you have an auth slice
import { useNavigation } from '@react-navigation/native';
import { logoutUser } from '@store/slices/authSlice';

const LogoutScreen: React.FC = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  useEffect(() => {
    const performLogout = async () => {
    //   await dispatch(logoutUser()).unwrap();
      navigation.reset({
        index: 0,
        routes: [{ name: 'AuthStack' }],
      });
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
