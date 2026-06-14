/* src/features/dashboard/Dashboard.jsx */
import React, { useMemo, useEffect } from 'react';
import { TrendingDown, AlertCircle, Wallet, Activity } from 'lucide-react';
import { useExpenses } from '../../context/ExpenseContext';

import ExpenseForm from '../transactions/ExpenseForm';
import LeakScoreCard from './LeakScoreCard';
import CategoryBreakdown from './CategoryBreakdown';
import InsightsPanel from './InsightsPanel';
import SubscriptionAlerts from './SubscriptionAlerts';

const Dashboard = () => {
  // 🔥 UPDATED: Pulled syncForegroundSMS from global state context
  const { expenses, insights, setInsights, leakScore, handleAddExpense, syncForegroundSMS } = useExpenses();

  // 🔥 THE SILENT TRIGGER: Automatically updates ledger records on dashboard mount
  useEffect(() => {
    console.log("Dashboard loaded. Executing silent background bank SMS scan...");
    if (typeof syncForegroundSMS === 'function') {
      syncForegroundSMS();
    }
  }, [syncForegroundSMS]);

  const stats = useMemo(() => {
    const totalSpent = expenses.reduce((sum, item) => sum + item.amount, 0);
    const LEAK_CATEGORIES = ["food", "subscription", "shopping", "transport", "entertainment", "snacks"];
    
    const leakageItems = expenses.filter(e => LEAK_CATEGORIES.includes(e.category.toLowerCase()));
    const totalLeakage = leakageItems.reduce((sum, item) => sum + item.amount, 0);
    const potentialSavings = Math.round(totalLeakage * 0.40);

    return { totalSpent, totalLeakage, potentialSavings, leakCount: leakageItems.length };
  }, [expenses]);

  const metrics = [
    { title: 'Monthly Leakage', value: `₹${stats.totalLeakage.toLocaleString()}`, description: 'Money drained on non-essentials', icon: <TrendingDown className="text-red-500 w-6 h-6" />, bg: 'bg-red-500/10', border: 'border-red-500/20', text: 'text-red-500' },
    { title: 'Active Leaks', value: stats.leakCount, description: 'Transactions flagged', icon: <AlertCircle className="text-amber-500 w-6 h-6" />, bg: 'bg-amber-500/10', border: 'border-amber-500/20', text: 'text-amber-500' },
    { title: 'Potential Savings', value: `₹${stats.potentialSavings.toLocaleString()}`, description: 'If you optimize spending', icon: <Wallet className="text-emerald-500 w-6 h-6" />, bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-500' }
  ];

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Top Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {metrics.map(metric => (
          <div key={metric.title} className="bg-zinc-900 p-5 rounded-sm border border-zinc-800 shadow-[0_0_15px_rgba(0,0,0,0.5)] group">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2.5 rounded-lg ${metric.bg} border ${metric.border}`}>{metric.icon}</div>
              <span className={`text-[9px] font-bold ${metric.text} ${metric.bg} px-2 py-1 rounded-sm uppercase tracking-widest border ${metric.border}`}>LIVE</span>
            </div>
            <div>
              <p className="text-zinc-400 text-[11px] font-bold uppercase tracking-wider mb-1">{metric.title}</p>
              <p className="text-3xl font-black text-white tracking-tight">{metric.value}</p>
              <p className="text-[10px] text-zinc-500 mt-1">{metric.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 items-start">
        <div className="xl:col-span-4 space-y-4 xl:sticky xl:top-6 z-0">
          <LeakScoreCard leakScore={leakScore} />
          <SubscriptionAlerts />

          <div className="bg-zinc-900 rounded-sm border border-zinc-800 shadow-xl">
            <div className="p-4 border-b border-zinc-800 flex justify-between items-center">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Activity className="w-4 h-4 text-indigo-400" /> Quick Add
              </h3>
            </div>
            <ExpenseForm onAddExpense={handleAddExpense} />
          </div>
        </div>
        
        <div className="xl:col-span-8 space-y-4">
          <div className="bg-zinc-900 rounded-sm border border-zinc-800 p-5 shadow-xl">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Spending Breakdown</h3>
             {expenses.length > 0 ? (
                 <CategoryBreakdown expenses={expenses} />
             ) : (
                 <div className="p-8 text-center flex flex-col items-center gap-2">
                    <Activity className="w-8 h-8 text-zinc-700" />
                    <p className="text-xs text-zinc-500 font-semibold uppercase tracking-widest">No data yet. Add an expense!</p>
                 </div>
             )}
          </div>

          <div className="bg-zinc-900 rounded-sm border border-zinc-800 p-5 shadow-xl min-h-[300px]">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Smart Alerts</h3>
            {insights.length > 0 ? (
                <InsightsPanel 
                  insights={insights} 
                  onDismissInsight={(id) => setInsights(insights.filter(i => i.id !== id))} 
                  personality={expenses.length === 0 ? 'The Saver' : 'The Spender'}
                />
            ) : (
                <div className="flex flex-col items-center justify-center h-40 bg-[#0a0a0a] rounded-sm border border-zinc-800/50 gap-2">
                    <AlertCircle className="w-6 h-6 text-zinc-700" />
                    <p className="text-xs text-zinc-500 font-semibold uppercase tracking-widest">Spending is clean. No alerts!</p>
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;