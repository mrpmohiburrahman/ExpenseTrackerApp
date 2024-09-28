// App/components/ProfileButton.tsx

import React from 'react';
import { TouchableOpacity } from 'react-native';
import VectorIcon from '@utils/VectorIcons'; // Adjust the path as needed
import { useNavigation } from '@react-navigation/native';
import { DrawerActions } from '@react-navigation/native';
import { Colors } from '@constants/Colors';

const ProfileButton: React.FC = () => {
  const navigation = useNavigation();

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  return (
    <TouchableOpacity onPress={openDrawer} style={{ marginRight: 16 }}>
      <VectorIcon.Ionicons name="person-circle-outline" size={24} color={Colors.secondary} />
    </TouchableOpacity>
  );
};

export default ProfileButton;
