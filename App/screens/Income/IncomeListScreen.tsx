// App/screens/IncomeListScreen.tsx

import { deleteIncome, editIncome, IncomeItem } from '@store/slices/incomeSlice';
import { RootState } from '@store/store';
import { addRandomIncomes } from '@utils/RandomData/addRandomIncomes';
import React, { useState, useEffect, useMemo } from 'react';
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
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Picker } from '@react-native-picker/picker'; // Ensure this is installed
import moment from 'moment'; // Ensure moment is installed
import { PieChart } from 'react-native-gifted-charts';

const IncomeListScreen: React.FC = () => {
  const dispatch = useDispatch();
  const incomes = useSelector((state: RootState) => state.income.incomes);

  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedIncome, setSelectedIncome] = useState<IncomeItem | null>(null);
  const [editedName, setEditedName] = useState<string>('');
  const [editedDate, setEditedDate] = useState<string>('');
  const [editedAmount, setEditedAmount] = useState<string>('');

  // New states for month filtering
  const [filterModalVisible, setFilterModalVisible] = useState<boolean>(false);
  const [selectedMonth, setSelectedMonth] = useState<string>(moment().format('YYYY-MM'));
  const [appliedMonth, setAppliedMonth] = useState<string>(moment().format('YYYY-MM'));
  const [filteredIncomes, setFilteredIncomes] = useState<IncomeItem[]>([]);

  useEffect(() => {
    applyFilter();
  }, [incomes, appliedMonth]);

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

      // Validate date format
      if (!moment(editedDate, 'YYYY-MM-DD', true).isValid()) {
        Alert.alert('Error', 'Date must be in YYYY-MM-DD format.');
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
      setFilteredIncomes(filtered);
    } else {
      setFilteredIncomes(incomes);
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
        {/* Placeholder for alignment */}
        <View style={{ width: 60 }} />
      </View>

      <FlatList
        data={filteredIncomes}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => openModal(item)} style={styles.item}>
            <Text style={styles.itemText}>{item.name}</Text>
            <Text>${item.amount.toFixed(2)}</Text>
            <Text>{item.date}</Text>
          </TouchableOpacity>
        )}
      />

      {/* Modal for Editing/Deleting Income */}
      <Modal
        visible={modalVisible}
        animationType="fade" // Changed from 'slide' to 'fade'
        transparent={true}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalBackdrop}>
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
            <View style={styles.modalButtonContainer}>
              <Button title="Save" onPress={handleSave} />
              <Button title="Delete" color="red" onPress={handleDelete} />
              <Button title="Cancel" onPress={() => setModalVisible(false)} />
            </View>
          </View>
        </View>
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
