import React from 'react';
import { Text as RNText, TextProps, StyleSheet } from 'react-native';

interface TextPropsExtended extends TextProps {
  children: React.ReactNode;
}

const Text: React.FC<TextPropsExtended> = ({ style, children, ...rest }) => {
  return (
    <RNText style={[styles.defaultText, style]} {...rest}>
      {children}
    </RNText>
  );
};

const styles = StyleSheet.create({
  defaultText: {
    fontSize: 16,
    color: '#000',
  },
});

export default Text;
