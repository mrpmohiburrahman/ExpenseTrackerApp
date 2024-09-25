import { addIncome } from '@store/slices/incomeSlice';
import { store } from '@store/store';
import moment from 'moment';

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
  return parseFloat((Math.random() * (2000 - 100) + 100).toFixed(2)); // Amount between 100 and 2000
};

// Action to add 20 income items divided over several months
export const addRandomIncomes = () => {
  console.log('🚀 ~ addRandomIncomes ~ addRandomIncomes:1');
  const currentDate = moment(); // Current date using moment
  const totalIncomes = 20;
  const monthsToAdd = 10; // Adding items for the last 10 months
  const minItemsPerMonth = 2;

  const monthIncomes: Record<string, number> = {};

  // Ensure at least 2 items per month
  for (let i = 0; i < monthsToAdd; i++) {
    const month = currentDate.clone().subtract(i, 'months').format('YYYY-MM');
    monthIncomes[month] = minItemsPerMonth;
  }

  console.log('🚀 ~ addRandomIncomes ~ addRandomIncomes:2');
  // Distribute the remaining items randomly over the months
  let remainingItems = totalIncomes - monthsToAdd * minItemsPerMonth;
  while (remainingItems > 0) {
    const randomMonthIndex = Math.floor(Math.random() * monthsToAdd);
    const month = currentDate.clone().subtract(randomMonthIndex, 'months').format('YYYY-MM');
    monthIncomes[month]++;
    remainingItems--;
  }

  console.log('🚀 ~ addRandomIncomes ~ addRandomIncomes:3');
  // Add the items with random names, amounts, and proper dates
  let incomeCounter = 0;
  Object.keys(monthIncomes).forEach(month => {
    for (let i = 0; i < monthIncomes[month]; i++) {
      const name = incomeNames[incomeCounter % incomeNames.length];
      const amount = getRandomAmount();
      const date = moment(`${month}-01`).format('YYYY-MM-DD'); // First day of the month
      console.log('🚀 ~ addRandomIncomes ~ addRandomIncomes:4');
      store.dispatch(addIncome(name, date, amount));
      console.log('🚀 ~ addRandomIncomes ~ addRandomIncomes:5');
      incomeCounter++;
    }
  });
  console.log('🚀 ~ addRandomIncomes ~ addRandomIncomes:6');
};
