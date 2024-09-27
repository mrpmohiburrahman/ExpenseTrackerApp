import { getBalanceByPeriod } from './balanceUtils';

interface ChartData {
  month: number | string;
  listenCount: number;
  specialCount: number;
}

export const getChartData = (period: 'Week' | 'Month' | 'Year', length: number = 5): ChartData[] => {
  const balances = getBalanceByPeriod();
  //   console.log('🚀 ~ getChartData ~ balances:', balances);
  let data: ChartData[] = [];

  if (period === 'Month') {
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
  } else if (period === 'Week') {
    const weeklyBalances = balances.weekly;
    const currentDate = new Date();
    const currentWeek = getWeekNumber(currentDate);

    data = Array.from({ length }, (_, index) => {
      const weekIndex = currentWeek - index;
      const weekStartDate = getStartDateOfWeek(currentDate.getFullYear(), weekIndex);
      const weekEndDate = new Date(weekStartDate);
      weekEndDate.setDate(weekEndDate.getDate() + 6); // End date is 6 days after start date

      const formatedWeekKey = `${formatDate(weekStartDate)}-${formatDate(weekEndDate)}`;

      const weekKey = `${currentDate.getFullYear()}-W${weekIndex < 1 ? weekIndex + 52 : weekIndex}`;
      return {
        month: formatedWeekKey,
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

// Helper function to get the start date of a week
const getStartDateOfWeek = (year: number, week: number): Date => {
  const firstDate = new Date(year, 0, 1);
  const days = (week - 1) * 7 - firstDate.getDay() + 1; // Adjust for week start
  const startDate = new Date(firstDate.setDate(firstDate.getDate() + days));
  return startDate;
};

// Helper function to format dates as "dd-mm-yyyy"
const formatDate = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear()).slice(-2);
  return `${day}/${month}`;
  //   return `${day}/${month}/${year}`;
};
