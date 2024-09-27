// useChartDerivedValues.ts
import { useDerivedValue } from 'react-native-reanimated';
import { SkFont } from '@shopify/react-native-skia';
import { ChartPressState } from 'victory-native';

interface StateType {
  x: {
    position: {
      value: number;
    };
  };
  y: {
    listenCount: {
      value: {
        value: number;
      };
      position: number;
    };
    specialCount: any; // Adjust this type based on your actual data structure
  };
}

interface DerivedValues {
  value: string;
  textXPosition: number;
  textYPosition: number;
  bgXPosition: number;
  bgYPosition: number;
  width: number;
  height: number;
  borderRadius: number;
}

const width = 100;
const height = 40;
const BORDER_RADIUS = 30;

const useChartDerivedValues = (
  state: ChartPressState<{
    x: number;
    y: {
      listenCount: number;
      specialCount: number;
    };
  }>,
  toolTipFont: SkFont | null,
  value: any
): DerivedValues => {
  const textXPosition = useDerivedValue(() => {
    if (!toolTipFont) {
      return 0;
    }
    return state.x.position.value - toolTipFont.measureText(value.value).width / 2;
  }, [value, toolTipFont]);

  const textYPosition = useDerivedValue(() => {
    return state.y.listenCount.position.value - height * 0.8;
  }, [value]);

  const bgXPosition = useDerivedValue(() => {
    if (!toolTipFont) {
      return 0;
    }
    return state.x.position.value - width / 2;
  }, [value, toolTipFont]);

  const bgYPosition = useDerivedValue(() => {
    return state.y.listenCount.position.value - height * 1.5;
  }, [value]);

  return {
    textXPosition,
    textYPosition,
    bgXPosition,
    bgYPosition,
    width,
    height,
    borderRadius: BORDER_RADIUS,
  };
};

export default useChartDerivedValues;
