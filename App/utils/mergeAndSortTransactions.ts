// src/utils/transactionUtils.ts
import { addAllSortedTransactions, AllSortedTransactionsItem } from '@store/slices/allTransactionSlice';
import { store } from '@store/store';
import { TransactionItem } from '../components/TransactionList'; // Adjust the import path as necessary

export const mergeAndSortTransactions = async () => {
  const incomesState = store.getState().income;
  const expensesState = store.getState().expense;
  const { incomes } = incomesState;
  const { expenses } = expensesState;

  // Map incomes to TransactionItem
  const incomeTransactions: TransactionItem[] = incomes.map(income => ({
    id: income.id,
    name: income.name,
    amount: income.amount,
    date: income.date,
    type: income.type || 'income',
  }));

  // Map expenses to TransactionItem
  const expenseTransactions: TransactionItem[] = expenses.map(expense => ({
    id: expense.id,
    name: expense.name,
    amount: expense.amount,
    date: expense.date,
    type: expense.type || 'expense',
  }));

  // Merge both arrays
  const allTransactions: AllSortedTransactionsItem[] = [...incomeTransactions, ...expenseTransactions];

  // Sort the merged array by date in descending order
  allTransactions.sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return dateB - dateA; // For descending order
  });

  store.dispatch(addAllSortedTransactions(allTransactions));
};
