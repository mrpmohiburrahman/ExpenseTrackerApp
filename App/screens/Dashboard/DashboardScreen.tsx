import * as React from 'react';
import { SafeAreaView, View } from 'react-native';

import Chart from '@components/Chart';
import PeriodSelector from '@components/PeriodSelector';
import Text from '@components/Text';

export default function GettingStartedScreen(props: { segment: string }) {
  const [selectedPeriod, setSelectedId] = React.useState<'Week' | 'Month' | 'Year'>('Week');

  return (
    <SafeAreaView
      style={{
        flex: 1,
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
      <Chart selectedPeriod={selectedPeriod} />
    </SafeAreaView>
  );
}
