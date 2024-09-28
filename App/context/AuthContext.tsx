// src/context/AuthContext.tsx

import React, { createContext, useContext, useEffect, useState } from 'react';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

interface AuthContextProps {
  user: FirebaseAuthTypes.User | null;
  initializing: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  googleSignin: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  initializing: true,
  signUp: async () => {},
  signIn: async () => {},
  signOut: async () => {},
  googleSignin: async () => {},
});

export const GOOGLE_CLIENT_ID = '1036316123714-3b6b5kgpdtcaq840jfp0joen21uta10u.apps.googleusercontent.com';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [initializing, setInitializing] = useState<boolean>(true);

  // Handle user state changes
  const onAuthStateChanged = (user: FirebaseAuthTypes.User | null) => {
    setUser(user);
    if (initializing) setInitializing(false);
  };

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  const googleSignin = async () => {
    try {
      const isGoogleServices = await GoogleSignin.hasPlayServices();
      const { data } = await GoogleSignin.signIn();
      console.log('🚀 ~ googleSignin ~ signInData:', data);
      if (data && data?.idToken) {
        const googleCredential = auth.GoogleAuthProvider.credential(data?.idToken);
        await auth().signInWithCredential(googleCredential);
      }
    } catch (error) {
      console.error(`[googleSignin] error in googleSignin === ${JSON.stringify(error)}`);
    }
  };
  const signUp = async (email: string, password: string) => {
    try {
      await auth().createUserWithEmailAndPassword(email, password);
    } catch (error) {
      // Handle Errors here.
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const authInfo = await auth().signInWithEmailAndPassword(email, password);
    } catch (error) {
      // Handle Errors here.
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await auth().signOut();
    } catch (error) {
      // Handle Errors here.
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, initializing, signUp, signIn, signOut, googleSignin }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};
