
// App/screens/AddIncomeScreen.tsx

import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, SafeAreaView } from 'react-native';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { addIncome } from '@store/slices/incomeSlice';

type RootStackParamList = {
  AddIncome: undefined;
  // Other routes
};

type AddIncomeNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'AddIncome'
>;

const AddIncomeScreen: React.FC = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation<AddIncomeNavigationProp>();

  const [name, setName] = useState<string>('');
  const [date, setDate] = useState<string>(''); // Ideally use a DatePicker
  const [amount, setAmount] = useState<string>('');

  const handleSubmit = () => {
    if (!name || !date || !amount) {
      Alert.alert('Error', 'Please fill all fields.');
      return;
    }

    dispatch(addIncome(name, date, parseFloat(amount)));
    Alert.alert('Success', 'Income added successfully.');
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        placeholder="Income Name"
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
      <Button title="Add Income" onPress={handleSubmit} />
    </SafeAreaView>
  );
};

export default AddIncomeScreen;

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