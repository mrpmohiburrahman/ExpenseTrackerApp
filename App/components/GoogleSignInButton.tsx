import { View, Text, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { Colors } from '@constants/Colors';
import { useAuth } from '@context/AuthContext';

const GoogleSignInButton = () => {
  const { googleSignin } = useAuth();
  return (
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
      <Image source={require('../assets/google.png')} style={{ height: 20, width: 20 }} />
      <Text style={{ color: Colors.signinSub, fontSize: 13 }}>Continue with google</Text>
    </TouchableOpacity>
  );
};

export default GoogleSignInButton;
