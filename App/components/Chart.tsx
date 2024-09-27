import { Circle, Group, LinearGradient, RoundedRect, Shadow, useFont, vec } from '@shopify/react-native-skia';
import * as React from 'react';
import { View } from 'react-native';
import { useDerivedValue } from 'react-native-reanimated';
import { Bar, CartesianChart, Line, useChartPressState } from 'victory-native';

import useChartData from '@hooks/useChartData';
import useChartDerivedValues from '@hooks/useChartDerivedValues';
import useDateNames from '@hooks/useDateNames';
import { Text as SKText } from '@shopify/react-native-skia';
import { SCREEN_HEIGHT } from 'App/constants/metrics';
import DateNamesDisplay from './DateNamesDisplay';

type ChartType = { selectedPeriod: any };

const Chart = ({ selectedPeriod }: ChartType) => {
  const toolTipFont = useFont(require('@assets/fonts/Inter_18pt-Black.ttf'), 14);
  const { state, isActive } = useChartPressState({
    x: 0,
    y: { listenCount: 0, specialCount: 100 },
  });

  const data = useChartData(selectedPeriod, 5); // Use the custom hook

  const dateNames = useDateNames(selectedPeriod, data);

  const value = useDerivedValue(() => {
    return '$ ' + state.y.listenCount.value.value;
  }, [state]);
  const {
    //  value,
    textXPosition,
    textYPosition,
    bgXPosition,
    bgYPosition,
    width,
    height,
    borderRadius,
  } = useChartDerivedValues(state, toolTipFont, value);

  return (
    <>
      <View
        style={{
          height: SCREEN_HEIGHT * 0.33,
        }}>
        <CartesianChart
          data={data}
          xKey={'month'}
          yKeys={['listenCount', 'specialCount']}
          domainPadding={{ left: 40, right: 40, top: 30 }}
          xAxis={{
            // font: toolTipFont,
            lineWidth: 0,
            labelPosition: 'outset',
            axisSide: 'bottom',
          }}
          yAxis={[
            {
              lineWidth: 0,
              lineColor: 'black',
            },
          ]}
          chartPressState={state}>
          {({ points, chartBounds }) => (
            <>
              <Bar
                points={points.specialCount}
                chartBounds={chartBounds}
                animate={{ type: 'spring' }}
                innerPadding={0.2}
                barCount={5}
                roundedCorners={{
                  topLeft: 5,
                  topRight: 5,
                }}>
                <LinearGradient
                  start={vec(0, 0)}
                  end={vec(0, 400)}
                  colors={[
                    'rgba(206, 168, 104, 0.2)', // Start color with 4% opacity
                    'rgba(206, 168, 104, 0.2)', // End color with 4% opacity
                  ]}
                />
              </Bar>
              <Line
                curveType="cardinal"
                points={points.listenCount}
                color="#cea868"
                strokeWidth={3}
                connectMissingData
              />
              {isActive ? (
                <Group>
                  <Circle cx={state.x.position} cy={state.y.listenCount.position} r={8} color={'grey'} opacity={0.8} />
                  <RoundedRect
                    x={bgXPosition}
                    y={bgYPosition}
                    width={width}
                    height={height}
                    r={borderRadius}
                    color="white">
                    <Shadow dx={12} dy={12} blur={25} color="#363B6414" />
                  </RoundedRect>
                  <SKText x={textXPosition} y={textYPosition} text={value} font={toolTipFont} color={'#ADAFBD'} />
                </Group>
              ) : null}
            </>
          )}
        </CartesianChart>
      </View>
      <DateNamesDisplay selectedPeriod={selectedPeriod} dateNames={dateNames} />
    </>
  );
};

export default Chart;
