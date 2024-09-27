import { Circle, Group, LinearGradient, RoundedRect, Shadow, useFont, vec } from '@shopify/react-native-skia';
import * as React from 'react';
import { SafeAreaView, View } from 'react-native';
import { runOnUI, useDerivedValue } from 'react-native-reanimated';
import { Bar, CartesianChart, Line, useChartPressState } from 'victory-native';

import PeriodSelector from '@components/PeriodSelector';
import Text from '@components/Text';
import { Text as SKText } from '@shopify/react-native-skia';
import { getChartData } from '@utils/chartDataUtils';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from 'App/constants/metrics';
import { Colors } from 'App/constants/Colors';

const DATA = (length: number = 10) =>
  Array.from({ length }, (_, index) => ({
    month: index + 1,
    listenCount: Math.floor(Math.random() * (100 - 50 + 1)) + 50,
    specialCount: 100,
  }));

export default function GettingStartedScreen(props: { segment: string }) {
  // const [data, setData] = React.useState(DATA(5));
  // console.log('🚀 ~ GettingStartedScreen ~ data:', data);

  const { state, isActive } = useChartPressState({
    x: 0,
    y: { listenCount: 0, specialCount: 100 },
  });

  const toolTipFont = useFont(require('@assets/fonts/Inter_18pt-Black.ttf'), 14);

  const width = 100;
  const height = 40;
  const borderRadius = 30;
  runOnUI(state => {
    console.log(`${JSON.stringify(state.y.listenCount.value.value)}`);
  })(state);
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

  const [selectedPeriod, setSelectedId] = React.useState<'Week' | 'Month' | 'Year'>('Week');

  const datas = getChartData(selectedPeriod, 5);
  const [data, setData] = React.useState(datas);
  React.useEffect(() => {
    const datas = getChartData(selectedPeriod, 5);

    setData(() => datas);
  }, [selectedPeriod]);

  // console.log(`🚀 ~ GettingStartedScreen ~ datas for ${selectedPeriod}:`, datas);

  const [dateNames, setDateNames] = React.useState<string[]>([]);

  React.useEffect(() => {
    const currentDate = new Date();
    if (selectedPeriod === 'Week') {
      console.log('data === ', JSON.stringify(data));

      setDateNames(() => data.map(item => item.month));
    } else if (selectedPeriod === 'Month') {
      const monthNames = Array.from({ length: 5 }, (_, index) => {
        const month = new Date(currentDate.getFullYear(), currentDate.getMonth() - index);
        return month.toLocaleDateString('en-US', { month: 'long' });
      }).reverse();
      setDateNames(monthNames);
    } else if (selectedPeriod === 'Year') {
      setDateNames([currentDate.getFullYear().toString()]);
    }
  }, [selectedPeriod]);
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
        <PeriodSelector selectedPeriod={selectedPeriod} onSelect={setSelectedId} />
      </View>

      <View
        style={{
          height: SCREEN_HEIGHT * 0.33,
          // borderWidth: 1,
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
                    {/* <Shadow dx={-12} dy={-12} blur={25} color="#c7f8ff" /> */}
                  </RoundedRect>
                  <SKText x={textXPosition} y={textYPosition} text={value} font={toolTipFont} color={'#ADAFBD'} />
                </Group>
              ) : null}
            </>
          )}
        </CartesianChart>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        {selectedPeriod === 'Month' &&
          dateNames &&
          dateNames.map(item => (
            <View key={item} style={{ borderWidth: 0, width: SCREEN_WIDTH / 5, alignItems: 'center' }}>
              <Text style={{ fontWeight: '400', fontSize: 18, color: Colors.tab }}>{item?.slice(0, 3)}</Text>
            </View>
          ))}
        {selectedPeriod === 'Year' &&
          dateNames.map(item => (
            <View key={item} style={{ borderWidth: 0, width: SCREEN_WIDTH / 5, alignItems: 'center' }}>
              <Text style={{ fontWeight: '400', fontSize: 18, color: Colors.tab }}>{item}</Text>
            </View>
          ))}
        {selectedPeriod === 'Week' &&
          dateNames &&
          dateNames.map(item => (
            <View
              key={item}
              style={{
                borderWidth: 0,
                width: SCREEN_WIDTH / 5,
                alignItems: 'center',
                transform: [{ rotate: '0deg' }],
              }}>
              <Text style={{ fontWeight: '400', fontSize: 12, color: Colors.tab }}>{item}</Text>
            </View>
          ))}
      </View>
    </SafeAreaView>
  );
}
