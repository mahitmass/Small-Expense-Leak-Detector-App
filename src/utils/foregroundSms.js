// src/utils/foregroundSms.js
export const scanInboxForExpenses = () => {
    return new Promise((resolve, reject) => {
        if (!window.SMS) {
            console.error("SMS plugin not found. Are you running on a native device?");
            return reject("Plugin missing");
        }

        const filter = {
            box: 'inbox', 
            maxCount: 20, // Scan the last 20 texts
        };

        window.SMS.listSMS(filter, (data) => {
            console.log("Scanned Inbox:", data);
            const newExpenses = [];
            
            data.forEach(msg => {
                const body = msg.body.toLowerCase();
                // Basic bank regex looking for "debited" or "spent"
                if (body.includes('debited') || body.includes('spent')) {
                    const amountMatch = body.match(/(?:rs\.?|inr)\s*(\d+(?:\.\d+)?)/i);
                    if (amountMatch) {
                        newExpenses.push({
                            amount: parseFloat(amountMatch[1]),
                            merchant: "Bank Auto-Scan",
                            date: new Date(msg.date).toISOString().split('T')[0],
                            rawText: msg.body
                        });
                    }
                }
            });
            resolve(newExpenses);
        }, (err) => {
            console.error("Failed to read SMS:", err);
            reject(err);
        });
    });
};