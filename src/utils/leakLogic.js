/* src/utils/leakLogic.js */
import { fireLeakWarning } from './notificationEngine';
// ==========================================
// 1. THE BRAIN: EXPANDED MERCHANT DATABASE
// ==========================================
export const MERCHANT_CATEGORY_MAP = {
  // --- LEAKS (Wants) ---
  swiggy: "food", zomato: "food", dominos: "food", kfc: "food", mcdonalds: "food",
  starbucks: "food", chaayos: "food", burgerking: "food", subway: "food", pizza: "food",
  eat: "food", cafe: "food", restaurant: "food", bar: "food", pub: "food",
  
  netflix: "subscription", spotify: "subscription", hotstar: "subscription",
  prime: "subscription", youtube: "subscription", apple: "subscription",
  disney: "subscription", hulu: "subscription", sonyliv: "subscription", chatgpt: "subscription",
  
  amazon: "shopping", flipkart: "shopping", myntra: "shopping", ajio: "shopping",
  meesho: "shopping", nykaa: "shopping", zara: "shopping", blinkit: "shopping", zepto: "shopping",
  hnm: "shopping", uniqlo: "shopping", decathlon: "shopping", dmart: "shopping", croma: "shopping",
  
  uber: "transport", ola: "transport", rapido: "transport", makemytrip: "transport",
  redbus: "transport", metro: "transport", flight: "transport", irctc: "transport",
  
  steam: "entertainment", playstation: "entertainment", xbox: "entertainment", 
  bookmyshow: "entertainment", pvr: "entertainment", inox: "entertainment",

  // --- ESSENTIALS (Needs - NOT Leaks) ---
  apollo: "healthcare", practo: "healthcare", pharmeasy: "healthcare", "1mg": "healthcare",
  medplus: "healthcare", hospital: "healthcare", pharmacy: "healthcare", doctor: "healthcare",
  
  coursera: "education", udemy: "education", byjus: "education", unacademy: "education",
  school: "education", college: "education", university: "education", tuition: "education",
  
  bescom: "bills", electricity: "bills", water: "bills", gas: "bills", broadband: "bills",
  airtel: "bills", jio: "bills", vi: "bills", rent: "bills", recharge: "bills",
  
  zerodha: "investment", groww: "investment", upstox: "investment", sip: "investment",
  mutual: "investment", fund: "investment", ppf: "investment", indmoney: "investment",
  
  paytm: "misc", gpay: "misc", phonepe: "misc", upi: "misc"
};

export const LEAK_CATEGORIES = ["food", "subscription", "shopping", "transport", "entertainment", "snacks"];

// ==========================================
// 2. CORE FUNCTIONS (Merged Logic)
// ==========================================

export function categorizeTransaction(description) {
  if (!description) return 'misc';
  
  // Strips all spaces (e.g. "Z O M A T O" becomes "zomato")
  const text = description.toLowerCase().replace(/\s+/g, '');

  // RULE A: Detect Personal UPI Transfers vs Company Payments
  if (text.includes('upito') || text.includes('vpa:')) {
    // Check if the UPI target happens to be a known business first
    const isBusiness = Object.keys(MERCHANT_CATEGORY_MAP).some(merchant => text.includes(merchant));
    if (!isBusiness) return 'transfer'; // It's a personal contact/friend
  }

  // RULE B: Standard Merchant Matching
  for (const [merchant, category] of Object.entries(MERCHANT_CATEGORY_MAP)) {
    if (text.includes(merchant)) return category;
  }
  
  return 'misc';
}

export function calculateLeakAnalysis(expenses, monthlyIncome) {
  if (!expenses || expenses.length === 0) return { score: 100, insights: [], personality: 'The Saver' };

  let leakSpent = 0;
  const categoryTotals = {};

  expenses.forEach(exp => {
    categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
    
    // Only count as "Leak" if it is a WANT, not a NEED
    if (LEAK_CATEGORIES.includes(exp.category)) {
      leakSpent += exp.amount;
    }
  });

  const safeIncome = monthlyIncome > 0 ? monthlyIncome : 15000;
  const leakRatio = Math.min(leakSpent / safeIncome, 1); 
  const score = Math.round(100 - (leakRatio * 100));

  const personality = determinePersonality(categoryTotals, leakSpent);

  return { score, categoryTotals, personality };
}

