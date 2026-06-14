/* src/components/Header.jsx */
import React, { useState, useEffect, useRef } from 'react';
import { Zap, Bell, HeartPulse, User, X } from 'lucide-react';
import { useExpenses } from '../context/ExpenseContext';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  // 🔥 1. Swapped 'insights' for 'notifications'
  const { leakScore, activeTab, setActiveTab, notifications } = useExpenses();
  const { currentUser, handleLogout: contextLogout } = useAuth();
  
  const [showNotifs, setShowNotifs] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  
  const profileMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const getHealthStatus = (score) => {
    if (score >= 80) return { label: 'Excellent', color: 'text-emerald-400', icon: <HeartPulse className="text-emerald-400" size={16} /> };
    if (score >= 50) return { label: 'Stable', color: 'text-amber-400', icon: <HeartPulse className="text-amber-400" size={16} /> };
    return { label: 'Critical', color: 'text-red-500', icon: <HeartPulse className="text-red-500" size={16} /> };
  };

  const handleLocalLogout = () => {
    setShowProfileMenu(false);
    
    if (contextLogout) {
      contextLogout(); 
    }
  };

  const status = getHealthStatus(leakScore);
  
  // 🔥 2. Now tracking the length of the new notifications array
  const unreadCount = notifications ? notifications.length : 0;

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
                    // 🔥 3. Mapping over the new notifications array!
                    notifications.map(notification => (
                      <div key={notification.id} className="p-4 border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors">
                        <p className="text-xs font-bold text-white mb-1">{notification.title}</p>
                        <p className="text-[10px] text-zinc-400 leading-relaxed">{notification.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
          
          {/* PROFILE DROPDOWN WITH REF SENSOR */}
          <div className="relative" ref={profileMenuRef}>
            <button 
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center border border-zinc-700 hover:bg-zinc-700 transition-colors focus:outline-none"
            >
               <User className="w-4 h-4 text-zinc-300" />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-3 w-52 bg-[#0a0a0a] border border-zinc-800 rounded-lg shadow-2xl overflow-hidden z-[200]">
                <div className="px-4 py-3 border-b border-zinc-800 bg-zinc-900/30">
                  <p className="text-sm font-bold text-white tracking-wide">{currentUser?.name || 'User'}</p>
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">Local Vault Active</p>
                </div>
                <button 
                  onClick={handleLocalLogout}
                  className="w-full text-left px-4 py-3 text-xs text-red-400 hover:bg-zinc-900 transition-colors font-bold tracking-widest uppercase flex items-center gap-2"
                >
                  Logout
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
      
      {/* DESKTOP Navigation Tabs */}
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