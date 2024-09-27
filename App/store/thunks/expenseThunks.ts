// src/store/thunks/incomeThunks.ts
import { AppDispatch, RootState } from '@store/store';
import { addIncome } from '@store/slices/incomeSlice';
import { mergeAndSortTransactions } from '@utils/transactionUtils';
import { addExpense } from '@store/slices/expenseSlice';

// Thunk action to add income and merge transactions
export const addExpenseAndMerge = (name: string, date: string, amount: number) => {
  return (dispatch: AppDispatch) => {
    dispatch(addExpense(name, date, amount));
    // After adding income, merge and sort transactions
    mergeAndSortTransactions();
  };
};
