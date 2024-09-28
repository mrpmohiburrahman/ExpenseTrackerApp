// src/store/slices/balanceSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@store/store';

interface BalanceState {
  balances: Balances;
  chartDataWeekly: ChartData[];
  chartDataMonthly: ChartData[];
  chartDataYearly: ChartData[];
}
export interface Balances {
  weekly: Record<string, number>;
  monthly: Record<string, number>;
  yearly: Record<string, number>;
}
export interface ChartData {
    period: number | string;
    listenCount: number;
    specialCount: number;
  }
const initialState: BalanceState = {
  balances: {
    weekly: {},
    monthly: {},
    yearly: {},
  },
  chartDataWeekly: [],
  chartDataMonthly: [],
  chartDataYearly: [],
};

const balanceSlice = createSlice({
  name: 'balance',
  initialState,
  reducers: {
    setBalances(state, action: PayloadAction<Balances>) {
      state.balances = action.payload;
    },
    setChartDataWeekly(state, action: PayloadAction<ChartData[]>) {
      state.chartDataWeekly = action.payload;
    },
    setChartDataMonthly(state, action: PayloadAction<ChartData[]>) {
      state.chartDataMonthly = action.payload;
    },
    setChartDataYearly(state, action: PayloadAction<ChartData[]>) {
      state.chartDataYearly = action.payload;
    },
  },
});

export const { setBalances, setChartDataWeekly, setChartDataMonthly, setChartDataYearly } = balanceSlice.actions;

export default balanceSlice.reducer;

// Selectors
export const selectBalances = (state: RootState) => state.balance.balances;
export const selectChartDataWeekly = (state: RootState) => state.balance.chartDataWeekly;
export const selectChartDataMonthly = (state: RootState) => state.balance.chartDataMonthly;
export const selectChartDataYearly = (state: RootState) => state.balance.chartDataYearly;
