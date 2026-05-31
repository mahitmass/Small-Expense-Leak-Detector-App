/* src/components/Header.jsx */
import React, { useState } from 'react';
import { Zap, Bell, HeartPulse, User, X } from 'lucide-react';
import { useExpenses } from '../context/ExpenseContext';

const Header = () => {
  // Grab everything directly from Context!
  const { leakScore, activeTab, setActiveTab, insights } = useExpenses();
  const [showNotifs, setShowNotifs] = useState(false);

  const getHealthStatus = (score) => {
    if (score >= 80) return { label: 'Excellent', color: 'text-emerald-400', icon: <HeartPulse className="text-emerald-400" size={18} /> };
    if (score >= 50) return { label: 'Stable', color: 'text-yellow-400', icon: <HeartPulse className="text-yellow-400" size={18} /> };
    return { label: 'Critical', color: 'text-red-400', icon: <HeartPulse className="text-red-400" size={18} /> };
  };

  const status = getHealthStatus(leakScore);
  const unreadCount = insights ? insights.length : 0;

  return (
    <header className="max-w-7xl mx-auto mb-8 relative z-[100]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6">
        
        {/* Logo */}
        <div>
          <h1 className="text-3xl font-black text-white flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-xl border border-blue-500/20">
              <Zap className="text-blue-400 w-8 h-8" />
            </div>
            Leak Detector
          </h1>
          <p className="text-slate-400 mt-1 flex items-center gap-2">
            Financial Health: 
            <span className={`font-bold flex items-center gap-1 ${status.color}`}>
              {status.icon} {status.label}
            </span>
          </p>
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-end gap-4 w-full md:w-auto">
          {/* Notifications */}
          <div className="relative">
            <button 
              onClick={() => setShowNotifs(!showNotifs)}
              className="relative p-3 bg-slate-800 rounded-xl border border-slate-700 hover:border-slate-600 transition-colors"
            >
              <Bell className="w-5 h-5 text-slate-300" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-slate-900">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotifs && (
              <div className="absolute right-0 mt-3 w-[90vw] max-w-[320px] origin-top-right bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl z-[150] overflow-hidden">
                <div className="p-3 border-b border-slate-700 flex justify-between items-center bg-slate-800/50">
                  <span className="font-bold text-white text-sm">Smart Alerts</span>
                  <button onClick={() => setShowNotifs(false)}><X className="w-4 h-4 text-slate-400" /></button>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {unreadCount === 0 ? (
                    <div className="p-4 text-center text-sm text-slate-500">No active alerts. You're doing great!</div>
                  ) : (
                    insights.map(insight => (
                      <div key={insight.id} className="p-3 border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors">
                        <p className="text-xs font-bold text-white mb-1">{insight.title}</p>
                        <p className="text-[10px] text-slate-400">{insight.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
          
          <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center border-2 border-slate-800">
             <User className="w-4 h-4 text-white" />
          </div>
        </div>
      </div>
      
      {/* Navigation Tabs */}
      <nav className="flex p-1 bg-slate-800/50 backdrop-blur-md rounded-xl border border-slate-700/50 overflow-x-auto relative z-10">
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
              flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-all whitespace-nowrap
              ${activeTab === tab.id 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/30'}
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