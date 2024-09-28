import HeaderWithActions from '@components/HeaderWithActions';
import ListEmptyScreen from '@components/ListEmptyScreen';
import TransactionHeaderWithChart from '@components/TransactionHeaderWithChart';
import TransactionList, { TransactionItem } from '@components/TransactionList';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { addExpense, deleteExpense, editExpense, ExpenseItem } from '@store/slices/expenseSlice';
import { RootState } from '@store/store';
import { generatePieChartData } from '@utils/chartUtils';
import { generateLast12Months } from '@utils/dateUtils';
import { filterTransactionsByMonth } from '@utils/filterTransactionsByMonth';
import { mergeAndSortTransactions } from '@utils/transactionUtils';
import { validateTransactionInput } from '@utils/validateTransactionInput';
import { Colors } from 'App/constants/Colors';
import moment from 'moment';
import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Button,
  FlatList,
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
import { PieChart } from 'react-native-gifted-charts';
import { useDispatch, useSelector } from 'react-redux';

const monthOptions = generateLast12Months();

const ExpenseListScreen: React.FC = () => {
  const dispatch = useDispatch();
  const expenses = useSelector((state: RootState) => state.expense.expenses);

  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedExpense, setSelectedExpense] = useState<ExpenseItem | null>(null);
  const [editedName, setEditedName] = useState<string>('');
  const [editedDate, setEditedDate] = useState<string>('');
  const [editedAmount, setEditedAmount] = useState<string>('');

  const [filterModalVisible, setFilterModalVisible] = useState<boolean>(false);
  const [selectedMonth, setSelectedMonth] = useState<string>(moment().format('YYYY-MM'));
  const [appliedMonth, setAppliedMonth] = useState<string>(moment().format('YYYY-MM'));
  const [filteredExpenses, setFilteredExpenses] = useState<TransactionItem[]>([]);

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
      const error = validateTransactionInput(editedName, editedDate, editedAmount);
      if (error) {
        Alert.alert('Error', error);
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
    const error = validateTransactionInput(newName, newDate, newAmount);
    if (error) {
      Alert.alert('Error', error);
      return;
    }

    dispatch(addExpense(newName, newDate, parseFloat(newAmount)));
    mergeAndSortTransactions();

    setNewName('');
    setNewDate(moment().format('YYYY-MM-DD'));
    setNewAmount('');
    setAddModalVisible(false);
    setShowDatePicker(false);
  };

  const handleApplyFilter = () => {
    setAppliedMonth(selectedMonth);
    setFilterModalVisible(false);
  };

  const pieData = useMemo(() => {
    return generatePieChartData(filteredExpenses);
  }, [filteredExpenses]);

  return (
    <View style={styles.container}>
      <FlatList
        data={[0, 1]}
        keyExtractor={item => item.toString()}
        renderItem={({ index }) => {
          if (index === 0) {
            if (filteredExpenses && filteredExpenses.length !== 0) {
              return (
                <TransactionHeaderWithChart
                  pieData={pieData}
                  appliedMonth={appliedMonth}
                  onFilterPress={() => {
                    setSelectedMonth(appliedMonth);
                    setFilterModalVisible(true);
                  }}
                  onAddPress={() => {
                    setAddModalVisible(true);
                  }}
                  addButtonTitle="+Add Expense"
                  emptyMessage="No expenses for selected month."
                />
              );
            } else {
              return <ListEmptyScreen />;
            }
          } else if (index === 1) {
            return <TransactionList data={filteredExpenses} onItemPress={openModal} type="expense" />;
          } else {
            return <View />;
          }
        }}
      />

      {/* Modal for Editing/Deleting Expense */}
      <Modal
        visible={modalVisible}
        animationType="fade"
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
        animationType="fade"
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
                  {monthOptions.map(month => (
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

    alignItems: 'center',
  },
  filterButtonText: {
    color: Colors.text,

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
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  filterModalContainer: {
    width: '90%',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
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
