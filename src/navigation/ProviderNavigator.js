/**
 * ProviderNavigator.js — Bottom tab + stack navigation for provider role
 */
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../constants/colors';

import ProviderDashboardScreen from '../screens/provider/ProviderDashboardScreen';
import ProviderJobDetailScreen from '../screens/provider/ProviderJobDetailScreen';
import ProviderEarningsScreen from '../screens/provider/ProviderEarningsScreen';
import ProviderProfileScreen from '../screens/provider/ProviderProfileScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const DashboardStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="DashboardMain" component={ProviderDashboardScreen} />
    <Stack.Screen name="ProviderJobDetail" component={ProviderJobDetailScreen} />
  </Stack.Navigator>
);

const ProviderNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarIcon: ({ focused, color }) => {
        let iconName;
        if (route.name === 'Dashboard') iconName = focused ? 'grid' : 'grid-outline';
        else if (route.name === 'Earnings') iconName = focused ? 'wallet' : 'wallet-outline';
        else if (route.name === 'ProviderProfile') iconName = focused ? 'person' : 'person-outline';
        return <Ionicons name={iconName} size={22} color={color} />;
      },
      tabBarActiveTintColor: COLORS.primary,
      tabBarInactiveTintColor: COLORS.textTertiary,
      tabBarStyle: {
        height: 65, paddingBottom: 10, paddingTop: 8, backgroundColor: COLORS.white,
        borderTopWidth: 1, borderTopColor: COLORS.divider,
      },
      tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
    })}
  >
    <Tab.Screen name="Dashboard" component={DashboardStack} />
    <Tab.Screen name="Earnings" component={ProviderEarningsScreen} />
    <Tab.Screen name="ProviderProfile" component={ProviderProfileScreen} options={{ tabBarLabel: 'Profile' }} />
  </Tab.Navigator>
);

export default ProviderNavigator;
