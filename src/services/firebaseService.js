/**
 * firebaseService.js — Reusable Firestore CRUD functions
 * All database operations are centralized here for cleaner code.
 */
import {
  collection, doc, setDoc, getDoc, getDocs, updateDoc, deleteDoc,
  query, where, orderBy, limit, serverTimestamp,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../firebase';

// ============== BOOKINGS ==============

/** Create a new booking document in Firestore */
export const createBooking = async (bookingData) => {
  try {
    const bookingRef = doc(db, 'bookings', bookingData.bookingId);
    await setDoc(bookingRef, { ...bookingData, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
    return { success: true, id: bookingData.bookingId };
  } catch (error) {
    console.log('createBooking error:', error);
    return { success: false, error: error.message };
  }
};

/** Get all bookings for a specific user */
export const getBookingsByUser = async (userId) => {
  try {
    const q = query(collection(db, 'bookings'), where('userId', '==', userId), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.log('getBookingsByUser error:', error);
    return [];
  }
};

/** Get all bookings for a specific provider */
export const getBookingsByProvider = async (providerId) => {
  try {
    const q = query(collection(db, 'bookings'), where('providerId', '==', providerId), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.log('getBookingsByProvider error:', error);
    return [];
  }
};

/** Update booking status (confirmed → assigned → on_the_way → in_progress → completed) */
export const updateBookingStatus = async (bookingId, newStatus) => {
  try {
    const bookingRef = doc(db, 'bookings', bookingId);
    await updateDoc(bookingRef, { status: newStatus, updatedAt: serverTimestamp() });
    return { success: true };
  } catch (error) {
    console.log('updateBookingStatus error:', error);
    return { success: false, error: error.message };
  }
};

// ============== SERVICES ==============

/** Get services filtered by category */
export const getServicesByCategory = async (category) => {
  try {
    let q;
    if (category) {
      q = query(collection(db, 'services'), where('category', '==', category));
    } else {
      q = query(collection(db, 'services'), limit(20));
    }
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.log('getServicesByCategory error:', error);
    return [];
  }
};

// ============== PROVIDERS ==============

/** Get a provider's profile by their user ID */
export const getProviderById = async (providerId) => {
  try {
    const providerDoc = await getDoc(doc(db, 'users', providerId));
    if (providerDoc.exists()) {
      return { id: providerDoc.id, ...providerDoc.data() };
    }
    return null;
  } catch (error) {
    console.log('getProviderById error:', error);
    return null;
  }
};

// ============== PROFILE IMAGE ==============

/** Upload a profile image to Firebase Storage and return the download URL */
export const uploadProfileImage = async (userId, imageUri) => {
  try {
    const response = await fetch(imageUri);
    const blob = await response.blob();
    const imageRef = ref(storage, `profileImages/${userId}.jpg`);
    await uploadBytes(imageRef, blob);
    const downloadURL = await getDownloadURL(imageRef);

    // Update user document with new profile image URL
    await updateDoc(doc(db, 'users', userId), { profileImage: downloadURL, updatedAt: serverTimestamp() });

    return { success: true, url: downloadURL };
  } catch (error) {
    console.log('uploadProfileImage error:', error);
    return { success: false, error: error.message };
  }
};

// ============== REVIEWS ==============

/** Add a review for a service */
export const addReview = async (reviewData) => {
  try {
    const reviewRef = doc(collection(db, 'reviews'));
    await setDoc(reviewRef, { ...reviewData, createdAt: serverTimestamp() });
    return { success: true, id: reviewRef.id };
  } catch (error) {
    console.log('addReview error:', error);
    return { success: false, error: error.message };
  }
};

/** Get reviews for a specific service */
export const getReviewsByService = async (serviceId) => {
  try {
    const q = query(collection(db, 'reviews'), where('serviceId', '==', serviceId), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.log('getReviewsByService error:', error);
    return [];
  }
};
