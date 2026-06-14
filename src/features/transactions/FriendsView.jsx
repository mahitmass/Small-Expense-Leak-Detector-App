/* src/features/transactions/FriendsView.jsx */
import React, { useMemo } from 'react';
import { Users, ArrowUpRight, Search } from 'lucide-react';

const FriendsView = ({ expenses, contacts = [] }) => {
  const contactLedger = useMemo(() => {
    const transfers = expenses.filter(exp => exp.category === 'transfer' || exp.isContactPayment);
    const ledger = {};

    transfers.forEach(tx => {
      const rawName = tx.description.replace(/UPI|transfer|to|-/gi, ' ').trim();
      const extractedName = rawName.split(' ')[0] || "Unknown";

      // 🔥 THE SMART CONTACT FILTER
      // Try to find if this parsed name actually exists in your phone's contact list
      const matchedContact = contacts.find(c => 
        c.name.toLowerCase().includes(extractedName.toLowerCase())
      );

      // If we found a real contact, use their real full name! Otherwise, fallback.
      const displayName = matchedContact ? matchedContact.name : extractedName;

      // Filter out obvious non-human merchants that slipped through UPI
      const ignoreList = ['SWIGGY', 'ZOMATO', 'AMAZON', 'FLIPKART', 'UBER', 'OLA'];
      if (ignoreList.includes(displayName.toUpperCase())) return;

      if (!ledger[displayName]) {
        ledger[displayName] = { name: displayName, totalSent: 0, count: 0, lastTx: tx.date };
      }
      
      ledger[displayName].totalSent += tx.amount;
      ledger[displayName].count += 1;
      
      if (new Date(tx.date) > new Date(ledger[displayName].lastTx)) {
        ledger[displayName].lastTx = tx.date;
      }
    });

    return Object.values(ledger).sort((a, b) => b.totalSent - a.totalSent);
  }, [expenses, contacts]);

  return (
    <div className="pb-10 space-y-6 animate-fade-in">
      {/* Top summary card omitted for brevity, keep the same UI you had before! */}
      <div className="bg-zinc-900 rounded-sm border border-zinc-800 p-6 shadow-xl relative overflow-hidden">
        <div className="absolute right-[-20px] top-[-20px] opacity-10">
          <Users className="w-32 h-32 text-indigo-400" />
        </div>
        <div className="relative z-10">
          <p className="text-[10px] text-zinc-500 font-bold tracking-widest uppercase mb-1">Total Sent to Friends</p>
          <h2 className="text-3xl font-black text-white mb-2">
            ₹{contactLedger.reduce((sum, c) => sum + c.totalSent, 0).toLocaleString()}
          </h2>
          <div className="inline-block bg-indigo-500/10 px-3 py-1.5 rounded-sm border border-indigo-500/20 text-[10px] font-bold text-indigo-400 uppercase tracking-widest">
            {contactLedger.length} Verified Contacts
          </div>
        </div>
      </div>

      <div className="bg-[#0a0a0a] border border-zinc-800 rounded-sm overflow-hidden">
        <div className="p-4 border-b border-zinc-800 bg-zinc-900/50">
          <h3 className="text-xs font-bold text-white tracking-widest uppercase">Contact Leaderboard</h3>
        </div>

        <div className="divide-y divide-zinc-800">
          {contactLedger.length === 0 ? (
            <div className="p-8 text-center text-zinc-500 text-xs font-bold uppercase tracking-wider">
               No friends detected yet. Sync Contacts!
            </div>
          ) : (
            contactLedger.map((contact, idx) => (
              <div key={idx} className="p-4 hover:bg-zinc-900/30 transition-colors flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-white font-black shadow-inner">
                    {contact.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider">{contact.name}</h4>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-0.5">
                      {contact.count} transfers • Last: {contact.lastTx}
                    </p>
                  </div>
                </div>
                <div className="text-right flex items-center gap-2">
                  <span className="text-sm font-bold text-white">₹{contact.totalSent.toLocaleString()}</span>
                  <div className="w-6 h-6 rounded-sm bg-red-500/10 flex items-center justify-center border border-red-500/20">
                    <ArrowUpRight className="w-3 h-3 text-red-400" />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default FriendsView;