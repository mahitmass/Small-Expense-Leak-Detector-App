/* src/components/ExpenseForm.jsx */
import React, { useState } from 'react';
import { CreditCard, Sun, Moon } from 'lucide-react';
import { CATEGORIES } from '../../utils/constants';

const ExpenseForm = ({ onAddExpense }) => {
  const [expense, setExpense] = useState({
    amount: '',
    category: 'food',
    description: '',
    time: 'daytime'
  });

  // Helper: Only show time for Food & Snacks
  const showTimeContext = ['food', 'snacks'].includes(expense.category);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!expense.amount || !expense.description) return;
    
    const newExpense = {
      id: Date.now(),
      amount: parseFloat(expense.amount),
      category: expense.category,
      description: expense.description,
      date: new Date().toISOString().split('T')[0],
      // If hidden, default to 'daytime' to keep data clean
      time: showTimeContext ? expense.time : 'daytime'
    };
    
    onAddExpense(newExpense);
    setExpense({ amount: '', category: 'food', description: '', time: 'daytime' });
  };

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wide">Amount</label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-slate-500">₹</span>
              <input
                type="number"
                value={expense.amount}
                onChange={(e) => setExpense({...expense, amount: e.target.value})}
                className="w-full pl-8 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-slate-600"
                placeholder="0.00"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wide">Category</label>
            <select
              value={expense.category}
              onChange={(e) => setExpense({...expense, category: e.target.value})}
              className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              {CATEGORIES.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wide">Description</label>
          <input
            type="text"
            value={expense.description}
            onChange={(e) => setExpense({...expense, description: e.target.value})}
            className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-slate-600"
            placeholder="What did you buy?"
            required
          />
        </div>
        
        {/* CONDITIONAL RENDER: Only show for Food/Snacks */}
        {showTimeContext && (
          <div className="animate-in fade-in slide-in-from-top-2 duration-300">
            <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wide">Time Context</label>
            <div className="grid grid-cols-2 gap-2">
               <button
                  type="button"
                  onClick={() => setExpense({...expense, time: 'daytime'})}
                  className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm transition-all border ${
                    expense.time === 'daytime' 
                    ? 'bg-blue-500/20 border-blue-500/50 text-blue-400' 
                    : 'bg-slate-900 border-slate-700 text-slate-500 hover:bg-slate-800'
                  }`}
                >
                  <Sun className="w-4 h-4" /> Day
                </button>
                <button
                  type="button"
                  onClick={() => setExpense({...expense, time: 'night'})}
                  className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm transition-all border ${
                    expense.time === 'night' 
                    ? 'bg-purple-500/20 border-purple-500/50 text-purple-400' 
                    : 'bg-slate-900 border-slate-700 text-slate-500 hover:bg-slate-800'
                  }`}
                >
                  <Moon className="w-4 h-4" /> Night
                </button>
            </div>
          </div>
        )}
        
        <button
          type="submit"
          className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-blue-900/20 hover:shadow-blue-900/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          <CreditCard className="w-4 h-4" />
          Add Transaction
        </button>
      </form>
    </div>
  );
};

export default ExpenseForm;