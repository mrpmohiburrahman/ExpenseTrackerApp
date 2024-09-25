import React from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import moment from 'moment';
import { moderateScale } from 'react-native-size-matters';
import { Colors } from 'App/constants/Colors';

export type TransactionItem = {
  id: string;
  name: string;
  amount: number;
  date: string;
  type: 'income' | 'expense'; // Added type to each transaction item
};

interface TransactionListProps {
  data: TransactionItem[];
  onItemPress: (item: TransactionItem) => void;
  type: 'income' | 'expense' | 'both'; // Updated to support 'both'
}

const TransactionList: React.FC<TransactionListProps> = ({ data, onItemPress, type }) => {
  const getSign = (itemType: 'income' | 'expense', amount: number) =>
    itemType === 'expense' ? `-${amount.toFixed(2)}` : `+${amount.toFixed(2)}`;

  const getAmountColor = (itemType: 'income' | 'expense') => (itemType === 'expense' ? Colors.danger : Colors.info);

  const renderTransactionItem = ({ item }: { item: TransactionItem }) => {
    // Determine sign and color based on item's type (income or expense)
    const itemType = type === 'both' ? item.type : type;
    return (
      <TouchableOpacity
        onPress={() => onItemPress(item)}
        style={{
          height: moderateScale(69),
          padding: 12,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: Colors.white,
          borderRadius: 5,
        }}>
        <View style={{ gap: 8 }}>
          <Text style={{ fontSize: 14, fontWeight: '400' }}>{item.name}</Text>
          <Text style={{ color: Colors.listSubItem, fontSize: 8 }}>
            {moment(item.date, 'YYYY-MM').format('D MMMM YYYY')}
          </Text>
        </View>
        <Text style={{ color: getAmountColor(itemType), fontWeight: '700' }}>{getSign(itemType, item.amount)}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      data={data}
      keyExtractor={item => item.id}
      contentContainerStyle={{
        rowGap: 10,
      }}
      renderItem={renderTransactionItem}
    />
  );
};

export default TransactionList;
