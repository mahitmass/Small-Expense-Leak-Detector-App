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
      // Existing
      "The Foodie": "You love dining out, but it eats your wallet.",
      "The Collector": "You have a subscription for everything.",
      "The Impulse Buyer": "Sales are your weakness.",
      "The Wanderer": "Always on the move.",
      "The Gamer": "Entertainment is your priority.",
      "The Zen Master": "Perfect financial balance.",
      "The Spender": "Money flows out as fast as it comes in.",
      
      // NEW TYPES (Added these to fix the "Calculating..." bug)
      "The Health Nut": " ",
      "The Scholar": "Investing heavily in knowledge and education.",
      "The Investor": "Building wealth for the future.",
      "The Responsible One": "Bills and utilities are your main focus.",
      "The Caffeine Addict": "Small coffee runs are adding up."
    };
    
    // Removed "Calculating..." fallback
    return map[type] || "Analyzing financial DNA..."; 
  };

  if (insights.length === 0) {
    return (
      <div className="text-center py-10 bg-slate-800/50 rounded-2xl border border-slate-700 border-dashed">
        <Zap className="text-yellow-400 w-8 h-8 mx-auto mb-3" />
        <p className="text-slate-400 font-medium">No leaks detected!</p>
        <p className="text-xs text-slate-500">Logic engine found no issues.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* 1. PERSONALITY CARD */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 border border-slate-700 rounded-2xl p-5 flex items-center gap-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-3 opacity-5">
           <Crown size={100} className="text-white" />
        </div>
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shrink-0">
           <Crown className="text-white w-7 h-7" />
        </div>
        <div>
           <p className="text-xs font-bold text-amber-400 uppercase tracking-wider">Financial Archetype</p>
           <h3 className="text-xl font-black text-white">{personality || "The Analyzer"}</h3>
           <p className="text-xs text-slate-400 mt-1">{getPersonalityDesc(personality)}</p>
        </div>
      </div>

      {/* 2. INSIGHT FEED */}
      <div className="space-y-4">
        {insights.map((insight) => {
          const style = getInsightStyle(insight.type);
          return (
            <div key={insight.id} className={`relative p-5 rounded-2xl border transition-all hover:scale-[1.01] duration-300 ${style.bg} ${style.border}`}>
              
              <div className="flex items-start gap-4 mb-3">
                <div className={`p-2 rounded-xl bg-slate-900/50 text-${style.color}-400 shrink-0 shadow-sm`}>
                  {React.cloneElement(style.icon, { size: 20 })}
                </div>
                <div>
                  <h4 className={`text-sm font-bold text-white mb-1`}>{insight.title}</h4>
                  <p className={`text-xs text-${style.color}-200/80 leading-relaxed`}>{insight.message}</p>
                </div>
              </div>

              {/* Box */}
              <div className="ml-14 bg-slate-900/40 p-3 rounded-lg border border-white/5">
                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  <span className={`text-${style.color}-400 font-bold mr-1`}>🚀 STRATEGY:</span> 
                  {insight.tip}
                </p>
              </div>

              <div className="flex justify-end mt-3">
                 <button 
                   onClick={() => onDismissInsight(insight.id)}
                   className="text-[10px] text-slate-500 hover:text-white font-medium px-3 py-1 bg-slate-900/50 rounded-full hover:bg-slate-800 transition-colors"
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