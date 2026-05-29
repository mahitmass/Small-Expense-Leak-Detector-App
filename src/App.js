/* src/App.js */
import React from 'react';
import Header from './components/Header';

// Features -> Dashboard Layout
import Dashboard from './features/dashboard/Dashboard';

// Features -> Transactions Management
import ExpenseList from './features/transactions/ExpenseList';
import PatternsView from './features/transactions/PatternsView';
import SubscriptionView from './features/transactions/SubscriptionView'; 

// Features -> Pop-up Modals
import SMSPermissionModal from './features/modals/SMSPermissionModal';
import SalaryModal from './features/modals/SalaryModal';

// Global Context Hook
import { useExpenses } from './context/ExpenseContext';

function App() {
  const {
    expenses, activeTab,
    showSalaryModal, showSMSModal, setShowSMSModal,
    handleSalarySubmit, handleDeleteExpense, handleAllowSMS
  } = useExpenses();

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />; // Completely clean! No children passed.
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
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px]"></div>
      </div>

      <SalaryModal isOpen={showSalaryModal} onSubmit={handleSalarySubmit} />
      
      <SMSPermissionModal 
        isOpen={showSMSModal}
        onAllow={handleAllowSMS}
        onDeny={() => setShowSMSModal(false)}
      />

      <Header /> {/* Completely clean! No props passed. */}
      
      <main className="max-w-7xl mx-auto pb-20">
        {renderTabContent()}
      </main>
    </div>
  );
}

export default App;