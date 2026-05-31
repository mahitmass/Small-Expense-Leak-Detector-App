/* src/utils/smsParser.js */

export const parseBankSMS = (messageBody) => {
  // 1. Security Check: Only process if it looks like a bank transaction
  const isBankMessage = /A\/c|Acct|debited|credited|UPI/i.test(messageBody);
  if (!isBankMessage) return null;

  // 2. Determine Debit or Credit
  const isDebit = /Dr |debited|deducted/i.test(messageBody);
  const type = isDebit ? 'debit' : 'credit';

  // 3. Extract the Amount (Matches "INR 90.00" or "Rs. 90.00")
  const amountMatch = messageBody.match(/(?:INR|Rs\.?)\s*([\d,]+\.?\d*)/i);
  const amount = amountMatch ? parseFloat(amountMatch[1].replace(/,/g, '')) : 0;

  // 4. Extract the Merchant / Person (Matches "UPI/DR/123/RAJAT GUPTA/...")
  // eslint-disable-next-line no-useless-escape
  const upiMatch = messageBody.match(/UPI\/(?:DR|CR|P2A)\/[^\/]+\/([^\/]+)/i);
  let merchant = upiMatch ? upiMatch[1] : 'Unknown Vendor';

  // Return clean data to your leakLogic!
  return {
    amount,
    type,
    merchant,
    date: new Date().toISOString(),
    isPerson: false // We will update this later with Contacts permission
  };
};