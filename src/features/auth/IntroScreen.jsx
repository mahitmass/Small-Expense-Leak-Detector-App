/* src/features/auth/IntroScreen.jsx */
import React, { useState, useEffect } from 'react';
import { Zap, ChevronRight } from 'lucide-react';

const IntroScreen = ({ onComplete }) => {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    // Stage 0: Logo Glowing (0-2s)
    const timer1 = setTimeout(() => setStage(1), 2000);
    // Stage 1: Story Text Floats Up (2-5s)
    const timer2 = setTimeout(() => setStage(2), 5000);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center relative overflow-hidden p-6 selection:bg-indigo-500/30">
      
      {/* SKIP BUTTON (Hides at final stage) */}
      <button 
        onClick={onComplete}
        className={`absolute top-12 right-6 text-[10px] font-bold tracking-widest uppercase text-zinc-500 hover:text-white transition-opacity duration-500 z-50 ${stage === 2 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
      >
        Skip
      </button>

      {/* STAGE 0 & 1: GLOWING LOGO */}
      <div className={`transition-all duration-1000 ease-out flex flex-col items-center ${stage > 0 ? '-translate-y-24 scale-75 opacity-50' : 'translate-y-0 scale-100 opacity-100'}`}>
        <div className="w-24 h-24 bg-indigo-600 rounded-3xl flex items-center justify-center mb-6 shadow-[0_0_60px_rgba(99,102,241,0.5)] animate-pulse">
          <Zap className="w-12 h-12 text-white" />
        </div>
        <h1 className="text-4xl font-black text-white tracking-tight">Leak Detector</h1>
      </div>

      {/* STAGE 1: STORY TEXT */}
      <div className={`absolute top-1/2 -translate-y-1/2 w-full max-w-md px-6 text-center transition-all duration-1000 ${stage === 1 ? 'opacity-100 translate-y-12' : 'opacity-0 translate-y-24 pointer-events-none'}`}>
        <p className="text-zinc-300 text-lg leading-relaxed font-semibold">
          Stop invisible spending.<br/>Track, detect, and eliminate financial leaks before they drain your savings.
        </p>
      </div>

      {/* STAGE 2: THE FINAL CTA */}
      <div className={`absolute top-1/2 -translate-y-1/2 w-full max-w-md px-6 flex flex-col items-center transition-all duration-1000 ${stage === 2 ? 'opacity-100 translate-y-12' : 'opacity-0 translate-y-32 pointer-events-none'}`}>
        <h2 className="text-2xl font-black text-white mb-2 text-center">Ready to lock in your savings?</h2>
        <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-10">100% Local • Zero Cloud Tracking</p>
        
        <button 
          onClick={onComplete}
          className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-indigo-600 text-white font-bold rounded-sm uppercase tracking-widest text-xs transition-all hover:bg-indigo-500 shadow-[0_0_30px_rgba(99,102,241,0.3)] active:scale-95"
        >
          Secure My Vault 
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

    </div>
  );
};

export default IntroScreen;