import React from 'react';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import BottomTabNavigator from './BottomTabNavigator';
import VectorIcon from '@utils/VectorIcons';

const Drawer = createDrawerNavigator();

const CustomDrawerContent = (props: any) => {
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItem
        label="Dashboard"
        onPress={() => props.navigation.navigate('Dashboard')}
        icon={({ color, size }) => (
          <VectorIcon.MaterialCommunityIcons name={'view-dashboard'} size={size} color={color} />
        )}
      />
      <DrawerItem
        label="Income"
        onPress={() => props.navigation.navigate('Income')}
        icon={({ color, size }) => <VectorIcon.Ionicons name={'wallet-outline'} size={size} color={color} />}
      />
      <DrawerItem
        label="Expense"
        onPress={() => props.navigation.navigate('Expense')}
        icon={({ color, size }) => (
          <VectorIcon.MaterialCommunityIcons name={'chart-areaspline'} size={size} color={color} />
        )}
      />
      <DrawerItem
        label="Goals"
        onPress={() => props.navigation.navigate('Goals')}
        icon={({ color, size }) => (
          <VectorIcon.MaterialCommunityIcons name={'bullseye-arrow'} size={size} color={color} />
        )}
      />
      <DrawerItem
        label="Logout"
        onPress={() => props.navigation.navigate('Logout')}
        icon={({ color, size }) => <VectorIcon.Ionicons name="log-out-outline" size={size} color={color} />}
      />
    </DrawerContentScrollView>
  );
};

const DrawerNavigator: React.FC = () => {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerPosition: 'right',
      }}
      drawerContent={props => <CustomDrawerContent {...props} />}>
      <Drawer.Screen name="Home" component={BottomTabNavigator} />
      {/* Additional Drawer Screens (if needed) can be added here */}
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
