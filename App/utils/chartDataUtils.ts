import { getBalanceByPeriod } from './balanceUtils';

interface ChartData {
  month: number | string;
  listenCount: number;
  specialCount: number;
}

export const getChartData = (period: 'weekly' | 'monthly' | 'yearly', length: number = 5): ChartData[] => {
  const balances = getBalanceByPeriod();
  let data: ChartData[] = [];

  if (period === 'monthly') {
    const monthlyBalances = balances.monthly;
    const currentMonth = new Date().getMonth() + 1;

    data = Array.from({ length }, (_, index) => {
      const monthIndex = currentMonth - index;
      const monthKey = `${new Date().getFullYear()}-${monthIndex < 1 ? monthIndex + 12 : monthIndex}`;

      return {
        month: monthIndex < 1 ? monthIndex + 12 : monthIndex,
        listenCount: monthlyBalances[monthKey] || 0,
        specialCount: Math.max(...Object.values(monthlyBalances)) || 0,
      };
    }).reverse();
  } else if (period === 'weekly') {
    const weeklyBalances = balances.weekly;
    const currentDate = new Date();
    const currentWeek = getWeekNumber(currentDate);

    data = Array.from({ length }, (_, index) => {
      const weekIndex = currentWeek - index;
      const weekKey = `${currentDate.getFullYear()}-W${weekIndex < 1 ? weekIndex + 52 : weekIndex}`;

      return {
        month: weekKey,
        listenCount: weeklyBalances[weekKey] || 0,
        specialCount: Math.max(...Object.values(weeklyBalances)) || 0,
      };
    }).reverse();
  } else if (period === 'yearly') {
    const yearlyBalances = balances.yearly;
    const currentYear = new Date().getFullYear();

    data = Array.from({ length }, (_, index) => {
      const yearKey = `${currentYear - index}`;

      return {
        month: yearKey,
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
