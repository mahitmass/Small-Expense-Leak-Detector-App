import React from 'react';
import { CalendarClock, AlertTriangle } from 'lucide-react';
import { useExpenses } from '../../context/ExpenseContext';

const SubscriptionAlerts = () => {
    const { upcomingSubscriptions } = useExpenses();

    if (!upcomingSubscriptions || upcomingSubscriptions.length === 0) return null;

    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-sm p-4 shadow-xl mb-4 animate-in fade-in slide-in-from-top-2">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 mb-3">
                <CalendarClock className="w-4 h-4 text-indigo-400" /> Upcoming Auto-Debits
            </h3>
            <div className="space-y-2">
                {upcomingSubscriptions.map((sub, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3 bg-[#0a0a0a] rounded-sm border border-zinc-800">
                        <div className="flex items-center gap-3">
                            <AlertTriangle className="w-4 h-4 text-amber-500" />
                            <div>
                                <p className="text-sm font-bold text-white uppercase">{sub.description}</p>
                                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                                    {sub.daysUntil === 0 ? 'EXPECTED TODAY' : `IN ${sub.daysUntil} DAYS`} ({sub.nextExpectedDate})
                                </p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-black text-amber-500">₹{sub.amount}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SubscriptionAlerts;
