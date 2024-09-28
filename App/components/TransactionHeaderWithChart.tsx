// @components/TransactionHeaderWithChart.tsx
import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';
import HeaderWithActions from '@components/HeaderWithActions';
import { Colors } from 'App/constants/Colors';
import moment from 'moment';

interface TransactionHeaderWithChartProps {
  pieData: any[]; // Adjust the type based on your PieChart data structure
  appliedMonth: string;
  onFilterPress: () => void;
  onAddPress: () => void;
  addButtonTitle: string;
  emptyMessage?: string; // Optional prop for custom empty message
}

const TransactionHeaderWithChart: React.FC<TransactionHeaderWithChartProps> = ({
  pieData,
  appliedMonth,
  onFilterPress,
  onAddPress,
  addButtonTitle,
  emptyMessage,
}) => {
  return (
    <>
      <View style={styles.chartContainer}>
        {pieData && pieData.length > 0 ? (
          <PieChart showText textColor="white" radius={150} textSize={20} data={pieData} />
        ) : emptyMessage ? (
          <Text style={styles.emptyMessage}>{emptyMessage}</Text>
        ) : null}
      </View>
      <HeaderWithActions
        filterTitle={moment(appliedMonth, 'YYYY-MM').format('MMMM YYYY')}
        onFilterPress={onFilterPress}
        addButtonTitle={addButtonTitle}
        onAddPress={onAddPress}
      />
    </>
  );
};

const styles = StyleSheet.create({
  chartContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyMessage: {
    textAlign: 'center',
    color: '#555',
    marginTop: 20,
    fontSize: 16,
  },
});

export default TransactionHeaderWithChart;
