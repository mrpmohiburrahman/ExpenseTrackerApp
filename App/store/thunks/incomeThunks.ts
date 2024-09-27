// src/store/thunks/incomeThunks.ts
import { AppDispatch, RootState } from '@store/store';
import { addIncome } from '@store/slices/incomeSlice';
import { mergeAndSortTransactions } from '@utils/transactionUtils';

// Thunk action to add income and merge transactions
export const addIncomeAndMerge = (name: string, date: string, amount: number) => {
  return (dispatch: AppDispatch) => {
    dispatch(addIncome(name, date, amount));
    // After adding income, merge and sort transactions
    mergeAndSortTransactions();
  };
};
