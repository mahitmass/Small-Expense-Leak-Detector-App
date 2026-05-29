/* src/context/ExpenseContext.js */
import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_EXPENSES } from '../utils/constants';
import { categorizeTransaction, calculateLeakAnalysis, generateSmartInsights } from '../utils/leakLogic';

const ExpenseContext = createContext();

export function ExpenseProvider({ children }) {
  const [expenses, setExpenses] = useState([]);
  const [insights, setInsights] = useState([]);
  const [leakScore, setLeakScore] = useState(0);
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const [showSalaryModal, setShowSalaryModal] = useState(true);
  const [showSMSModal, setShowSMSModal] = useState(false);

  useEffect(() => {
    setExpenses(INITIAL_EXPENSES);
  }, []);

  const runAnalysis = (currentExpenses, income) => {
    const safeIncome = income || monthlyIncome;
    const { score } = calculateLeakAnalysis(currentExpenses, safeIncome);
    setLeakScore(score);

    const totals = currentExpenses.reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
      return acc;
    }, {});
    
    const newInsights = generateSmartInsights(currentExpenses, totals);
    setInsights(newInsights);
  };

  const handleSalarySubmit = (income) => {
    setMonthlyIncome(income);
    setShowSalaryModal(false);
    setTimeout(() => setShowSMSModal(true), 500);
    runAnalysis(INITIAL_EXPENSES, income);
  };

  const handleAddExpense = (newExpense) => {
    if (!newExpense.category || newExpense.category === 'misc') {
      newExpense.category = categorizeTransaction(newExpense.description);
    }
    const updated = [newExpense, ...expenses];
    setExpenses(updated);
    runAnalysis(updated, monthlyIncome);
  };

  const handleDeleteExpense = (id) => {
    const updated = expenses.filter(expense => expense.id !== id);
    setExpenses(updated);
    runAnalysis(updated, monthlyIncome);
  };

  const handleAllowSMS = () => {
    setShowSMSModal(false);
    setTimeout(() => {
      const smsData = [
        { id: 901, amount: 499, category: 'subscription', description: 'Netflix Auto-Debit', date: '2024-01-20', time: 'morning' },
        { id: 902, amount: 269, category: 'food', description: 'Zomato Order #221', date: '2024-01-19', time: 'night' },
        { id: 903, amount: 40, category: 'snacks', description: 'Chai Point', date: '2024-01-19', time: 'evening' },
      ];
      const merged = [...smsData, ...expenses];
      setExpenses(merged);
      runAnalysis(merged, monthlyIncome);
      alert("✅ SMS Data Synced");
    }, 800);
  };

  return (
    <ExpenseContext.Provider value={{
      expenses, insights, setInsights, leakScore, monthlyIncome, activeTab, setActiveTab,
      showSalaryModal, setShowSalaryModal, showSMSModal, setShowSMSModal,
      handleSalarySubmit, handleAddExpense, handleDeleteExpense, handleAllowSMS
    }}>
      {children}
    </ExpenseContext.Provider>
  );
}

export function useExpenses() {
  return useContext(ExpenseContext);
}