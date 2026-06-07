/* src/components/Header.jsx */
import React, { useState } from 'react';
import { Zap, Bell, HeartPulse, User, X } from 'lucide-react';
import { useExpenses } from '../context/ExpenseContext';

const Header = () => {
  const { leakScore, activeTab, setActiveTab, insights } = useExpenses();
  const [showNotifs, setShowNotifs] = useState(false);

  const getHealthStatus = (score) => {
    if (score >= 80) return { label: 'Excellent', color: 'text-emerald-400', icon: <HeartPulse className="text-emerald-400" size={16} /> };
    if (score >= 50) return { label: 'Stable', color: 'text-amber-400', icon: <HeartPulse className="text-amber-400" size={16} /> };
    return { label: 'Critical', color: 'text-red-500', icon: <HeartPulse className="text-red-500" size={16} /> };
  };

  const status = getHealthStatus(leakScore);
  const unreadCount = insights ? insights.length : 0;

  return (
    <header className="max-w-7xl mx-auto mb-6 relative z-[100]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6 border-b border-zinc-800 pb-6">
        
        {/* Logo & Health Badge */}
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-3">
            <div className="p-2 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
              <Zap className="text-indigo-400 w-6 h-6" />
            </div>
            Leak Detector
          </h1>
          <div className={`mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-zinc-900 border border-zinc-800 ${status.color}`}>
            {status.icon}
            Financial Health: {status.label}
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-end gap-4 w-full md:w-auto">
          
          {/* Notifications */}
          <div className="relative">
            <button 
              onClick={() => setShowNotifs(!showNotifs)}
              className="relative p-2.5 bg-zinc-900 rounded-lg border border-zinc-800 hover:border-zinc-700 transition-colors"
            >
              <Bell className="w-5 h-5 text-zinc-400" />
              {unreadCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(239,68,68,0.5)]">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotifs && (
              <div className="absolute right-0 mt-3 w-[90vw] max-w-[320px] origin-top-right bg-zinc-900 border border-zinc-800 rounded-sm shadow-2xl z-[150] overflow-hidden">
                <div className="p-3 border-b border-zinc-800 flex justify-between items-center bg-[#0a0a0a]">
                  <span className="font-bold text-white text-xs uppercase tracking-wider">Smart Alerts</span>
                  <button onClick={() => setShowNotifs(false)}><X className="w-4 h-4 text-zinc-500" /></button>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {unreadCount === 0 ? (
                    <div className="p-6 text-center text-xs font-semibold text-zinc-500">No active alerts. You're doing great!</div>
                  ) : (
                    insights.map(insight => (
                      <div key={insight.id} className="p-4 border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors">
                        <p className="text-xs font-bold text-white mb-1">{insight.title}</p>
                        <p className="text-[10px] text-zinc-400 leading-relaxed">{insight.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
          
          <div className="w-9 h-9 rounded-lg bg-zinc-800 flex items-center justify-center border border-zinc-700">
             <User className="w-4 h-4 text-zinc-300" />
          </div>
        </div>
      </div>
      
      {/* DESKTOP Navigation Tabs (Hidden on Mobile) */}
      <nav className="hidden md:flex gap-2 p-1 bg-zinc-900 border border-zinc-800 rounded-lg w-max">
        {[
          { id: 'dashboard', label: 'Dashboard' },
          { id: 'expenses', label: 'Transactions' },
          { id: 'subscriptions', label: 'Subscriptions' },
          { id: 'patterns', label: 'Patterns' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              px-5 py-2 rounded-md text-xs font-bold transition-all tracking-wide
              ${activeTab === tab.id 
                ? 'bg-indigo-600 text-white shadow-md' 
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'}
            `}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </header>
  );
};

export default Header;