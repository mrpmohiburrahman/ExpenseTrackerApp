import React from 'react';
import { View, StyleSheet } from 'react-native';
import Text from '@components/Text';
import { Colors } from 'App/constants/Colors';
import { SCREEN_WIDTH } from 'App/constants/metrics';

type DateNamesDisplayProps = {
  selectedPeriod: string;
  dateNames: string[];
};

/**
 * Component to display date names based on the selected period.
 *
 * @param selectedPeriod - The period selected by the user ('Week', 'Month', 'Year').
 * @param dateNames - The array of date names to display.
 * @returns A React component displaying the date names.
 */
const DateNamesDisplay: React.FC<DateNamesDisplayProps> = ({ selectedPeriod, dateNames }) => {
  return (
    <View style={styles.container}>
      {dateNames.map(item => {
        // Determine the display text and styling based on the selected period.
        let displayText = item;
        let fontSize = 18;

        if (selectedPeriod === 'Month') {
          displayText = item.slice(0, 3); // Shorten month names to first 3 letters.
        } else if (selectedPeriod === 'Week') {
          fontSize = 12; // Smaller font size for week days.
        }

        return (
          <View key={item} style={styles.itemContainer}>
            <Text style={[styles.text, { fontSize }]}>{displayText}</Text>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemContainer: {
    borderWidth: 0,
    width: SCREEN_WIDTH / 5,
    alignItems: 'center',
  },
  text: {
    fontWeight: '400',
    color: Colors.tab,
  },
});

export default DateNamesDisplay;
