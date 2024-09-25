import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import VectorIcon from '@utils/VectorIcons';
import DashboardScreen from '@screens/Dashboard/DashboardScreen';
import IncomeListScreen from '@screens/Income/IncomeListScreen';
import ExpenseListScreen from '@screens/Expense/ExpenseListScreen';
import GoalsScreen from '@screens/Goals/GoalsScreen';
import LogoutScreen from '@screens/Logout/LogoutScreen';
import ProfileButton from '@components/ProfileButton';

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
              return (
                <VectorIcon.MaterialCommunityIcons
                  name={focused ? 'view-dashboard' : 'view-dashboard-outline'}
                  size={size}
                  color={color}
                />
              );
              break;
            case 'Income':
              return <VectorIcon.Ionicons name={focused ? 'wallet' : 'wallet-outline'} size={size} color={color} />;
              break;
            case 'Expense':
              return (
                <VectorIcon.MaterialCommunityIcons
                  name={focused ? 'chart-areaspline-variant' : 'chart-areaspline'}
                  size={size}
                  color={color}
                />
              );
              break;
            case 'Goals':
              return (
                <VectorIcon.MaterialCommunityIcons
                  name={focused ? 'bullseye-arrow' : 'bullseye-arrow'}
                  size={size}
                  color={color}
                />
              );
              break;
            case 'Logout':
              iconName = focused ? 'log-out' : 'log-out-outline';
              break;
            default:
              iconName = 'ellipse';
          }

          return <VectorIcon.Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '##485B42',
        tabBarInactiveTintColor: '#707070',
      })}>
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Income" component={IncomeListScreen} />
      <Tab.Screen name="Expense" component={ExpenseListScreen} />
      <Tab.Screen name="Goals" component={GoalsScreen} />
      <Tab.Screen name="Logout" component={LogoutScreen} />
    </Tab.Navigator>
  );
};

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
