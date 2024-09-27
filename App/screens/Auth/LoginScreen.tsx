import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  SafeAreaView,
  StyleSheet,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { useAuth } from '../../context/AuthContext';

import AuthHeader from '@components/AuthHeader';
import Or from '@components/Or';
import Text from '@components/Text';
import { Colors } from 'App/constants/Colors';
import { TouchableOpacity } from 'react-native';

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
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
            <View style={styles.container}>
              {/* Header */}
              <AuthHeader />

              <View style={styles.formContainer}>
                <TouchableOpacity
                  onPress={async () => {
                    await googleSignin();
                  }}
                  style={styles.googleButton}>
                  <Image source={require('App/assets/google.png')} style={styles.googleImage} />
                  <Text style={styles.googleText}>Continue with Google</Text>
                </TouchableOpacity>

                <Or />

                <TextInput
                  autoFocus
                  mode="outlined"
                  label="Email"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  placeholder="Type email"
                  style={styles.input}
                />
                <TextInput
                  mode="outlined"
                  label="Password"
                  placeholder="Type password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  style={styles.input}
                />

                <Button
                  onPress={handleLogin}
                  disabled={loading}
                  style={styles.loginButton}
                  labelStyle={styles.loginButtonText}>
                  {loading ? 'Logging in...' : 'Sign in'}
                </Button>
              </View>

              <View style={styles.footer}>
                <Text style={styles.notAmember}>Not A Member?</Text>
                <Text style={styles.link} onPress={() => navigation.navigate('Register')}>
                  Sign Up here
                </Text>
              </View>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 16,
    paddingHorizontal: 20,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    gap: 10,
  },
  googleButton: {
    borderWidth: 1,
    borderRadius: 12,
    backgroundColor: 'white',
    borderColor: '#BFCCDC',
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  googleImage: {
    height: 20,
    width: 20,
  },
  googleText: {
    color: Colors.signinSub,
    fontSize: 13,
  },
  input: {
    marginTop: 10,
    backgroundColor: 'white',
  },
  loginButton: {
    backgroundColor: '#485B42',
    borderRadius: 8,
    paddingVertical: 5,
    marginTop: 16,
  },
  loginButtonText: {
    color: '#ffffff',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    paddingTop: 20,
  },
  notAmember: {
    color: Colors.signinSub,
    fontWeight: '500',
    textAlign: 'center',
  },
  link: {
    color: Colors.signin,
    textDecorationLine: 'underline',
    fontWeight: '600',
    textAlign: 'center',
  },
});
