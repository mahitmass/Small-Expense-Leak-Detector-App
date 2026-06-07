/* src/components/PatternsView.jsx */
import React, { useMemo } from 'react';
import { Moon, Sun, Repeat } from 'lucide-react';

const PatternsView = ({ expenses }) => {
  const stats = useMemo(() => {
    if (expenses.length === 0) return null;
    let nightCount = 0;
    const categoryCounts = {};
    expenses.forEach(item => {
      if (item.time === 'night') nightCount++;
      categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1;
    });
    const topCategory = Object.keys(categoryCounts).reduce((a, b) => 
      categoryCounts[a] > categoryCounts[b] ? a : b
    );
    return {
      nightCount,
      dayCount: expenses.length - nightCount,
      nightPercent: Math.round((nightCount / expenses.length) * 100),
      topCategory,
      topCategoryCount: categoryCounts[topCategory]
    };
  }, [expenses]);

  if (!stats) return <div className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest text-center p-8">No patterns detected yet.</div>;

  return (
    <div className="space-y-4 animate-fade-in">
      <h2 className="text-lg font-bold text-white mb-4 uppercase tracking-wider">Spending Habits</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Pattern 1: Time */}
        <div className="bg-zinc-900 p-5 rounded-sm border border-zinc-800 shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Moon className="w-24 h-24 text-indigo-500" />
          </div>
          <h3 className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-4">Time Context</h3>
          <div className="flex items-end gap-2 mb-2">
            <span className="text-3xl font-black text-white">{stats.nightPercent}%</span>
            <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-500 mb-1.5">of purchases made at Night</span>
          </div>
          <div className="w-full bg-[#0a0a0a] border border-zinc-800 h-2 rounded-sm overflow-hidden flex mb-4">
            <div className="bg-indigo-500 h-full" style={{ width: `${stats.nightPercent}%` }}></div>
            <div className="bg-amber-500 h-full" style={{ width: `${100 - stats.nightPercent}%` }}></div>
          </div>
          <div className="flex gap-4 text-[10px] font-bold uppercase tracking-wider">
            <div className="flex items-center gap-1.5 text-indigo-400"><Moon className="w-3 h-3" /> {stats.nightCount} Night</div>
            <div className="flex items-center gap-1.5 text-amber-500"><Sun className="w-3 h-3" /> {stats.dayCount} Day</div>
          </div>
        </div>

        {/* Pattern 2: Category */}
        <div className="bg-zinc-900 p-5 rounded-sm border border-zinc-800 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <Repeat className="w-24 h-24 text-emerald-500" />
          </div>
          <h3 className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-4">Top Habit</h3>
          <div className="flex items-center gap-4 mt-2">
            <div className="p-3 bg-[#0a0a0a] rounded-sm border border-emerald-500/20 text-emerald-500">
              <Repeat className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xl font-black text-white uppercase tracking-wider">{stats.topCategory}</p>
              <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mt-0.5">Most frequent expense</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatternsView;