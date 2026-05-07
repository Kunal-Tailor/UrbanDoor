/**
 * notificationService.js — Push notification setup with Expo
 * Handles permission requests, FCM token, and notification listeners.
 */
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';

// Configure how notifications appear when app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

/** Request notification permissions and get the Expo push token */
export const registerForPushNotifications = async () => {
  if (!Device.isDevice) {
    console.log('Push notifications only work on physical devices');
    return null;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.log('Notification permission denied');
    return null;
  }

  // Set up Android notification channel
  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'ServeNow',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
    });
  }

  const token = (await Notifications.getExpoPushTokenAsync()).data;
  return token;
};

/** Save the push token to the user's Firestore document */
export const savePushToken = async (userId, token) => {
  if (!userId || !token) return;
  try {
    await updateDoc(doc(db, 'users', userId), { pushToken: token });
  } catch (error) {
    console.log('Error saving push token:', error);
  }
};

/** Send a local notification (for testing or local alerts) */
export const sendLocalNotification = async (title, body, data = {}) => {
  await Notifications.scheduleNotificationAsync({
    content: { title, body, data, sound: true },
    trigger: null, // Send immediately
  });
};

/** Add listeners for receiving and tapping notifications */
export const addNotificationListeners = (onReceive, onTap) => {
  const receiveSub = Notifications.addNotificationReceivedListener(onReceive);
  const tapSub = Notifications.addNotificationResponseReceivedListener(onTap);
  return () => {
    receiveSub.remove();
    tapSub.remove();
  };
};
