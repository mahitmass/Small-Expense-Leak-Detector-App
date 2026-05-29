/* InsightsView.jsx */
import React from 'react';
import { useExpenses } from '../../context/ExpenseContext'; // Adjust path if it's in components/ instead of features/

const InsightsView = () => {
  const { expenses, insights } = useExpenses();

  // Dynamic Math instead of hardcoded numbers!
  const snacksTotal = expenses.filter(e => e.category === 'snacks').reduce((sum, e) => sum + e.amount, 0);
  const nightTotal = expenses.filter(e => e.time === 'night').reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
      {/* Monthly Projection */}
      <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6 shadow-lg">
        <h2 className="text-xl font-bold text-white mb-6">Monthly Impact Projection</h2>
        <div className="space-y-4">
          <div className="p-4 bg-gradient-to-r from-red-500/10 to-red-500/5 border border-red-500/20 rounded-xl">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium text-red-200">Snacks & Coffee</p>
                <p className="text-sm text-red-400">Current monthly drain</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-red-400">₹{snacksTotal}</p>
                <p className="text-xs text-red-300/70">per month</p>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-gradient-to-r from-yellow-500/10 to-yellow-500/5 border border-yellow-500/20 rounded-xl">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium text-yellow-200">Late-Night Orders</p>
                <p className="text-sm text-yellow-400">Vampire spending</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-yellow-400">₹{nightTotal}</p>
                <p className="text-xs text-yellow-300/70">per month</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Behavioral Insights */}
      <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6 shadow-lg">
        <h2 className="text-xl font-bold text-white mb-6">Behavioral Insights</h2>
        <div className="space-y-4">
          {insights.length === 0 ? (
             <div className="p-4 text-center text-slate-500 border border-slate-700 rounded-xl">No active behavioral alerts!</div>
          ) : (
             insights.map(insight => (
              <div key={insight.id} className="flex items-center justify-between p-4 border border-slate-700 rounded-xl hover:bg-slate-700/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`p-3 bg-${insight.severity === 'high' ? 'red' : 'blue'}-500/10 rounded-xl`}>
                    <span className="text-xl">{insight.type === 'habit' ? '🌙' : '💡'}</span>
                  </div>
                  <div>
                    <p className="font-medium text-slate-200">{insight.title}</p>
                    <p className="text-sm text-slate-400">{insight.message}</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-slate-700 text-slate-300 text-xs font-bold rounded-full uppercase tracking-wider">
                  {insight.type}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default InsightsView;