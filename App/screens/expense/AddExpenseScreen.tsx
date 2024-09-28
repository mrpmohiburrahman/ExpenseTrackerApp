// App/screens/AddExpenseScreen.tsx

import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { addExpense } from '@store/slices/expenseSlice';

import { getBalanceByPeriod } from '@utils/balanceUtils';
import { setBalances, setChartDataMonthly, setChartDataWeekly, setChartDataYearly } from '@store/slices/balanceSlice';
import { mergeAndSortTransactions } from '@utils/mergeAndSortTransactions';
import { getChartData } from '@utils/chartDataUtils';
import { getChartedByPeriod } from '@utils/getChartedByPeriod';

type RootStackParamList = {
  AddExpense: undefined;
  // Other routes
};

type AddExpenseNavigationProp = NativeStackNavigationProp<RootStackParamList, 'AddExpense'>;

const AddExpenseScreen: React.FC = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation<AddExpenseNavigationProp>();

  const [name, setName] = useState<string>('');
  const [date, setDate] = useState<string>(''); // Ideally use a DatePicker
  const [amount, setAmount] = useState<string>('');

  const handleSubmit = async () => {
    if (!name || !date || !amount) {
      Alert.alert('Error', 'Please fill all fields.');
      return;
    }

    dispatch(addExpense(name, date, parseFloat(amount)));
    Alert.alert('Success', 'Expense added successfully.');
    navigation.goBack();
    await mergeAndSortTransactions();
    const balances = getBalanceByPeriod();
    dispatch(setBalances(balances));
    // Compute chart data
    const chartDataWeekly = getChartedByPeriod('Week', balances, 5);
    const chartDataMonthly = getChartedByPeriod('Month', balances, 5);
    const chartDataYearly = getChartedByPeriod('Year', balances, 5);

    // Dispatch actions to update the balance slice
    dispatch(setBalances(balances));
    dispatch(setChartDataWeekly(chartDataWeekly));
    dispatch(setChartDataMonthly(chartDataMonthly));
    dispatch(setChartDataYearly(chartDataYearly));
  };

  return (
    <View style={styles.container}>
      <TextInput placeholder="Expense Name" value={name} onChangeText={setName} style={styles.input} />
      <TextInput placeholder="Date (YYYY-MM-DD)" value={date} onChangeText={setDate} style={styles.input} />
      <TextInput
        placeholder="Amount"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        style={styles.input}
      />
      <Button title="Add Expense" onPress={handleSubmit} />
    </View>
  );
};

export default AddExpenseScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
});
