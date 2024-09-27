import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { Colors } from 'App/constants/Colors';
import { clearIncomes } from '@store/slices/incomeSlice';
import { clearExpenses } from '@store/slices/expenseSlice';
import { useDispatch } from 'react-redux';
import { addRandomIncomes } from '@utils/RandomData/addRandomIncomes';
import { addRandomExpenses } from '@utils/RandomData/addRandomExpenses';

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
          addRandomIncomes();
          addRandomExpenses();
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
          // addRandomFinancials();
        }}>
        <Text>Empty The Store</Text>
      </TouchableOpacity>
    </View>
  );
};

export default GoalsScreen;
