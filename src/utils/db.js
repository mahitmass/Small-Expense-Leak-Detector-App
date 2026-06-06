/* src/utils/db.js */
import { CapacitorSQLite, SQLiteConnection } from '@capacitor-community/sqlite';

const sqlite = new SQLiteConnection(CapacitorSQLite);
let db = null;

export const initializeDatabase = async () => {
    try {
        db = await sqlite.createConnection("expense_leak_db", false, "no-encryption", 1, false);
        await db.open();

        // 1. Transactions table schema
        const transactionSchema = `
            CREATE TABLE IF NOT EXISTS transactions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                amount REAL NOT NULL,
                merchant TEXT NOT NULL,
                date TEXT NOT NULL,
                category TEXT DEFAULT 'Unknown',
                type TEXT DEFAULT 'debit',
                unique_hash TEXT UNIQUE
            );
        `;
        
        // 2. Users table schema for local authentication
        const userSchema = `
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                username TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP
            );
        `;

        await db.execute(transactionSchema);
        await db.execute(userSchema);
        
        console.log("✅ SQLite Tables Initialized Successfully");
        return true;
    } catch (error) {
        console.error("❌ SQLite Initialization Failed:", error);
        return false;
    }
};

export const getDB = () => db;