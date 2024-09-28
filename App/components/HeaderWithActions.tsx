// App/components/HeaderWithActions.tsx
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import VectorIcon from '@utils/VectorIcons'; // Assuming you already have this utility
import { moderateScale } from 'react-native-size-matters';
import { Colors } from '@constants/Colors';

interface HeaderWithActionsProps {
  filterTitle: string;
  addButtonTitle?: string; // New prop for customizing the add button title
  onFilterPress: () => void;
  onAddPress: () => void;
}

const HeaderWithActions: React.FC<HeaderWithActionsProps> = ({
  filterTitle,
  addButtonTitle = '+Add Income', // Default value
  onFilterPress,
  onAddPress,
}) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={onFilterPress} style={styles.filterButton}>
        <Text style={styles.filterButtonText}>{filterTitle}</Text>
        <VectorIcon.SimpleLineIcons name="arrow-down" size={moderateScale(10)} />
      </TouchableOpacity>

      <TouchableOpacity onPress={onAddPress} style={styles.addButton}>
        <Text style={styles.filterButtonText}>{addButtonTitle}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  filterButton: {
    flexDirection: 'row',
    gap: 10,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  filterButtonText: {
    color: Colors.text,
    fontWeight: '600',
  },
  addButton: {
    flexDirection: 'row',
    gap: 10,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
});

export default HeaderWithActions;
