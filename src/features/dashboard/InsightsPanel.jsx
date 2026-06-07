/* src/components/InsightsPanel.jsx */
import React from 'react';
import { Lightbulb, TrendingUp, AlertTriangle, Moon, Zap, Leaf, Crown, Rocket } from 'lucide-react';

const InsightsPanel = ({ insights, onDismissInsight, personality }) => {
  
  const getInsightStyle = (type) => {
    switch (type) {
      case 'wealth': return { icon: <Rocket />, color: 'violet', bg: 'bg-violet-500/10', border: 'border-violet-500/20' };
      case 'opportunity': return { icon: <TrendingUp />, color: 'blue', bg: 'bg-blue-500/10', border: 'border-blue-500/20' };
      case 'eco': return { icon: <Leaf />, color: 'emerald', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' };
      case 'habit': return { icon: <Moon />, color: 'indigo', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20' };
      case 'alert': return { icon: <AlertTriangle />, color: 'red', bg: 'bg-red-500/10', border: 'border-red-500/20' };
      default: return { icon: <Lightbulb />, color: 'yellow', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' };
    }
  };

  const getPersonalityDesc = (type) => {
    const map = {
      "The Foodie": "You love dining out, but it eats your wallet.",
      "The Collector": "You have a subscription for everything.",
      "The Impulse Buyer": "Sales are your weakness.",
      "The Wanderer": "Always on the move.",
      "The Gamer": "Entertainment is your priority.",
      "The Zen Master": "Perfect financial balance.",
      "The Spender": "Money flows out as fast as it comes in.",
      "The Health Nut": " ",
      "The Scholar": "Investing heavily in knowledge and education.",
      "The Investor": "Building wealth for the future.",
      "The Responsible One": "Bills and utilities are your main focus.",
      "The Caffeine Addict": "Small coffee runs are adding up."
    };
    return map[type] || "Analyzing financial DNA..."; 
  };

  if (insights.length === 0) {
    return (
      <div className="text-center py-10 bg-[#0a0a0a] rounded-sm border border-zinc-800 border-dashed">
        <Zap className="text-yellow-400 w-8 h-8 mx-auto mb-3" />
        <p className="text-zinc-400 font-bold uppercase tracking-wider text-xs">No leaks detected!</p>
        <p className="text-[10px] text-zinc-500 mt-1">Logic engine found no issues.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* 1. PERSONALITY CARD */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-sm p-5 flex items-center gap-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-3 opacity-5">
           <Crown size={100} className="text-white" />
        </div>
        <div className="w-12 h-12 rounded-sm bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shrink-0">
           <Crown className="text-white w-6 h-6" />
        </div>
        <div>
           <p className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">Financial Archetype</p>
           <h3 className="text-lg font-black text-white leading-tight">{personality || "The Analyzer"}</h3>
           <p className="text-[10px] text-zinc-400 mt-0.5">{getPersonalityDesc(personality)}</p>
        </div>
      </div>

      {/* 2. INSIGHT FEED */}
      <div className="space-y-3">
        {insights.map((insight) => {
          const style = getInsightStyle(insight.type);
          return (
            <div key={insight.id} className={`relative p-4 rounded-sm border transition-all hover:scale-[1.01] duration-300 ${style.bg} ${style.border}`}>
              <div className="flex items-start gap-3 mb-3">
                <div className={`p-2 rounded-sm bg-[#0a0a0a] text-${style.color}-400 shrink-0 shadow-sm border border-${style.color}-500/20`}>
                  {React.cloneElement(style.icon, { size: 16 })}
                </div>
                <div>
                  <h4 className={`text-xs font-bold text-white mb-1 uppercase tracking-wider`}>{insight.title}</h4>
                  <p className={`text-[11px] text-${style.color}-200/80 leading-relaxed`}>{insight.message}</p>
                </div>
              </div>

              <div className="ml-12 bg-[#0a0a0a] p-3 rounded-sm border border-zinc-800">
                <p className="text-[10px] text-zinc-300 leading-relaxed font-medium">
                  <span className={`text-${style.color}-500 font-bold mr-1 tracking-wider`}>🚀 STRATEGY:</span> 
                  {insight.tip}
                </p>
              </div>

              <div className="flex justify-end mt-3">
                 <button 
                   onClick={() => onDismissInsight(insight.id)}
                   className="text-[9px] text-zinc-500 hover:text-white font-bold uppercase tracking-widest px-3 py-1.5 bg-[#0a0a0a] rounded-sm border border-zinc-800 hover:border-zinc-600 transition-all"
                 >
                   Dismiss
                 </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default InsightsPanel;