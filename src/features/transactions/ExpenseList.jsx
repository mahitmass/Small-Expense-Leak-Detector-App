/* src/features/transactions/ExpenseList.jsx */
import React from 'react';
import { Coffee, Smartphone, CreditCard, Moon, Sun, ShoppingBag, Map, Trash2, HeartPulse, GraduationCap, Zap, Landmark, RefreshCw } from 'lucide-react';
import { useExpenses } from '../../context/ExpenseContext';

const ExpenseList = ({ expenses, onDelete }) => {
  const { syncForegroundSMS, handleDeleteExpense } = useExpenses();
  const LEAK_CATEGORIES = ["food", "subscription", "shopping", "transport", "entertainment", "snacks"];

  const getCategoryDetails = (category) => {
    switch (category) {
      case 'food': return { icon: <Coffee className="w-4 h-4" />, color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20' };
      case 'snacks': return { icon: <Coffee className="w-4 h-4" />, color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20' };
      case 'subscription': return { icon: <Smartphone className="w-4 h-4" />, color: 'text-indigo-500', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20' };
      case 'transport': return { icon: <Map className="w-4 h-4" />, color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20' };
      case 'shopping': return { icon: <ShoppingBag className="w-4 h-4" />, color: 'text-pink-500', bg: 'bg-pink-500/10', border: 'border-pink-500/20' };
      case 'entertainment': return { icon: <CreditCard className="w-4 h-4" />, color: 'text-violet-500', bg: 'bg-violet-500/10', border: 'border-violet-500/20' };
      case 'healthcare': return { icon: <HeartPulse className="w-4 h-4" />, color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' };
      case 'education': return { icon: <GraduationCap className="w-4 h-4" />, color: 'text-cyan-500', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20' };
      case 'bills': return { icon: <Zap className="w-4 h-4" />, color: 'text-yellow-500', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' };
      case 'investment': return { icon: <Landmark className="w-4 h-4" />, color: 'text-green-500', bg: 'bg-green-500/10', border: 'border-green-500/20' };
      default: return { icon: <CreditCard className="w-4 h-4" />, color: 'text-zinc-400', bg: 'bg-[#0a0a0a]', border: 'border-zinc-800' };
    }
  };

  // 🔥 RESTORED: Fully Polished Empty-State Icon/Message Design
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
      {/* NEW UTILITY ACTION BAR */}
      <div className="flex items-center justify-between mb-4 bg-zinc-900/50 p-2 border border-zinc-800 rounded-sm">
        <button 
          onClick={syncForegroundSMS}
          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wider bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-sm transition-colors shadow-md"
        >
          <RefreshCw className="w-3 h-3" /> Sync Bank SMS
        </button>
        <span className="text-[9px] font-bold tracking-widest uppercase text-zinc-400 bg-black px-2 py-1.5 border border-zinc-800 rounded-sm">
          {expenses.length} Records
        </span>
      </div>
      
      <div className="space-y-2">
        {expenses.map(expense => {
          const style = getCategoryDetails(expense.category);
          const isLeak = LEAK_CATEGORIES.includes(expense.category);
          
          // 🔥 RESTORED: Day/Night evaluation limits
          const showTime = ['food', 'snacks'].includes(expense.category);
          
          return (
            <div 
              key={expense.id} 
              // 🔥 RESTORED: Complete Interactive Animation Transition and Hover States
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
                    {/* 🔥 RESTORED: The Crimson High-Visibility Leak Badge */}
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
                  {/* 🔥 RESTORED: Clean Float Rounding Rules */}
                  <div className={`text-sm font-black ${isLeak ? 'text-red-500' : 'text-zinc-300'}`}>
                    ₹{expense.amount.toFixed(0)}
                  </div>
                  
                  {/* 🔥 RESTORED: Conditional Render Time Icons */}
                  {showTime && (
                    <div className="flex items-center justify-end gap-1 text-[9px] font-bold uppercase tracking-widest text-zinc-500 mt-0.5">
                       {expense.time === 'night' ? <Moon className="w-2.5 h-2.5 text-indigo-400" /> : <Sun className="w-2.5 h-2.5 text-amber-500" />}
                       <span>{expense.time}</span>
                    </div>
                  )}
                </div>

                <button 
                  onClick={() => handleDeleteExpense(expense.id)} 
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