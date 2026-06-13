/* src/context/ExpenseContext.js */
import React, { createContext, useContext, useState, useEffect } from 'react';
import { categorizeTransaction, calculateLeakAnalysis, generateSmartInsights, evaluateDailyLeaks } from '../utils/leakLogic';
import { getDB } from '../utils/db'; 
import { scanForSubscriptions } from '../utils/subscriptionScanner'; 
// 🔥 NEW: Import the Sync Engine
import { syncNotification } from '../utils/notificationSync'; 

const ExpenseContext = createContext();

export function ExpenseProvider({ children }) {
  const [expenses, setExpenses] = useState([]); 
  const [insights, setInsights] = useState([]);
  const [leakScore, setLeakScore] = useState(0);
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showSalaryModal, setShowSalaryModal] = useState(true);
  const [upcomingSubscriptions, setUpcomingSubscriptions] = useState([]);

  // INITIAL LOAD: Fetch data from SQLite when the app boots
  useEffect(() => {
    const loadData = async () => {
      const db = getDB();
      if (db) {
        try {
          const res = await db.query(`SELECT * FROM transactions ORDER BY date DESC`);
          
          let dbExpenses = [];
          if (res.values && res.values.length > 0) {
            dbExpenses = res.values.map(row => ({
              id: row.id,
              amount: row.amount,
              description: row.merchant,
              date: row.date,
              category: row.category,
              type: row.type
            }));
          }

          setExpenses(dbExpenses);
          runAnalysis(dbExpenses, monthlyIncome);

          const predicted = scanForSubscriptions(dbExpenses);
          setUpcomingSubscriptions(predicted);

        } catch (error) {
          console.error("❌ Failed to load from SQLite:", error);
        }
      }
    };
    loadData();
  }, [monthlyIncome]);

  // 🔥 NEW: The Master Alert Function (Fires Android Push + Updates Bell Icon)
  const dispatchAlert = async (title, message) => {
    await syncNotification(Date.now(), title, message, (newAlert) => {
      // We tag it as 'isDynamic' so it doesn't get erased by static analysis
      const finalAlert = { ...newAlert, isDynamic: true };
      setInsights(prev => [finalAlert, ...prev]);
    });
  };

  const runAnalysis = (currentExpenses, income) => {
    const safeIncome = income || monthlyIncome;
    const { score } = calculateLeakAnalysis(currentExpenses, safeIncome);
    setLeakScore(score);

    const totals = currentExpenses.reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
      return acc;
    }, {});
    
    const newInsights = generateSmartInsights(currentExpenses, totals);
    
    // 🔥 FIX: Merge the new static insights with your dynamic Android alerts
    setInsights(prev => {
      const dynamicAlerts = prev.filter(p => p.isDynamic);
      return [...dynamicAlerts, ...newInsights];
    });
  };

  const handleSalarySubmit = (income) => {
    setMonthlyIncome(income);
    setShowSalaryModal(false);
    runAnalysis(expenses, income);
  };

  const handleAddExpense = async (newExpense) => {
    if (!newExpense.category || newExpense.category === 'misc') {
      newExpense.category = categorizeTransaction(newExpense.description);
    }
    
    const db = getDB();
    if (db) {
      try {
        const query = `INSERT INTO transactions (amount, merchant, date, category, type, unique_hash) VALUES (?, ?, ?, ?, ?, ?)`;
        const hash = `${newExpense.description}-${newExpense.amount}-${newExpense.date}`; 
        await db.run(query, [newExpense.amount, newExpense.description, newExpense.date, newExpense.category, 'debit', hash]);
      } catch (err) {
        console.error("SQLite Insert Error:", err);
      }
    }

    // 🔥 THE DAILY LEAK MONITOR 
    const dailyLeakLimit = 500; 
    const leakWarning = evaluateDailyLeaks(newExpense, expenses, dailyLeakLimit);
    
    // Trigger the synchronized alert if a leak is detected
    if (leakWarning) {
      const msg = typeof leakWarning === 'string' ? leakWarning : `You exceeded your ₹${dailyLeakLimit} daily limit!`;
      dispatchAlert("Daily Leak Alert 🚨", msg);
    }

    const updated = [newExpense, ...expenses];
    setExpenses(updated);
    runAnalysis(updated, monthlyIncome);
    setUpcomingSubscriptions(scanForSubscriptions(updated));
  };

  const handleAddMultipleExpenses = async (newExpensesArray) => {
    const db = getDB();
    if (db) {
      try {
        for (const exp of newExpensesArray) {
          const cat = (!exp.category || exp.category === 'misc') ? categorizeTransaction(exp.description) : exp.category;
          const hash = `${exp.description}-${exp.amount}-${exp.date}-${Math.random()}`; 
          const query = `INSERT OR IGNORE INTO transactions (amount, merchant, date, category, type, unique_hash) VALUES (?, ?, ?, ?, ?, ?)`;
          await db.run(query, [exp.amount, exp.description, exp.date, cat, 'debit', hash]);
        }
      } catch (err) {
        console.error("SQLite Bulk Insert Error:", err);
      }
    }

    const updated = [...newExpensesArray, ...expenses];
    setExpenses(updated);
    runAnalysis(updated, monthlyIncome);
    setUpcomingSubscriptions(scanForSubscriptions(updated));
  };

  const handleDeleteExpense = async (id) => {
    const db = getDB();
    if (db) {
      try {
        await db.run(`DELETE FROM transactions WHERE id = ?`, [id]);
      } catch (err) {
        console.error("SQLite Delete Error:", err);
      }
    }

    const updated = expenses.filter(expense => expense.id !== id);
    setExpenses(updated);
    runAnalysis(updated, monthlyIncome);
    setUpcomingSubscriptions(scanForSubscriptions(updated));
  };

  return (
    <ExpenseContext.Provider value={{
      expenses, insights, setInsights, leakScore, monthlyIncome, activeTab, setActiveTab,
      showSalaryModal, setShowSalaryModal, upcomingSubscriptions,
      handleSalarySubmit, handleAddExpense, handleAddMultipleExpenses, handleDeleteExpense,
      dispatchAlert // 🔥 Exported so you can call it from anywhere!
    }}>
      {children}
    </ExpenseContext.Provider>
  );
}

export function useExpenses() {
  return useContext(ExpenseContext);
}