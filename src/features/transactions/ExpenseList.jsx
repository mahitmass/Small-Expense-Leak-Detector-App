/* src/components/ExpenseList.jsx */
import React from 'react';
import { Coffee, Smartphone, CreditCard, Moon, Sun, ShoppingBag, Map, Trash2 } from 'lucide-react';

const ExpenseList = ({ expenses, onDelete }) => {
  const LEAK_CATEGORIES = ["food", "subscription", "shopping", "transport", "entertainment", "snacks"];

  const getCategoryDetails = (category) => {
    switch (category) {
      case 'food': return { icon: <Coffee className="w-5 h-5" />, color: 'text-orange-400', bg: 'bg-orange-500/10' };
      case 'snacks': return { icon: <Coffee className="w-5 h-5" />, color: 'text-red-400', bg: 'bg-red-500/10' };
      case 'subscription': return { icon: <Smartphone className="w-5 h-5" />, color: 'text-purple-400', bg: 'bg-purple-500/10' };
      case 'transport': return { icon: <Map className="w-5 h-5" />, color: 'text-blue-400', bg: 'bg-blue-500/10' };
      case 'shopping': return { icon: <ShoppingBag className="w-5 h-5" />, color: 'text-pink-400', bg: 'bg-pink-500/10' };
      case 'entertainment': return { icon: <CreditCard className="w-5 h-5" />, color: 'text-purple-400', bg: 'bg-purple-500/10' };
      case 'healthcare': return { icon: <div className="w-5 h-5 text-center">🏥</div>, color: 'text-emerald-400', bg: 'bg-emerald-500/10' };
      case 'education': return { icon: <div className="w-5 h-5 text-center">🎓</div>, color: 'text-cyan-400', bg: 'bg-cyan-500/10' };
      case 'bills': return { icon: <div className="w-5 h-5 text-center">⚡</div>, color: 'text-yellow-400', bg: 'bg-yellow-500/10' };
      case 'investment': return { icon: <div className="w-5 h-5 text-center">📈</div>, color: 'text-green-400', bg: 'bg-green-500/10' };
      default: return { icon: <CreditCard className="w-5 h-5" />, color: 'text-slate-400', bg: 'bg-slate-500/10' };
    }
  };

  if (expenses.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <CreditCard className="w-8 h-8 text-slate-600" />
        </div>
        <h3 className="text-white font-medium">No transactions yet</h3>
        <p className="text-slate-500 text-sm mt-1">Add an expense to start tracking leaks.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        Transaction History
        <span className="text-xs font-normal text-slate-500 bg-slate-800 px-2 py-1 rounded-full">{expenses.length}</span>
      </h2>
      <div className="space-y-3">
        {expenses.map(expense => {
          const style = getCategoryDetails(expense.category);
          const isLeak = LEAK_CATEGORIES.includes(expense.category);
          
          // Only show Day/Night for Food and Snacks
          const showTime = ['food', 'snacks'].includes(expense.category);
          
          return (
            <div 
              key={expense.id} 
              className={`flex items-center justify-between p-4 rounded-xl transition-all group border ${
                isLeak 
                  ? 'bg-red-500/5 border-red-500/30 hover:border-red-500/50 hover:bg-red-500/10' 
                  : 'bg-slate-900/50 border-slate-700/50 hover:border-slate-600 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${style.bg} ${style.color} group-hover:scale-110 transition-transform relative`}>
                  {style.icon}
                  {isLeak && (
                    <div className="absolute -top-1 -right-1 bg-red-500 w-2.5 h-2.5 rounded-full border-2 border-slate-900 animate-pulse"></div>
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-slate-200 flex items-center gap-2">
                    {expense.description}
                    {isLeak && (
                      <span className="text-[10px] font-bold bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded border border-red-500/20 uppercase tracking-wider">
                        Leak
                      </span>
                    )}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                    <span className="capitalize px-2 py-0.5 bg-slate-800 rounded text-slate-400">{expense.category}</span>
                    <span>{expense.date}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className={`text-lg font-bold ${isLeak ? 'text-red-400' : 'text-[#FFD700]'}`}>
                    ₹{expense.amount.toFixed(0)}
                  </div>
                  
                  {/* CONDITIONAL RENDER: Time Icon */}
                  {showTime && (
                    <div className="flex items-center justify-end gap-1 text-xs text-slate-500 mt-1">
                       {expense.time === 'night' ? <Moon className="w-3 h-3 text-purple-400" /> : <Sun className="w-3 h-3 text-amber-400" />}
                       <span className="capitalize">{expense.time}</span>
                    </div>
                  )}
                </div>

                <button 
                  onClick={() => onDelete && onDelete(expense.id)}
                  className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
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