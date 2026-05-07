/**
 * RootNavigator.js — Root navigator that checks auth state
 * Shows Auth stack when logged out, Customer or Provider navigator when logged in.
 */
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import AuthNavigator from './AuthNavigator';
import CustomerNavigator from './CustomerNavigator';
import ProviderNavigator from './ProviderNavigator';
import LoadingSpinner from '../components/LoadingSpinner';

const RootNavigator = () => {
  const { user, userData, loading } = useAuth();

  // Show loading spinner while checking auth state
  if (loading) {
    return <LoadingSpinner message="Starting ServeNow..." />;
  }

  return (
    <NavigationContainer>
      {!user ? (
        // Not logged in — show auth screens
        <AuthNavigator />
      ) : userData?.role === 'provider' ? (
        // Logged in as provider
        <ProviderNavigator />
      ) : (
        // Logged in as customer (default)
        <CustomerNavigator />
      )}
    </NavigationContainer>
  );
};

export default RootNavigator;