function determinePersonality(totals, totalLeak) {
  if (totalLeak === 0) return "The Zen Master";
  
  const topCat = Object.keys(totals).reduce((a, b) => totals[a] > totals[b] ? a : b);
  
  const personalities = {
    food: "The Foodie",
    subscription: "The Collector",
    shopping: "The Impulse Buyer",
    transport: "The Wanderer",
    entertainment: "The Gamer",
    snacks: "The Caffeine Addict",
    healthcare: "The Health Nut",
    education: "The Scholar",
    investment: "The Investor",
    bills: "The Responsible One"
  };

  return personalities[topCat] || "The Spender";
}

// ==========================================
// 3. THE SMART INSIGHT ENGINE 
// ==========================================

export const generateSmartInsights = (expenses, categoryTotals) => {
  const insights = [];

  // Calculate Strictly Wasted Money
  let strictlyWasted = 0;
  LEAK_CATEGORIES.forEach(cat => {
    strictlyWasted += (categoryTotals[cat] || 0);
  });

  // RULE 1: FUTURE WEALTH (The "Millionaire" Logic)
  if (strictlyWasted > 500) {
    const r = 0.01; // 1% monthly return
    const n = 120; // 10 years
    const futureValue = strictlyWasted * (((Math.pow(1 + r, n) - 1) / r));
    
    insights.push({
      id: 'future-wealth',
      type: 'wealth',
      title: 'Millionaire Potential',
      message: `You are leaking ₹${strictlyWasted}/month on non-essentials.`,
      tip: `Invested in an Index Fund, this waste would grow to ₹${Math.round(futureValue / 100000)} Lakhs in 10 years.`,
      severity: 'high'
    });
  }

  // RULE 2: OPPORTUNITY COST (Stocks vs Shopping)
  const impulseSpend = (categoryTotals.shopping || 0) + (categoryTotals.food || 0);
  if (impulseSpend > 2000) {
    const stockShares = Math.floor(impulseSpend / 1000); 
    insights.push({
      id: 'opportunity-cost',
      type: 'opportunity',
      title: 'The Real Trade-off',
      message: `You spent ₹${impulseSpend} on perishable items this month.`,
      tip: `Trade-off: You could have bought ${stockShares} shares of a top TATA company instead.`,
      severity: 'medium'
    });
  }

  // RULE 3: THE LATTE FACTOR (Small Daily Habits)
  const smallImpulseBuys = expenses.filter(e => e.amount < 150 && (e.category === 'snacks' || e.category === 'food'));
  if (smallImpulseBuys.length >= 3) {
    const totalWasted = smallImpulseBuys.reduce((sum, e) => sum + e.amount, 0);
    insights.push({
      id: 'latte-factor',
      type: 'habit',
      title: 'The "Latte Factor"',
      message: `You've made ${smallImpulseBuys.length} small purchases recently totaling ₹${totalWasted}.`,
      tip: "Brewing coffee/tea at home could save you ₹2,000/month.",
      severity: 'medium'
    });
  }

  // RULE 4: GOOD HABIT PRAISE (Education/Healthcare)
  if ((categoryTotals.education || 0) > 1000 || (categoryTotals.investment || 0) > 1000) {
    insights.push({
      id: 'good-habit',
      type: 'eco', 
      title: 'Great Investment!',
      message: 'You are spending heavily on Education/Investments.',
      tip: 'This is "Good Spending". It builds your future value rather than destroying it.',
      severity: 'low'
    });
  }

  // RULE 5: VAMPIRE SPENDING (Late Night)
  const nightTxns = expenses.filter(e => e.time === 'night');
  if (nightTxns.length > 0) {
    const nightTotal = nightTxns.reduce((sum, e) => sum + e.amount, 0);
    insights.push({
      id: 'vampire',
      type: 'habit',
      title: 'Vampire Spending',
      message: `You spent ₹${nightTotal} late at night (The Vampire Hours).`,
      tip: "Apply the 24-Hour Rule: Wait a day before buying anything after 10 PM.",
      severity: 'high'
    });
  }

  // RULE 6: CARBON FOOTPRINT (Transport/Shopping)
  const carbonHeavy = (categoryTotals.transport || 0) + (categoryTotals.shopping || 0);
  if (carbonHeavy > 4000) {
    insights.push({
      id: 'carbon-footprint',
      type: 'eco',
      title: 'High Carbon Footprint',
      message: 'Your spending habits indicate a high environmental impact.',
      tip: 'Try bundling your online orders to reduce delivery emissions.',
      severity: 'low'
    });
  }

  // RULE 7: FOOD ADDICTION
  const totalSpent = Object.values(categoryTotals).reduce((a, b) => a + b, 0);
  if (totalSpent > 0 && ((categoryTotals.food || 0) / totalSpent) > 0.30) {
    insights.push({
      id: 'food-addict',
      type: 'alert',
      title: 'Ordering Out Too Much',
      message: `You spent over 30% of your money on food delivery.`,
      tip: "Delete food apps on weekdays to break the loop.",
      severity: 'high'
    });
  }

  // RULE 8: UPGRADED SUBSCRIPTION AUDIT
  const subs = expenses.filter(e => e.category === 'subscription');
  if (subs.length > 0) {
    const expensiveSub = subs.sort((a,b) => b.amount - a.amount)[0];
    insights.push({
      id: 'sub-check',
      type: 'opportunity',
      title: 'Subscription Usage Audit',
      message: `You're paying ₹${expensiveSub.amount} for ${expensiveSub.description}. Are you still using this enough to justify the cost?`,
      tip: "Cancel it for one month. If you miss it, resubscribe. You could save ₹" + (expensiveSub.amount * 12) + " a year.",
      severity: 'medium'
    });
  }

  // RULE 9: MARKETPLACE BLURRINESS (Amazon, Blinkit)
  const marketplaces = expenses.filter(e => ['amazon', 'blinkit', 'flipkart', 'zepto'].some(m => e.description.toLowerCase().includes(m)));
  if (marketplaces.length > 0) {
    const totalMarketplace = marketplaces.reduce((sum, e) => sum + e.amount, 0);
    insights.push({
      id: 'marketplace-split',
      type: 'wealth',
      title: 'Uncategorized Bulk Orders',
      message: `You spent ₹${totalMarketplace} on platforms like Amazon/Blinkit. This could be groceries, electronics, or wants.`,
      tip: "Tap on these transactions to split them into detailed categories to see your true Leak Score.",
      severity: 'low'
    });
  }

  // RULE 10: CREDIT CARD OPTIMIZATION
  if ((categoryTotals.food || 0) > 1000 || (categoryTotals.shopping || 0) > 2000) {
    insights.push({
      id: 'card-rewards',
      type: 'eco', 
      title: 'Maximize Your Rewards',
      message: 'Based on your heavy food and shopping spending, you are leaving cashback on the table.',
      tip: "Link an SBI Cashback or HDFC Swiggy card. You could be saving 5% automatically on these categories.",
      severity: 'low'
    });
  }

  return insights;
};

// ==========================================
// 4. DAILY LIMIT & NOTIFICATION ENGINE
// ==========================================

export const evaluateDailyLeaks = (newTransaction, todayExpenses, dailyLimit) => {
    // Only check if it's actually a leak category
    if (!LEAK_CATEGORIES.includes(newTransaction.category)) return 0;

    // Calculate how much was already spent today on LEAKS
    const currentDailyTotal = todayExpenses
        .filter(e => LEAK_CATEGORIES.includes(e.category))
        .reduce((sum, e) => sum + e.amount, 0);

    const newTotal = currentDailyTotal + newTransaction.amount;

    // If this specific transaction pushes them over the edge
    if (currentDailyTotal <= dailyLimit && newTotal > dailyLimit) {
        fireLeakWarning(
            newTransaction.description, 
            newTransaction.amount, 
            newTotal, 
            dailyLimit
        );
    }

    return newTotal;
};
