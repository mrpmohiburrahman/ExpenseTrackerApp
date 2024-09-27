import React, { useState } from 'react';
import {
  View,
  ActivityIndicator,
  Alert,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
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

    if (!isChecked) {
      Alert.alert('Agreement Required', 'You must agree to the terms and conditions.');
      return;
    }

    setLoading(true);
    try {
      await signUp(email, password);
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
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}>
        <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
          <View style={styles.container}>
            <AuthHeader />
            <View style={styles.form}>
              <GoogleSignInButton />
              <Or />

              <TextInput
                autoFocus
                mode="outlined"
                label="Full Name"
                value={name}
                onChangeText={setName}
                keyboardType="default"
                placeholder="Type name"
                style={styles.input}
              />
              <TextInput
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

              <TextInput
                mode="outlined"
                label="Confirm Password"
                placeholder="Type password again"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                style={styles.input}

              />
              <View style={styles.checkboxContainer}>
                <TouchableOpacity
                  onPress={() => setIsChecked(state => !state)}
                  activeOpacity={1}
                  style={styles.checkbox}>
                  <VectorIcon.MaterialIcons
                    name={isChecked ? 'check-box' : 'check-box-outline-blank'}
                    size={20}
                    color={Colors.primary}
                  />
                </TouchableOpacity>
                <AgreementText />
              </View>
              <Button onPress={handleRegister} disabled={loading} style={styles.button} textColor="#ffffff">
                {loading ? 'Get Started...' : 'Get Started'}
              </Button>
            </View>
            <View style={styles.footer}>
              <Text style={styles.notAmember}>Already have an account?</Text>
              <Text style={styles.link} onPress={() => navigation.navigate('Login')}>
                Sign In here
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingHorizontal: 20,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  form: {
    gap: 10,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    marginBottom: 12,
  },
  checkboxContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  checkbox: {
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 5,
    marginTop: 6,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    paddingTop: 10,
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
