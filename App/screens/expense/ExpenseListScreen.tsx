// App/screens/ExpenseListScreen.tsx

import { deleteExpense, editExpense, ExpenseItem } from '@store/slices/expenseSlice';
import { RootState } from '@store/store';
import { addRandomExpenses } from '@utils/RandomData/addRandomExpenses';
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Button,
  TextInput,
  Alert,
  Platform,
  TouchableWithoutFeedback,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Picker } from '@react-native-picker/picker';
import moment from 'moment';

const ExpenseListScreen: React.FC = () => {
  const dispatch = useDispatch();
  const expenses = useSelector((state: RootState) => state.expense.expenses);

  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedExpense, setSelectedExpense] = useState<ExpenseItem | null>(null);
  const [editedName, setEditedName] = useState<string>('');
  const [editedDate, setEditedDate] = useState<string>('');
  const [editedAmount, setEditedAmount] = useState<string>('');

  // States for month filtering
  const [filterModalVisible, setFilterModalVisible] = useState<boolean>(false);
  const [selectedMonth, setSelectedMonth] = useState<string>(moment().format('YYYY-MM'));
  const [appliedMonth, setAppliedMonth] = useState<string>(moment().format('YYYY-MM'));
  const [filteredExpenses, setFilteredExpenses] = useState<ExpenseItem[]>([]);

  useEffect(() => {
    applyFilter();
  }, [expenses, appliedMonth]);

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

      // Validate date format
      if (!moment(editedDate, 'YYYY-MM-DD', true).isValid()) {
        Alert.alert('Error', 'Date must be in YYYY-MM-DD format.');
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

  // Function to apply month filter based on appliedMonth
  const applyFilter = () => {
    if (appliedMonth) {
      const [year, month] = appliedMonth.split('-').map(Number);
      const filtered = expenses.filter(expense => {
        const expenseDate = moment(expense.date, 'YYYY-MM-DD');
        return (
          expenseDate.year() === year && expenseDate.month() + 1 === month // month is 0-indexed in moment
        );
      });
      setFilteredExpenses(filtered);
    } else {
      setFilteredExpenses(expenses);
    }
  };

  // Generate list of months from current to previous 12 months
  const generateMonthOptions = () => {
    const months = [];
    const current = moment();
    for (let i = 0; i < 12; i++) {
      months.push(current.clone().subtract(i, 'months').format('YYYY-MM'));
    }
    return months;
  };

  // Handle Apply in filter modal
  const handleApplyFilter = () => {
    setAppliedMonth(selectedMonth);
    setFilterModalVisible(false);
  };

  return (
    <View style={styles.container}>
      {/* Header with Filter Button */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            setSelectedMonth(appliedMonth); // Initialize picker with current filter
            setFilterModalVisible(true);
          }}
          style={styles.filterButton}>
          <Text style={styles.filterButtonText}>Filter</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Expense List</Text>
        {/* Placeholder for alignment */}
        <View style={{ width: 60 }} />
      </View>

      {/* Optional: Display Applied Filter */}
      <Text style={styles.appliedFilterText}>Showing: {moment(appliedMonth, 'YYYY-MM').format('MMMM YYYY')}</Text>

      <FlatList
        data={filteredExpenses}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => openModal(item)} style={styles.item}>
            <Text style={styles.itemText}>{item.name}</Text>
            <Text>${item.amount.toFixed(2)}</Text>
            <Text>{item.date}</Text>
          </TouchableOpacity>
        )}
      />

      {/* Modal for Editing/Deleting Expense */}
      <Modal
        visible={modalVisible}
        animationType="fade" // Changed to 'fade'
        transparent={true}
        onRequestClose={() => setModalVisible(false)}>
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalBackdrop}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>Edit Expense</Text>
                <TextInput
                  placeholder="Expense Name"
                  value={editedName}
                  onChangeText={setEditedName}
                  style={styles.input}
                />
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
                <View style={styles.modalButtonContainer}>
                  <Button title="Save" onPress={handleSave} />
                  <Button title="Delete" color="red" onPress={handleDelete} />
                  <Button title="Cancel" onPress={() => setModalVisible(false)} />
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Modal for Month Filtering */}
      <Modal
        visible={filterModalVisible}
        animationType="fade" // Changed to 'fade'
        transparent={true}
        onRequestClose={() => setFilterModalVisible(false)}>
        <TouchableWithoutFeedback onPress={() => setFilterModalVisible(false)}>
          <View style={styles.modalBackdrop}>
            <TouchableWithoutFeedback>
              <View style={styles.filterModalContainer}>
                <Text style={styles.modalTitle}>Select Month</Text>
                <Picker
                  selectedValue={selectedMonth}
                  onValueChange={itemValue => setSelectedMonth(itemValue)}
                  style={styles.picker}
                  mode="dropdown">
                  {generateMonthOptions().map(month => (
                    <Picker.Item key={month} label={moment(month, 'YYYY-MM').format('MMMM YYYY')} value={month} />
                  ))}
                </Picker>
                <View style={styles.modalButtonContainer}>
                  <Button title="Apply" onPress={handleApplyFilter} />
                  <Button title="Cancel" onPress={() => setFilterModalVisible(false)} />
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  filterButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    width: 60,
    alignItems: 'center',
  },
  filterButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  appliedFilterText: {
    textAlign: 'center',
    marginBottom: 10,
    fontSize: 16,
    color: '#555',
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
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)', // Semi-transparent background
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    elevation: 5, // Adds shadow for Android
    shadowColor: '#000', // Adds shadow for iOS
    shadowOffset: { width: 0, height: 2 }, // Adds shadow for iOS
    shadowOpacity: 0.25, // Adds shadow for iOS
    shadowRadius: 4, // Adds shadow for iOS
  },
  filterModalContainer: {
    width: '90%',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    elevation: 5, // Adds shadow for Android
    shadowColor: '#000', // Adds shadow for iOS
    shadowOffset: { width: 0, height: 2 }, // Adds shadow for iOS
    shadowOpacity: 0.25, // Adds shadow for iOS
    shadowRadius: 4, // Adds shadow for iOS
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
  modalButtonContainer: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  picker: {
    height: Platform.OS === 'ios' ? 200 : 50,
    width: '100%',
  },
});
