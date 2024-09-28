// screens/ExpenseListScreen.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Button, FlatList, StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { RootState } from '@store/store';
import { addExpense, deleteExpense, editExpense, ExpenseItem } from '@store/slices/expenseSlice';
// import { generateLast12Months, filterTransactionsByMonth } from '@utils';

import { generatePieChartData } from '@utils/chartUtils';
import TransactionHeaderWithChart from '@components/TransactionHeaderWithChart';
import TransactionList from '@components/TransactionList';
import ListEmptyScreen from '@components/ListEmptyScreen';
import EditDeleteModal from '@components/EditDeleteModal';
import FilterModal from '@components/FilterModal';
import AddModal from '@components/AddModal';
import { filterTransactionsByMonth } from '@utils/filterTransactionsByMonth';
import { generateLast12Months } from '@utils/dateUtils';

// import EditDeleteModal from '@components/modals/EditDeleteModal';
// import AddModal from '@components/modals/AddModal';
// import FilterModal from '@components/modals/FilterModal';

const ExpenseListScreen: React.FC = () => {
  const dispatch = useDispatch();
  const expenses = useSelector((state: RootState) => state.expense.expenses);

  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<ExpenseItem | null>(null);

  const [isAddModalVisible, setAddModalVisible] = useState(false);

  const [isFilterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<string>(moment().format('YYYY-MM'));
  const [appliedMonth, setAppliedMonth] = useState<string>(moment().format('YYYY-MM'));

  const monthOptions = generateLast12Months();

  const filteredExpenses = useMemo(() => filterTransactionsByMonth(expenses, appliedMonth), [expenses, appliedMonth]);

  const pieData = useMemo(() => generatePieChartData(filteredExpenses), [filteredExpenses]);

  const handleEditSave = (data: { name: string; date: string; amount: number }) => {
    if (selectedExpense) {
      dispatch(
        editExpense({
          id: selectedExpense.id,
          name: data.name,
          date: data.date,
          amount: data.amount,
        })
      );
      setEditModalVisible(false);
      setSelectedExpense(null);
    }
  };

  const handleEditDelete = () => {
    if (selectedExpense) {
      dispatch(deleteExpense(selectedExpense.id));
      setEditModalVisible(false);
      setSelectedExpense(null);
    }
  };

  const handleAdd = (data: { name: string; date: string; amount: number }) => {
    dispatch(addExpense(data.name, data.date, data.amount));
    setAddModalVisible(false);
  };

  const handleApplyFilter = (month: string) => {
    setAppliedMonth(month);
    setFilterModalVisible(false);
  };

  const openEditModal = (expense: ExpenseItem) => {
    setSelectedExpense(expense);
    setEditModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={[0, 1]}
        keyExtractor={item => item.toString()}
        renderItem={({ index }) => {
          if (index === 0) {
            if (filteredExpenses.length > 0) {
              return (
                <TransactionHeaderWithChart
                  pieData={pieData}
                  appliedMonth={appliedMonth}
                  onFilterPress={() => setFilterModalVisible(true)}
                  onAddPress={() => setAddModalVisible(true)}
                  addButtonTitle="+Add Expense"
                  emptyMessage="No expenses for selected month."
                />
              );
            } else {
              return <ListEmptyScreen />;
            }
          } else if (index === 1) {
            return (
              <TransactionList
                data={filteredExpenses}
                onItemPress={openEditModal}
                type="expense"
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
          selectedExpense
            ? {
                name: selectedExpense.name,
                date: selectedExpense.date,
                amount: selectedExpense.amount,
              }
            : null
        }
        title="Edit Expense"
        placeholderName="Expense Name"
        placeholderDate="Date (YYYY-MM-DD)"
        placeholderAmount="Amount"
      />

      {/* Add Modal */}
      <AddModal
        visible={isAddModalVisible}
        onClose={() => setAddModalVisible(false)}
        onAdd={handleAdd}
        title="Add Expense"
        placeholderName="Expense Name"
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

export default ExpenseListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});
