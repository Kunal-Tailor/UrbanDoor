/**
 * AuthContext.js — Authentication context provider
 * 
 * Manages user authentication state (login, signup, logout) across the whole app.
 * Uses Firebase Auth + Firestore for user data persistence.
 * Includes DEMO MODE for testing without Firebase.
 */

import React, { createContext, useState, useEffect, useContext } from 'react';
import { Alert } from 'react-native';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../../firebase';

const AuthContext = createContext();

// Custom hook to use auth context in any component
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

// ============== DEMO ACCOUNTS ==============
const DEMO_CUSTOMER = {
  id: 'demo-customer-001',
  name: 'Kunal Namdev',
  email: 'customer@demo.com',
  role: 'customer',
  phone: '+91 98765 43210',
  profileImage: '',
  savedAddresses: ['123 MG Road, Mumbai, Maharashtra 400001'],
};

const DEMO_PROVIDER = {
  id: 'demo-provider-001',
  name: 'Rajesh Kumar',
  email: 'provider@demo.com',
  role: 'provider',
  phone: '+91 98765 43211',
  profileImage: 'https://randomuser.me/api/portraits/men/1.jpg',
  services: ['Cleaner'],
  isOnline: true,
  rating: 4.8,
  reviewCount: 342,
  completedJobs: 580,
  experience: '5 years',
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);         // Firebase Auth user or demo user
  const [userData, setUserData] = useState(null);  // Firestore user document or demo data
  const [loading, setLoading] = useState(true);    // Initial auth check loading
  const [authLoading, setAuthLoading] = useState(false); // Login/signup loading
  const [isDemo, setIsDemo] = useState(false);     // Track if using demo mode

  // Listen for auth state changes (runs on app start)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            setUserData({ id: userDoc.id, ...userDoc.data() });
          }
        } catch (error) {
          console.log('Error fetching user data:', error);
        }
      } else if (!isDemo) {
        setUser(null);
        setUserData(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [isDemo]);

  // ============== DEMO LOGIN (no Firebase needed) ==============
  const demoLogin = (role = 'customer') => {
    setAuthLoading(true);
    const demoData = role === 'provider' ? DEMO_PROVIDER : DEMO_CUSTOMER;
    
    // Simulate a small delay like a real login
    setTimeout(() => {
      setUser({ uid: demoData.id, email: demoData.email, displayName: demoData.name });
      setUserData(demoData);
      setIsDemo(true);
      setLoading(false);
      setAuthLoading(false);
    }, 500);
  };

  // Sign up with email, password, and user details
  const signup = async (name, email, password, role) => {
    setAuthLoading(true);
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(result.user, { displayName: name });

      const userDocData = {
        name,
        email,
        role,
        phone: '',
        profileImage: '',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      if (role === 'provider') {
        userDocData.services = [];
        userDocData.isOnline = false;
        userDocData.rating = 0;
        userDocData.reviewCount = 0;
        userDocData.completedJobs = 0;
        userDocData.experience = '';
        userDocData.location = null;
      } else {
        userDocData.savedAddresses = [];
      }

      await setDoc(doc(db, 'users', result.user.uid), userDocData);
      setUserData({ id: result.user.uid, ...userDocData });

      return { success: true };
    } catch (error) {
      console.log('SIGNUP ERROR:', error.code, error.message);
      let message = 'Something went wrong. Please try again.';
      if (error.code === 'auth/email-already-in-use') message = 'This email is already registered.';
      else if (error.code === 'auth/invalid-email') message = 'Invalid email address.';
      else if (error.code === 'auth/weak-password') message = 'Password should be at least 6 characters.';
      else if (error.code === 'auth/operation-not-allowed') message = 'Email/Password sign-in is not enabled. Enable it in Firebase Console → Authentication → Sign-in method.';
      else if (error.code === 'auth/configuration-not-found') message = 'Firebase Auth not set up. Enable Email/Password in Firebase Console.';
      else message = error.message || message;
      return { success: false, error: message };
    } finally {
      setAuthLoading(false);
    }
  };

  // Login with email and password
  const login = async (email, password) => {
    setAuthLoading(true);
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const userDoc = await getDoc(doc(db, 'users', result.user.uid));
      if (userDoc.exists()) {
        setUserData({ id: userDoc.id, ...userDoc.data() });
      }
      return { success: true };
    } catch (error) {
      console.log('LOGIN ERROR:', error.code, error.message);
      let message = 'Something went wrong. Please try again.';
      if (error.code === 'auth/user-not-found') message = 'No account found with this email.';
      else if (error.code === 'auth/wrong-password') message = 'Incorrect password.';
      else if (error.code === 'auth/invalid-email') message = 'Invalid email address.';
      else if (error.code === 'auth/too-many-requests') message = 'Too many attempts. Try again later.';
      else if (error.code === 'auth/invalid-credential') message = 'Invalid email or password.';
      else message = error.message || message;
      return { success: false, error: message };
    } finally {
      setAuthLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    try {
      if (isDemo) {
        setUser(null);
        setUserData(null);
        setIsDemo(false);
        return;
      }
      await signOut(auth);
      setUser(null);
      setUserData(null);
    } catch (error) {
      Alert.alert('Error', 'Failed to log out. Please try again.');
    }
  };

  // Send password reset email
  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (error) {
      let message = 'Something went wrong.';
      if (error.code === 'auth/user-not-found') message = 'No account found with this email.';
      else if (error.code === 'auth/invalid-email') message = 'Invalid email address.';
      return { success: false, error: message };
    }
  };

  // Update user data
  const updateUserData = async (updates) => {
    if (isDemo) {
      setUserData(prev => ({ ...prev, ...updates }));
      return { success: true };
    }
    if (!user) return;
    try {
      await setDoc(doc(db, 'users', user.uid), { ...updates, updatedAt: serverTimestamp() }, { merge: true });
      setUserData(prev => ({ ...prev, ...updates }));
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to update profile.' };
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      userData,
      loading,
      authLoading,
      isDemo,
      signup,
      login,
      logout,
      resetPassword,
      updateUserData,
      demoLogin,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
