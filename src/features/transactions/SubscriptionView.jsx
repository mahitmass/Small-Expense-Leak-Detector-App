/* src/features/transactions/SubscriptionView.jsx */
import React from 'react';
import { CreditCard, TrendingUp, AlertTriangle } from 'lucide-react';

const SubscriptionView = ({ expenses }) => {
  const subs = expenses.filter(e => e.category === 'subscription');
  const totalMonthly = subs.reduce((sum, e) => sum + e.amount, 0);
  const totalYearly = totalMonthly * 12;

  return (
    <div className="animate-fade-in space-y-4">
      <div className="bg-indigo-600 rounded-sm p-6 shadow-2xl text-white relative overflow-hidden">
        <div className="absolute -right-10 -top-10 opacity-10">
           <TrendingUp className="w-48 h-48" />
        </div>
        <div className="relative z-10">
          <p className="text-[10px] font-bold text-indigo-200 uppercase tracking-widest mb-1">Projected Annual Cost</p>
          <h2 className="text-4xl font-black mb-4">₹{totalYearly.toLocaleString()}</h2>
          <p className="text-[10px] font-bold text-indigo-100 uppercase tracking-widest bg-black/20 inline-block px-3 py-1.5 rounded-sm border border-indigo-500/30">
            {subs.length} active services
          </p>
        </div>
      </div>

      <div className="bg-zinc-900 rounded-sm border border-zinc-800 shadow-xl">
        <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-[#0a0a0a]">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
             <CreditCard className="w-4 h-4 text-indigo-400" /> Active Roster
          </h3>
        </div>
        
        <div className="divide-y divide-zinc-800">
          {subs.length === 0 ? (
            <div className="p-8 text-center text-zinc-500 text-[10px] font-bold uppercase tracking-widest">No subscriptions detected.</div>
          ) : (
            subs.map((sub, index) => (
              <div key={sub.id} className="p-4 hover:bg-zinc-800/50 transition-colors">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-sm bg-[#0a0a0a] border border-zinc-800 flex items-center justify-center text-zinc-400 font-bold text-sm uppercase">
                      {sub.description.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-white text-sm uppercase tracking-wide">{sub.description}</p>
                      <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-0.5">Auto-debit on {sub.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-white text-sm">₹{sub.amount}/mo</p>
                  </div>
                </div>

                {index === 0 && (
                  <div className="mt-3 p-3 bg-red-500/5 border border-red-500/20 rounded-sm flex items-start gap-3">
                    <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest">AI Usage Check</p>
                      <p className="text-[11px] text-zinc-400 mt-1 mb-3">No logged activity in 5 months. Still using?</p>
                      <div className="flex gap-2">
                         <button className="text-[9px] font-bold uppercase tracking-widest bg-red-500/10 hover:bg-red-500/20 text-red-400 px-3 py-1.5 rounded-sm transition-colors border border-red-500/20">Keep</button>
                         <button className="text-[9px] font-bold uppercase tracking-widest bg-[#0a0a0a] hover:bg-zinc-800 text-zinc-400 px-3 py-1.5 rounded-sm transition-colors border border-zinc-800">Flag to Cancel</button>
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