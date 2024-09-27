// utils/validationUtils.ts
import moment from 'moment';
export const validateTransactionInput = (name: string, date: string, amount: string): string | null => {
  if (!name || !date || !amount) {
    return 'Please fill all fields.';
  }

  if (!moment(date, 'YYYY-MM-DD', true).isValid()) {
    return 'Date must be in YYYY-MM-DD format.';
  }

  const amountNumber = parseFloat(amount);
  if (isNaN(amountNumber) || amountNumber <= 0) {
    return 'Please enter a valid amount.';
  }

  return null;
};
