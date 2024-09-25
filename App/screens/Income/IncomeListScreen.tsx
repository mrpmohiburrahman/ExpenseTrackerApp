// App/screens/IncomeListScreen.tsx

import { deleteIncome, editIncome, IncomeItem } from '@store/slices/incomeSlice';
import { RootState } from '@store/store';
import { addRandomIncomes } from '@utils/RandomData/addRandomIncomes';
import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Modal, Button, TextInput, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

const IncomeListScreen: React.FC = () => {
  const dispatch = useDispatch();
  const incomes = useSelector((state: RootState) => state.income.incomes);

  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedIncome, setSelectedIncome] = useState<IncomeItem | null>(null);
  const [editedName, setEditedName] = useState<string>('');
  const [editedDate, setEditedDate] = useState<string>('');
  const [editedAmount, setEditedAmount] = useState<string>('');

  const openModal = (income: IncomeItem) => {
    setSelectedIncome(income);
    setEditedName(income.name);
    setEditedDate(income.date);
    setEditedAmount(income.amount.toString());
    setModalVisible(true);
  };

  const handleSave = () => {
    if (selectedIncome) {
      if (!editedName || !editedDate || !editedAmount) {
        Alert.alert('Error', 'Please fill all fields.');
        return;
      }

      dispatch(
        editIncome({
          id: selectedIncome.id,
          name: editedName,
          date: editedDate,
          amount: parseFloat(editedAmount),
        })
      );
      setModalVisible(false);
      setSelectedIncome(null);
    }
  };

  const handleDelete = () => {
    if (selectedIncome) {
      dispatch(deleteIncome(selectedIncome.id));
      setModalVisible(false);
      setSelectedIncome(null);
    }
  };

  return (
    <View style={styles.container}>
      {/* <Button
        title="randome income"
        onPress={() => {
          console.log('🚀 ~ addRandomIncomes:root');
          addRandomIncomes();
        }}
      /> */}
      <FlatList
        data={incomes}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => openModal(item)} style={styles.item}>
            <Text style={styles.itemText}>{item.name}</Text>
            <Text>{item.amount}</Text>
            <Text>{item.date}</Text>
          </TouchableOpacity>
        )}
      />

      {/* Modal for Editing/Deleting Income */}
      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Edit Income</Text>
          <TextInput placeholder="Income Name" value={editedName} onChangeText={setEditedName} style={styles.input} />
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

export default IncomeListScreen;

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
