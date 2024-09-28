import React from 'react';
import Text from '@components/Text';
import { View, TouchableOpacity, FlatList, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import moment from 'moment';
import { moderateScale } from 'react-native-size-matters';
import { Colors } from '@constants/Colors';

export type TransactionItem = {
  id: string;
  name: string;
  amount: number;
  date: string;
  type: 'income' | 'expense';
};

interface TransactionListProps {
  contentContainerStyle?: StyleProp<ViewStyle>;
  data: TransactionItem[];
  onItemPress: (item: TransactionItem) => void;
  type: 'income' | 'expense' | 'both';
  singleItemStyle?: StyleProp<ViewStyle>;
}

const TransactionList: React.FC<TransactionListProps> = ({
  data,
  onItemPress,
  type,
  contentContainerStyle,
  singleItemStyle,
}) => {
  const getSign = (itemType: 'income' | 'expense', amount: number) =>
    itemType === 'expense' ? `-${amount.toFixed(2)}` : `+${amount.toFixed(2)}`;

  const getAmountColor = (itemType: 'income' | 'expense') => (itemType === 'expense' ? Colors.danger : Colors.info);

  const renderTransactionItem = ({ item }: { item: TransactionItem }) => {
    const itemType = type === 'both' ? item.type : type;
    return (
      <TouchableOpacity
        onPress={() => onItemPress(item)}
        style={[
          {
            height: moderateScale(69),
            padding: 12,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: Colors.white,
            borderRadius: 5,
          },
          singleItemStyle,
        ]}>
        <View style={{ gap: 8 }}>
          <Text style={{ fontSize: 14, fontWeight: '400', color: Colors.text }}>{item.name}</Text>
          <Text style={{ color: Colors.listSubItem, fontSize: 8 }}>
            {moment(item.date, 'YYYY-MM-DD').format('DD MMMM YYYY')}
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
      contentContainerStyle={[
        {
          rowGap: 10,
        },
        contentContainerStyle,
      ]}
      renderItem={renderTransactionItem}
    />
  );
};

export default TransactionList;
