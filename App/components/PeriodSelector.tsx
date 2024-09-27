// PeriodSelector.tsx
import React from 'react';
import { FlatList, TouchableOpacity, View } from 'react-native';
import Text from '@components/Text';
import { SCREEN_WIDTH } from 'App/constants/metrics';
import { Colors } from 'App/constants/Colors';

interface Period {
  id: 'Day' | 'Week' | 'Month' | 'Year';
  title: 'Day' | 'Week' | 'Month' | 'Year';
}

interface PeriodSelectorProps {
  selectedId: 'Day' | 'Week' | 'Month' | 'Year';
  onSelect: (id: 'Day' | 'Week' | 'Month' | 'Year') => void;
}

const PERIODS: Period[] = [
  { id: 'Day', title: 'Day' },
  { id: 'Week', title: 'Week' },
  { id: 'Month', title: 'Month' },
  { id: 'Year', title: 'Year' },
];

const PeriodSelector: React.FC<PeriodSelectorProps> = ({ selectedId, onSelect }) => {
  const renderItem = ({ item }: { item: Period }) => {
    const backgroundColor = selectedId === item.id ? Colors.primary : Colors.white;
    const textColor = selectedId === item.id ? '#fff' : '#ADAFBD';

    return (
      <TouchableOpacity
        onPress={() => onSelect(item.id)}
        style={{
          height: 40,
          justifyContent: 'center',
          alignItems: 'center',
          marginHorizontal: 5,
          borderRadius: 60,
          width: SCREEN_WIDTH / 4 - 20,
          backgroundColor,
        }}>
        <Text style={{ fontSize: 14, color: textColor }}>{item.title}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      data={PERIODS}
      renderItem={renderItem}
      keyExtractor={item => item.id}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        width: SCREEN_WIDTH,
        height: 40,
      }}
    />
  );
};

export default PeriodSelector;
