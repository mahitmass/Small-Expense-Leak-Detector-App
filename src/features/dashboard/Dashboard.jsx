/* src/features/dashboard/Dashboard.jsx */
import React, { useMemo } from 'react';
import { TrendingDown, AlertCircle, Activity, Wallet } from 'lucide-react';
import { useExpenses } from '../../context/ExpenseContext';

// Import the pieces directly instead of using fragile "children" arrays
import ExpenseForm from '../transactions/ExpenseForm';
import LeakScoreCard from './LeakScoreCard';
import CategoryBreakdown from './CategoryBreakdown';
import InsightsPanel from './InsightsPanel';

const Dashboard = () => {
  // Grab everything directly from Context! No more prop drilling.
  const { expenses, insights, setInsights, leakScore, handleAddExpense } = useExpenses();

  // --- REAL-TIME CALCULATIONS ---
  const stats = useMemo(() => {
    const totalSpent = expenses.reduce((sum, item) => sum + item.amount, 0);
    
    // Better: Import this from constants in the future, but keeping it safe for now
    const LEAK_CATEGORIES = ["food", "subscription", "shopping", "transport", "entertainment", "snacks"];
    
    const leakageItems = expenses.filter(e => LEAK_CATEGORIES.includes(e.category));
    const totalLeakage = leakageItems.reduce((sum, item) => sum + item.amount, 0);
    const potentialSavings = Math.round(totalLeakage * 0.40);

    return { totalSpent, totalLeakage, potentialSavings, leakCount: leakageItems.length };
  }, [expenses]);

  const metrics = [
    { title: 'Monthly Leakage', value: `₹${stats.totalLeakage.toLocaleString()}`, description: 'Money drained on non-essentials', icon: <TrendingDown className="text-red-400 w-6 h-6" />, bg: 'bg-red-500/10', text: 'text-red-400' },
    { title: 'Active Leaks', value: stats.leakCount, description: 'Transactions flagged', icon: <AlertCircle className="text-yellow-400 w-6 h-6" />, bg: 'bg-yellow-500/10', text: 'text-yellow-400' },
    { title: 'Potential Savings', value: `₹${stats.potentialSavings.toLocaleString()}`, description: 'If you optimize spending', icon: <Wallet className="text-emerald-400 w-6 h-6" />, bg: 'bg-emerald-500/10', text: 'text-emerald-400' }
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Top Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {metrics.map(metric => (
          <div key={metric.title} className="bg-slate-800 p-5 rounded-2xl border border-slate-700 shadow-lg hover:border-slate-600 transition-colors group">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${metric.bg} group-hover:scale-110 transition-transform`}>{metric.icon}</div>
              <span className={`text-xs font-bold ${metric.text} bg-slate-900/50 px-2 py-1 rounded-lg uppercase tracking-wider`}>Live</span>
            </div>
            <div>
              <p className="text-slate-400 text-sm font-medium mb-1">{metric.title}</p>
              <p className="text-2xl font-bold text-white tracking-tight">{metric.value}</p>
              <p className="text-xs text-slate-500 mt-2">{metric.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: Hero Score & Forms (4 cols) */}
        <div className="xl:col-span-4 space-y-6 xl:sticky xl:top-6 z-0">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl opacity-75 blur group-hover:opacity-100 transition duration-1000"></div>
            <div className="relative">
              <LeakScoreCard leakScore={leakScore} />
            </div>
          </div>

          <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden shadow-xl">
            <div className="p-4 border-b border-slate-700 bg-slate-800/50 backdrop-blur flex justify-between items-center">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-400" /> Quick Add
              </h3>
            </div>
            <div className="p-1">
              <ExpenseForm onAddExpense={handleAddExpense} />
            </div>
          </div>
        </div>
        
        {/* RIGHT COLUMN: Visuals & Insights (8 cols) */}
        <div className="xl:col-span-8 space-y-6">
          <div className="bg-slate-800 rounded-2xl border border-slate-700 p-1 shadow-xl">
             {expenses.length > 0 ? (
                 <CategoryBreakdown expenses={expenses} />
             ) : (
                 <div className="p-8 text-center text-slate-500">No data to breakdown yet. Add an expense!</div>
             )}
          </div>

          <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6 shadow-xl min-h-[300px]">
            <h3 className="text-lg font-bold text-white mb-4">Smart Alerts</h3>
            {insights.length > 0 ? (
                <InsightsPanel 
                  insights={insights} 
                  onDismissInsight={(id) => setInsights(insights.filter(i => i.id !== id))} 
                  personality={expenses.length === 0 ? 'The Saver' : 'The Spender'}
                />
            ) : (
                <div className="flex items-center justify-center h-40 text-slate-500 bg-slate-900/50 rounded-xl border border-dashed border-slate-700">
                    Your spending looks clean. No alerts!
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;