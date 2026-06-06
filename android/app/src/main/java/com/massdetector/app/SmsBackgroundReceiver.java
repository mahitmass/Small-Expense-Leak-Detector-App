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

                        // 🔥 LAYER 1: THE SPAM KILLER
                        if (sender != null && sender.matches(".*\\+?[0-9]{8,}.*")) {
                            continue; 
                        }

                        // 🔥 LAYER 2: DYNAMIC INTENT CHECK (Debit vs Credit)
                        String lowerBody = messageBody.toLowerCase();
                        boolean isDebit = lowerBody.contains("debited") || lowerBody.contains("paid") || lowerBody.contains("spent");
                        boolean isCredit = lowerBody.contains("credited") || lowerBody.contains("received") || lowerBody.contains("refund");

                        if (isDebit || isCredit) {
                            // Determine the exact transaction type
                            String txType = isCredit ? "credit" : "debit";
                            processAndStoreSms(context, messageBody, sender, txType);
                        }
                    }
                }
            }
        }
    }

    // 🔥 LAYER 3: DYNAMIC EXTRACTION
    // Notice we added 'String txType' as a parameter here!
    private void processAndStoreSms(Context context, String messageBody, String sender, String txType) {
        try {
            Matcher amountMatcher = UNIVERSAL_AMOUNT_PATTERN.matcher(messageBody);
            Matcher merchantMatcher = UNIVERSAL_MERCHANT_PATTERN.matcher(messageBody);

            String amount = "0";
            String merchant = sender;

            if (amountMatcher.find()) {
                amount = amountMatcher.group(1).replace(",", ""); 
            }
            if (merchantMatcher.find()) {
                merchant = merchantMatcher.group(1).trim();
            }

            if (!amount.equals("0")) {
                String currentDate = new SimpleDateFormat("yyyy-MM-dd", Locale.getDefault()).format(new Date());
                String hash = merchant + "-" + amount + "-" + System.currentTimeMillis(); 
                
                SQLiteDatabase db = context.openOrCreateDatabase("expense_leak_db", Context.MODE_PRIVATE, null);
                db.execSQL("CREATE TABLE IF NOT EXISTS transactions (id INTEGER PRIMARY KEY AUTOINCREMENT, amount REAL NOT NULL, merchant TEXT NOT NULL, date TEXT NOT NULL, category TEXT DEFAULT 'Unknown', type TEXT DEFAULT 'debit', unique_hash TEXT UNIQUE);");
                
                // 🔥 THE FIX: Inject the dynamic 'txType' variable instead of hardcoding 'debit'
                db.execSQL("INSERT OR IGNORE INTO transactions (amount, merchant, date, category, type, unique_hash) VALUES (?, ?, ?, ?, ?, ?)", 
                        new Object[]{Double.parseDouble(amount), merchant, currentDate, "Auto-Parsed", txType, hash});
                
                db.close();
                Log.d(TAG, "✅ Saved: " + merchant + " | ₹" + amount + " | Type: " + txType.toUpperCase());
            }
        } catch (Exception e) {
            Log.e(TAG, "❌ Parse Error: " + e.getMessage());
        }
    }
}