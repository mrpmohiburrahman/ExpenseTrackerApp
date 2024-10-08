import { View } from 'react-native';
import React from 'react';
import { Colors } from '@constants/Colors';
import Text from './Text';

const Or = () => (
  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
    <View style={{ flex: 1, backgroundColor: Colors.placeholder, height: 2 }} />
    <Text style={{ fontStyle: 'italic', color: Colors.placeholder }}>or</Text>
    <View style={{ flex: 1, backgroundColor: Colors.placeholder, height: 2 }} />
  </View>
);

export default Or;
