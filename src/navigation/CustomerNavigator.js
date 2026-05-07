/**
 * CustomerNavigator.js — Bottom tab + stack navigation for customer role
 */
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../constants/colors';

import HomeScreen from '../screens/customer/HomeScreen';
import ServiceListScreen from '../screens/customer/ServiceListScreen';
import ServiceDetailScreen from '../screens/customer/ServiceDetailScreen';
import BookingScreen from '../screens/customer/BookingScreen';
import BookingConfirmationScreen from '../screens/customer/BookingConfirmationScreen';
import TrackBookingScreen from '../screens/customer/TrackBookingScreen';
import BookingHistoryScreen from '../screens/customer/BookingHistoryScreen';
import ProfileScreen from '../screens/customer/ProfileScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Home stack: Home → ServiceList → ServiceDetail → Booking → Confirmation → Track
const HomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="HomeMain" component={HomeScreen} />
    <Stack.Screen name="ServiceList" component={ServiceListScreen} />
    <Stack.Screen name="ServiceDetail" component={ServiceDetailScreen} />
    <Stack.Screen name="Booking" component={BookingScreen} />
    <Stack.Screen name="BookingConfirmation" component={BookingConfirmationScreen} />
    <Stack.Screen name="TrackBooking" component={TrackBookingScreen} />
  </Stack.Navigator>
);

// Bookings stack
const BookingsStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="BookingHistory" component={BookingHistoryScreen} />
    <Stack.Screen name="TrackBooking" component={TrackBookingScreen} />
  </Stack.Navigator>
);

const CustomerNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;
        if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
        else if (route.name === 'Bookings') iconName = focused ? 'calendar' : 'calendar-outline';
        else if (route.name === 'Profile') iconName = focused ? 'person' : 'person-outline';
        return <Ionicons name={iconName} size={22} color={color} />;
      },
      tabBarActiveTintColor: COLORS.primary,
      tabBarInactiveTintColor: COLORS.textTertiary,
      tabBarStyle: {
        height: 65,
        paddingBottom: 10,
        paddingTop: 8,
        backgroundColor: COLORS.white,
        borderTopWidth: 1,
        borderTopColor: COLORS.divider,
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 1,
        shadowRadius: 12,
        elevation: 8,
      },
      tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
    })}
  >
    <Tab.Screen name="Home" component={HomeStack} />
    <Tab.Screen name="Bookings" component={BookingsStack} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

export default CustomerNavigator;
