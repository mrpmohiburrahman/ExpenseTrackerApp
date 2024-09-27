// src/utils/balanceUtils.ts

import { AllSortedTransactionsItem } from '@store/slices/allTransactionSlice';
import { store } from '@store/store';

interface Balances {
  weekly: Record<string, number>;
  monthly: Record<string, number>;
  yearly: Record<string, number>;
}

export const getBalanceByPeriod = (): Balances => {
  const transactions: AllSortedTransactionsItem[] = store.getState().allTransaction.allSortedTransactions;
  const balances: Balances = {
    weekly: {},
    monthly: {},
    yearly: {},
  };

  transactions.forEach(transaction => {
    const date = new Date(transaction.date);
    const week = `${date.getFullYear()}-W${getWeekNumber(date)}`;
    const month = `${date.getFullYear()}-${date.getMonth() + 1}`;
    const year = `${date.getFullYear()}`;

    // Initialize balances for each period if not already done
    if (!balances.weekly[week]) balances.weekly[week] = 0;
    if (!balances.monthly[month]) balances.monthly[month] = 0;
    if (!balances.yearly[year]) balances.yearly[year] = 0;

    // Update the balances
    const amount = transaction.type === 'income' ? transaction.amount : -transaction.amount;
    balances.weekly[week] += amount;
    balances.monthly[month] += amount;
    balances.yearly[year] += amount;
  });

  return balances;
};

// Helper function to get the week number
const getWeekNumber = (date: Date): number => {
  const firstDate = new Date(date.getFullYear(), 0, 1);
  const days = Math.floor((date.valueOf() - firstDate.valueOf()) / (1000 * 60 * 60 * 24));
  return Math.ceil((days + firstDate.getDay() + 1) / 7);
};
