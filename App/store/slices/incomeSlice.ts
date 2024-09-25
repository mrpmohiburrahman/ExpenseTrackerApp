import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import uuid from 'react-native-uuid';

// Define the structure of an Income Item
export interface IncomeItem {
  id: string;
  name: string;
  date: string; // ISO formatted date string
  amount: number;
  type?: 'income'; // Added "type" field to define whether it's an expense or income
}

// Define the initial state structure
interface IncomeState {
  incomes: IncomeItem[];
}

// Initialize the state
const initialState: IncomeState = {
  incomes: [],
};

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
            type: 'income', // Automatically set type to "income"
          } as IncomeItem,
        };
      },
    },
    // Action to edit an existing income
    editIncome: (state, action: PayloadAction<IncomeItem>) => {
      const index = state.incomes.findIndex(income => income.id === action.payload.id);
      if (index !== -1) {
        state.incomes[index] = action.payload;
      }
    },
    // Action to delete an income by ID
    deleteIncome: (state, action: PayloadAction<string>) => {
      state.incomes = state.incomes.filter(income => income.id !== action.payload);
    },
    // Action to clear all incomes
    clearIncomes: state => {
      state.incomes = []; // Reset incomes array to empty
    },
  },
});

// Export actions and reducer
export const { addIncome, editIncome, deleteIncome, clearIncomes } = incomeSlice.actions;
export default incomeSlice.reducer;
