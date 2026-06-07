/* src/features/transactions/ExpenseList.jsx */
import React from 'react';
import { Coffee, Smartphone, CreditCard, Moon, Sun, ShoppingBag, Map, Trash2, HeartPulse, GraduationCap, Zap, Landmark } from 'lucide-react';

const ExpenseList = ({ expenses, onDelete }) => {
  const LEAK_CATEGORIES = ["food", "subscription", "shopping", "transport", "entertainment", "snacks"];

  const getCategoryDetails = (category) => {
    switch (category) {
      // Original Categories
      case 'food': return { icon: <Coffee className="w-4 h-4" />, color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20' };
      case 'snacks': return { icon: <Coffee className="w-4 h-4" />, color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20' };
      case 'subscription': return { icon: <Smartphone className="w-4 h-4" />, color: 'text-indigo-500', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20' };
      case 'transport': return { icon: <Map className="w-4 h-4" />, color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20' };
      case 'shopping': return { icon: <ShoppingBag className="w-4 h-4" />, color: 'text-pink-500', bg: 'bg-pink-500/10', border: 'border-pink-500/20' };
      case 'entertainment': return { icon: <CreditCard className="w-4 h-4" />, color: 'text-violet-500', bg: 'bg-violet-500/10', border: 'border-violet-500/20' };
      
      // 🔥 RESTORED CATEGORIES (Upgraded to Lucide Icons)
      case 'healthcare': return { icon: <HeartPulse className="w-4 h-4" />, color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' };
      case 'education': return { icon: <GraduationCap className="w-4 h-4" />, color: 'text-cyan-500', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20' };
      case 'bills': return { icon: <Zap className="w-4 h-4" />, color: 'text-yellow-500', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' };
      case 'investment': return { icon: <Landmark className="w-4 h-4" />, color: 'text-green-500', bg: 'bg-green-500/10', border: 'border-green-500/20' };
      
      default: return { icon: <CreditCard className="w-4 h-4" />, color: 'text-zinc-400', bg: 'bg-[#0a0a0a]', border: 'border-zinc-800' };
    }
  };

  if (expenses.length === 0) {
    return (
      <div className="text-center py-12 border border-zinc-800 border-dashed rounded-sm bg-[#0a0a0a]">
        <div className="w-12 h-12 bg-zinc-900 border border-zinc-800 rounded-sm flex items-center justify-center mx-auto mb-3">
          <CreditCard className="w-5 h-5 text-zinc-600" />
        </div>
        <h3 className="text-zinc-400 font-bold text-xs uppercase tracking-wider">No history</h3>
        <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest mt-1">Add an expense to start.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider">History</h2>
        <span className="text-[9px] font-bold tracking-widest uppercase text-zinc-500 bg-[#0a0a0a] border border-zinc-800 px-2 py-1 rounded-sm">
          {expenses.length} Records
        </span>
      </div>
      
      <div className="space-y-2">
        {expenses.map(expense => {
          const style = getCategoryDetails(expense.category);
          const isLeak = LEAK_CATEGORIES.includes(expense.category);
          
          // 🔥 RESTORED LOGIC: Only show Day/Night for Food and Snacks
          const showTime = ['food', 'snacks'].includes(expense.category);
          
          return (
            <div 
              key={expense.id} 
              className={`flex items-center justify-between p-3.5 rounded-sm transition-all group border ${
                isLeak 
                  ? 'bg-red-500/5 border-red-500/20 hover:border-red-500/40' 
                  : 'bg-zinc-900 border-zinc-800 hover:border-zinc-600'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div className={`p-2.5 rounded-sm ${style.bg} ${style.color} ${style.border} border relative`}>
                  {style.icon}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-zinc-200 flex items-center gap-2 uppercase tracking-wide">
                    {expense.description}
                    {isLeak && (
                      <span className="text-[8px] font-black bg-red-500 text-white px-1.5 py-0.5 rounded-sm uppercase tracking-widest">
                        Leak
                      </span>
                    )}
                  </h3>
                  <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-zinc-500 mt-1">
                    <span>{expense.category}</span>
                    <span>•</span>
                    <span>{expense.date}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className={`text-sm font-black ${isLeak ? 'text-red-500' : 'text-zinc-300'}`}>
                    ₹{expense.amount.toFixed(0)}
                  </div>
                  
                  {/* 🔥 RESTORED LOGIC: Conditional Render Time Icon */}
                  {showTime && (
                    <div className="flex items-center justify-end gap-1 text-[9px] font-bold uppercase tracking-widest text-zinc-500 mt-0.5">
                       {expense.time === 'night' ? <Moon className="w-2.5 h-2.5 text-indigo-400" /> : <Sun className="w-2.5 h-2.5 text-amber-500" />}
                       <span>{expense.time}</span>
                    </div>
                  )}
                </div>

                <button 
                  onClick={() => onDelete && onDelete(expense.id)}
                  className="p-2 text-zinc-600 hover:text-red-500 hover:bg-red-500/10 rounded-sm transition-colors"
                  title="Delete transaction"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ExpenseList;