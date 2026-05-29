/* src/components/CategoryBreakdown.jsx */
import React from 'react';
import { PieChart, TrendingUp, CreditCard, ShoppingBag, Coffee, Map, HeartPulse, GraduationCap, Zap, Landmark } from 'lucide-react';

const CategoryBreakdown = ({ expenses }) => {
  // Category Metadata for visuals
  const CATEGORY_STYLES = {
    // Leaks
    food: { color: '#F59E0B', label: 'Food', icon: <Coffee className="w-4 h-4" /> },
    snacks: { color: '#EF4444', label: 'Snacks', icon: <Coffee className="w-4 h-4" /> },
    travel: { color: '#3B82F6', label: 'Travel', icon: <Map className="w-4 h-4" /> },
    transport: { color: '#3B82F6', label: 'Travel', icon: <Map className="w-4 h-4" /> },
    subscription: { color: '#8B5CF6', label: 'Subs', icon: <TrendingUp className="w-4 h-4" /> },
    shopping: { color: '#EC4899', label: 'Shopping', icon: <ShoppingBag className="w-4 h-4" /> },
    entertainment: { color: '#A855F7', label: 'Fun', icon: <CreditCard className="w-4 h-4" /> },

    // Needs (New)
    healthcare: { color: '#10B981', label: 'Health', icon: <HeartPulse className="w-4 h-4" /> },
    education: { color: '#06B6D4', label: 'Education', icon: <GraduationCap className="w-4 h-4" /> },
    bills: { color: '#EAB308', label: 'Bills', icon: <Zap className="w-4 h-4" /> },
    investment: { color: '#22C55E', label: 'Invest', icon: <Landmark className="w-4 h-4" /> },
    
    misc: { color: '#94A3B8', label: 'Misc', icon: <CreditCard className="w-4 h-4" /> }
  };

  const calculateCategoryTotals = () => {
    const totals = {};
    let grandTotal = 0;
    
    expenses.forEach(expense => {
      const cat = expense.category.toLowerCase();
      totals[cat] = (totals[cat] || 0) + expense.amount;
      grandTotal += expense.amount;
    });
    return { totals, grandTotal };
  };

  const { totals, grandTotal } = calculateCategoryTotals();

  // Calculate distinct segments for the CSS gradient
  let gradientString = '';
  let accumulatedPct = 0;
  
  Object.entries(totals).forEach(([cat, amount]) => {
    const pct = (amount / grandTotal) * 100;
    const color = (CATEGORY_STYLES[cat] || CATEGORY_STYLES.misc).color;
    
    gradientString += `${color} ${accumulatedPct}% ${accumulatedPct + pct}%, `;
    accumulatedPct += pct;
  });
  
  gradientString = gradientString.slice(0, -2); // Remove trailing comma

  if (!grandTotal) {
    gradientString = '#334155 0% 100%';
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <PieChart className="w-5 h-5 text-purple-400" />
          Spending Breakdown
        </h2>
        <span className="text-xs font-mono text-slate-400 bg-slate-900 px-2 py-1 rounded">
          TOTAL: ₹{grandTotal.toLocaleString()}
        </span>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-8">
        {/* CSS Pie Chart */}
        <div className="relative w-48 h-48 flex-shrink-0">
          <div 
            className="w-full h-full rounded-full shadow-2xl"
            style={{ 
              background: `conic-gradient(${gradientString})`,
              boxShadow: '0 0 40px -10px rgba(0,0,0,0.5)'
            }}
          ></div>
          <div className="absolute inset-0 m-auto w-32 h-32 bg-slate-800 rounded-full flex items-center justify-center flex-col">
            <span className="text-xs text-slate-400">Total Spent</span>
            <span className="text-lg font-bold text-white">₹{grandTotal}</span>
          </div>
        </div>

        {/* Legend */}
        <div className="w-full space-y-3">
          {Object.entries(totals)
            .sort(([,a], [,b]) => b - a)
            .map(([category, total]) => {
            const style = CATEGORY_STYLES[category] || CATEGORY_STYLES.misc;
            const percentage = grandTotal > 0 ? ((total / grandTotal) * 100).toFixed(1) : 0;
            
            return (
              <div key={category} className="group">
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-slate-300 flex items-center gap-2">
                    <span style={{ color: style.color }}>{style.icon}</span>
                    {style.label}
                  </span>
                  <div className="text-right">
                    <span className="font-bold text-white mr-2">₹{total}</span>
                    <span className="text-xs text-slate-500">({percentage}%)</span>
                  </div>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-500 group-hover:brightness-110"
                    style={{ 
                      width: `${percentage}%`, 
                      backgroundColor: style.color 
                    }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CategoryBreakdown;