
// redux/slices/expenseSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import uuid from 'react-native-uuid';

// Define the structure of an Expense Item
export interface ExpenseItem {
  id: string;
  name: string;
  date: string; // ISO formatted date string
  amount: number;
}

// Define the initial state structure
interface ExpenseState {
  expenses: ExpenseItem[];
}

// Initialize the state
const initialState: ExpenseState = {
  expenses: [],
};
// redux/slices/expenseSlice.ts

const expenseSlice = createSlice({
  name: 'expense',
  initialState,
  reducers: {
    // Action to add a new expense
    addExpense: {
      reducer: (state, action: PayloadAction<ExpenseItem>) => {
        state.expenses.push(action.payload);
      },
      prepare: (name: string, date: string, amount: number) => {
        return {
          payload: {
            id: uuid.v4(),
            name,
            date,
            amount,
          } as ExpenseItem,
        };
      },
    },
    // Action to edit an existing expense
    editExpense: (state, action: PayloadAction<ExpenseItem>) => {
      const index = state.expenses.findIndex((expense) => expense.id === action.payload.id);
      if (index !== -1) {
        state.expenses[index] = action.payload;
      }
    },
    // Action to delete an expense by ID
    deleteExpense: (state, action: PayloadAction<string>) => {
      state.expenses = state.expenses.filter((expense) => expense.id !== action.payload);
    },
  },
});

// Export actions and reducer
export const { addExpense, editExpense, deleteExpense } = expenseSlice.actions;
export default expenseSlice.reducer;