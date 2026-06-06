/* src/utils/db.js */
import { CapacitorSQLite, SQLiteConnection } from '@capacitor-community/sqlite';

const sqlite = new SQLiteConnection(CapacitorSQLite);
let db = null;

export const initializeDatabase = async () => {
    try {
        db = await sqlite.createConnection("expense_leak_db", false, "no-encryption", 1, false);
        await db.open();

        const schema = `
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
        await db.execute(schema);
        console.log("✅ SQLite Database Initialized Successfully");
        return true;
    } catch (error) {
        console.error("❌ SQLite Initialization Failed:", error);
        return false;
    }
};

export const getDB = () => db;
