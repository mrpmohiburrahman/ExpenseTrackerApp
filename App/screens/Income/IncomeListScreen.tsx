// screens/IncomeListScreen.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Button, FlatList, StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { RootState } from '@store/store';
import { addIncome, deleteIncome, editIncome } from '@store/slices/incomeSlice';

import { generatePieChartData } from '@utils/chartUtils';
import TransactionHeaderWithChart from '@components/TransactionHeaderWithChart';
import TransactionList, { TransactionItem } from '@components/TransactionList';
import ListEmptyScreen from '@components/ListEmptyScreen';
import EditDeleteModal from '@components/EditDeleteModal';
import AddModal from '@components/AddModal';
import FilterModal from '@components/FilterModal';
import { filterTransactionsByMonth } from '@utils/filterTransactionsByMonth';
import { generateLast12Months } from '@utils/dateUtils';

// import EditDeleteModal from '@components/modals/EditDeleteModal';
// import AddModal from '@components/modals/AddModal';
// import FilterModal from '@components/modals/FilterModal';

const IncomeListScreen: React.FC = () => {
  const dispatch = useDispatch();
  const incomes = useSelector((state: RootState) => state.income.incomes);

  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [selectedIncome, setSelectedIncome] = useState<TransactionItem | null>(null);

  const [isAddModalVisible, setAddModalVisible] = useState(false);

  const [isFilterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<string>(moment().format('YYYY-MM'));
  const [appliedMonth, setAppliedMonth] = useState<string>(moment().format('YYYY-MM'));

  const monthOptions = generateLast12Months();

  const filteredIncomes = useMemo(() => filterTransactionsByMonth(incomes, appliedMonth), [incomes, appliedMonth]);

  const pieData = useMemo(() => generatePieChartData(filteredIncomes), [filteredIncomes]);

  const handleEditSave = (data: { name: string; date: string; amount: number }) => {
    if (selectedIncome) {
      dispatch(
        editIncome({
          id: selectedIncome.id,
          name: data.name,
          date: data.date,
          amount: data.amount,
        })
      );
      setEditModalVisible(false);
      setSelectedIncome(null);
    }
  };

  const handleEditDelete = () => {
    if (selectedIncome) {
      dispatch(deleteIncome(selectedIncome.id));
      setEditModalVisible(false);
      setSelectedIncome(null);
    }
  };

  const handleAdd = (data: { name: string; date: string; amount: number }) => {
    dispatch(addIncome(data.name, data.date, data.amount));
    setAddModalVisible(false);
  };

  const handleApplyFilter = (month: string) => {
    setAppliedMonth(month);
    setFilterModalVisible(false);
  };

  const openEditModal = (income: TransactionItem) => {
    setSelectedIncome(income);
    setEditModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={[0, 1]}
        keyExtractor={item => item.toString()}
        renderItem={({ index }) => {
          if (index === 0) {
            if (filteredIncomes.length > 0) {
              return (
                <TransactionHeaderWithChart
                  pieData={pieData}
                  appliedMonth={appliedMonth}
                  onFilterPress={() => setFilterModalVisible(true)}
                  onAddPress={() => setAddModalVisible(true)}
                  addButtonTitle="+Add Income"
                />
              );
            } else {
              return <ListEmptyScreen />;
            }
          } else if (index === 1) {
            return (
              <TransactionList
                data={filteredIncomes}
                onItemPress={openEditModal}
                type="income"
                singleItemStyle={{
                  marginVertical: 5,
                  marginHorizontal: 10,
                }}
              />
            );
          } else {
            return <View />;
          }
        }}
      />

      {/* Edit/Delete Modal */}
      <EditDeleteModal
        visible={isEditModalVisible}
        onClose={() => setEditModalVisible(false)}
        onSave={handleEditSave}
        onDelete={handleEditDelete}
        initialData={
          selectedIncome
            ? {
                name: selectedIncome.name,
                date: selectedIncome.date,
                amount: selectedIncome.amount,
              }
            : null
        }
        title="Edit Income"
        placeholderName="Income Name"
        placeholderDate="Date (YYYY-MM-DD)"
        placeholderAmount="Amount"
      />

      {/* Add Modal */}
      <AddModal
        visible={isAddModalVisible}
        onClose={() => setAddModalVisible(false)}
        onAdd={handleAdd}
        title="Add Income"
        placeholderName="Income Name"
        placeholderAmount="Amount"
      />

      {/* Filter Modal */}
      <FilterModal
        visible={isFilterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        onApply={handleApplyFilter}
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
        monthOptions={monthOptions}
      />
    </View>
  );
};

export default IncomeListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});
