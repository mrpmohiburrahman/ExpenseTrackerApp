import { View, Text } from 'react-native';
import React from 'react';

const AgreementText = () => {
  return (
    <View style={{ flexDirection: 'row', gap: 2 }}>
      <Text style={{ fontSize: 13, fontWeight: '500' }}>I agree with the</Text>
      <Text style={{ fontSize: 13, fontWeight: '500', color: '#3570FF' }}>Terms & Conditions</Text>
      <Text style={{ fontSize: 13, fontWeight: '500' }}>and</Text>
      <Text style={{ fontSize: 13, fontWeight: '500', color: '#3570FF' }}>Privacy Policy</Text>
    </View>
  );
};

export default AgreementText;
