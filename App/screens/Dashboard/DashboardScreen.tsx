import * as React from 'react';
import { FlatList, SafeAreaView, View } from 'react-native';

import Chart from '@components/Chart';
import ListEmptyScreen from '@components/ListEmptyScreen';
import PeriodSelector from '@components/PeriodSelector';
import Text from '@components/Text';
import TransactionList from '@components/TransactionList';
import { selectAllSortedTransactions } from '@store/slices/allTransactionSlice';
import VectorIcon from '@utils/VectorIcons';
import { Colors } from '@constants/Colors';
import { useSelector } from 'react-redux';

export default function DashboardScreen(props: { segment: string }) {
  const [selectedPeriod, setSelectedId] = React.useState<'Week' | 'Month' | 'Year'>('Week');
  const sortedTransactions = useSelector(selectAllSortedTransactions);
  // console.log('🚀 ~ GettingStartedScreen ~ sortedTransactions:', sortedTransactions);
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FlatList
        data={[0, 1]}
        extraData={sortedTransactions}
        ListHeaderComponent={() => {
          if (!sortedTransactions || sortedTransactions.length === 0) return <ListEmptyScreen />;
        }}
        ListEmptyComponent={ListEmptyScreen}
        renderItem={({ index }) => {
          if (index === 0) {
            if (sortedTransactions.length > 0) {
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
            } else return <ListEmptyScreen />;
          } else if (index === 1)
            return (
              <TransactionList
                data={sortedTransactions}
                type="both"
                onItemPress={() => {}}
                singleItemStyle={{
                  marginVertical: 5,
                  marginHorizontal: 20,
                }}
              />
            );
          else return <View />;
        }}
      />
    </SafeAreaView>
  );
}
