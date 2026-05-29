/* src/features/modals/SalaryModal.jsx */
import React, { useState } from 'react';
import { Wallet, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';

const SalaryModal = ({ isOpen, onSubmit }) => {
  const [displayValue, setDisplayValue] = useState('');
  const [numericValue, setNumericValue] = useState(0);
  const [error, setError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleFormat = (e) => {
    // Strip non-numbers
    const rawValue = e.target.value.replace(/[^0-9]/g, '');
    if (rawValue) {
      const num = parseInt(rawValue, 10);
      setNumericValue(num);
      setDisplayValue(num.toLocaleString('en-IN')); // Formats to Indian comma system
      setError(false);
    } else {
      setNumericValue(0);
      setDisplayValue('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (numericValue < 1000) {
      setError(true);
      return;
    }
    
    // Play success animation before closing
    setIsSuccess(true);
    setTimeout(() => {
      onSubmit(numericValue);
      setIsSuccess(false);
    }, 800);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-md flex items-center justify-center z-[200] p-4 animate-in fade-in duration-300">
      <div className="bg-slate-800 border border-slate-700 rounded-3xl w-full max-w-md p-8 shadow-2xl relative overflow-hidden">
        
        {/* Success Overlay */}
        {isSuccess && (
          <div className="absolute inset-0 bg-emerald-600 z-10 flex flex-col items-center justify-center animate-in fade-in zoom-in duration-300">
            <ShieldCheck className="w-20 h-20 text-white mb-4 animate-bounce" />
            <h2 className="text-2xl font-bold text-white">Budget Set!</h2>
          </div>
        )}

        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.15)]">
            <Wallet className="w-10 h-10 text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Set Your Baseline</h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            To calculate your personal <span className="text-blue-400 font-semibold">Leak Score</span> accurately, we need to know your estimated monthly disposable income.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <div className={`relative transition-transform ${error ? 'animate-[shake_0.2s_ease-in-out_2]' : ''}`}>
              <span className="absolute left-5 top-4 text-slate-400 text-xl font-medium">₹</span>
              <input 
                type="text" 
                inputMode="numeric"
                placeholder="0"
                value={displayValue}
                onChange={handleFormat}
                className={`w-full pl-10 pr-6 py-4 bg-slate-900/50 border ${error ? 'border-red-500/50 focus:ring-red-500' : 'border-slate-600 focus:ring-emerald-500'} rounded-2xl text-white text-2xl font-bold focus:ring-2 outline-none transition-all`}
                autoFocus
              />
            </div>
            {error && (
              <p className="text-red-400 text-xs mt-2 flex items-center gap-1 justify-center">
                <AlertCircle className="w-3 h-3" /> Please enter a valid monthly budget.
              </p>
            )}
          </div>
          
          <button 
            type="submit"
            className="w-full py-4 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold rounded-xl shadow-lg shadow-emerald-900/20 hover:shadow-emerald-900/40 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 text-lg"
          >
            Start Analyzing <ArrowRight className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default SalaryModal;