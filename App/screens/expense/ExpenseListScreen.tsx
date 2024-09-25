// App/screens/ExpenseListScreen.tsx

import { deleteExpense, editExpense, ExpenseItem } from '@store/slices/expenseSlice';
import { RootState } from '@store/store';
import { addRandomExpenses } from '@utils/RandomData/addRandomExpenses';
import React, { useState } from 'react';
import { Alert, Button, FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

const ExpenseListScreen: React.FC = () => {
  const dispatch = useDispatch();
  const expenses = useSelector((state: RootState) => state.expense.expenses);

  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedExpense, setSelectedExpense] = useState<ExpenseItem | null>(null);
  const [editedName, setEditedName] = useState<string>('');
  const [editedDate, setEditedDate] = useState<string>('');
  const [editedAmount, setEditedAmount] = useState<string>('');

  const openModal = (expense: ExpenseItem) => {
    setSelectedExpense(expense);
    setEditedName(expense.name);
    setEditedDate(expense.date);
    setEditedAmount(expense.amount.toString());
    setModalVisible(true);
  };

  const handleSave = () => {
    if (selectedExpense) {
      if (!editedName || !editedDate || !editedAmount) {
        Alert.alert('Error', 'Please fill all fields.');
        return;
      }

      dispatch(
        editExpense({
          id: selectedExpense.id,
          name: editedName,
          date: editedDate,
          amount: parseFloat(editedAmount),
        })
      );
      setModalVisible(false);
      setSelectedExpense(null);
    }
  };

  const handleDelete = () => {
    if (selectedExpense) {
      dispatch(deleteExpense(selectedExpense.id));
      setModalVisible(false);
      setSelectedExpense(null);
    }
  };

  return (
    <View style={styles.container}>
      {/* <Button
        title="randome expense"
        onPress={() => {
          addRandomExpenses();
        }}
      /> */}
      <FlatList
        data={expenses}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => openModal(item)} style={styles.item}>
            <Text style={styles.itemText}>{item.name}</Text>
            <Text>{item.amount}</Text>
            <Text>{item.date}</Text>
          </TouchableOpacity>
        )}
      />

      {/* Modal for Editing/Deleting Expense */}
      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Edit Expense</Text>
          <TextInput placeholder="Expense Name" value={editedName} onChangeText={setEditedName} style={styles.input} />
          <TextInput
            placeholder="Date (YYYY-MM-DD)"
            value={editedDate}
            onChangeText={setEditedDate}
            style={styles.input}
          />
          <TextInput
            placeholder="Amount"
            value={editedAmount}
            onChangeText={setEditedAmount}
            keyboardType="numeric"
            style={styles.input}
          />
          <Button title="Save" onPress={handleSave} />
          <Button title="Delete" color="red" onPress={handleDelete} />
          <Button title="Cancel" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>
    </View>
  );
};

export default ExpenseListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  item: {
    padding: 12,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  itemText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'red',
  },
  modalTitle: {
    fontSize: 22,
    marginBottom: 12,
    textAlign: 'center',
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
