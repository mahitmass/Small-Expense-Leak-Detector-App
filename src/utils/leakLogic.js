/* src/utils/leakLogic.js */

// ==========================================
// 1. THE BRAIN: MERCHANT DATABASE
// ==========================================
export const MERCHANT_CATEGORY_MAP = {
  // --- LEAKS (Wants) ---
  swiggy: "food", zomato: "food", dominos: "food", kfc: "food", mcdonalds: "food",
  starbucks: "food", chaayos: "food", burgerking: "food", subway: "food", pizza: "food",
  eat: "food", cafe: "food", restaurant: "food", bar: "food", pub: "food",
  
  netflix: "subscription", spotify: "subscription", hotstar: "subscription",
  prime: "subscription", youtube: "subscription", apple: "subscription",
  disney: "subscription", hulu: "subscription", sonyliv: "subscription",
  
  amazon: "shopping", flipkart: "shopping", myntra: "shopping", ajio: "shopping",
  meesho: "shopping", nykaa: "shopping", zara: "shopping", blinkit: "shopping",
  hnm: "shopping", uniqlo: "shopping", decathlon: "shopping",
  
  uber: "transport", ola: "transport", rapido: "transport", makemytrip: "transport",
  redbus: "transport", metro: "transport", flight: "transport",
  
  steam: "entertainment", playstation: "entertainment", xbox: "entertainment", 
  bookmyshow: "entertainment", pvr: "entertainment", inox: "entertainment",

  // --- ESSENTIALS (Needs - NOT Leaks) ---
  apollo: "healthcare", practo: "healthcare", pharmeasy: "healthcare", "1mg": "healthcare",
  medplus: "healthcare", hospital: "healthcare", pharmacy: "healthcare", doctor: "healthcare",
  
  coursera: "education", udemy: "education", byjus: "education", unacademy: "education",
  school: "education", college: "education", university: "education", tuition: "education",
  
  bescom: "bills", electricity: "bills", water: "bills", gas: "bills", broadband: "bills",
  airtel: "bills", jio: "bills", vi: "bills", rent: "bills",
  
  zerodha: "investment", groww: "investment", upstox: "investment", sip: "investment",
  mutual: "investment", fund: "investment", ppf: "investment",
  
  paytm: "misc", gpay: "misc", phonepe: "misc", upi: "misc"
};

// ✅ FIX: Exported this so other files can use it!
export const LEAK_CATEGORIES = ["food", "subscription", "shopping", "transport", "entertainment", "snacks"];

// ==========================================
// 2. CORE FUNCTIONS
// ==========================================

export function categorizeTransaction(description) {
  const text = description.toLowerCase().replace(/\s+/g, '');
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
// 3. THE SMART INSIGHT ENGINE (ALL RULES)
// ==========================================

export function generateSmartInsights(expenses, categoryTotals) {
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

  // RULE 8: SUBSCRIPTION TRAP
  const subs = expenses.filter(e => e.category === 'subscription');
  if (subs.length > 2) {
    insights.push({
      id: 'sub-trap',
      type: 'alert',
      title: 'Subscription Creep',
      message: `You have ${subs.length} active subscriptions.`,
      tip: "Audit: Cancel any service you haven't opened in the last 7 days.",
      severity: 'medium'
    });
  }

  return insights;
}