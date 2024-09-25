


import React from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';


type RootStackParamList = {
  AddIncome: undefined;
  AddExpense: undefined;
  
};

type AddItemButtonsNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'AddIncome' | 'AddExpense'
>;

const AddItemButtons: React.FC = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation<AddItemButtonsNavigationProp>();

  const handleAddIncome = () => {
    
    navigation.navigate('AddIncome');
  };

  const handleAddExpense = () => {
    
    navigation.navigate('AddExpense');
  };

  return (
    <View style={styles.container}>
      <Button title="Add Income" onPress={handleAddIncome} />
      <Button title="Add Expense" onPress={handleAddExpense} />
    </View>
  );
};

export default AddItemButtons;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
});