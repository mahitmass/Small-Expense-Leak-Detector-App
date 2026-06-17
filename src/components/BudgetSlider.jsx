import React from 'react';
import { useExpenses } from '../context/ExpenseContext';

const BudgetSlider = () => {
  const { monthlyBudget, handleBudgetChange } = useExpenses();
  
  // If budget is 0 (No Limit), we set the slider to its maximum visual position (50000)
  const sliderValue = monthlyBudget === 0 ? 50000 : monthlyBudget;

  const onChange = (e) => {
    const val = Number(e.target.value);
    if (val >= 50000) {
      handleBudgetChange(0); // 0 completely disables the budget alerts
    } else {
      handleBudgetChange(val);
    }
  };

  return (
    <div className="bg-zinc-900 p-6 rounded-lg border border-zinc-800 w-full max-w-md">
      <h3 className="text-white font-bold mb-4 text-sm tracking-wide">Set Monthly Budget</h3>
      
      <div className="flex justify-between text-xs font-bold uppercase tracking-wider mb-3">
        <span className="text-zinc-500">₹3000</span>
        <span className={monthlyBudget === 0 ? "text-emerald-400" : "text-white"}>
          {monthlyBudget === 0 ? "NO SPECIFIC BUDGET" : `₹${monthlyBudget}`}
        </span>
      </div>
      
      <input 
        type="range" 
        min="3000" 
        max="50000" 
        step="1000"
        value={sliderValue}
        onChange={onChange}
        className="w-full accent-indigo-500 h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
      />
      
      <p className="text-[10px] text-zinc-500 mt-4 leading-relaxed tracking-wide">
        Alerts will be triggered dynamically when your total monthly spending crosses this threshold. Drag to the max right to disable.
      </p>
    </div>
  );
};

export default BudgetSlider;