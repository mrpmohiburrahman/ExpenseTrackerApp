// App/components/NotificationButton.tsx

import React from 'react';
import { TouchableOpacity } from 'react-native';
import VectorIcon from '@utils/VectorIcons'; // Adjust the path if necessary
import { useNavigation } from '@react-navigation/native';
import { Colors } from '@constants/Colors';

const NotificationButton: React.FC = () => {
  const navigation = useNavigation();

  const openNotifications = () => {
    // Navigate to the Notifications screen
    // Ensure that you have a Notifications screen defined in your navigator
    navigation.navigate('Notifications');
  };

  return (
    <TouchableOpacity onPress={openNotifications} style={{ marginRight: 16 }}>
      <VectorIcon.Ionicons name="notifications-outline" size={24} color={Colors.secondary} />
    </TouchableOpacity>
  );
};

export default NotificationButton;
