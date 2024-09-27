import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@store/store';
import uuid from 'react-native-uuid';

export interface AllSortedTransactionsItem {
  id: string;
  name: string;
  date: string;
  amount: number;
  type?: 'expense' | 'income';
}

interface AllSortedTransactionsState {
  allSortedTransactions: AllSortedTransactionsItem[];
}

const initialState: AllSortedTransactionsState = {
  allSortedTransactions: [],
};

const allSortedTransactionsSlice = createSlice({
  name: 'allSortedTransactions',
  initialState,
  reducers: {
    addAllSortedTransactions: (state, action: PayloadAction<AllSortedTransactionsItem[]>) => {
      state.allSortedTransactions = action.payload;
    },
    clearAllSortedTransactions: state => {
      state.allSortedTransactions = [];
    },
  },
});

export const { addAllSortedTransactions, clearAllSortedTransactions } = allSortedTransactionsSlice.actions;
export default allSortedTransactionsSlice.reducer;

export const selectAllSortedTransactions = (state: RootState) => state.allTransaction.allSortedTransactions;
