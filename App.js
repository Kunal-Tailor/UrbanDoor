/**
 * App.js — Main entry point for ServeNow
 * 
 * Wraps the entire app in the AuthProvider context so all screens
 * can access the current user's authentication state.
 */

import React from 'react';
import { StatusBar, LogBox } from 'react-native';
import { AuthProvider } from './src/context/AuthContext';
import RootNavigator from './src/navigation/RootNavigator';

// Suppress specific warnings in development (optional)
LogBox.ignoreLogs([
  'AsyncStorage has been extracted',
  'Setting a timer',
]);

export default function App() {
  return (
    <AuthProvider>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      <RootNavigator />
    </AuthProvider>
  );
}
