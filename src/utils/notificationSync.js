/* src/utils/notificationSync.js */
import { LocalNotifications } from '@capacitor/local-notifications';

export const syncNotification = async (id, title, message, addInsightToContext) => {
  // 1. Send it to the React App UI (Top Right Bell Icon)
  const newInsight = {
    id: id || Date.now(),
    title: title,
    message: message,
    timestamp: new Date().toISOString(),
    isRead: false
  };
  
  // Call the function from your ExpenseContext to update the UI
  if (addInsightToContext) {
    addInsightToContext(newInsight);
  }

  // 2. Send the exact same data to the Android System Tray
  try {
    // Request permission (Required for Android 13+)
    const permStatus = await LocalNotifications.checkPermissions();
    if (permStatus.display !== 'granted') {
      await LocalNotifications.requestPermissions();
    }

    // Fire the Android Notification
    await LocalNotifications.schedule({
      notifications: [
        {
          title: title,
          body: message,
          id: newInsight.id, // Keep the IDs matching!
          schedule: { at: new Date(Date.now() + 1000) }, // Fire almost immediately
          smallIcon: 'ic_stat_icon_config_sample', // Your Android icon
        }
      ]
    });
  } catch (error) {
    console.error("Android Notification Failed:", error);
  }
};