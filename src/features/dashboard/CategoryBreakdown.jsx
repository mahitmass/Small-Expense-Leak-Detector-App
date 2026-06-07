/* src/components/CategoryBreakdown.jsx */
import React from 'react';
import { PieChart, TrendingUp, CreditCard, ShoppingBag, Coffee, Map, HeartPulse, GraduationCap, Zap, Landmark } from 'lucide-react';

const CategoryBreakdown = ({ expenses }) => {
  const CATEGORY_STYLES = {
    food: { color: '#F59E0B', label: 'Food', icon: <Coffee className="w-4 h-4" /> },
    snacks: { color: '#EF4444', label: 'Snacks', icon: <Coffee className="w-4 h-4" /> },
    travel: { color: '#3B82F6', label: 'Travel', icon: <Map className="w-4 h-4" /> },
    transport: { color: '#3B82F6', label: 'Travel', icon: <Map className="w-4 h-4" /> },
    subscription: { color: '#8B5CF6', label: 'Subs', icon: <TrendingUp className="w-4 h-4" /> },
    shopping: { color: '#EC4899', label: 'Shopping', icon: <ShoppingBag className="w-4 h-4" /> },
    entertainment: { color: '#A855F7', label: 'Fun', icon: <CreditCard className="w-4 h-4" /> },
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

  let gradientString = '';
  let accumulatedPct = 0;
  Object.entries(totals).forEach(([cat, amount]) => {
    const pct = (amount / grandTotal) * 100;
    const color = (CATEGORY_STYLES[cat] || CATEGORY_STYLES.misc).color;
    gradientString += `${color} ${accumulatedPct}% ${accumulatedPct + pct}%, `;
    accumulatedPct += pct;
  });
  
  gradientString = gradientString.slice(0, -2); 
  if (!grandTotal) gradientString = '#18181b 0% 100%';

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest bg-[#0a0a0a] px-2 py-1 rounded-sm border border-zinc-800">
          TOTAL SPENT: ₹{grandTotal.toLocaleString()}
        </span>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-8">
        <div className="relative w-40 h-40 flex-shrink-0">
          <div 
            className="w-full h-full rounded-full"
            style={{ background: `conic-gradient(${gradientString})` }}
          ></div>
          <div className="absolute inset-0 m-auto w-24 h-24 bg-zinc-900 rounded-full flex items-center justify-center flex-col shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]">
            <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">Total</span>
            <span className="text-sm font-black text-white">₹{grandTotal}</span>
          </div>
        </div>

        <div className="w-full space-y-3">
          {Object.entries(totals)
            .sort(([,a], [,b]) => b - a)
            .map(([category, total]) => {
            const style = CATEGORY_STYLES[category] || CATEGORY_STYLES.misc;
            const percentage = grandTotal > 0 ? ((total / grandTotal) * 100).toFixed(1) : 0;
            
            return (
              <div key={category} className="group">
                <div className="flex justify-between text-[11px] mb-1.5 font-bold uppercase tracking-wider">
                  <span className="text-zinc-300 flex items-center gap-2">
                    <span style={{ color: style.color }}>{style.icon}</span>
                    {style.label}
                  </span>
                  <div className="text-right">
                    <span className="text-white mr-2">₹{total}</span>
                    <span className="text-zinc-500">({percentage}%)</span>
                  </div>
                </div>
                <div className="w-full bg-[#0a0a0a] border border-zinc-800 h-1.5 rounded-none overflow-hidden">
                  <div 
                    className="h-full transition-all duration-500"
                    style={{ width: `${percentage}%`, backgroundColor: style.color }}
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