// src/context/AuthContext.tsx

import React, {createContext, useContext, useEffect, useState} from 'react';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';

interface AuthContextProps {
  user: FirebaseAuthTypes.User | null;
  initializing: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  initializing: true,
  signUp: async () => {},
  signIn: async () => {},
  signOut: async () => {},
});

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [initializing, setInitializing] = useState<boolean>(true);

  // Handle user state changes
  const onAuthStateChanged = (user: FirebaseAuthTypes.User | null) => {
    console.log("🚀 ~ onAuthStateChanged ~ user:", user)
    setUser(user);
    if (initializing) setInitializing(false);
    console.log("🚀 ~ onAuthStateChanged ~ initializing:", initializing)
  };

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  const signUp = async (email: string, password: string) => {
    console.log("🚀 ~ signUp ~ password:", password)
    console.log("🚀 ~ signUp ~ email:", email)
    try {
      await auth().createUserWithEmailAndPassword(email, password);
    } catch (error) {
      console.log("🚀 ~ signUp ~ error:", error)
      // Handle Errors here.
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    console.log("🚀 ~ signIn ~ signIn: 1",)
    try {
      const authInfo = await auth().signInWithEmailAndPassword(email, password);
      console.log("🚀 ~ signIn ~ authInfo:", authInfo)
      
    console.log("🚀 ~ signIn ~ signIn: 1",)
    } catch (error) {
    console.log("🚀 ~ signIn ~ error:", error)
    console.log("🚀 ~ signIn ~ signIn: 1",)
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
    <AuthContext.Provider value={{user, initializing, signUp, signIn, signOut}}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};
