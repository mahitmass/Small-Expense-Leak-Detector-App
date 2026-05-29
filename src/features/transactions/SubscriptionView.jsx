/* src/features/transactions/SubscriptionView.jsx */
import React from 'react';
import { CreditCard, Trash2, TrendingUp, AlertTriangle } from 'lucide-react';

const SubscriptionView = ({ expenses }) => {
  const subs = expenses.filter(e => e.category === 'subscription');
  const totalMonthly = subs.reduce((sum, e) => sum + e.amount, 0);
  const totalYearly = totalMonthly * 12;

  return (
    <div className="animate-fade-in space-y-6">
      <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl p-6 shadow-2xl text-white">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-indigo-200 font-medium mb-1">Projected Annual Cost</p>
            <h2 className="text-4xl font-black">₹{totalYearly.toLocaleString()}</h2>
          </div>
          <div className="p-3 bg-white/10 rounded-xl backdrop-blur">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
        </div>
        <p className="text-sm text-indigo-200 mt-4 bg-black/20 inline-block px-3 py-1 rounded-lg">
          You are paying for {subs.length} active services
        </p>
      </div>

      <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-700 bg-slate-800/50 flex justify-between items-center">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
             <CreditCard className="w-4 h-4 text-violet-400" /> Active Subscriptions
          </h3>
        </div>
        
        <div className="divide-y divide-slate-700">
          {subs.length === 0 ? (
            <div className="p-8 text-center text-slate-500">No subscriptions detected yet.</div>
          ) : (
            subs.map((sub, index) => (
              <div key={sub.id} className="p-4 hover:bg-slate-700/30 transition-colors">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-violet-500/10 flex items-center justify-center text-violet-400 font-bold text-lg">
                      {sub.description.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-white">{sub.description}</p>
                      <p className="text-xs text-slate-400">Auto-debit on {sub.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-white">₹{sub.amount}/mo</p>
                  </div>
                </div>

                {/* AI Proactive Insight Check (Simulating 6-month check on random items) */}
                {index === 0 && (
                  <div className="mt-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
                    <div>
                      <p className="text-sm font-bold text-red-200">AI Usage Check</p>
                      <p className="text-xs text-red-300/80 mb-2">You haven't logged any activity related to this in 5 months. Are you still using it?</p>
                      <div className="flex gap-2">
                         <button className="text-[10px] bg-red-500/20 hover:bg-red-500/40 text-red-300 px-3 py-1 rounded-lg transition-colors border border-red-500/30">Yes, keep it</button>
                         <button className="text-[10px] bg-slate-900/50 hover:bg-slate-900 text-slate-300 px-3 py-1 rounded-lg transition-colors border border-slate-700">Flag for Cancellation</button>
                      </div>
                    </div>
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