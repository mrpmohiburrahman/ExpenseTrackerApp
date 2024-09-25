import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { Colors } from 'App/constants/Colors';
import TransactionList, { TransactionItem } from '@components/TransactionList';
import { mergeAndSortTransactions } from '@utils/transactionUtils';

const DashboardScreen: React.FC = () => {
  const [transactions, setTransactions] = useState<TransactionItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        const mergedTransactions = mergeAndSortTransactions();
        setTransactions(mergedTransactions);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTransactions();
  }, []);

  const handleItemPress = (item: TransactionItem) => {
    console.log('Transaction pressed:', item);
  };

  return (
    <View style={{ flex: 1, paddingHorizontal: 20 }}>
      {loading ? (
        <ActivityIndicator size="large" color={Colors.primary} />
      ) : (
        <TransactionList data={transactions} onItemPress={handleItemPress} type="both" />
      )}
    </View>
  );
};

export default DashboardScreen;
