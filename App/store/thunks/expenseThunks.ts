// src/store/thunks/incomeThunks.ts
import { setBalances, setChartDataMonthly, setChartDataWeekly, setChartDataYearly } from '@store/slices/balanceSlice';
import { addExpense } from '@store/slices/expenseSlice';
import { AppDispatch } from '@store/store';
import { getBalanceByPeriod } from '@utils/balanceUtils';
import { getChartedByPeriod } from '@utils/getChartedByPeriod';
import { mergeAndSortTransactions } from '@utils/mergeAndSortTransactions';

// Thunk action to add income and merge transactions
export const addExpenseAndMerge = (name: string, date: string, amount: number) => {
  return async (dispatch: AppDispatch) => {
    dispatch(addExpense(name, date, amount));
    // After adding income, merge and sort transactions

    await mergeAndSortTransactions();
    const balances = getBalanceByPeriod();
    dispatch(setBalances(balances));
    // Compute chart data
    const chartDataWeekly = getChartedByPeriod('Week', balances, 5);
    const chartDataMonthly = getChartedByPeriod('Month', balances, 5);
    const chartDataYearly = getChartedByPeriod('Year', balances, 5);

    dispatch(setChartDataWeekly(chartDataWeekly));
    dispatch(setChartDataMonthly(chartDataMonthly));
    dispatch(setChartDataYearly(chartDataYearly));
  };
};
