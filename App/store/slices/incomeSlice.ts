
// redux/slices/incomeSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import uuid from 'react-native-uuid';

// Define the structure of an Income Item
export interface IncomeItem {
  id: string;
  name: string;
  date: string; // ISO formatted date string
  amount: number;
}

// Define the initial state structure
interface IncomeState {
  incomes: IncomeItem[];
}

// Initialize the state
const initialState: IncomeState = {
  incomes: [],
};
// redux/slices/incomeSlice.ts

const incomeSlice = createSlice({
  name: 'income',
  initialState,
  reducers: {
    // Action to add a new income
    addIncome: {
      reducer: (state, action: PayloadAction<IncomeItem>) => {
        state.incomes.push(action.payload);
      },
      prepare: (name: string, date: string, amount: number) => {
        return {
          payload: {
            id: uuid.v4(),
            name,
            date,
            amount,
          } as IncomeItem,
        };
      },
    },
    // Action to edit an existing income
    editIncome: (state, action: PayloadAction<IncomeItem>) => {
      const index = state.incomes.findIndex((income) => income.id === action.payload.id);
      if (index !== -1) {
        state.incomes[index] = action.payload;
      }
    },
    // Action to delete an income by ID
    deleteIncome: (state, action: PayloadAction<string>) => {
      state.incomes = state.incomes.filter((income) => income.id !== action.payload);
    },
  },
});

// Export actions and reducer
export const { addIncome, editIncome, deleteIncome } = incomeSlice.actions;
export default incomeSlice.reducer;