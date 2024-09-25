// App/navigation/BottomTabNavigator.tsx

import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import VectorIcon from '@utils/VectorIcons';
import DashboardScreen from '@screens/Dashboard/DashboardScreen';
import IncomeListScreen from '@screens/Income/IncomeListScreen';
import ExpenseListScreen from '@screens/Expense/ExpenseListScreen';
import GoalsScreen from '@screens/Goals/GoalsScreen';
import LogoutScreen from '@screens/Logout/LogoutScreen';
import ProfileButton from '@components/ProfileButton';
import NotificationButton from '@components/NotificationButton'; // New Component

const Tab = createBottomTabNavigator();

const BottomTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        // Align the header title to the left
        headerTitle: getHeaderTitle(route.name),
        headerTitleAlign: 'left',

        headerStyle: {
          height: 130,
        },
        headerTitleStyle: {
          fontSize: 20,
        },

        // Add both Notification and Profile buttons to the header right
        headerRight: () => (
          <View style={styles.headerRightContainer}>
            <NotificationButton />
            <ProfileButton />
          </View>
        ),

        // Define the tab bar icons based on the route name
        tabBarIcon: ({ focused, color, size }) => {
          switch (route.name) {
            case 'Dashboard':
              return (
                <VectorIcon.MaterialCommunityIcons
                  name={focused ? 'view-dashboard' : 'view-dashboard-outline'}
                  size={size}
                  color={color}
                />
              );
            case 'Income':
              return <VectorIcon.Ionicons name={focused ? 'wallet' : 'wallet-outline'} size={size} color={color} />;
            case 'Expense':
              return (
                <VectorIcon.MaterialCommunityIcons
                  name={focused ? 'chart-areaspline-variant' : 'chart-areaspline'}
                  size={size}
                  color={color}
                />
              );
            case 'Goals':
              return (
                <VectorIcon.MaterialCommunityIcons
                  name={focused ? 'bullseye-arrow' : 'bullseye-arrow'}
                  size={size}
                  color={color}
                />
              );
            case 'Logout':
              return <VectorIcon.Ionicons name={focused ? 'log-out' : 'log-out-outline'} size={size} color={color} />;
            default:
              return <VectorIcon.Ionicons name="ellipse" size={size} color={color} />;
          }
        },

        // Corrected color code
        tabBarActiveTintColor: '#485B42',
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

// Function to get the header title based on the route name
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

// Styles for the header right container and other styles
const styles = StyleSheet.create({
  headerRightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16, // Adjust as needed for spacing
  },
});

export default BottomTabNavigator;
