import { View, Text } from 'react-native';
import React from 'react';
import { Colors } from '@constants/Colors';
import { SCREEN_WIDTH } from '@constants/metrics';

const AuthHeader = () => {
  return (
    <View style={{ alignItems: 'center', gap: 20, paddingBottom: 50 }}>
      <View style={{ flexDirection: 'row', gap: 4 }}>
        <Text style={{ color: Colors.primary, fontSize: 33 }}>Expense</Text>
        <Text style={{ color: Colors.secondary, fontSize: 33 }}>Tracker</Text>
      </View>
      <Text
        style={{
          color: Colors.text,
          fontSize: 26,
          fontWeight: '600',
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
  );
};

export default AuthHeader;
