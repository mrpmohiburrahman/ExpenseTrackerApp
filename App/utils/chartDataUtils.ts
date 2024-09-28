import { store } from '@store/store';
import { getBalanceByPeriod } from './balanceUtils';

interface ChartData {
  month: number | string;
  listenCount: number;
  specialCount: number;
}

export const getChartData = (period: 'Week' | 'Month' | 'Year', length: number = 5): ChartData[] => {
  let data: ChartData[] = [];

  if (period === 'Month') {
    const { chartDataMonthly } = store.getState().balance;
    return chartDataMonthly;
  } else if (period === 'Week') {
    const { chartDataWeekly } = store.getState().balance;
    return chartDataWeekly;
  } else if (period === 'Year') {
    const { chartDataYearly } = store.getState().balance;
    return chartDataYearly;
  }

  return data;
};

const getWeekNumber = (date: Date): number => {
  const firstDate = new Date(date.getFullYear(), 0, 1);
  const days = Math.floor((date.valueOf() - firstDate.valueOf()) / (1000 * 60 * 60 * 24));
  return Math.ceil((days + firstDate.getDay() + 1) / 7);
};

const getStartDateOfWeek = (year: number, week: number): Date => {
  const firstDate = new Date(year, 0, 1);
  const days = (week - 1) * 7 - firstDate.getDay() + 1;
  const startDate = new Date(firstDate.setDate(firstDate.getDate() + days));
  return startDate;
};

const formatDate = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear()).slice(-2);
  return `${day}/${month}`;
};
