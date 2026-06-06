package com.mahitmass.app;

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
    // We use a unified tag so you can filter logs easily
    private static final String TAG = "LEAK_QA_TEST";
    
    private static final Pattern UNIVERSAL_AMOUNT_PATTERN = Pattern.compile("(?i)(?:Rs\\.?|INR|₹)\\s*([\\d,]+\\.?\\d*)");
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

                        Log.i(TAG, "--------------------------------------------------");
                        Log.i(TAG, "📥 NEW SMS RECEIVED FROM: " + sender);
                        Log.i(TAG, "📝 BODY: " + messageBody);

                        /*// 🔥 LAYER 1: SPAM KILLER
                        if (sender != null && sender.matches(".*\\+?[0-9]{8,}.*")) {
                            Log.w(TAG, "🛑 LAYER 1 FAILED: Blocked 10-digit Spam Number.");
                            continue; 
                        }
                        Log.d(TAG, "✅ LAYER 1 PASSED: Valid Commercial Header."); */ 

                        // 🔥 LAYER 2: INTENT CHECK
                        String lowerBody = messageBody.toLowerCase();
                        boolean isDebit = lowerBody.contains("debited") || lowerBody.contains("paid") || lowerBody.contains("spent");
                        boolean isCredit = lowerBody.contains("credited") || lowerBody.contains("received") || lowerBody.contains("refund");

                        if (!isDebit && !isCredit) {
                            Log.w(TAG, "🛑 LAYER 2 FAILED: No transaction keywords found (Not a debit/credit).");
                            continue;
                        }
                        Log.d(TAG, "✅ LAYER 2 PASSED: Intent found. Debit=" + isDebit + ", Credit=" + isCredit);

                        // Determine type
                        String txType = isCredit ? "credit" : "debit";
                        processAndStoreSms(context, messageBody, sender, txType);
                    }
                }
            }
        }
    }

    // 🔥 LAYER 3: EXTRACTION & SQLITE
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
            if (merchant.contains("Bal")) {
                merchant = merchant.split("Bal")[0]; 
            }
            merchant = merchant.replace(".", "").trim();

            if (amount.equals("0")) {
                Log.e(TAG, "❌ LAYER 3 FAILED: Regex could not find a valid money amount.");
                return;
            }

            Log.d(TAG, "✅ LAYER 3 PASSED: Extracted Amount: " + amount + " | Merchant: " + merchant);

            // SQLITE INJECTION
            String currentDate = new SimpleDateFormat("yyyy-MM-dd", Locale.getDefault()).format(new Date());
            // 🔥 THE FIX: Base the hash strictly on the message content and date to block duplicates
            String hash = merchant + "-" + amount + "-" + currentDate; 
            
            SQLiteDatabase db = context.openOrCreateDatabase("expense_leak_db", Context.MODE_PRIVATE, null);
            db.execSQL("CREATE TABLE IF NOT EXISTS transactions (id INTEGER PRIMARY KEY AUTOINCREMENT, amount REAL NOT NULL, merchant TEXT NOT NULL, date TEXT NOT NULL, category TEXT DEFAULT 'Unknown', type TEXT DEFAULT 'debit', unique_hash TEXT UNIQUE);");
            
            db.execSQL("INSERT OR IGNORE INTO transactions (amount, merchant, date, category, type, unique_hash) VALUES (?, ?, ?, ?, ?, ?)", 
                    new Object[]{Double.parseDouble(amount), merchant, currentDate, "Auto-Parsed", txType, hash});
            
            db.close();
            Log.i(TAG, "💾 DATABASE SUCCESS: Transaction securely written to SQLite.");
            Log.i(TAG, "--------------------------------------------------");

        } catch (Exception e) {
            Log.e(TAG, "💥 CRITICAL CRASH IN PARSER: " + e.getMessage());
        }
    }
}