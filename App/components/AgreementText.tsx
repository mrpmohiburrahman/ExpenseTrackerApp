import { View } from 'react-native';
import React from 'react';
import Text from './Text';
import { SCREEN_WIDTH } from '@constants/metrics';

const AgreementText = () => {
  return (
    <View>
      <View style={{ flexDirection: 'row', gap: 2 }}>
        <Text style={{ fontSize: 13, fontWeight: '500' }}>I agree with the</Text>
        <Text style={{ fontSize: 13, fontWeight: '500', color: '#3570FF' }}>Terms & Conditions</Text>
        <Text style={{ fontSize: 13, fontWeight: '500' }}>and</Text>
      </View>

      <Text style={{ fontSize: 13, fontWeight: '500', color: '#3570FF' }}>Privacy Policy</Text>
    </View>
  );
};

export default AgreementText;
