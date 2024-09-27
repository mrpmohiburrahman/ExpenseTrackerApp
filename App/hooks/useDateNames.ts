import { useMemo } from 'react';

/**
 * Custom hook to generate date names based on the selected period and data.
 *
 * @param selectedPeriod - The period selected by the user ('Week', 'Month', 'Year').
 * @param data - The chart data array.
 * @returns An array of formatted date names.
 */
const useDateNames = (selectedPeriod: string, data: any[]): string[] => {
  const dateNames = useMemo(() => {
    const currentDate = new Date();

    switch (selectedPeriod) {
      case 'Week':
        // Assuming each data item has a 'month' property representing the day name.
        return data.map(item => item.month);

      case 'Month':
        // Generate the last 5 months' names.
        const monthNames = Array.from({ length: 5 }, (_, index) => {
          const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - index, 1);
          return date.toLocaleDateString('en-US', { month: 'long' });
        }).reverse();
        return monthNames;

      case 'Year':
        // Display the current year.
        return [currentDate.getFullYear().toString()];

      default:
        return [];
    }
  }, [selectedPeriod, data]);

  return dateNames;
};

export default useDateNames;
