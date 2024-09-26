import { Circle, LinearGradient, vec } from '@shopify/react-native-skia';
import * as React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import type { SharedValue } from 'react-native-reanimated';
import { Bar, CartesianChart, Line, useChartPressState } from 'victory-native';

export default function GettingStartedScreen(props: { segment: string }) {
  const { state, isActive } = useChartPressState({ x: 0, y: { highTmp: 0 } });

  return (
    <SafeAreaView style={styles.safeView}>
      <View style={{ flex: 1, maxHeight: 400, padding: 32 }}>
        <CartesianChart
          data={DATA}
          xKey="day"
          yKeys={['highTmp']}
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
              {isActive && <ToolTip x={state.x.position} y={state.y.highTmp.position} />}
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
