/* src/context/ExpenseContext.js */
import React, { createContext, useContext, useState, useEffect } from 'react';
// 🔥 Cleaned up imports so everything is merged perfectly
import { categorizeTransaction, calculateLeakAnalysis, generateSmartInsights, evaluateDailyLeaks, calculateMonthlySavings } from '../utils/leakLogic';
import { getDB } from '../utils/db'; 
import { scanForSubscriptions } from '../utils/subscriptionScanner'; 
import { syncNotification } from '../utils/notificationSync'; 

const ExpenseContext = createContext();

export function ExpenseProvider({ children }) {
  const [expenses, setExpenses] = useState([]); 
  const [insights, setInsights] = useState([]);
  const [notifications, setNotifications] = useState([]); // 🔥 Your new inbox for Android alerts
  const [leakScore, setLeakScore] = useState(0);
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showSalaryModal, setShowSalaryModal] = useState(true);
  const [upcomingSubscriptions, setUpcomingSubscriptions] = useState([]);

  // 🔥 THE MASTER ALERT FUNCTION
  const dispatchAlert = async (title, message) => {
    await syncNotification(Date.now(), title, message, (newAlert) => {
      // Pushes directly to the new notifications bucket instead of mixing with insights
      setNotifications(prev => [newAlert, ...prev]); 
    });
  };

  // 🔥 ADDED 'isBoot' SWITCH TO PREVENT SPAM
  const loadData = async (isBoot = false) => {
    const db = getDB();
    if (db) {
      try {
        const res = await db.query(`SELECT * FROM transactions ORDER BY date DESC, id DESC`);
        
        let dbExpenses = [];
        if (res.values && res.values.length > 0) {
          dbExpenses = res.values.map(row => ({
            id: row.id,
            amount: row.amount,
            description: row.merchant,
            date: row.date,
            category: row.category,
            type: row.type,
            time: row.time || 'day'
          }));
        }

        setExpenses(dbExpenses);
        runAnalysis(dbExpenses, monthlyIncome);
        
        const predicted = scanForSubscriptions(dbExpenses);
        setUpcomingSubscriptions(predicted);

        // 🔥 FIRE THESE ONLY WHEN THE APP OPENS (Not every time you add an expense)
        if (isBoot) {
          // 1. Subscription Alerts
          predicted.forEach(sub => {
             if (sub.count >= 5) {
                dispatchAlert(
                  "Subscription Leak! 🚨", 
                  `You've paid for ${sub.name} 5 times. Are you still using it?`
                );
             }
          });

          // 2. Monthly Savings Alerts
          const monthlyStats = calculateMonthlySavings(dbExpenses);
          if (monthlyStats.hasSavings) {
             dispatchAlert(
               "Great Job Saving! 📈", 
               `You spent ₹${monthlyStats.lastMonthTotal} last month, but only ₹${monthlyStats.thisMonthTotal} this month. You saved ₹${monthlyStats.savings}!`
             );
          }
        }

      } catch (error) {
        console.error("❌ Failed to load from SQLite:", error);
      }
    }
  };

  // INITIAL AUTO-LOAD ON BOOT
  useEffect(() => {
    // Pass 'true' here so the alerts know it's safe to fire!
    loadData(true);
  }, [monthlyIncome]);

  const runAnalysis = (currentExpenses, income) => {
    const safeIncome = income || monthlyIncome;
    const { score } = calculateLeakAnalysis(currentExpenses, safeIncome);
    setLeakScore(score);

    const totals = currentExpenses.reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
      return acc;
    }, {});
    
    const newInsights = generateSmartInsights(currentExpenses, totals);
    
    // 🔥 Reverted to standard so your insights panel acts normal
    setInsights(newInsights);
  };

  const handleSalarySubmit = (income) => {
    const strictInt = Math.floor(Number(income)); 
    setMonthlyIncome(strictInt);
    setShowSalaryModal(false);
    runAnalysis(expenses, strictInt);
  };

  const handleAddExpense = async (newExpense) => {
    if (!newExpense.category || newExpense.category === 'misc') {
      newExpense.category = categorizeTransaction(newExpense.description);
    }
    
    const db = getDB();
    if (db) {
      try {
        const query = `INSERT OR IGNORE INTO transactions (amount, merchant, date, category, type, unique_hash) VALUES (?, ?, ?, ?, ?, ?)`;
        const hash = `${newExpense.description}-${newExpense.amount}-${newExpense.date}`; 
        await db.run(query, [newExpense.amount, newExpense.description, newExpense.date, newExpense.category, 'debit', hash]);
        
        // Notice we don't pass 'true' here, so it won't spam the monthly alert!
        await loadData(); 
      } catch (err) {
        console.error("SQLite Insert Error:", err);
      }
    }

    const dailyLeakLimit = 500; 
    const leakWarning = evaluateDailyLeaks(newExpense, expenses, dailyLeakLimit);
    
    if (leakWarning) {
      const msg = typeof leakWarning === 'string' ? leakWarning : `You exceeded your ₹${dailyLeakLimit} daily limit!`;
      dispatchAlert("Daily Leak Alert 🚨", msg);
    }
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
        await loadData();
      } catch (err) {
        console.error("SQLite Bulk Insert Error:", err);
      }
    }
  };

  const handleDeleteExpense = async (id) => {
    const db = getDB();
    if (db) {
      try {
        await db.run(`DELETE FROM transactions WHERE id = ?`, [id]);
        await loadData();
      } catch (err) {
        console.error("SQLite Delete Error:", err);
      }
    }
  };

  return (
    <ExpenseContext.Provider value={{
      expenses, insights, setInsights, leakScore, monthlyIncome, activeTab, setActiveTab,
      showSalaryModal, setShowSalaryModal, upcomingSubscriptions,
      notifications, setNotifications, // 🔥 Successfully exported here!
      handleSalarySubmit, handleAddExpense, handleDeleteExpense, handleAddMultipleExpenses, 
      dispatchAlert 
    }}>
      {children}
    </ExpenseContext.Provider>
  );
}

export function useExpenses() {
  return useContext(ExpenseContext);
}