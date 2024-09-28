import HeaderWithActions from '@components/HeaderWithActions';
import ListEmptyScreen from '@components/ListEmptyScreen';
import Text from '@components/Text';
import TransactionHeaderWithChart from '@components/TransactionHeaderWithChart';
import TransactionList, { TransactionItem } from '@components/TransactionList';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { validateInterpolationOptions } from '@shopify/react-native-skia';
import { addIncome, deleteIncome, editIncome } from '@store/slices/incomeSlice';
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
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { PieChart } from 'react-native-gifted-charts';
import { useDispatch, useSelector } from 'react-redux';

const monthOptions = generateLast12Months();
const IncomeListScreen: React.FC = () => {
  const dispatch = useDispatch();
  const incomes = useSelector((state: RootState) => state.income.incomes);

  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedIncome, setSelectedIncome] = useState<TransactionItem | null>(null);
  const [editedName, setEditedName] = useState<string>('');
  const [editedDate, setEditedDate] = useState<string>('');
  const [editedAmount, setEditedAmount] = useState<string>('');

  const [filterModalVisible, setFilterModalVisible] = useState<boolean>(false);
  const [selectedMonth, setSelectedMonth] = useState<string>(moment().format('YYYY-MM'));
  const [appliedMonth, setAppliedMonth] = useState<string>(moment().format('YYYY-MM'));
  const [filteredIncomes, setFilteredIncomes] = useState<TransactionItem[]>([]);

  const [addModalVisible, setAddModalVisible] = useState<boolean>(false);
  const [newName, setNewName] = useState<string>('');
  const [newDate, setNewDate] = useState<string>(moment().format('YYYY-MM-DD'));
  const [newAmount, setNewAmount] = useState<string>('');
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);

  useEffect(() => {
    const filtered = filterTransactionsByMonth(incomes, appliedMonth);
    setFilteredIncomes(filtered);
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
      const error = validateTransactionInput(editedName, editedDate, editedAmount);
      if (error) {
        Alert.alert('Error', error);
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

  const handleAddIncome = () => {
    const error = validateTransactionInput(newName, newDate, newAmount);
    if (error) {
      Alert.alert('Error', error);
      return;
    }

    dispatch(addIncome(newName, newDate, parseFloat(newAmount)));

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
    return generatePieChartData(filteredIncomes);
  }, [filteredIncomes]);
  return (
    <View style={styles.container}>
      <FlatList
        data={[0, 1]}
        keyExtractor={item => item.toString()}
        renderItem={({ index }) => {
          if (index === 0) {
            if (filteredIncomes && filteredIncomes.length !== 0) {
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
                  addButtonTitle="+Add Income"
                />
              );
            } else {
              return <ListEmptyScreen />;
            }
          } else if (index === 1) {
            return <TransactionList data={filteredIncomes} onItemPress={openModal} type="income" />;
          } else {
            return <View />;
          }
        }}
      />

      {/* Modal for Editing/Deleting Income */}
      <Modal
        visible={modalVisible}
        animationType="fade"
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
        animationType="fade"
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
              {monthOptions.map(month => (
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
