/* src/context/ExpenseContext.js */
import React, { createContext, useContext, useState } from 'react';
import { categorizeTransaction, calculateLeakAnalysis, generateSmartInsights } from '../utils/leakLogic';

const ExpenseContext = createContext();

export function ExpenseProvider({ children }) {
  const [expenses, setExpenses] = useState([]); 
  const [insights, setInsights] = useState([]);
  const [leakScore, setLeakScore] = useState(0);
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const [showSalaryModal, setShowSalaryModal] = useState(true);

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
    runAnalysis(expenses, income);
  };

  const handleAddExpense = (newExpense) => {
    if (!newExpense.category || newExpense.category === 'misc') {
      newExpense.category = categorizeTransaction(newExpense.description);
    }
    const updated = [newExpense, ...expenses];
    setExpenses(updated);
    runAnalysis(updated, monthlyIncome);
  };

  // 🔥 नया फंक्शन: यह एक साथ 50+ ट्रांज़ैक्शन सेव करेगा बिना ओवरराइट किये!
  const handleAddMultipleExpenses = (newExpensesArray) => {
    const updated = [...newExpensesArray, ...expenses];
    setExpenses(updated);
    runAnalysis(updated, monthlyIncome);
  };

  const handleDeleteExpense = (id) => {
    const updated = expenses.filter(expense => expense.id !== id);
    setExpenses(updated);
    runAnalysis(updated, monthlyIncome);
  };

  return (
    <ExpenseContext.Provider value={{
      expenses, insights, setInsights, leakScore, monthlyIncome, activeTab, setActiveTab,
      showSalaryModal, setShowSalaryModal,
      handleSalarySubmit, handleAddExpense, 
      handleAddMultipleExpenses, // इसे यहाँ एक्सपोर्ट करना ज़रूरी है
      handleDeleteExpense
    }}>
      {children}
    </ExpenseContext.Provider>
  );
}

export function useExpenses() {
  return useContext(ExpenseContext);
}