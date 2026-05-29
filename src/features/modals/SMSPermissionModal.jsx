/* src/features/modals/SMSPermissionModal.jsx */
import React, { useState } from 'react';
import { MessageSquare, Shield, Lock, Loader2 } from 'lucide-react';

const SMSPermissionModal = ({ isOpen, onAllow, onDeny }) => {
  const [isScanning, setIsScanning] = useState(false);

  if (!isOpen) return null;

  const handleAllowClick = () => {
    setIsScanning(true);
    // Simulate secure connection before firing the real allow handler
    setTimeout(() => {
      onAllow();
      setIsScanning(false);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-md flex items-center justify-center z-[200] p-4 animate-in fade-in duration-300">
      <div className="bg-slate-800 border border-slate-700 rounded-3xl w-full max-w-md p-8 shadow-2xl relative overflow-hidden">
        
        {/* Decorative background blur */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-600/20 rounded-full blur-[50px] pointer-events-none"></div>

        <div className="text-center mb-8 relative z-10">
          <div className="w-20 h-20 bg-blue-500/10 rounded-2xl rotate-3 flex items-center justify-center mx-auto mb-6 border border-blue-500/20">
            <div className="-rotate-3">
               <MessageSquare className="w-10 h-10 text-blue-400" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Auto-Detect Spending?</h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            Skip manual entry. Allow Leak Detector to securely scan your bank SMS alerts to log transactions automatically.
          </p>
        </div>

        <div className="space-y-4 mb-8 relative z-10">
          <div className="flex items-start gap-4 p-4 bg-slate-900/50 rounded-2xl border border-emerald-500/10">
            <div className="p-2 bg-emerald-500/10 rounded-lg shrink-0">
               <Shield className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="text-left">
              <span className="font-bold text-emerald-100 text-sm block mb-0.5">100% On-Device Privacy</span>
              <p className="text-slate-400 text-xs leading-relaxed">Your messages never leave your phone. Data is processed locally and wiped from cache instantly.</p>
            </div>
          </div>
          
          <div className="flex items-start gap-4 p-4 bg-slate-900/50 rounded-2xl border border-slate-700/50">
            <div className="p-2 bg-slate-800 rounded-lg shrink-0">
               <Lock className="w-5 h-5 text-slate-400" />
            </div>
            <div className="text-left">
              <span className="font-bold text-slate-200 text-sm block mb-0.5">Read-Only Access</span>
              <p className="text-slate-400 text-xs leading-relaxed">We can only read transaction alerts. We cannot view personal texts or OTPs.</p>
            </div>
          </div>
        </div>

        <div className="flex gap-4 relative z-10">
          <button 
            onClick={onDeny}
            disabled={isScanning}
            className="w-1/3 py-4 text-slate-400 font-semibold hover:text-white hover:bg-slate-700/50 rounded-xl transition-all disabled:opacity-50"
          >
            Skip
          </button>
          <button 
            onClick={handleAllowClick}
            disabled={isScanning}
            className="w-2/3 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-900/20 transition-all flex items-center justify-center gap-2 disabled:opacity-80"
          >
            {isScanning ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Connecting...
              </>
            ) : (
              'Enable Sync'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SMSPermissionModal;