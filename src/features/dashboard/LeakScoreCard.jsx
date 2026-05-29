/* src/components/LeakScoreCard.jsx */
import React from 'react';
import { ShieldCheck, ShieldAlert, Shield } from 'lucide-react';

const LeakScoreCard = ({ leakScore }) => {
  const getDetails = (score) => {
    if (score >= 80) return { label: 'Excellent', color: 'text-emerald-400', stroke: '#34D399' };
    if (score >= 50) return { label: 'Warning', color: 'text-yellow-400', stroke: '#FACC15' };
    return { label: 'Critical', color: 'text-red-400', stroke: '#F87171' };
  };

  const { label, color, stroke } = getDetails(leakScore);
  
  // SVG Math: 
  // We want a semi-circle arc (180 degrees). 
  // Radius = 80. Circumference = 2 * PI * 80 ≈ 502.
  // We only show half of it, so max dasharray = 251.
  const radius = 80;
  const maxDash = Math.PI * radius; // ~251
  const dashOffset = maxDash - ((leakScore / 100) * maxDash);

  return (
    <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6 shadow-xl relative overflow-visible flex flex-col items-center justify-center text-center z-0">
      
      <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-4">Financial Score</h3>
      
      {/* Semi-Circle Gauge */}
      <div className="relative w-48 h-28 mb-2 overflow-hidden">
        {/* Grey Background Track */}
        <svg className="w-full h-full" viewBox="0 0 200 100">
          <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="#1e293b" strokeWidth="15" strokeLinecap="round" />
          
          {/* Colored Progress Bar */}
          <path 
            d="M 20 100 A 80 80 0 0 1 180 100" 
            fill="none" 
            stroke={stroke} 
            strokeWidth="15"
            strokeLinecap="round"
            strokeDasharray={maxDash}
            strokeDashoffset={dashOffset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        
        {/* Score Text (Absolute Center) */}
        <div className="absolute bottom-0 left-0 w-full text-center mb-2">
           <span className="text-4xl font-black text-white">{leakScore}</span>
        </div>
      </div>

      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-700 ${color} mb-4`}>
        {leakScore >= 80 ? <ShieldCheck size={16} /> : leakScore >= 50 ? <Shield size={16} /> : <ShieldAlert size={16} />}
        <span className="text-sm font-bold">{label}</span>
      </div>

      <p className="text-xs text-slate-500 max-w-[200px]">
        {leakScore < 50 ? "High leakage detected." : "Your spending is optimized."}
      </p>
    </div>
  );
};

export default LeakScoreCard;