import { LocalNotifications } from '@capacitor/local-notifications';

// Ask the user for permission when the app opens
export const initializeNotifications = async () => {
    try {
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

// The function to actually trigger the native lock-screen buzz
export const fireLeakWarning = async (merchant, amount, currentTotal, limit) => {
    try {
        await LocalNotifications.schedule({
            notifications: [
                {
                    title: "⚠️ Daily Leak Limit Exceeded",
                    body: `₹${amount} at ${merchant} pushed you to ₹${currentTotal} today (Limit: ₹${limit}).`,
                    id: new Date().getTime(), 
                    schedule: { at: new Date(Date.now() + 1000) }, // Fire exactly 1 second from now
                    smallIcon: "ic_stat_icon_config_sample", 
                }
            ]
        });
    } catch (error) {
        console.error("Failed to fire notification", error);
    }
};
