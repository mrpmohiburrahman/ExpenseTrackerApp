import moment from 'moment';
import { store } from '@store/store';
import { addIncome } from '@store/slices/incomeSlice';
import { addIncomeAndMerge } from '@store/thunks/incomeThunks';

// Generate random names for the incomes
const incomeNames = [
  'Freelance Project',
  'Salary',
  'Stock Dividends',
  'Gift',
  'Bonus',
  'Side Hustle',
  'Consulting',
  'Interest',
  'Rental Income',
  'Investment Return',
  'Part-Time Job',
  'Business Profit',
  'Online Course Sale',
  'Royalties',
  'Workshop Fee',
  'Referral Commission',
  'Blog Income',
  'E-book Sale',
  'Affiliate Income',
  'Miscellaneous Income',
];

// Generate random amounts for the incomes
const getRandomAmount = () => {
  return parseFloat((Math.random() * (2000 - 1000) + 1000).toFixed(2)); // Amount between 1000 and 2000
};

// Action to add 2 income items per week for the last 20 weeks
export const addRandomIncomes = () => {
  const currentDate = moment(); // Current date using moment
  const totalWeeks = 20;

  // Total income items counter
  let incomeCounter = 0;

  // Iterate through the last 20 weeks
  for (let week = 0; week < totalWeeks; week++) {
    // Generate 2 incomes for each week
    for (let i = 0; i < 2; i++) {
      const date = currentDate.clone().subtract(week, 'weeks').startOf('isoWeek').add(i, 'days').format('YYYY-MM-DD');
      const name = incomeNames[incomeCounter % incomeNames.length];
      const amount = getRandomAmount();
      // store.dispatch(addIncome(name, date, amount)); // Dispatch income with generated name, date, and amount
      store.dispatch(addIncomeAndMerge(name, date, amount)); // Use the thunk instead of addIncome

      incomeCounter++;
    }
  }
};
