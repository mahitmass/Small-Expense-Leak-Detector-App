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

  if (!stats) return <div className="text-slate-400 text-center p-8">No patterns detected yet.</div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-xl font-bold text-white mb-4">Spending Habits</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Pattern 1: Time */}
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Moon className="w-24 h-24 text-purple-500" />
          </div>
          <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-4">Time Context</h3>
          <div className="flex items-end gap-2 mb-2">
            <span className="text-4xl font-black text-white">{stats.nightPercent}%</span>
            <span className="text-sm text-slate-400 mb-1">of purchases made at Night</span>
          </div>
          <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden flex mb-4">
            <div className="bg-purple-500 h-full" style={{ width: `${stats.nightPercent}%` }}></div>
            <div className="bg-orange-400 h-full" style={{ width: `${100 - stats.nightPercent}%` }}></div>
          </div>
          <div className="flex gap-4 text-xs font-medium">
            <div className="flex items-center gap-1 text-purple-300"><Moon className="w-3 h-3" /> {stats.nightCount} Night</div>
            <div className="flex items-center gap-1 text-orange-300"><Sun className="w-3 h-3" /> {stats.dayCount} Day</div>
          </div>
        </div>

        {/* Pattern 2: Category */}
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Repeat className="w-24 h-24 text-blue-500" />
          </div>
          <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-4">Top Habit</h3>
          <div className="flex items-center gap-4 mb-4">
            <div className="p-4 bg-blue-500/10 rounded-xl border border-blue-500/20 text-blue-400">
              <Repeat className="w-8 h-8" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white capitalize">{stats.topCategory}</p>
              <p className="text-slate-400 text-sm">Most frequent expense</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatternsView;