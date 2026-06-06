package com.mahitmass.app; // Change this if your package name is different

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.telephony.SmsMessage;
import android.util.Log;
import android.database.sqlite.SQLiteDatabase;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

public class SmsBackgroundReceiver extends BroadcastReceiver {
    private static final String TAG = "SmsBackgroundReceiver";
    
    // 🔥 THE UNIVERSAL REGEX ENGINE
    // Catches Rs., INR, ₹, RS, rs followed by spaces and any number format
    private static final Pattern UNIVERSAL_AMOUNT_PATTERN = Pattern.compile("(?i)(?:Rs\\.?|INR|₹)\\s*([\\d,]+\\.?\\d*)");
    
    // Looser Merchant Pattern: Looks for UPI targets or standard "to" keywords
    private static final Pattern UNIVERSAL_MERCHANT_PATTERN = Pattern.compile("(?i)(?:UPI/(?:DR|CR|P2A|P2M)/\\d+/|to\\s)([A-Za-z0-9\\s\\*]+?)(?:\\.|\\n|\\s(?:Ref|Bal))");

    @Override
    public void onReceive(Context context, Intent intent) {
        if ("android.provider.Telephony.SMS_RECEIVED".equals(intent.getAction())) {
            Bundle bundle = intent.getExtras();
            if (bundle != null) {
                Object[] pdus = (Object[]) bundle.get("pdus");
                if (pdus != null) {
                    for (Object pdu : pdus) {
                        SmsMessage smsMessage = SmsMessage.createFromPdu((byte[]) pdu);
                        String messageBody = smsMessage.getMessageBody();
                        String sender = smsMessage.getOriginatingAddress();

                        Log.d(TAG, "Intercepted SMS from: " + sender);

                        // 🔥 LAYER 1: THE SPAM KILLER
                        // If the sender is a normal 10-digit phone number, drop it immediately.
                        // Commercial bank headers (like AD-AUBANK or VM-HDFCBK) contain letters.
                        if (sender != null && sender.matches(".*\\+?[0-9]{8,}.*")) {
                            Log.d(TAG, "Blocked Spam/Fake SMS from: " + sender);
                            continue; 
                        }

                        // 🔥 LAYER 2: THE INTENT CHECK
                        // Ensure it's an actual transaction, not just a balance alert or OTP
                        String lowerBody = messageBody.toLowerCase();
                        boolean isTransaction = lowerBody.contains("debited") || 
                                              lowerBody.contains("credited") || 
                                              lowerBody.contains("paid") || 
                                              lowerBody.contains("spent");

                        if (isTransaction) {
                            // Passed all security checks. Safe to extract dynamically!
                            processAndStoreSms(context, messageBody, sender);
                        }
                    }
                }
            }
        }
    }

    // 🔥 LAYER 3: DYNAMIC EXTRACTION & DATABASE INJECTION
    private void processAndStoreSms(Context context, String messageBody, String sender) {
        try {
            Matcher amountMatcher = UNIVERSAL_AMOUNT_PATTERN.matcher(messageBody);
            Matcher merchantMatcher = UNIVERSAL_MERCHANT_PATTERN.matcher(messageBody);

            String amount = "0";
            String merchant = sender; // Fallback to the Bank's Header ID if merchant isn't found perfectly

            if (amountMatcher.find()) {
                amount = amountMatcher.group(1).replace(",", ""); // Strip commas for clean SQLite math
            }
            if (merchantMatcher.find()) {
                merchant = merchantMatcher.group(1).trim();
            }

            // If we successfully found an amount, silently inject it into the SQLite DB
            if (!amount.equals("0")) {
                String currentDate = new SimpleDateFormat("yyyy-MM-dd", Locale.getDefault()).format(new Date());
                String hash = merchant + "-" + amount + "-" + System.currentTimeMillis(); // Safer unique hash
                
                // Open the database in the background without waking up React
                SQLiteDatabase db = context.openOrCreateDatabase("expense_leak_db", Context.MODE_PRIVATE, null);
                
                // Safety check: ensure table exists just in case the app was never opened by the user yet
                db.execSQL("CREATE TABLE IF NOT EXISTS transactions (id INTEGER PRIMARY KEY AUTOINCREMENT, amount REAL NOT NULL, merchant TEXT NOT NULL, date TEXT NOT NULL, category TEXT DEFAULT 'Unknown', type TEXT DEFAULT 'debit', unique_hash TEXT UNIQUE);");
                
                // Inject the transaction
                db.execSQL("INSERT OR IGNORE INTO transactions (amount, merchant, date, category, type, unique_hash) VALUES (?, ?, ?, ?, ?, ?)", 
                        new Object[]{Double.parseDouble(amount), merchant, currentDate, "Auto-Parsed", "debit", hash});
                
                db.close();
                Log.d(TAG, "✅ Dynamically Parsed & Saved: " + merchant + " | ₹" + amount);
            }
        } catch (Exception e) {
            Log.e(TAG, "❌ Dynamic Parse Error: " + e.getMessage());
        }
    }
}