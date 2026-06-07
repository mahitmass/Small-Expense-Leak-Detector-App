/* src/features/transactions/FriendsView.jsx */
import React, { useState } from 'react';
import { Users, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const FriendsView = ({ expenses }) => {
  // Filter only transactions that were marked as Contact/UPI payments
  const friendTxns = expenses.filter(e => e.isContactPayment);
  
  // Local state to handle the UI toggling of verified items
  const [verifiedStates, setVerifiedStates] = useState({});

  const handleVerify = (id, status) => {
    setVerifiedStates(prev => ({ ...prev, [id]: status }));
    // In the future, this should dispatch to ExpenseContext to update SQLite
  };

  if (friendTxns.length === 0) {
    return (
      <div className="text-center py-12 border border-zinc-800 border-dashed rounded-sm bg-[#0a0a0a] mt-4">
        <Users className="w-8 h-8 text-zinc-600 mx-auto mb-3" />
        <h3 className="text-zinc-400 font-bold text-xs uppercase tracking-wider">No Social Activity</h3>
        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">No contact payments detected.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="bg-indigo-600/10 border border-indigo-500/20 rounded-sm p-5 shadow-xl">
         <h2 className="text-sm font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-2 mb-2">
            <AlertCircle className="w-4 h-4" /> Social Leak Audit
         </h2>
         <p className="text-[11px] text-zinc-400 font-medium">
            Verify your contact transfers. Was this a legitimate shared expense (✔️) or did you spot a friend / make an impulse buy (❌)?
         </p>
      </div>

      <div className="space-y-3">
        {friendTxns.map(txn => {
          const verification = verifiedStates[txn.id];

          return (
            <div key={txn.id} className="bg-zinc-900 border border-zinc-800 rounded-sm p-4 transition-all hover:border-zinc-700">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-sm bg-[#0a0a0a] border border-zinc-800 flex items-center justify-center text-zinc-400 font-bold text-sm uppercase">
                    {txn.description.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-zinc-200 uppercase tracking-wide">{txn.description}</h3>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-500 mt-1">{txn.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-black text-white">₹{txn.amount}</span>
                </div>
              </div>

              {/* VERIFICATION UI */}
              <div className="flex items-center justify-between pt-3 border-t border-zinc-800/50">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Status:</span>
                
                {!verification ? (
                  <div className="flex gap-2">
                     <button onClick={() => handleVerify(txn.id, 'legit')} className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded-sm text-[9px] font-bold uppercase tracking-wider transition-colors">
                        <CheckCircle className="w-3 h-3" /> Legit Split
                     </button>
                     <button onClick={() => handleVerify(txn.id, 'leak')} className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-sm text-[9px] font-bold uppercase tracking-wider transition-colors">
                        <XCircle className="w-3 h-3" /> Social Leak
                     </button>
                  </div>
                ) : verification === 'legit' ? (
                  <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> Verified Expense
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest flex items-center gap-1">
                    <XCircle className="w-3 h-3" /> Flagged Leak
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FriendsView;