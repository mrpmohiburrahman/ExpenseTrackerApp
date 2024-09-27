import { BlurMask, Circle, Group, LinearGradient, RoundedRect, Shadow, useFont, vec } from '@shopify/react-native-skia';
import * as React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { useDerivedValue, type SharedValue } from 'react-native-reanimated';
import { Bar, CartesianChart, Line, useChartPressState } from 'victory-native';

import { Text as SKText } from '@shopify/react-native-skia';
import { SCREEN_WIDTH } from 'App/constants/metrics';

// const DATA = Array.from({ length: 5 }, (_, i) => ({
//   day: i,
//   highTmp: 5 + 30 * Math.random(),
// }));
const DATA = (length: number = 10) =>
  Array.from({ length }, (_, index) => ({
    month: index + 1,
    listenCount: Math.floor(Math.random() * (100 - 50 + 1)) + 50,
    specialCount: 100,
  }));
export default function GettingStartedScreen(props: { segment: string }) {
  const [data, setData] = React.useState(DATA(5));
  console.log('🚀 ~ GettingStartedScreen ~ data:', data);

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

  return (
    <SafeAreaView style={styles.safeView}>
      <View
        style={{
          flex: 1,
          maxHeight: 400,
          padding: 32,
          borderWidth: 1,
        }}>
        <CartesianChart
          data={data}
          xKey="month"
          yKeys={['listenCount', 'specialCount']}
          domainPadding={{ left: 30, right: 30, top: 60 }}
          // axisOptions={{
          //   font: toolTipFont,
          //   formatXLabel: value => {
          //     return `${value}`;
          //   },
          //   formatYLabel: value => {
          //     return `${value}`;
          //   },

          //   lineWidth: {
          //     grid: {
          //       x: 0,
          //       y: 0,
          //     },
          //     frame: 0,
          //   },

          //   // labelColor: 'black',
          // }}
          // frame={{
          //   lineColor: 'transparent',
          //   lineWidth: 0,
          // }}

          xAxis={{
            font: toolTipFont,
            formatXLabel: value => {
              return `${value}`;
            },
            lineWidth: 0,
            // labelOffset: -10,
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
                // labels={{ position: 'bottom', font: toolTipFont, color: 'black' }}
                // labels={({ datum }) => `${datum.listenCount}`} // Add this line for labels

                roundedCorners={{
                  topLeft: 5,
                  topRight: 5,
                }}>
                <LinearGradient start={vec(0, 0)} end={vec(0, 400)} colors={['#f3f2ec', '#f3f2ec']} />
              </Bar>
              <Line
                curveType="cardinal"
                points={points.listenCount}
                color="#cea868"
                strokeWidth={3}
                connectMissingData
              />
              {/* {isActive && <ToolTip x={state.x.position} y={state.y.highTmp.position} />} */}
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

function ToolTip({ x, y }: { x: SharedValue<number>; y: SharedValue<number> }) {
  return <Circle cx={x} cy={y} r={8} color="black" />;
}

const styles = StyleSheet.create({
  safeView: {
    flex: 1,
    backgroundColor: 'white',
  },
});
