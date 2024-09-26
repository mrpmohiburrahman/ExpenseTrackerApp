// App/screens/Auth/RegisterScreen.tsx

import React, { useState } from 'react';
import { View, ActivityIndicator, Alert, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import Text from '@components/Text';
import AuthHeader from '@components/AuthHeader';
import Or from '@components/Or';
import { Button, TextInput } from 'react-native-paper';
import GoogleSignInButton from '@components/GoogleSignInButton';
import { Colors } from 'App/constants/Colors';
import AgreementText from '@components/AgreementText';
import VectorIcon from '@utils/VectorIcons';

type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

type RegisterScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Register'>;

const RegisterScreen: React.FC = () => {
  const { signUp, initializing } = useAuth();
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const [name, setName] = useState('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [isChecked, setIsChecked] = useState(false);
  const [toggleCheckBox, setToggleCheckBox] = useState(false);
  const handleRegister = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await signUp(email, password);

      // Navigation is handled by auth state change
    } catch (error: any) {
      Alert.alert('Registration Error', error.message);
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
          paddingHorizontal: 20,
          // borderWidth: 1,
          borderColor: 'red',
        }}>
        <AuthHeader />
        <View style={{ gap: 10 }}>
          <GoogleSignInButton />
          <Or />

          <TextInput
            autoFocus
            mode={'outlined'}
            label="Full Name"
            value={name}
            onChangeText={setName}
            keyboardType="default"
            placeholder="Type name"
            // style={{ borderWidth: 1, borderColor: 'red' }}
          />
          <TextInput
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

          <TextInput
            mode={'outlined'}
            label={'Confirm Pasword'}
            placeholder="Type password again"
            value={password}
            onChangeText={setConfirmPassword}
            secureTextEntry
            // right={<TextInput.Icon icon="eye" />}
            // style={{ borderWidth: 1, borderColor: 'red' }}
          />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              onPress={() => setIsChecked(state => !state)}
              activeOpacity={1}
              style={{ paddingVertical: 10, paddingHorizontal: 5 }}>
              <VectorIcon.MaterialIcons
                name={isChecked ? 'check-box' : 'check-box-outline-blank'}
                size={20}
                color={Colors.primary}
              />
            </TouchableOpacity>
            <AgreementText />
          </View>
          <Button
            onPress={handleRegister}
            disabled={loading}
            style={{ backgroundColor: Colors.primary, borderRadius: 8, paddingVertical: 5, marginTop: 6 }}
            textColor="#ffffff">
            {loading ? 'Get Started...' : 'Get Started'}
          </Button>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 10, paddingTop: 10 }}>
          <Text style={styles.notAmember}>Already have an account?</Text>
          <Text style={styles.link} onPress={() => navigation.navigate('Login')}>
            Sign In here
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default RegisterScreen;

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
