// App/screens/ExpenseListScreen.tsx

import HeaderWithActions from '@components/HeaderWithActions';
import TransactionList, { TransactionItem } from '@components/TransactionList';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker'; // Ensure this is installed
import { addExpense, deleteExpense, editExpense, ExpenseItem } from '@store/slices/expenseSlice';
import { RootState } from '@store/store';
import { filterTransactionsByMonth } from '@utils/filterTransactionsByMonth';
import { mergeAndSortTransactions } from '@utils/transactionUtils';
import { Colors } from 'App/constants/Colors';
import moment from 'moment'; // Ensure moment is installed
import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Button,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { PieChart } from 'react-native-gifted-charts'; // Ensure this is installed
import { useDispatch, useSelector } from 'react-redux';

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
  const [filteredExpenses, setFilteredExpenses] = useState<TransactionItem[]>([]);

  // States for Add Expense Modal
  const [addModalVisible, setAddModalVisible] = useState<boolean>(false);
  const [newName, setNewName] = useState<string>('');
  const [newDate, setNewDate] = useState<string>(moment().format('YYYY-MM-DD'));
  const [newAmount, setNewAmount] = useState<string>('');
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);

  useEffect(() => {
    const filtered = filterTransactionsByMonth(expenses, appliedMonth);
    setFilteredExpenses(filtered);
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

      // Validate amount
      const amountNumber = parseFloat(newAmount);
      if (isNaN(amountNumber) || amountNumber <= 0) {
        Alert.alert('Error', 'Please enter a valid amount.');
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
      // Reset the form and close the modal
      setNewName('');
      setNewDate(moment().format('YYYY-MM-DD'));
      setNewAmount('');
      setAddModalVisible(false);
      setShowDatePicker(false);
    }
  };

  const handleDelete = () => {
    if (selectedExpense) {
      dispatch(deleteExpense(selectedExpense.id));
      setModalVisible(false);
      setSelectedExpense(null);
    }
  };
  const handleAddExpense = () => {
    if (!newName || !newDate || !newAmount) {
      Alert.alert('Error', 'Please fill all fields.');
      return;
    }

    if (!moment(newDate, 'YYYY-MM-DD', true).isValid()) {
      Alert.alert('Error', 'Date must be in YYYY-MM-DD format.');
      return;
    }

    const amountNumber = parseFloat(newAmount);
    if (isNaN(amountNumber) || amountNumber <= 0) {
      Alert.alert('Error', 'Please enter a valid amount.');
      return;
    }

    dispatch(addExpense(newName, newDate, amountNumber));
    mergeAndSortTransactions();

    setNewName('');
    setNewDate(moment().format('YYYY-MM-DD'));
    setNewAmount('');
    setAddModalVisible(false);
    setShowDatePicker(false);
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

  // Helper function to truncate text to one word
  const truncateToOneWord = (text: string) => {
    return text.split(' ')[0];
  };

  // Define color list
  const colorList = ['#619780', '#485B42', '#B97016', '#D9B758'];
  const additionalColors = ['#FF5733', '#33FF57', '#3357FF', '#FF33A8', '#8E44AD', '#16A085', '#E74C3C', '#F1C40F'];

  // Compute pieData based on filteredExpenses
  const pieData = useMemo(() => {
    // Group expenses by name and sum amounts
    const grouped = filteredExpenses.reduce(
      (acc, expense) => {
        acc[expense.name] = (acc[expense.name] || 0) + expense.amount;
        return acc;
      },
      {} as Record<string, number>
    );

    const entries = Object.entries(grouped);

    return entries.map(([name, value], index) => {
      const truncatedName = truncateToOneWord(name);
      let color = colorList[index % colorList.length];

      if (index >= colorList.length) {
        // Assign additional colors or generate random if exceeding predefined colors
        color = additionalColors[index - colorList.length] || '#' + Math.floor(Math.random() * 16777215).toString(16);
      }

      return {
        value,
        color,
        text: truncatedName,
      };
    });
  }, [filteredExpenses]);

  return (
    <View style={styles.container}>
      {/* Pie Chart */}
      <View style={{ justifyContent: 'center', alignItems: 'center', marginBottom: 20 }}>
        {pieData.length > 0 ? (
          <PieChart
            showText
            textColor="white"
            radius={150}
            textSize={20}
            data={pieData}
            // Optional: Add other PieChart props as needed
          />
        ) : (
          <Text style={styles.noDataText}>No expenses for selected month.</Text>
        )}
      </View>

      {/* Reusable Header with Actions */}
      <HeaderWithActions
        filterTitle={moment(appliedMonth, 'YYYY-MM').format('MMMM YYYY')}
        onFilterPress={() => {
          setSelectedMonth(appliedMonth); // Initialize picker with current filter
          setFilterModalVisible(true);
        }}
        addButtonTitle="+Add Expense"
        onAddPress={() => {
          setAddModalVisible(true);
          // Handle add income press
        }}
      />

      <TransactionList data={filteredExpenses} onItemPress={openModal} type="expense" />

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
      {/* Modal for Adding Expense */}
      <Modal
        visible={addModalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => {
          setAddModalVisible(false);
          setShowDatePicker(false);
        }}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalBackdrop}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Add Expense</Text>
            <TextInput placeholder="Expense Name" value={newName} onChangeText={setNewName} style={styles.input} />

            <TextInput
              placeholder="Amount"
              value={newAmount}
              onChangeText={setNewAmount}
              keyboardType="numeric"
              style={styles.input}
            />
            <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateInput}>
              <Text>{newDate}</Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={new Date(newDate)}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) {
                    setNewDate(moment(selectedDate).format('YYYY-MM-DD'));
                  }
                }}
              />
            )}
            <View style={styles.modalButtonContainer}>
              <Button title="Add" onPress={handleAddExpense} />
              <Button
                title="Cancel"
                onPress={() => {
                  setAddModalVisible(false);
                  setShowDatePicker(false);
                }}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
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
    flexDirection: 'row',
    gap: 10,
    padding: 10,
    borderRadius: 5,
    // width: 60,
    alignItems: 'center',
  },
  filterButtonText: {
    color: Colors.text,
    // fontWeight: 'bold',
    fontWeight: '600',
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
  dateInput: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    borderRadius: 4,
    justifyContent: 'center',
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
  noDataText: {
    textAlign: 'center',
    color: '#555',
    marginTop: 20,
    fontSize: 16,
  },
});
