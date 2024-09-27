import { Circle, LinearGradient, useFont, vec } from '@shopify/react-native-skia';
import * as React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { useDerivedValue, type SharedValue } from 'react-native-reanimated';
import { Bar, CartesianChart, Line, useChartPressState } from 'victory-native';

import { Text as SKText } from '@shopify/react-native-skia';
export default function GettingStartedScreen(props: { segment: string }) {
  const { state, isActive } = useChartPressState({ x: 0, y: { highTmp: 0 } });

  const toolTipFont = useFont(require('@assets/fonts/Inter_18pt-Black.ttf'), 24);

  const value = useDerivedValue(() => {
    return '$' + state.y.highTmp.value.value;
  }, [state]);
  const textXPosition = useDerivedValue(() => {
    if (!toolTipFont) {
      return 0;
    }
    return state.x.position.value - toolTipFont.measureText(value.value).width / 2;
  }, [value, toolTipFont]);
  const textYPosition = useDerivedValue(() => {
    return state.y.highTmp.position.value - 15;
  }, [value]);
  return (
    <SafeAreaView style={styles.safeView}>
      <View style={{ flex: 1, maxHeight: 400, padding: 32 }}>
        <CartesianChart
          data={DATA}
          xKey="day"
          yKeys={['highTmp']}
          domainPadding={{ left: 30, right: 30 }}
          xAxis={{
            formatXLabel: value => {
              return `${value}`;
            },
            lineWidth: 0,
          }}
          yAxis={[{ lineWidth: 0 }]}
          chartPressState={state}>
          {({ points, chartBounds }) => (
            <>
              <Bar
                points={points.highTmp}
                chartBounds={chartBounds}
                animate={{ type: 'spring' }}
                innerPadding={0.33}
                roundedCorners={{
                  topLeft: 5,
                  topRight: 5,
                }}>
                <LinearGradient start={vec(0, 0)} end={vec(0, 400)} colors={['#efe9de', '#efe9de']} />
              </Bar>
              <Line curveType="cardinal" points={points.highTmp} color="#cea868" strokeWidth={3} connectMissingData />
              {/* {isActive && <ToolTip x={state.x.position} y={state.y.highTmp.position} />} */}
              {isActive ? (
                <>
                  <SKText font={toolTipFont} color={'black'} x={textXPosition} y={textYPosition} text={value} />
                  <Circle cx={state.x.position} cy={state.y.highTmp.position} r={8} color={'grey'} opacity={0.8} />
                </>
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

const DATA = Array.from({ length: 5 }, (_, i) => ({
  day: i,
  highTmp: 5 + 30 * Math.random(),
}));

const styles = StyleSheet.create({
  safeView: {
    flex: 1,
    backgroundColor: 'white',
  },
});
