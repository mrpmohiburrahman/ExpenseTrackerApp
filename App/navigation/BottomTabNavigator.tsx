// App/navigation/BottomTabNavigator.tsx

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import VectorIcon from '@utils/VectorIcons'; // Adjust the path as needed
import DashboardScreen from '@screens/Dashboard/DashboardScreen';
import IncomeListScreen from '@screens/Income/IncomeListScreen';
import ExpenseListScreen from '@screens/Expense/ExpenseListScreen';
import GoalsScreen from '@screens/Goals/GoalsScreen';
import LogoutScreen from '@screens/Logout/LogoutScreen';
import ProfileButton from '@components/ProfileButton'; // The custom header button

const Tab = createBottomTabNavigator();

const BottomTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerTitle: getHeaderTitle(route.name),
        headerRight: () => <ProfileButton />,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;

          switch (route.name) {
            case 'Dashboard':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Income':
              iconName = focused ? 'arrow-down-circle' : 'arrow-down-circle-outline';
              break;
            case 'Expense':
              iconName = focused ? 'arrow-up-circle' : 'arrow-up-circle-outline';
              break;
            case 'Goals':
              iconName = focused ? 'flag' : 'flag-outline';
              break;
            case 'Logout':
              iconName = focused ? 'log-out' : 'log-out-outline';
              break;
            default:
              iconName = 'ellipse';
          }

          return <VectorIcon.Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#6200ee',
        tabBarInactiveTintColor: 'gray',
      })}>
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Income" component={IncomeListScreen} />
      <Tab.Screen name="Expense" component={ExpenseListScreen} />
      <Tab.Screen name="Goals" component={GoalsScreen} />
      <Tab.Screen name="Logout" component={LogoutScreen} />
    </Tab.Navigator>
  );
};

// Helper function to set header titles
const getHeaderTitle = (routeName: string) => {
  switch (routeName) {
    case 'Dashboard':
      return 'Dashboard';
    case 'Income':
      return 'Income';
    case 'Expense':
      return 'Expense';
    case 'Goals':
      return 'Goals';
    case 'Logout':
      return 'Logout';
    default:
      return '';
  }
};

export default BottomTabNavigator;
