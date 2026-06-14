import { LocalNotifications } from '@capacitor/local-notifications';

export const initializeNotifications = async () => {
    try {
        // 🔥 FIX: Check existing status first so we don't annoy the user
        const currentStatus = await LocalNotifications.checkPermissions();
        
        if (currentStatus.display === 'granted') {
            return true;
        }

        // Only request if we don't have it yet
        const { display } = await LocalNotifications.requestPermissions();
        if (display !== 'granted') {
            console.warn("User denied push notification permissions.");
            return false;
        }
        return true;
    } catch (error) {
        console.error("Failed to initialize notifications", error);
        return false;
    }
};

// 🔥 THE BRUTE-FORCE TEST PING
export const forceTestNotification = async () => {
    try {
        console.log("Triggering test notification...");
        await LocalNotifications.schedule({
            notifications: [
                {
                    title: "🔔 Test Connection Live",
                    body: "Native notifications are fully connected to Capacitor!",
                    id: 888,
                    schedule: { at: new Date(Date.now() + 1000) },
                    smallIcon: "ic_launcher" // Changed to the guaranteed default icon
                }
            ]
        });
        console.log("Test scheduled successfully.");
    } catch (error) {
        console.error("Notification crash:", error);
    }
};

export const fireLeakWarning = async (merchant, amount, currentTotal, limit) => {
    try {
        await LocalNotifications.schedule({
            notifications: [
                {
                    title: "⚠️ Daily Leak Limit Exceeded",
                    body: `₹${amount} at ${merchant} pushed you to ₹${currentTotal} today (Limit: ₹${limit}).`,
                    // 🔥 THE FIX: Generates a safe 6-digit number well below the Java Integer limit
                    id: Math.floor(Math.random() * 999999), 
                    schedule: { at: new Date(Date.now() + 1000) },
                    smallIcon: "ic_launcher"
                }
            ]
        });
    } catch (error) {
        console.error("Failed to fire notification", error);
    }
};