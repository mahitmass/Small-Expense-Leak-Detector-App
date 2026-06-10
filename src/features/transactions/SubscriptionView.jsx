/* src/features/transactions/SubscriptionView.jsx */
import React, { useMemo } from 'react';
import { AlertTriangle, TrendingDown, CreditCard, Activity } from 'lucide-react';

const SubscriptionView = ({ expenses }) => {
  // 🔥 THE NEW ALGORITHM: Group, Count, and Flag
  // 🔥 THE UPDATED ALGORITHM: Group, Count, and Flag (No hiding!)
  const { roster, totalAnnualCost, projectedSavings } = useMemo(() => {
    const groups = {};

    // 🔥 FIX: Only process expenses where category is 'subscriptions'
    const subscriptionExpenses = expenses.filter(exp => exp.category === 'subscriptions');

    subscriptionExpenses.forEach(exp => {
      const name = exp.description.trim().toUpperCase();
      
      if (!groups[name]) {
        groups[name] = { 
          name: exp.description, 
          count: 0, 
          latestAmount: exp.amount, 
          lastDate: exp.date 
        };
      }
      
      groups[name].count += 1;
      
      // ... rest of your existing logic stays exactly the same
      
      // Keep the most recent amount and date
      if (new Date(exp.date) > new Date(groups[name].lastDate)) {
        groups[name].lastDate = exp.date;
        groups[name].latestAmount = exp.amount;
      }
    });

    // 2. Treat ALL grouped expenses as part of the roster (Removed the count > 1 filter!)
    const activeSubs = Object.values(groups);

    let annualCostAcc = 0;
    let savingsAcc = 0;

    // 3. Apply your threshold rule (Count >= 5)
    const analyzedRoster = activeSubs.map(sub => {
      const annual = sub.latestAmount * 12;
      annualCostAcc += annual;

      // The Magic Rule: Flag only if paid 5 or more times
      const isFlagged = sub.count >= 5;
      
      if (isFlagged) {
        savingsAcc += annual;
      }

      return { ...sub, annualCost: annual, isFlagged };
    }).sort((a, b) => b.annualCost - a.annualCost);

    return { 
      roster: analyzedRoster, 
      totalAnnualCost: annualCostAcc, 
      projectedSavings: savingsAcc 
    };
  }, [expenses]);

  return (
    <div className="pb-10">
      
      {/* 💳 TOP DASHBOARD CARD */}
      <div className="bg-indigo-600 rounded-sm p-6 relative overflow-hidden mb-6 shadow-xl shadow-indigo-900/20">
        {/* Decorative Background Chart */}
        <div className="absolute right-0 bottom-0 opacity-20 pointer-events-none">
          <svg width="200" height="100" viewBox="0 0 200 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 100L50 40L100 70L200 10" stroke="white" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <p className="text-[10px] text-indigo-200 font-bold tracking-widest uppercase mb-1">Projected Annual Cost</p>
            <h2 className="text-4xl font-black text-white">₹{totalAnnualCost.toLocaleString()}</h2>
            <div className="mt-3 inline-block bg-indigo-900/40 px-3 py-1.5 rounded-sm text-[10px] font-bold text-indigo-100 uppercase tracking-widest">
              {roster.length} Active Services
            </div>
          </div>

          {/* 🔥 NEW SAVINGS METRIC (Only shows if there are flagged leaks) */}
          {projectedSavings > 0 && (
            <div className="bg-zinc-900/40 p-3 rounded-sm border border-emerald-500/20 backdrop-blur-sm">
              <p className="text-[10px] text-emerald-400 font-bold tracking-widest uppercase mb-1 flex items-center gap-1">
                <TrendingDown className="w-3 h-3" /> Potential Savings
              </p>
              <h2 className="text-2xl font-bold text-emerald-400">₹{projectedSavings.toLocaleString()}</h2>
            </div>
          )}
        </div>
      </div>

      {/* 📋 ROSTER LIST */}
      <div className="bg-[#0a0a0a] border border-zinc-800 rounded-sm overflow-hidden">
        <div className="p-4 border-b border-zinc-800 flex items-center gap-2 bg-zinc-900/50">
          <CreditCard className="w-4 h-4 text-zinc-400" />
          <h3 className="text-xs font-bold text-white tracking-widest uppercase">Active Roster</h3>
        </div>

        <div className="divide-y divide-zinc-800">
          {roster.length === 0 ? (
             <div className="p-8 text-center text-zinc-500 text-xs font-bold uppercase tracking-wider">
               No subscriptions detected yet.
             </div>
          ) : (
            roster.map((sub, index) => (
              <div key={index} className="p-5 hover:bg-zinc-900/30 transition-colors">
                
                {/* Main Subscription Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-sm bg-zinc-800 border border-zinc-700 flex items-center justify-center text-white font-black shadow-inner">
                      {sub.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white uppercase tracking-wider">{sub.name}</h4>
                      <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-0.5">
                        Paid {sub.count} times • Last: {sub.lastDate}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-white">₹{sub.latestAmount}</span>
                    <span className="text-[10px] text-zinc-500 font-bold uppercase ml-1">/mo</span>
                  </div>
                </div>

                {/* 🔥 DYNAMIC WARNING: Only appears if count >= 5 */}
                {sub.isFlagged ? (
                  <div className="ml-14 p-4 border border-red-900/50 bg-red-950/20 rounded-sm">
                    <div className="flex items-start gap-2 mb-3">
                      <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                      <div>
                        <h5 className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-1">Recurrent Leak Flag</h5>
                        <p className="text-xs text-zinc-400 leading-relaxed">
                          You have paid for this service {sub.count} times. Are you logging enough activity to justify ₹{sub.annualCost.toLocaleString()} a year?
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 pl-6">
                      <button className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-sm text-[10px] font-bold text-white uppercase tracking-widest transition-colors">
                        Keep
                      </button>
                      <button className="px-4 py-2 bg-red-900/30 hover:bg-red-900/50 border border-red-900/50 rounded-sm text-[10px] font-bold text-red-400 uppercase tracking-widest transition-colors">
                        Flag to Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="ml-14 flex items-center gap-1.5 text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                    <Activity className="w-3 h-3" /> Still evaluating value (Need {5 - sub.count} more cycles)
                  </div>
                )}

              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
};

export default SubscriptionView;