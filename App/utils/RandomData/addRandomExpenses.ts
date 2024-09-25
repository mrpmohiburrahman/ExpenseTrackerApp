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
  return parseFloat((Math.random() * (1500 - 50) + 50).toFixed(2)); // Amount between 50 and 1500
};

// Action to add 20 expense items divided over several months
export const addRandomExpenses = () => {
  const currentDate = moment(); // Current date using moment
  const totalExpenses = 20;
  const monthsToAdd = 10; // Adding items for the last 10 months
  const minItemsPerMonth = 2;

  const monthExpenses: Record<string, number> = {};

  // Ensure at least 2 items per month
  for (let i = 0; i < monthsToAdd; i++) {
    const month = currentDate.clone().subtract(i, 'months').format('YYYY-MM');
    monthExpenses[month] = minItemsPerMonth;
  }

  // Distribute the remaining items randomly over the months
  let remainingItems = totalExpenses - monthsToAdd * minItemsPerMonth;
  while (remainingItems > 0) {
    const randomMonthIndex = Math.floor(Math.random() * monthsToAdd);
    const month = currentDate.clone().subtract(randomMonthIndex, 'months').format('YYYY-MM');
    monthExpenses[month]++;
    remainingItems--;
  }

  // Add the items with random names, amounts, and proper dates
  let expenseCounter = 0;
  Object.keys(monthExpenses).forEach(month => {
    for (let i = 0; i < monthExpenses[month]; i++) {
      const name = expenseNames[expenseCounter % expenseNames.length];
      const amount = getRandomAmount();
      const date = moment(`${month}-01`).format('YYYY-MM-DD'); // First day of the month
      store.dispatch(addExpense(name, date, amount));
      expenseCounter++;
    }
  });
};
