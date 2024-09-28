// src/store/thunks/incomeThunks.ts
import { AppDispatch, RootState } from '@store/store';
import { addIncome } from '@store/slices/incomeSlice';
import { mergeAndSortTransactions } from '@utils/mergeAndSortTransactions';
import { getBalanceByPeriod } from '@utils/balanceUtils';
import { setBalances, setChartDataMonthly, setChartDataWeekly, setChartDataYearly } from '@store/slices/balanceSlice';
import { getChartedByPeriod } from '@utils/getChartedByPeriod';

// Thunk action to add income and merge transactions
export const addIncomeAndMerge = (name: string, date: string, amount: number) => {
  return async (dispatch: AppDispatch) => {
    dispatch(addIncome(name, date, amount));
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
