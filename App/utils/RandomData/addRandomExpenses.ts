import moment from 'moment';
import { store } from '@store/store';
import { addExpense } from '@store/slices/expenseSlice';

// Generate random names for the expenses
const expenseNames = [
  'Groceries',
  'Rent',
  'Electricity Bill',
  'Water Bill',
  'Gas Bill',
  'Internet Bill',
  'Restaurant',
  'Shopping',
  'Car Maintenance',
  'Insurance',
  'Medical Expenses',
  'Travel',
  'Subscriptions',
  'Gym Membership',
  'Entertainment',
  'Clothing',
  'Phone Bill',
  'Gift',
  'Charity',
  'Miscellaneous',
];

// Generate random amounts for the expenses
const getRandomAmount = () => {
  return parseFloat((Math.random() * (500 - 100) + 100).toFixed(2)); // Amount between 100 and 500
};

// Action to add 2 expenses per week for the last 20 weeks
export const addRandomExpenses = () => {
  const currentDate = moment(); // Current date using moment
  const totalWeeks = 20;

  // Total expense items counter
  let expenseCounter = 0;

  // Iterate through the last 20 weeks
  for (let week = 0; week < totalWeeks; week++) {
    // Generate 2 expenses for each week
    for (let i = 0; i < 2; i++) {
      const date = currentDate.clone().subtract(week, 'weeks').startOf('isoWeek').add(i, 'days').format('YYYY-MM-DD');
      const name = expenseNames[expenseCounter % expenseNames.length];
      const amount = getRandomAmount();
      store.dispatch(addExpense(name, date, amount)); // Dispatch expense with generated name, date, and amount
      expenseCounter++;
    }
  }
};
