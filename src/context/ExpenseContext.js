/* src/context/ExpenseContext.js */
import React, { createContext, useContext, useState, useEffect } from 'react';
import { categorizeTransaction, calculateLeakAnalysis, generateSmartInsights } from '../utils/leakLogic';
import { getDB } from '../utils/db'; // 🔥 Importing the new SQLite database

const ExpenseContext = createContext();

export function ExpenseProvider({ children }) {
  const [expenses, setExpenses] = useState([]); 
  const [insights, setInsights] = useState([]);
  const [leakScore, setLeakScore] = useState(0);
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showSalaryModal, setShowSalaryModal] = useState(true);

  // 🔥 INITIAL LOAD: Fetch data from SQLite when the app boots
  useEffect(() => {
    const loadData = async () => {
      const db = getDB();
      if (db) {
        try {
          const res = await db.query(`SELECT * FROM transactions ORDER BY date DESC`);
          if (res.values && res.values.length > 0) {
            const loadedExpenses = res.values.map(row => ({
              id: row.id,
              amount: row.amount,
              description: row.merchant,
              date: row.date,
              category: row.category,
              type: row.type
            }));
            setExpenses(loadedExpenses);
            runAnalysis(loadedExpenses, monthlyIncome);
          }
        } catch (error) {
          console.error("❌ Failed to load from SQLite:", error);
        }
      }
    };
    loadData();
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
    setInsights(newInsights);
  };

  const handleSalarySubmit = (income) => {
    setMonthlyIncome(income);
    setShowSalaryModal(false);
    runAnalysis(expenses, income);
  };

  // 🔥 UPDATE: Save single expense to SQLite
  const handleAddExpense = async (newExpense) => {
    if (!newExpense.category || newExpense.category === 'misc') {
      newExpense.category = categorizeTransaction(newExpense.description);
    }
    
    const db = getDB();
    if (db) {
      try {
        const query = `INSERT INTO transactions (amount, merchant, date, category, type, unique_hash) VALUES (?, ?, ?, ?, ?, ?)`;
        const hash = `${newExpense.description}-${newExpense.amount}-${newExpense.date}`; // Basic unique hash
        await db.run(query, [newExpense.amount, newExpense.description, newExpense.date, newExpense.category, 'debit', hash]);
      } catch (err) {
        console.error("SQLite Insert Error:", err);
      }
    }

    const updated = [newExpense, ...expenses];
    setExpenses(updated);
    runAnalysis(updated, monthlyIncome);
  };

  // 🔥 UPDATE: Bulk save 50+ transactions to SQLite without overwriting!
  const handleAddMultipleExpenses = async (newExpensesArray) => {
    const db = getDB();
    if (db) {
      try {
        // Run a loop to insert the massive batch safely into the database
        for (const exp of newExpensesArray) {
          const cat = (!exp.category || exp.category === 'misc') ? categorizeTransaction(exp.description) : exp.category;
          const hash = `${exp.description}-${exp.amount}-${exp.date}-${Math.random()}`; // Prevent hash collisions
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
  };

  return (
    <ExpenseContext.Provider value={{
      expenses, insights, setInsights, leakScore, monthlyIncome, activeTab, setActiveTab,
      showSalaryModal, setShowSalaryModal,
      handleSalarySubmit, handleAddExpense, 
      handleAddMultipleExpenses,
      handleDeleteExpense
    }}>
      {children}
    </ExpenseContext.Provider>
  );
}

export function useExpenses() {
  return useContext(ExpenseContext);
}