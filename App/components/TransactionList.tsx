import React from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import moment from 'moment';
import { moderateScale } from 'react-native-size-matters';
import { Colors } from 'App/constants/Colors';

interface TransactionItem {
  id: string;
  name: string;
  amount: number;
  date: string;
}

interface TransactionListProps {
  data: TransactionItem[];
  onItemPress: (item: TransactionItem) => void;
  type: 'income' | 'expense';
}

const TransactionList: React.FC<TransactionListProps> = ({ data, onItemPress, type }) => {
  const getSign = (amount: number) => (type === 'expense' ? `-${amount.toFixed(2)}` : `+${amount.toFixed(2)}`);
  const getAmountColor = () => (type === 'expense' ? Colors.danger : Colors.info);

  return (
    <FlatList
      data={data}
      keyExtractor={item => item.id}
      contentContainerStyle={{
        rowGap: 10,
      }}
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={() => onItemPress(item)}
          style={{
            height: moderateScale(69),
            borderColor: 'red',
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
          <Text style={{ color: getAmountColor(), fontWeight: '700' }}>{getSign(item.amount)}</Text>
        </TouchableOpacity>
      )}
    />
  );
};

export default TransactionList;
