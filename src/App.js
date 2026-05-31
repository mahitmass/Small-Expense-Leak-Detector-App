/* src/App.js */
import React, { useEffect } from 'react';
import AIAssistant from './features/ai/AIAssistant';

// Layout & Context
import Header from './components/Header';
import { useExpenses } from './context/ExpenseContext';

// Native SMS Parser Engine
import { parseBankSMS } from './utils/smsParser';

// Features
import Dashboard from './features/dashboard/Dashboard';
import ExpenseList from './features/transactions/ExpenseList';
import PatternsView from './features/transactions/PatternsView';
import SubscriptionView from './features/transactions/SubscriptionView'; 
import SMSPermissionModal from './features/modals/SMSPermissionModal';
import SalaryModal from './features/modals/SalaryModal';

function App() {
  const {
    expenses, activeTab,
    showSalaryModal, showSMSModal, setShowSMSModal,
    handleSalarySubmit, handleDeleteExpense, handleAllowSMS,
    handleAddExpense // Pull this in so we can save scanned transactions
  } = useExpenses();

  // Native Automation: Scans the last 100 SMS messages on the device
  const scanInboxHistory = () => {
    if (window.SMS) {
      // 1. Check for permission first
      window.SMS.hasPermission((hasPermission) => {
        if (hasPermission) {
          fetchMessages();
        } else {
          // 2. Request permission natively (Triggers the Android popup)
          window.SMS.requestPermission(() => {
            console.log("SMS Permission Granted!");
            fetchMessages();
          }, (err) => {
            console.error("SMS Permission Denied by User", err);
          });
        }
      }, (err) => console.error("Permission check failed", err));
    } else {
      console.log("Running in Browser mode - Native SMS inbox tracking disabled.");
    }
  };

  // 3. The actual fetching logic separated out
  const fetchMessages = () => {
    const filter = { box: 'inbox', maxCount: 100 };
    window.SMS.listSMS(filter, (messages) => {
      console.log(`Successfully pulled ${messages.length} SMS items.`);
      messages.forEach((msg) => {
        const parsedTransaction = parseBankSMS(msg.body);
        if (parsedTransaction && parsedTransaction.type === 'debit') {
          const isDuplicate = expenses.some(
            e => e.amount === parsedTransaction.amount && 
                 e.description === parsedTransaction.merchant
          );
          if (!isDuplicate) {
            handleAddExpense({
              description: parsedTransaction.merchant,
              amount: parsedTransaction.amount,
              category: 'shopping', 
              date: parsedTransaction.date.split('T')[0],
              time: 'day'
            });
          }
        }
      });
    }, (err) => console.error("Failed to list SMS:", err));
  };

  // Intercept the permission click to trigger the scanner immediately
  const handleNativeAllow = () => {
    handleAllowSMS(); // Fires your original context handler
    setTimeout(() => {
      scanInboxHistory(); // Runs the initialization scan
    }, 1600); // Wait for your modal's premium loading animation to finish!
  };

  // Automatically scan on app launch if the modal is already cleared/authorized
  useEffect(() => {
    if (!showSMSModal && !showSalaryModal) {
      scanInboxHistory();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showSMSModal, showSalaryModal]);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'expenses':
        return (
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-4 shadow-xl">
            <ExpenseList expenses={expenses} onDelete={handleDeleteExpense} />
          </div>
        );
      case 'subscriptions':
        return <SubscriptionView expenses={expenses} />;
      case 'patterns':
        return <PatternsView expenses={expenses} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 p-4 md:p-6 font-sans">
      {/* Background Glow */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px]"></div>
      </div>

      {/* Modals */}
      <SalaryModal isOpen={showSalaryModal} onSubmit={handleSalarySubmit} />
      <SMSPermissionModal 
        isOpen={showSMSModal}
        onAllow={handleNativeAllow} // Uses our native wrapper hook
        onDeny={() => setShowSMSModal(false)}
      />

      {/* Main UI */}
      <Header />
      
      <main className="max-w-7xl mx-auto pb-20">
        {renderTabContent()}
      </main>
      
      {/* The New AI Feature */}
      <AIAssistant />
    </div>
  );
}

export default App;