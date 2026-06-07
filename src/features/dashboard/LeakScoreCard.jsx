/* src/features/dashboard/LeakScoreCard.jsx */
import React from 'react';
import { ShieldCheck, ShieldAlert, Shield } from 'lucide-react';

const LeakScoreCard = ({ leakScore }) => {
  // 🔥 RESTORED: Your flawless 3-tier logic engine, mapped to the new UI colors
  const getDetails = (score) => {
    if (score >= 80) return { label: 'Excellent Status', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', stroke: '#34D399', icon: <ShieldCheck size={14} /> };
    if (score >= 50) return { label: 'Warning Status', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', stroke: '#FACC15', icon: <Shield size={14} /> };
    return { label: 'Critical Status', color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20', stroke: '#EF4444', icon: <ShieldAlert size={14} /> };
  };

  const { label, color, bg, border, stroke, icon } = getDetails(leakScore);
  
  // New SVG Arc Math
  const radius = 55;
  const circumference = Math.PI * radius; 
  const strokeDashoffset = circumference - (leakScore / 100) * circumference;

  return (
    <div className="bg-zinc-900 rounded-sm border border-zinc-800 p-6 text-center shadow-xl relative overflow-hidden">
      {/* Background glow maps to the 3-tier stroke color */}
      <div className="absolute -top-10 -inset-x-0 h-32 blur-3xl opacity-10 pointer-events-none" style={{ backgroundColor: stroke }}></div>
      
      <div className="text-[10px] font-bold tracking-[2px] text-zinc-500 uppercase mb-6 relative z-10">Financial Score</div>
      
      <div className="relative w-[140px] h-[80px] mx-auto mb-4 z-10">
        <svg viewBox="0 0 140 80" className="overflow-visible">
          <path d="M15,75 A55,55 0 0,1 125,75" fill="none" stroke="#18181b" strokeWidth="12" strokeLinecap="round" />
          <path 
            d="M15,75 A55,55 0 0,1 125,75" 
            fill="none" 
            stroke={stroke} 
            strokeWidth="12" 
            strokeLinecap="round" 
            strokeDasharray={circumference} 
            strokeDashoffset={strokeDashoffset} 
            className="transition-all duration-1000 ease-out" 
          />
          <text x="70" y="65" textAnchor="middle" fontSize="36" fontWeight="900" fill="#ffffff" className="tracking-tighter">
            {leakScore}
          </text>
        </svg>
      </div>

      <div className="relative z-10">
        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-sm text-[10px] font-bold uppercase tracking-wider mb-2 border ${bg} ${border} ${color}`}>
          {icon} 
          {label}
        </div>
        <p className="text-[11px] text-zinc-500 font-medium">
          {leakScore < 50 ? "High leakage detected." : leakScore < 80 ? "Watch your impulse spending." : "Your spending is optimized."}
        </p>
      </div>
    </div>
  );
};

export default LeakScoreCard;