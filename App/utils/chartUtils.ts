// utils/chartUtils.ts
import { TransactionItem } from '@components/TransactionList';
import { truncateToOneWord } from './truncateToOneWord';
import { additionalColors, colorList } from '@constants/Colors';

interface PieChartData {
  value: number;
}

export const generatePieChartData = (transactions: TransactionItem[]): PieChartData[] => {
  const grouped = transactions.reduce(
    (acc, income) => {
      acc[income.name] = (acc[income.name] || 0) + income.amount;
      return acc;
    },
    {} as Record<string, number>
  );

  const entries = Object.entries(grouped);

  return entries.map(([name, value], index) => {
    const truncatedName = truncateToOneWord(name);
    let color = colorList[index % colorList.length];

    if (index >= colorList.length) {
      color = additionalColors[index - colorList.length] || '#' + Math.floor(Math.random() * 16777215).toString(16);
    }

    return {
      value,
      color,
      text: truncatedName,
    };
  });
};
