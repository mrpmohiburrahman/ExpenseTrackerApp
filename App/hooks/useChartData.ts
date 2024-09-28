// useChartData.ts
import { useState, useEffect } from 'react';
import { getChartData } from '@utils/chartDataUtils';

type ChartData = {
  month: string;
  listenCount: number;
  specialCount: number;
};

const useChartData = (selectedPeriod: any, dataPoints: number = 5): ChartData[] => {
  const [data, setData] = useState<ChartData[]>([]);

  useEffect(() => {
    const fetchData = () => {
      const _data = getChartData(selectedPeriod, dataPoints);
      setData(() => _data as ChartData[]);
    };

    fetchData();
  }, [selectedPeriod, dataPoints]);

  return data;
};

export default useChartData;
