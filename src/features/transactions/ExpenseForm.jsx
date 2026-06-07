/* src/features/transactions/ExpenseForm.jsx */
import React, { useState } from 'react';
import { Plus, Sun, Moon } from 'lucide-react';
import { CATEGORIES } from '../../utils/constants';

const ExpenseForm = ({ onAddExpense }) => {
  // 🔥 RESTORED: Your original exact state object
  const [expense, setExpense] = useState({
    amount: '',
    category: 'food',
    description: '',
    time: 'daytime'
  });

  // 🔥 RESTORED: Your smart category checker
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
      // 🔥 RESTORED: Default safety fallback
      time: showTimeContext ? expense.time : 'daytime'
    };
    
    onAddExpense(newExpense);
    setExpense({ amount: '', category: 'food', description: '', time: 'daytime' });
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-[#0a0a0a]">
      {/* AMOUNT & CATEGORY SIDE-BY-SIDE */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <label className="block text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">Amount</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 font-bold text-xs">₹</span>
            <input 
              type="number" 
              value={expense.amount} 
              onChange={e => setExpense({...expense, amount: e.target.value})} 
              placeholder="0.00" 
              className="w-full bg-zinc-900 border border-zinc-800 rounded-sm pl-7 pr-3 py-2.5 text-white text-xs font-semibold focus:border-indigo-500 outline-none transition-colors" 
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">Category</label>
          <select 
            value={expense.category} 
            onChange={e => setExpense({...expense, category: e.target.value})} 
            className="w-full bg-zinc-900 border border-zinc-800 rounded-sm px-3 py-2.5 text-white text-xs font-semibold focus:border-indigo-500 outline-none transition-colors"
          >
            {/* 🔥 RESTORED: Your dynamic constants mapper */}
            {CATEGORIES.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* DESCRIPTION FULL WIDTH */}
      <div className="mb-4">
        <label className="block text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">Description</label>
        <input 
          type="text" 
          value={expense.description} 
          onChange={e => setExpense({...expense, description: e.target.value})} 
          placeholder="What did you buy?" 
          className="w-full bg-zinc-900 border border-zinc-800 rounded-sm px-3 py-2.5 text-white text-xs focus:border-indigo-500 outline-none transition-colors" 
          required
        />
      </div>

      {/* 🔥 RESTORED CONDITIONAL RENDER: Only show for Food/Snacks */}
      {showTimeContext && (
        <div className="mb-5 animate-in fade-in slide-in-from-top-2 duration-300">
          <label className="block text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">Time Context</label>
          <div className="grid grid-cols-2 gap-2">
            <button 
              type="button" 
              onClick={() => setExpense({...expense, time: 'daytime'})} 
              className={`flex items-center justify-center gap-2 py-2.5 rounded-sm border text-[11px] font-bold uppercase tracking-wider transition-all ${expense.time === 'daytime' ? 'bg-indigo-500/10 border-indigo-500 text-indigo-400' : 'bg-zinc-900 border-zinc-800 text-zinc-500'}`}
            >
              <Sun size={14} /> Day
            </button>
            <button 
              type="button" 
              onClick={() => setExpense({...expense, time: 'night'})} 
              className={`flex items-center justify-center gap-2 py-2.5 rounded-sm border text-[11px] font-bold uppercase tracking-wider transition-all ${expense.time === 'night' ? 'bg-indigo-500/10 border-indigo-500 text-indigo-400' : 'bg-zinc-900 border-zinc-800 text-zinc-500'}`}
            >
              <Moon size={14} /> Night
            </button>
          </div>
        </div>
      )}

      <button 
        type="submit" 
        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 rounded-sm flex justify-center items-center gap-2 text-xs uppercase tracking-wider transition-colors shadow-[0_0_15px_rgba(79,70,229,0.2)]"
      >
         <Plus size={14} /> Add Transaction
      </button>
    </form>
  );
};

export default ExpenseForm;