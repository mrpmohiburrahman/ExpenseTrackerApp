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
      console.log('🚀 ~ useChartData ~ useChartData:--------1', useChartData);
      const _data = getChartData(selectedPeriod, dataPoints);
      console.log('🚀 ~ useChartData ~ useChartData:--------2', useChartData);
      setData(() => _data as ChartData[]);
    };

    fetchData();
  }, [selectedPeriod, dataPoints]);

  return data;
};

export default useChartData;
