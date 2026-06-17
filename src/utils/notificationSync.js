import { LocalNotifications } from '@capacitor/local-notifications';

export const syncNotification = async (id, title, message, addInsightToContext) => {
  // 1. ALWAYS UPDATE THE UI BELL ICON FIRST (Fail-safe)
  const newInsight = {
    id: id || Date.now(),
    title: title,
    message: message,
    timestamp: new Date().toISOString(),
    isRead: false,
    isDynamic: true // Tagged so your context knows not to delete it
  };
  
  if (addInsightToContext) {
    addInsightToContext(newInsight);
  }

  // 2. ATTEMPT ANDROID SYSTEM NOTIFICATION
  try {
    const permStatus = await LocalNotifications.checkPermissions();
    
    if (permStatus.display !== 'granted') {
      const request = await LocalNotifications.requestPermissions();
      if (request.display !== 'granted') {
        console.warn("User denied Android notification permissions.");
        return; // UI bell is already updated!
      }
    }

    await LocalNotifications.schedule({
      notifications: [
        {
          title: title,
          body: message,
          id: parseInt(id.toString().substring(0, 8)), // Android requires a short INT ID
          schedule: { at: new Date(Date.now() + 1000) }, 
          smallIcon: 'ic_stat_icon_config_sample', 
        }
      ]
    });
  } catch (error) {
    console.error("Capacitor Native Notification Skipped (Normal if testing on web):", error);
  }
};