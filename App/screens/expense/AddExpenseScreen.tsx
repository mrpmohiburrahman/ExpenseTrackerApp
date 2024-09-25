
// App/screens/AddExpenseScreen.tsx

import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { addExpense } from '@store/slices/expenseSlice';

type RootStackParamList = {
  AddExpense: undefined;
  // Other routes
};

type AddExpenseNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'AddExpense'
>;

const AddExpenseScreen: React.FC = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation<AddExpenseNavigationProp>();

  const [name, setName] = useState<string>('');
  const [date, setDate] = useState<string>(''); // Ideally use a DatePicker
  const [amount, setAmount] = useState<string>('');

  const handleSubmit = () => {
    if (!name || !date || !amount) {
      Alert.alert('Error', 'Please fill all fields.');
      return;
    }

    dispatch(addExpense(name, date, parseFloat(amount)));
    Alert.alert('Success', 'Expense added successfully.');
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Expense Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        placeholder="Date (YYYY-MM-DD)"
        value={date}
        onChangeText={setDate}
        style={styles.input}
      />
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