// App/screens/IncomeListScreen.tsx

import HeaderWithActions from '@components/HeaderWithActions';
import TransactionList, { TransactionItem } from '@components/TransactionList';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker'; // Ensure this is installed
import { clearExpenses } from '@store/slices/expenseSlice';
import { addIncome, clearIncomes, deleteIncome, editIncome } from '@store/slices/incomeSlice';
import { RootState } from '@store/store';
import { addRandomExpenses } from '@utils/RandomData/addRandomExpenses';
import { addRandomIncomes } from '@utils/RandomData/addRandomIncomes';
import { Colors } from 'App/constants/Colors';
import moment from 'moment'; // Ensure moment is installed
import React, { useEffect, useMemo, useState } from 'react';
import Text from '@components/Text';
import {
  Alert,
  Button,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { PieChart } from 'react-native-gifted-charts';
import { useDispatch, useSelector } from 'react-redux';
import { addRandomFinancials } from '@utils/RandomData/addRandomFinancials';

const IncomeListScreen: React.FC = () => {
  const dispatch = useDispatch();
  const incomes = useSelector((state: RootState) => state.income.incomes);

  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedIncome, setSelectedIncome] = useState<TransactionItem | null>(null);
  const [editedName, setEditedName] = useState<string>('');
  const [editedDate, setEditedDate] = useState<string>('');
  const [editedAmount, setEditedAmount] = useState<string>('');

  // New states for month filtering
  const [filterModalVisible, setFilterModalVisible] = useState<boolean>(false);
  const [selectedMonth, setSelectedMonth] = useState<string>(moment().format('YYYY-MM'));
  const [appliedMonth, setAppliedMonth] = useState<string>(moment().format('YYYY-MM'));
  const [filteredIncomes, setFilteredIncomes] = useState<TransactionItem[]>([]);

  // States for Add Income Modal
  const [addModalVisible, setAddModalVisible] = useState<boolean>(false);
  const [newName, setNewName] = useState<string>('');
  const [newDate, setNewDate] = useState<string>(moment().format('YYYY-MM-DD'));
  const [newAmount, setNewAmount] = useState<string>('');
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);

  useEffect(() => {
    applyFilter();
  }, [incomes, appliedMonth]);

  const openModal = (income: TransactionItem) => {
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

      // Validate date format
      if (!moment(editedDate, 'YYYY-MM-DD', true).isValid()) {
        Alert.alert('Error', 'Date must be in YYYY-MM-DD format.');
        return;
      }

      // Validate amount
      const amountNumber = parseFloat(editedAmount);
      if (isNaN(amountNumber) || amountNumber <= 0) {
        Alert.alert('Error', 'Please enter a valid amount.');
        return;
      }

      dispatch(
        editIncome({
          id: selectedIncome.id,
          name: editedName,
          date: editedDate,
          amount: amountNumber,
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

  // Handle Add Income
  const handleAddIncome = () => {
    if (!newName || !newDate || !newAmount) {
      Alert.alert('Error', 'Please fill all fields.');
      return;
    }

    // Validate date format
    if (!moment(newDate, 'YYYY-MM-DD', true).isValid()) {
      Alert.alert('Error', 'Date must be in YYYY-MM-DD format.');
      return;
    }

    // Validate amount
    const amountNumber = parseFloat(newAmount);
    if (isNaN(amountNumber) || amountNumber <= 0) {
      Alert.alert('Error', 'Please enter a valid amount.');
      return;
    }

    // Dispatch the addIncome action
    dispatch(addIncome(newName, newDate, amountNumber));

    // Reset the form and close the modal
    setNewName('');
    setNewDate(moment().format('YYYY-MM-DD'));
    setNewAmount('');
    setAddModalVisible(false);
    setShowDatePicker(false);
  };

  // Function to apply month filter based on appliedMonth
  const applyFilter = () => {
    if (appliedMonth) {
      const [year, month] = appliedMonth.split('-').map(Number);
      const filtered = incomes.filter(income => {
        const incomeDate = moment(income.date, 'YYYY-MM-DD');
        return (
          incomeDate.year() === year && incomeDate.month() + 1 === month // month is 0-indexed in moment
        );
      });
      setFilteredIncomes(filtered as TransactionItem[]);
    } else {
      setFilteredIncomes(incomes as TransactionItem[]);
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

  // Helper function to truncate text to one word
  const truncateToOneWord = (text: string) => {
    return text.split(' ')[0];
  };

  // Define color list
  const colorList = ['#619780', '#485B42', '#B97016', '#D9B758'];
  const additionalColors = ['#FF5733', '#33FF57', '#3357FF', '#FF33A8', '#8E44AD', '#16A085', '#E74C3C', '#F1C40F'];

  // Compute pieData based on filteredIncomes
  const pieData = useMemo(() => {
    // Group incomes by name and sum amounts
    const grouped = filteredIncomes.reduce(
      (acc, income) => {
        acc[income.name] = (acc[income.name] || 0) + income.amount;
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
  }, [filteredIncomes]);
  return (
    <View style={styles.container}>
      <Button
        title="cleare income and expnse"
        onPress={() => {
          dispatch(clearIncomes());
          dispatch(clearExpenses());
          addRandomIncomes();
          addRandomExpenses();
          // addRandomFinancials();
        }}
      />
      <View style={{ justifyContent: 'center', alignItems: 'center', marginBottom: 20 }}>
        <PieChart
          showText
          textColor="white"
          radius={150}
          textSize={20}
          data={pieData}
          // Optional: Add other PieChart props as needed
        />
      </View>
      {/* Reusable Header with Actions */}
      <HeaderWithActions
        filterTitle={moment(appliedMonth, 'YYYY-MM').format('MMMM YYYY')}
        onFilterPress={() => {
          setSelectedMonth(appliedMonth); // Initialize picker with current filter
          setFilterModalVisible(true);
        }}
        addButtonTitle="+Add Income"
        onAddPress={() => {
          setAddModalVisible(true);
        }}
      />

      <TransactionList data={filteredIncomes} onItemPress={openModal} type="income" />

      {/* Modal for Editing/Deleting Income */}
      <Modal
        visible={modalVisible}
        animationType="fade" // Changed from 'slide' to 'fade'
        transparent={true}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Edit Income</Text>
            <TextInput
              placeholder="Income Name"
              value={editedName}
              onChangeText={setEditedName}
              style={styles.input}
              placeholderTextColor={Colors.placeholder}
            />
            <TextInput
              placeholder="Date (YYYY-MM-DD)"
              value={editedDate}
              onChangeText={setEditedDate}
              style={styles.input}
              placeholderTextColor={Colors.placeholder}
            />
            <TextInput
              placeholder="Amount"
              value={editedAmount}
              onChangeText={setEditedAmount}
              keyboardType="numeric"
              style={styles.input}
              placeholderTextColor={Colors.placeholder}
            />
            <View style={styles.modalButtonContainer}>
              <Button title="Save" onPress={handleSave} />
              <Button title="Delete" color="red" onPress={handleDelete} />
              <Button title="Cancel" onPress={() => setModalVisible(false)} />
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal for Adding Income */}
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
            <Text style={styles.modalTitle}>Add Income</Text>
            <TextInput
              placeholder="Income Name"
              value={newName}
              onChangeText={setNewName}
              style={styles.input}
              placeholderTextColor={Colors.placeholder}
            />

            <TextInput
              placeholder="Amount"
              value={newAmount}
              onChangeText={setNewAmount}
              keyboardType="numeric"
              style={styles.input}
              placeholderTextColor={Colors.placeholder}
            />
            <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateInput}>
              <Text style={{ color: Colors.text }}>{newDate}</Text>
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
              <Button title="Add" onPress={handleAddIncome} />
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
        animationType="fade" // Changed from 'slide' to 'fade'
        transparent={true}
        onRequestClose={() => setFilterModalVisible(false)}>
        <View style={styles.modalBackdrop}>
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
  item: {},
  itemText: {},
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
    color: Colors.text,
    fontSize: 22,
    marginBottom: 12,
    textAlign: 'center',
  },
  input: {
    color: Colors.text,
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
});
