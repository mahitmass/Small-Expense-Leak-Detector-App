/* src/App.js */
import React, { useEffect, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import Header from './components/Header';
import Dashboard from './features/dashboard/Dashboard';
import ExpenseList from './features/transactions/ExpenseList';
import SubscriptionView from './features/transactions/SubscriptionView';
import PatternsView from './features/transactions/PatternsView';
import { useExpenses } from './context/ExpenseContext';
import { parseBankSMS } from './utils/smsParser';
import { initializeDatabase } from './utils/db'; 

// 🔥 IMPORT THE CONTRIBUTOR'S AUTH CONTEXT AND SCREEN
import { useAuth } from './context/AuthContext';
import AuthScreen from './features/auth/AuthScreen';

function App() {
  // 🔥 PULL IN AUTH STATE
  const { currentUser, loading } = useAuth();

  const {
    showSalaryModal, 
    setShowSMSModal,
    activeTab, 
    handleAddExpense,
    handleAddMultipleExpenses, 
    expenses,
    handleSalarySubmit
  } = useExpenses();
  
  const [inputIncome, setInputIncome] = useState('50000');
  
  // 🔥 STATE FOR THE SMART GATEKEEPER
  const [isDbReady, setIsDbReady] = useState(false);
  const [isBooting, setIsBooting] = useState(true);
  const [bootMessage, setBootMessage] = useState("Initializing Engine...");

  // 🔥 THE SMART BRAIN: Boot DB & Check Sync Memory
  useEffect(() => {
    const setupDB = async () => {
      const success = await initializeDatabase();
      if (success) {
        setIsDbReady(true);
        
        // Did we already sync the inbox in the past?
        const hasSynced = localStorage.getItem("hasSyncedInbox");
        if (hasSynced === "true") {
          setIsBooting(false); // Skip the manual sync screen
        }
      } else {
        console.error("Database failed to wake up!");
        setBootMessage("🚨 Database Failed to Wake Up");
      }
    };
    setupDB();
  }, []);

  const triggerManualSync = () => {
    if (Capacitor.isNativePlatform()) {
      setBootMessage("Accessing Native Inbox...");
      const smsEngine = window.SMS || (window.cordova && window.cordova.plugins && window.cordova.plugins.sms);

      if (smsEngine) {
        if (typeof smsEngine.listSMS === 'function') {
          fetchNativeMessages(smsEngine);
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

  const fetchNativeMessages = (smsEngine) => {
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
      }

      alert(`✅ Synced ${addedCount} new transactions from your inbox!`);

      // 🔥 STAMP THE MEMORY: Tell the app never to show the Sync screen again
      localStorage.setItem("hasSyncedInbox", "true");

      if (typeof setIsBooting === 'function') {
        setIsBooting(false); 
      }
      if (typeof setShowSMSModal === 'function') {
        setShowSMSModal(false);
      }

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
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-4 shadow-xl">
            <h2 className="text-xl font-bold text-white mb-4">All Transactions</h2>
            <ExpenseList expenses={expenses} />
          </div>
        );
      case 'subscriptions': return <SubscriptionView expenses={expenses} />;
      case 'patterns': return <PatternsView expenses={expenses} />;
      default: return <Dashboard />;
    }
  };

  // 🔥 GATEKEEPER 1: Wait for SQLite to Boot Up
  if (!isDbReady || loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-black mb-4 animate-pulse">Waking up SQLite & Security...</h1>
      </div>
    );
  }

  // 🔥 GATEKEEPER 2: If no one is logged in, block access and show the Vault UI
  if (!currentUser) {
    return <AuthScreen />;
  }

  // 🔥 GATEKEEPER 3: The Smart SMS Inbox Check (Only runs once!)
  if (isBooting) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 text-center">
        <h1 className="text-3xl font-black text-white mb-4">Mass Detector</h1>
        <p className="text-slate-400 font-semibold mb-8">
          Welcome to the vault, {currentUser.name}! Click below to sync your historical SMS data.
        </p>
        
        <button 
          onClick={triggerManualSync}
          className="px-8 py-4 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold text-white shadow-lg transition-all"
        >
          I have allowed SMS ➡️ Sync Now
        </button>

        <p className="text-blue-400 font-semibold mt-8 animate-pulse">{bootMessage}</p>
      </div>
    );
  }

  // --- NORMAL APP UI ---
  return (
    <div className="min-h-screen bg-slate-900 font-sans text-slate-200 p-4 md:p-8 selection:bg-blue-500/30">
      <Header />
      <main className="max-w-7xl mx-auto relative z-10">
        {renderTabContent()}
      </main>

      {/* SALARY MODAL */}
      {showSalaryModal && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
           <div className="bg-slate-800 p-6 rounded-2xl w-full max-w-md border border-slate-700 shadow-2xl">
              <h2 className="text-2xl font-bold text-white mb-2">Welcome, {currentUser.name}!</h2>
              <p className="text-slate-400 mb-6">Enter your monthly income to start tracking leaks.</p>
              
              <div className="relative mb-6">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                <input 
                  type="number"
                  value={inputIncome}
                  onChange={(e) => setInputIncome(e.target.value)}
                  placeholder="e.g. 50000"
                  className="w-full pl-9 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white font-semibold focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <button 
                onClick={() => handleSalarySubmit(Number(inputIncome) || 0)} 
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold text-white transition-colors shadow-lg shadow-blue-600/20"
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