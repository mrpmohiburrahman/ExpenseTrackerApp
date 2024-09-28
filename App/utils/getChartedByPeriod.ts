// src/utils/chartUtils.ts

import { Balances } from '@store/slices/balanceSlice';

export interface ChartData {
  period: number | string;
  listenCount: number;
  specialCount: number;
}

export const getChartedByPeriod = (
  period: 'Week' | 'Month' | 'Year',
  balances: Balances,
  length: number = 5
): ChartData[] => {
  let data: ChartData[] = [];

  if (period === 'Month') {
    const monthlyBalances = balances.monthly;
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();

    data = Array.from({ length }, (_, index) => {
      const monthIndex = currentMonth - index;
      const yearAdjustment = monthIndex < 1 ? Math.floor((monthIndex - 1) / 12) : 0;
      const adjustedMonth = ((monthIndex - 1) % 12) + 1;
      const monthKey = `${currentYear + yearAdjustment}-${adjustedMonth}`;

      return {
        period: adjustedMonth,
        listenCount: monthlyBalances[monthKey] || 0,
        specialCount: Math.max(...Object.values(monthlyBalances)) || 0,
      };
    }).reverse();
  } else if (period === 'Week') {
    const weeklyBalances = balances.weekly;
    const currentDate = new Date();
    const currentWeek = getWeekNumber(currentDate);

    data = Array.from({ length }, (_, index) => {
      const weekIndex = currentWeek - index;
      const adjustedWeek = weekIndex < 1 ? weekIndex + 52 : weekIndex;
      const yearAdjustment = weekIndex < 1 ? Math.floor((weekIndex - 1) / 52) : 0;
      const weekKey = `${currentDate.getFullYear() + yearAdjustment}-W${adjustedWeek}`;

      return {
        period: weekKey,
        listenCount: weeklyBalances[weekKey] || 0,
        specialCount: Math.max(...Object.values(weeklyBalances)) || 0,
      };
    }).reverse();
  } else if (period === 'Year') {
    const yearlyBalances = balances.yearly;
    const currentYear = new Date().getFullYear();

    data = Array.from({ length }, (_, index) => {
      const yearKey = `${currentYear - index}`;
      return {
        period: yearKey,
        listenCount: yearlyBalances[yearKey] || 0,
        specialCount: Math.max(...Object.values(yearlyBalances)) || 0,
      };
    }).reverse();
  }

  return data;
};

// Helper function to get the week number
const getWeekNumber = (date: Date): number => {
  const firstDate = new Date(date.getFullYear(), 0, 1);
  const days = Math.floor((date.valueOf() - firstDate.valueOf()) / (1000 * 60 * 60 * 24));
  return Math.ceil((days + firstDate.getDay() + 1) / 7);
};
