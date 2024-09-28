// @utils/filterUtils.ts
import moment from 'moment';
import { TransactionItem } from '@components/TransactionList';

export const filterTransactionsByMonth = (transactions: TransactionItem[], appliedMonth: string): TransactionItem[] => {
  if (appliedMonth) {
    const [year, month] = appliedMonth.split('-').map(Number);
    return transactions
      .filter(transaction => {
        const transactionDate = moment(transaction.date, 'YYYY-MM-DD');
        return transactionDate.year() === year && transactionDate.month() + 1 === month;
      })
      .reverse();
  } else {
    return transactions.reverse();
  }
};
