import { View, TouchableOpacity } from 'react-native';
import React from 'react';
import { clearIncomes } from '@store/slices/incomeSlice';
import { clearExpenses } from '@store/slices/expenseSlice';
import { addRandomIncomes } from '@utils/RandomData/addRandomIncomes';
import { addRandomExpenses } from '@utils/RandomData/addRandomExpenses';
import { useDispatch } from 'react-redux';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from 'App/constants/metrics';
import { Colors } from 'App/constants/Colors';
import Text from './Text';

const ListEmptyScreen = () => {
  const dispatch = useDispatch();
  return (
    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        // borderWidth: 1,
        borderColor: 'red',
        height: SCREEN_HEIGHT,
        width: SCREEN_WIDTH,
      }}>
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
          addRandomIncomes();
          addRandomExpenses();
          // addRandomFinancials();
        }}>
        <Text>Press here to populate with data</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ListEmptyScreen;
