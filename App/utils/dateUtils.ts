// utils/dateUtils.ts
import moment from 'moment';
export const generateLast12Months = (): string[] => {
  const months = [];
  const current = moment();
  for (let i = 0; i < 12; i++) {
    months.push(current.clone().subtract(i, 'months').format('YYYY-MM'));
  }
  return months;
};
