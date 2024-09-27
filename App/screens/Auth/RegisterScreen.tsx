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
import { isValidEmail } from '@utils/isValidEmail';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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

  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState<boolean>(false);

  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    agreement?: string;
  }>({});

  const validateInputs = () => {
    const newErrors: typeof errors = {};

    if (!name.trim()) {
      newErrors.name = 'Full name is required.';
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!isValidEmail(email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!password) {
      newErrors.password = 'Password is required.';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password.';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    if (!isChecked) {
      newErrors.agreement = 'You must agree to the terms and conditions.';
    }

    return newErrors;
  };

  const handleRegister = async () => {
    const validationErrors = validateInputs();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);

      const errorMessages = Object.values(validationErrors)
        .map((error, index) => `👉 ${error}`)
        .join('\n');

      Alert.alert('Registration Error', errorMessages);
      return;
    }

    setErrors({});
    setLoading(true);
    try {
      await signUp(email, password);

      Alert.alert('Success', 'Registration successful!', [
        {
          text: 'OK',
          onPress: () => navigation.navigate('Login'),
        },
      ]);
    } catch (error: any) {
      Alert.alert('Registration Error', error.message || 'An unexpected error occurred.');
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
  const inset = useSafeAreaInsets();
  return (
    <View style={{ flex: 1, paddingTop: inset.top }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}>
        <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
          <View style={styles.container}>
            {/* Header */}
            <AuthHeader />

            <View style={styles.form}>
              {/* Google Sign-In Button */}
              <GoogleSignInButton />
              <Or />

              {/* Full Name Input */}
              <TextInput
                autoFocus
                mode="outlined"
                label="Full Name"
                value={name}
                onChangeText={setName}
                keyboardType="default"
                placeholder="Type your full name"
                style={styles.input}
                error={!!errors.name}
              />
              {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

              {/* Email Input */}
              <TextInput
                mode="outlined"
                label="Email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                placeholder="Type your email"
                style={styles.input}
                error={!!errors.email}
              />
              {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

              {/* Password Input with Toggle Visibility */}
              <TextInput
                mode="outlined"
                label="Password"
                placeholder="Type your password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!passwordVisible}
                style={styles.input}
                error={!!errors.password}
                right={
                  <TextInput.Icon
                    icon={passwordVisible ? 'eye-off' : 'eye'}
                    onPress={() => setPasswordVisible(!passwordVisible)}
                  />
                }
              />
              {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

              {/* Confirm Password Input with Toggle Visibility */}
              <TextInput
                mode="outlined"
                label="Confirm Password"
                placeholder="Type your password again"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!confirmPasswordVisible}
                style={styles.input}
                error={!!errors.confirmPassword}
                right={
                  <TextInput.Icon
                    icon={confirmPasswordVisible ? 'eye-off' : 'eye'}
                    onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                  />
                }
              />
              {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}

              {/* Agreement Checkbox */}
              <View style={styles.checkboxContainer}>
                <TouchableOpacity onPress={() => setIsChecked(prev => !prev)} activeOpacity={1} style={styles.checkbox}>
                  <VectorIcon.MaterialIcons
                    name={isChecked ? 'check-box' : 'check-box-outline-blank'}
                    size={24}
                    color={Colors.primary}
                  />
                </TouchableOpacity>
                <AgreementText />
              </View>
              {errors.agreement && <Text style={styles.errorText}>{errors.agreement}</Text>}

              {/* Register Button */}
              <Button onPress={handleRegister} disabled={loading} style={styles.button} textColor="#ffffff">
                {loading ? 'Getting Started...' : 'Get Started'}
              </Button>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.notAmember}>Already have an account?</Text>
              <Text style={styles.link} onPress={() => navigation.navigate('Login')}>
                Sign In here
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
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
    marginTop: 20,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    marginBottom: 8,
    backgroundColor: 'white',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  checkbox: {
    padding: 4,
    marginRight: 8,
  },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 8,
    marginTop: 10,
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
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: -4,
    marginBottom: 4,
    marginLeft: 4,
  },
});
