/* src/utils/smsParser.js */

export const parseBankSMS = (message) => {
  console.log("--------------------------------------------------");
  console.log("📥 RAW SMS:", message);

  // 1. IGNORE SPAM
  if (!/(debited|deducted|spent|sent|paid|dr\s|dr\b)/i.test(message)) {
    console.log("❌ REJECTED: No debit keywords found.");
    return null; 
  }

  // 2. EXTRACT AMOUNT
  const amountRegex = /(?:Rs\.?|INR|₹)\s*([\d,]+\.?\d*)/i;
  const amountMatch = message.match(amountRegex);
  
  if (!amountMatch) {
    console.log("❌ REJECTED: Could not find money symbol/amount.");
    return null;
  }
  
  const amount = parseFloat(amountMatch[1].replace(/,/g, ''));
  console.log("✅ AMOUNT:", amount);

  // 3. EXTRACT MERCHANT (Built specifically for AU Bank & UPI formats)
  let merchant = "Unknown Merchant";
  
  // This jumps over the "UPI/DR/123456789/" numbers and grabs the name
  const upiRegex = /UPI\/(?:DR|CR|P2A|P2M)\/\d+\/([^/\n]+)/i;
  const upiMatch = message.match(upiRegex);

  if (upiMatch) {
    // If it's a UPI transaction, we grab it and label it
    merchant = "UPI - " + upiMatch[1].trim();
    console.log("✅ MERCHANT PARSED:", merchant);
  } else {
    // Fallback for non-UPI bank card swipes
    const cardRegex = /(?:at|to|in)\s+([A-Za-z0-9\s*.\-]+?)(?:\s+(?:on|ref|txn|for|date|val)|$)/i;
    const cardMatch = message.match(cardRegex);
    if (cardMatch) {
      merchant = cardMatch[1].trim();
      console.log("✅ MERCHANT PARSED (CARD):", merchant);
    } else {
      console.log("⚠️ MERCHANT FAILED: Defaulting to Unknown.");
    }
  }

  // 4. EXTRACT REAL DATE (Handles DD-MMM-YYYY like '06-MAY-2026')
  let transactionDate = null;
  const dateRegex = /(\d{2})[-/]([A-Za-z]{3}|\d{2})[-/](\d{2,4})/;
  const dateMatch = message.match(dateRegex);
  
  if (dateMatch) {
    const day = dateMatch[1];
    let monthRaw = dateMatch[2].toUpperCase();
    
    // Convert 'MAY' into '05' so the app can sort it properly
    const monthMap = {
      'JAN': '01', 'FEB': '02', 'MAR': '03', 'APR': '04', 
      'MAY': '05', 'JUN': '06', 'JUL': '07', 'AUG': '08', 
      'SEP': '09', 'OCT': '10', 'NOV': '11', 'DEC': '12'
    };
    
    const month = monthMap[monthRaw] || monthRaw; 
    const year = dateMatch[3].length === 2 ? "20" + dateMatch[3] : dateMatch[3]; 
    
    transactionDate = `${year}-${month}-${day}`; 
    console.log("✅ DATE PARSED:", transactionDate);
  } else {
    console.log("⚠️ DATE FAILED: Returning null (App.js will use today).");
  }

  return {
    type: 'debit',
    amount: amount,
    merchant: merchant,
    date: transactionDate 
  };
};