/* src/App.js */
import { initializeNotifications } from './utils/notificationEngine';
import React, { useEffect, useState } from 'react';
import { Zap } from 'lucide-react';
import { Home, List, RefreshCw, BarChart2, Users } from 'lucide-react'; // Added Users
import { LocalNotifications } from '@capacitor/local-notifications'; // Added Notifications
import FriendsView from './features/transactions/FriendsView'; // Added Component
import { Capacitor } from '@capacitor/core';
import Header from './components/Header';
import Dashboard from './features/dashboard/Dashboard';
import ExpenseList from './features/transactions/ExpenseList';
import SubscriptionView from './features/transactions/SubscriptionView';
import PatternsView from './features/transactions/PatternsView';
import { useExpenses } from './context/ExpenseContext';
import { parseBankSMS } from './utils/smsParser';
import { initializeDatabase } from './utils/db'; 
import { useAuth } from './context/AuthContext';
import AuthScreen from './features/auth/AuthScreen';
import { fetchDeviceContacts } from './utils/contacts';

function App() {
  const { currentUser, loading } = useAuth();
  const [deviceContacts, setDeviceContacts] = useState([]);

  // 🔥 ADDED setActiveTab HERE SO THE BOTTOM NAV WORKS
  const {
    showSalaryModal, 
    setShowSMSModal,
    activeTab, 
    setActiveTab, 
    handleAddExpense,
    handleAddMultipleExpenses, 
    expenses,
    handleSalarySubmit
  } = useExpenses();
  
  const [inputIncome, setInputIncome] = useState('50000');
  const [isDbReady, setIsDbReady] = useState(false);
  const [isBooting, setIsBooting] = useState(true);
  const [bootMessage, setBootMessage] = useState("Initializing Engine...");

  useEffect(() => {
    initializeNotifications();
    const setupDB = async () => {
      if (Capacitor.getPlatform() === 'web') {
        setIsDbReady(true);
        setIsBooting(false);
        return;
      }

      const success = await initializeDatabase();
      if (success) {
        setIsDbReady(true);
        const hasSynced = localStorage.getItem("hasSyncedInbox");
        if (hasSynced === "true") {
          setIsBooting(false); 
        }
      } else {
        console.error("Database failed to wake up!");
        setBootMessage("🚨 Database Failed to Wake Up");
      }
    };
    setupDB();
  }, []);

  const triggerManualSync = async () => {
    if (Capacitor.isNativePlatform()) {
      setBootMessage("Syncing Contacts Library...");
      const syncedContacts = await fetchDeviceContacts();
      setDeviceContacts(syncedContacts);

      setBootMessage("Accessing Native Inbox...");
      const smsEngine = window.SMS || (window.cordova && window.cordova.plugins && window.cordova.plugins.sms);

      if (smsEngine) {
        if (typeof smsEngine.listSMS === 'function') {
          fetchNativeMessages(smsEngine, syncedContacts); 
        } else {
          setBootMessage("🚨 PLUGIN ERROR: listSMS function is still missing.");
        }
      } else {
        setBootMessage("🚨 NATIVE ERROR: Bridge missing.");
      }
    } else {
      setBootMessage("💻 Web Mode: Simulating Sync...");
      simulateWebSync();
    }
  };

  const fetchNativeMessages = (smsEngine, syncedContacts) => {
    const filter = { box: 'inbox', maxCount: 200 }; 
    
    smsEngine.listSMS(filter, (messages) => {
      let addedCount = 0;
      let bulkExpenses = []; 
      
      messages.forEach((msg) => {
        const parsedTransaction = parseBankSMS(msg.body); 
        
        if (parsedTransaction && parsedTransaction.type === 'debit') {
          const isDuplicateState = expenses.some(e => e.amount === parsedTransaction.amount && e.description === parsedTransaction.merchant && e.date === parsedTransaction.date);
          const isDuplicateNew = bulkExpenses.some(e => e.amount === parsedTransaction.amount && e.description === parsedTransaction.merchant && e.date === parsedTransaction.date);
          
          if (!isDuplicateState && !isDuplicateNew) {
            bulkExpenses.push({
              id: Math.random().toString(36).substring(7),
              description: parsedTransaction.merchant,
              amount: parsedTransaction.amount,
              category: parsedTransaction.merchant.toLowerCase().includes('upi') ? 'transfer' : 'shopping', 
              date: parsedTransaction.date ? parsedTransaction.date.split('T')[0] : new Date().toISOString().split('T')[0],
              time: 'day',
              isContactPayment: parsedTransaction.merchant.toLowerCase().includes('upi')
            });
            addedCount++;
          }
        }
      });

      if (bulkExpenses.length > 0) {
        handleAddMultipleExpenses(bulkExpenses);
        
        // 🔥 TRIGGER THE PUSH NOTIFICATION
        LocalNotifications.schedule({
          notifications: [
            {
              title: "Vault Synced",
              body: `Detected ${addedCount} new transactions. Check your leak score.`,
              id: Date.now(),
              schedule: { at: new Date(Date.now() + 1000) }, // Trigger in 1 second
              sound: null,
              attachments: null,
              actionTypeId: "",
              extra: null
            }
          ]
        });
      }

      alert(`✅ Synced ${addedCount} new transactions from your inbox!`);
      localStorage.setItem("hasSyncedInbox", "true");

      if (typeof setIsBooting === 'function') { setIsBooting(false); }
      if (typeof setShowSMSModal === 'function') { setShowSMSModal(false); }

    }, (err) => {
      console.error("Failed to list SMS:", err);
      alert("Error reading SMS inbox.");
    });
  };

  const simulateWebSync = () => {
    setTimeout(() => {
      handleAddExpense({ description: 'Amazon Order', amount: 899, category: 'shopping', date: '2024-06-01', isContactPayment: false });
      handleAddExpense({ description: 'UPI to Rahul', amount: 450, category: 'transfer', date: '2024-06-01', isContactPayment: true });
      localStorage.setItem("hasSyncedInbox", "true");
      setIsBooting(false); 
    }, 1500);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'expenses': return (
          <div className="bg-zinc-900 border border-zinc-800 rounded-sm p-4 shadow-xl">
            <h2 className="text-xl font-bold text-white mb-4">All Transactions</h2>
            <ExpenseList expenses={expenses} />
          </div>
        );
      case 'subscriptions': return <SubscriptionView expenses={expenses} />;
      case 'patterns': return <PatternsView expenses={expenses} />;
      case 'friends': return <FriendsView expenses={expenses} />; // 🔥 ADDED THIS
      default: return <Dashboard />;
    }
  };

  if (!isDbReady || loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-black mb-4 animate-pulse tracking-tight">Waking up SQLite & Security...</h1>
      </div>
    );
  }

  if (!currentUser) {
    return <AuthScreen />;
  }

  if (isBooting) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 bg-indigo-500 rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(99,102,241,0.3)]">
           <Zap className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-black text-white mb-2 tracking-tight">Leak Detector</h1>
        <p className="text-[10px] text-zinc-500 font-bold tracking-widest uppercase mb-10">Smart Financial Management</p>
        
        <p className="text-sm text-zinc-400 font-semibold mb-8">
          Welcome back, {currentUser.name}! Click below to sync new SMS data.
        </p>
        
        <button 
          onClick={triggerManualSync}
          className="w-full max-w-xs py-4 bg-indigo-600 hover:bg-indigo-500 rounded-sm font-bold text-white shadow-lg transition-all uppercase tracking-wider text-sm"
        >
          Sync Data Vault
        </button>

        <p className="text-indigo-400 font-semibold mt-8 animate-pulse text-xs">{bootMessage}</p>
      </div>
    );
  }

  return (
    // 🔥 ADDED pb-24 so content isn't hidden behind the new mobile bottom nav
    <div className="min-h-screen bg-[#0a0a0a] font-sans text-zinc-200 p-4 pb-24 md:p-8 md:pb-8 selection:bg-indigo-500/30">
      <Header />
      <main className="max-w-7xl mx-auto relative z-10">
        {renderTabContent()}
      </main>

      {/* 🔥 MOBILE BOTTOM NAVIGATION BAR */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0a0a0a]/95 backdrop-blur-lg border-t border-zinc-800 flex justify-around items-center px-2 py-3 z-[100] pb-safe">
        {[
          { id: 'dashboard', label: 'Home', icon: Home },
          { id: 'expenses', label: 'Txns', icon: List },
          { id: 'friends', label: 'Friends', icon: Users }, // 🔥 ADDED THIS
          { id: 'subscriptions', label: 'Subs', icon: RefreshCw },
          { id: 'patterns', label: 'Patterns', icon: BarChart2 }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-1 p-2 w-16 transition-colors ${isActive ? 'text-indigo-400' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'fill-indigo-500/20' : ''}`} />
              <span className="text-[9px] font-bold tracking-wide">{tab.label}</span>
            </button>
          );
        })}
      </nav>

      {/* SALARY MODAL */}
      {showSalaryModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
           <div className="bg-zinc-900 p-8 rounded-sm w-full max-w-md border border-zinc-800 shadow-2xl">
              <h2 className="text-2xl font-bold text-white mb-2">Welcome!</h2>
              <p className="text-xs text-zinc-400 mb-6 uppercase tracking-widest font-semibold">Enter monthly income to track leaks.</p>
              
              <div className="relative mb-6">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 font-bold">₹</span>
                <input 
                  type="number"
                  value={inputIncome}
                  onChange={(e) => setInputIncome(e.target.value)}
                  placeholder="e.g. 50000"
                  className="w-full pl-9 pr-4 py-3 bg-[#0a0a0a] border border-zinc-800 rounded-sm text-white font-semibold focus:outline-none focus:border-indigo-500/50 transition-colors"
                />
              </div>

              <button 
                onClick={() => handleSalarySubmit(Number(inputIncome) || 0)} 
                className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 rounded-sm font-bold text-white transition-all shadow-lg shadow-indigo-600/10 uppercase tracking-wider text-sm"
              >
                Set Income
              </button>
           </div>
        </div>
      )}
    </div>
  );
}

export default App;
