package com.mahitmass.app;

import android.service.notification.NotificationListenerService;
import android.service.notification.StatusBarNotification;
import android.app.Notification;
import android.os.Bundle;
import android.util.Log;

public class NotificationService extends NotificationListenerService {
    @Override
    public void onNotificationPosted(StatusBarNotification sbn) {
        String packageName = sbn.getPackageName();
        // Read notifications explicitly sent by the default system text messenger
        if (packageName.equals("com.google.android.apps.messaging") || packageName.equals("com.samsung.android.messaging")) {
            Bundle extras = sbn.getNotification().extras;
            String title = extras.getString(Notification.EXTRA_TITLE);
            String text = extras.getCharSequence(Notification.EXTRA_TEXT).toString();

            Log.d("NativeScanner", "Intercepted Text from: " + title + " Content: " + text);

            // TODO: Feed this raw text string directly into a native SQLite database open helper
        }
    }
}