import Text from '@components/Text';
import { clearAllSortedTransactions } from '@store/slices/allTransactionSlice';
import { clearExpenses } from '@store/slices/expenseSlice';
import { clearIncomes } from '@store/slices/incomeSlice';
import { mergeAndSortTransactions } from '@utils/mergeAndSortTransactions';
import { addRandomExpenses } from '@utils/RandomData/addRandomExpenses';
import { addRandomIncomes } from '@utils/RandomData/addRandomIncomes';
import { Colors } from '@constants/Colors';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useDispatch } from 'react-redux';

const GoalsScreen = () => {
  const dispatch = useDispatch();
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <TouchableOpacity
        style={{
          borderWidth: 1,
          borderColor: Colors.placeholder,
          paddingHorizontal: 20,
          paddingVertical: 10,
          borderRadius: 10,
        }}
        onPress={() => {
          dispatch(clearIncomes());
          dispatch(clearExpenses());
          dispatch(clearAllSortedTransactions());
          addRandomIncomes();
          addRandomExpenses();
          mergeAndSortTransactions();

          // addRandomFinancials();
        }}>
        <Text>Press here to populate with data</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          borderWidth: 1,
          borderColor: Colors.placeholder,
          paddingHorizontal: 20,
          paddingVertical: 10,
          borderRadius: 10,
        }}
        onPress={() => {
          dispatch(clearIncomes());
          dispatch(clearExpenses());
          dispatch(clearAllSortedTransactions());
          // addRandomFinancials();
        }}>
        <Text>Empty The Store</Text>
      </TouchableOpacity>
    </View>
  );
};

export default GoalsScreen;
