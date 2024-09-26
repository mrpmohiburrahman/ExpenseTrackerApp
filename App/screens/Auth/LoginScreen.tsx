// App/screens/Auth/LoginScreen.tsx

import React, { useState } from 'react';
import { View, ActivityIndicator, Alert, StyleSheet, SafeAreaView, Image } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { Button } from 'react-native-paper';

import VectorIcon from '@utils/VectorIcons';
import Text from '@components/Text';
import { Colors } from 'App/constants/Colors';
import { SCREEN_WIDTH } from 'App/constants/metrics';
import Or from '@components/Or';
import { GoogleSigninButton } from '@react-native-google-signin/google-signin';
import { TouchableOpacity } from 'react-native';
import { IconButton, TextInput } from 'react-native-paper';
import AuthHeader from '@components/AuthHeader';
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
          // justifyContent: 'center',
          paddingHorizontal: 20,
          // borderWidth: 1,
          borderColor: 'red',
        }}>
        {/* Header */}
        <AuthHeader />
        <View style={{ gap: 10 }}>
          <TouchableOpacity
            onPress={async () => {
              await googleSignin();
            }}
            style={{
              borderWidth: 1,
              borderRadius: 12,
              backgroundColor: 'white',
              borderColor: '#BFCCDC',
              // height: 50,
              paddingVertical: 10,
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'row',
              gap: 10,
            }}>
            <Image source={require('App/assets/google.png')} style={{ height: 20, width: 20 }} />
            <Text style={{ color: Colors.signinSub, fontSize: 13 }}>Continue with google</Text>
          </TouchableOpacity>
          <Or />

          <TextInput
            autoFocus
            mode={'outlined'}
            label="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder="Type email"
            // style={{ borderWidth: 1, borderColor: 'red' }}
          />
          <TextInput
            mode={'outlined'}
            label={'Pasword'}
            placeholder="Type password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            // right={<TextInput.Icon icon="eye" />}
            // style={{ borderWidth: 1, borderColor: 'red' }}
          />

          <Button
            onPress={handleLogin}
            disabled={loading}
            style={{ backgroundColor: '#485B42', borderRadius: 8, paddingVertical: 5, marginTop: 6 }}
            textColor="#ffffff">
            {loading ? 'Logging in...' : 'Sign in'}
          </Button>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 10, paddingTop: 10 }}>
          <Text style={styles.notAmember}>Not A Member?</Text>
          <Text style={styles.link} onPress={() => navigation.navigate('Register')}>
            Sign Up here
          </Text>
        </View>
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
  notAmember: {
    marginTop: 16,
    color: Colors.signinSub,
    fontWeight: '500',
    textAlign: 'center',
  },
  link: {
    marginTop: 16,
    color: Colors.signin,
    textDecorationLine: 'underline',
    fontWeight: '600',
    textAlign: 'center',
  },
});
