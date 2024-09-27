import moment from 'moment';
import { store } from '@store/store';
import { addExpense } from '@store/slices/expenseSlice';
import { addIncome } from '@store/slices/incomeSlice';

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

const getRandomAmount = (min, max) => {
  return parseFloat((Math.random() * (max - min) + min).toFixed(2));
};

const addRandomFinancials = () => {
  const currentDate = moment();
  const totalItems = 20;
  const monthsToAdd = 10;
  const minItemsPerMonth = 2;

  const monthExpenses = {};
  const monthIncomes = {};

  for (let i = 0; i < monthsToAdd; i++) {
    const month = currentDate.clone().subtract(i, 'months').format('YYYY-MM');
    monthExpenses[month] = minItemsPerMonth;
    monthIncomes[month] = minItemsPerMonth;
  }

  let totalExpenses = 0;

  Object.keys(monthExpenses).forEach(month => {
    for (let i = 0; i < monthExpenses[month]; i++) {
      const amount = getRandomAmount(50, 500); // Lower cap to control expenses
      totalExpenses += amount;
      const date = moment(`${month}-01`).format('YYYY-MM-DD');
      store.dispatch(addExpense(expenseNames[i % expenseNames.length], date, amount));
    }
  });

  // Calculate total income ensuring it's higher than total expenses
  let totalIncome = totalExpenses + getRandomAmount(500, 1000); // Buffer for safety
  let remainingIncome = totalIncome;

  Object.keys(monthIncomes).forEach(month => {
    for (let i = 0; i < monthIncomes[month]; i++) {
      const maxAmount = Math.min(remainingIncome / (monthIncomes[month] - i), 2000);
      const amount = getRandomAmount(100, maxAmount);
      remainingIncome -= amount;
      const date = moment(`${month}-01`).format('YYYY-MM-DD');
      store.dispatch(addIncome(incomeNames[i % incomeNames.length], date, amount));
    }
  });

  // Verify income always exceeds expenses
  console.log(`Total Income: ${totalIncome}, Total Expenses: ${totalExpenses}`);
};

export { addRandomFinancials };
