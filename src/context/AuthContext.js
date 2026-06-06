/* src/context/AuthContext.js */
import React, { createContext, useContext, useState, useEffect } from 'react';
import { getDB } from '../utils/db';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Optional: Check local storage or session if user was previously logged in
        const savedUser = localStorage.getItem('active_user');
        if (savedUser) {
            setCurrentUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    const handleSignUp = async (name, username, password) => {
        const db = getDB();
        if (!db) return { success: false, error: "Database not ready" };

        try {
            const queryStr = `INSERT INTO users (name, username, password) VALUES (?, ?, ?)`;
            await db.run(queryStr, [name, username.toLowerCase().trim(), password]);
            
            // Auto log in after signing up
            const user = { name, username };
            setCurrentUser(user);
            localStorage.setItem('active_user', JSON.stringify(user));
            return { success: true };
        } catch (error) {
            console.error("Signup error:", error);
            return { success: false, error: "Username already exists or invalid!" };
        }
    };

    const handleSignIn = async (username, password) => {
        const db = getDB();
        if (!db) return { success: false, error: "Database not ready" };

        try {
            const res = await db.query(
                `SELECT * FROM users WHERE username = ? AND password = ?`,
                [username.toLowerCase().trim(), password]
            );

            if (res.values && res.values.length > 0) {
                const matchedUser = res.values[0];
                const user = { name: matchedUser.name, username: matchedUser.username };
                setCurrentUser(user);
                localStorage.setItem('active_user', JSON.stringify(user));
                return { success: true };
            } else {
                return { success: false, error: "Invalid username or password" };
            }
        } catch (error) {
            console.error("Signin error:", error);
            return { success: false, error: "Authentication system error" };
        }
    };

    const handleLogout = () => {
        setCurrentUser(null);
        localStorage.removeItem('active_user');
    };

    return (
        <AuthContext.Provider value={{ currentUser, loading, handleSignIn, handleSignUp, handleLogout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);