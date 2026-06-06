/* src/context/ExpenseContext.js */
import React, { createContext, useContext, useState, useEffect } from 'react';
import { initializeDatabase, getDB } from '../utils/db';

const ExpenseContext = createContext();

export function ExpenseProvider({ children }) {
    const [expenses, setExpenses] = useState([]);
    const [isDbReady, setIsDbReady] = useState(false);

    useEffect(() => {
        const setup = async () => {
            const ready = await initializeDatabase();
            setIsDbReady(ready);
            if (ready) {
                await loadExpensesFromDB();
            }
        };
        setup();
    }, []);

    const loadExpensesFromDB = async () => {
        const db = getDB();
        if (!db) return;
        
        const result = await db.query(`SELECT * FROM transactions ORDER BY date DESC`);
        if (result.values) {
            setExpenses(result.values);
        }
    };

    const handleAddMultipleExpenses = async (parsedTransactionsArray) => {
        const db = getDB();
        if (!db || parsedTransactionsArray.length === 0) return;

        let statements = [];
        
        parsedTransactionsArray.forEach((t) => {
            const uniqueHash = `${t.date}_${t.amount}_${t.merchant.replace(/\s+/g, '')}`;
            statements.push({
                statement: `INSERT OR IGNORE INTO transactions (amount, merchant, date, category, type, unique_hash) VALUES (?, ?, ?, ?, ?, ?)`,
                values: [t.amount, t.merchant, t.date, t.category || 'Unknown', t.type || 'debit', uniqueHash]
            });
        });

        try {
            await db.executeSet(statements);
            await loadExpensesFromDB(); 
        } catch (error) {
            console.error("Batch SQLite write failed:", error);
        }
    };

    return (
        <ExpenseContext.Provider value={{ expenses, isDbReady, handleAddMultipleExpenses }}>
            {children}
        </ExpenseContext.Provider>
    );
}

export const useExpenses = () => useContext(ExpenseContext);
