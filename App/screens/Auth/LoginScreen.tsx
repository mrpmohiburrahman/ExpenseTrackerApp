// App/screens/Auth/LoginScreen.tsx

import React, { useState } from 'react';
import { View, TextInput, Button, ActivityIndicator, Alert, StyleSheet, SafeAreaView, Image } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import VectorIcon from '@utils/VectorIcons';
import Text from '@components/Text';
import { Colors } from 'App/constants/Colors';
import { SCREEN_WIDTH } from 'App/constants/metrics';
import Or from '@components/Or';
import { GoogleSigninButton } from '@react-native-google-signin/google-signin';
import { TouchableOpacity } from 'react-native';
// import VectorIcon from 'App/utils/VectorIcons';
// import VectorIcon from '@utils/VectorIcons';

type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

type LoginScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

const LoginScreen: React.FC = () => {
  const { signIn, initializing, googleSignin } = useAuth();
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      await signIn(email, password);
      // Navigation is handled by auth state change
    } catch (error: any) {
      Alert.alert('Login Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  if (initializing) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          flex: 1,
          padding: 16,
          justifyContent: 'center',
          paddingHorizontal: 20,
          borderWidth: 1,
          borderColor: 'red',
        }}>
        {/* Header */}
        <View style={{ alignItems: 'center', gap: 10 }}>
          <View style={{ flexDirection: 'row', gap: 4 }}>
            <Text style={{ color: Colors.primary, fontSize: 33 }}>Expense</Text>
            <Text style={{ color: Colors.secondary, fontSize: 33 }}>Tracker</Text>
          </View>
          <Text
            style={{
              color: Colors.text,
              fontSize: 26,
            }}>
            Sign In Your Account!
          </Text>
          <Text
            style={{
              color: Colors.signinSub,
              fontSize: 14,
              width: SCREEN_WIDTH * 0.6,
              textAlign: 'center',
            }}>
            It's not too late; let's embark on your journey to a rich life.
          </Text>
        </View>
        <TouchableOpacity
          onPress={async () => {
            await googleSignin();
          }}
          style={{
            borderWidth: 1,
            borderRadius: 12,
            borderColor: '#BFCCDC',
            // height: 50,
            paddingVertical: 10,
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
            gap: 10,
          }}>
          <Image source={require('App/assets/google.png')} style={{ height: 20, width: 20 }} />
          <Text style={{ color: Colors.signinSub }}>Continue with google</Text>
        </TouchableOpacity>
        <Or />
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          style={styles.input}
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />
        <Button title={loading ? 'Logging in...' : 'Login'} onPress={handleLogin} disabled={loading} />
        <Text style={styles.link} onPress={() => navigation.navigate('Register')}>
          Don't have an account? Register
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  title: {
    fontSize: 24,
    marginBottom: 24,
    textAlign: 'center',
  },
  link: {
    marginTop: 16,
    color: 'blue',
    textAlign: 'center',
  },
});
