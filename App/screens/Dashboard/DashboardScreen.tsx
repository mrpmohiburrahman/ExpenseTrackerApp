import * as React from 'react';
import { FlatList, SafeAreaView, ScrollView, TouchableOpacity, View } from 'react-native';

import Chart from '@components/Chart';
import PeriodSelector from '@components/PeriodSelector';
import Text from '@components/Text';
import { mergeAndSortTransactions } from '@utils/transactionUtils';
import TransactionList from '@components/TransactionList';
import VectorIcon from '@utils/VectorIcons';
import { Colors } from 'App/constants/Colors';
import { clearIncomes } from '@store/slices/incomeSlice';
import { clearExpenses } from '@store/slices/expenseSlice';
import ListEmptyScreen from '@components/ListEmptyScreen';

export default function GettingStartedScreen(props: { segment: string }) {
  const [selectedPeriod, setSelectedId] = React.useState<'Week' | 'Month' | 'Year'>('Week');
  const mergedData = mergeAndSortTransactions();
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FlatList
        data={mergedData}
        ListHeaderComponent={() => {
          if (!mergedData) return <View />;
          return (
            <>
              <View style={{ paddingHorizontal: 10 }}>
                <View style={{ paddingLeft: 10, paddingVertical: 20 }}>
                  <Text style={{ color: '#363B64', fontSize: 24, fontWeight: '700' }}>Your Revenue</Text>
                </View>
                <PeriodSelector selectedPeriod={selectedPeriod} onSelect={setSelectedId} />
              </View>
              <Chart selectedPeriod={selectedPeriod} />
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingHorizontal: 20,
                  paddingBottom: 10,
                  paddingTop: 20,
                }}>
                <Text style={{ fontWeight: '400', fontSize: 10, color: Colors.recentTransaction }}>
                  RECENT TRANSACTIONS
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={{ fontWeight: '400', fontSize: 10, color: Colors.seeAll }}>See All</Text>
                  <VectorIcon.SimpleLineIcons name="arrow-right" size={8} />
                </View>
              </View>
            </>
          );
        }}
        ListEmptyComponent={ListEmptyScreen}
        renderItem={({}) => {
          return (
            <TransactionList
              data={mergedData}
              type="both"
              onItemPress={() => {}}
              singleItemStyle={{
                marginVertical: 5,
                marginHorizontal: 20,
              }}
            />
          );
        }}
      />
    </SafeAreaView>
  );
}
