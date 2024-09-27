import { Circle, Group, LinearGradient, RoundedRect, Shadow, useFont, vec } from '@shopify/react-native-skia';
import * as React from 'react';
import { SafeAreaView, View } from 'react-native';
import { useDerivedValue } from 'react-native-reanimated';
import { Bar, CartesianChart, Line, useChartPressState } from 'victory-native';

import PeriodSelector from '@components/PeriodSelector';
import Text from '@components/Text';
import { Text as SKText } from '@shopify/react-native-skia';
import { getChartData } from '@utils/chartDataUtils';
import { SCREEN_HEIGHT } from 'App/constants/metrics';

const DATA = (length: number = 10) =>
  Array.from({ length }, (_, index) => ({
    month: index + 1,
    listenCount: Math.floor(Math.random() * (100 - 50 + 1)) + 50,
    specialCount: 100,
  }));

export default function GettingStartedScreen(props: { segment: string }) {
  const period = 'monthly'; // Change this to 'weekly' or 'yearly' as needed
  const datas = getChartData(period, 5);

  console.log('🚀 ~ GettingStartedScreen ~ datas:', datas);
  const [data, setData] = React.useState(DATA(5));
  // console.log('🚀 ~ GettingStartedScreen ~ data:', data);

  const { state, isActive } = useChartPressState({
    x: 0,
    y: { listenCount: 0, specialCount: 100 },
  });

  const toolTipFont = useFont(require('@assets/fonts/Inter_18pt-Black.ttf'), 14);

  const width = 100;
  const height = 40;
  const borderRadius = 30;

  const value = useDerivedValue(() => {
    return '$ ' + state.y.listenCount.value.value;
  }, [state]);

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

  const [selectedId, setSelectedId] = React.useState<'Day' | 'Week' | 'Month' | 'Year'>('Week');

  return (
    <SafeAreaView
      style={{
        flex: 1,
        // backgroundColor: 'white',
      }}>
      <View
        style={{
          paddingHorizontal: 10,
        }}>
        <View style={{ paddingLeft: 10, paddingVertical: 20 }}>
          <Text style={{ color: '#363B64', fontSize: 24, fontWeight: '700' }}>Your Revenue</Text>
        </View>
        <PeriodSelector selectedId={selectedId} onSelect={setSelectedId} />
      </View>

      <View
        style={{
          height: SCREEN_HEIGHT * 0.33,
          borderWidth: 1,
        }}>
        <CartesianChart
          data={data}
          xKey="month"
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
              {true ? (
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
                    {/* <Shadow dx={-12} dy={-12} blur={25} color="#c7f8ff" /> */}
                  </RoundedRect>
                  <SKText x={textXPosition} y={textYPosition} text={value} font={toolTipFont} color={'#ADAFBD'} />
                </Group>
              ) : null}
            </>
          )}
        </CartesianChart>
      </View>
    </SafeAreaView>
  );
}
