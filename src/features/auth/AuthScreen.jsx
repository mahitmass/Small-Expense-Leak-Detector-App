/* src/features/auth/AuthScreen.jsx */
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Lock, User, ShieldAlert, CheckCircle } from 'lucide-react';

export default function AuthScreen() {
    const { handleSignIn, handleSignUp } = useAuth();
    const [isSignUp, setIsSignUp] = useState(false);
    
    // Form fields
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    
    // Feedback states
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMsg('');

        if (!username || !password || (isSignUp && !name)) {
            setError("Please fill in all active fields.");
            return;
        }

        if (isSignUp) {
            const res = await handleSignUp(name, username, password);
            if (res.success) {
                setSuccessMsg("Account created successfully!");
            } else {
                setError(res.error);
            }
        } else {
            const res = await handleSignIn(username, password);
            if (!res.success) {
                setError(res.error);
            }
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center p-4">
            <div className="w-full max-w-md bg-slate-800 border border-slate-700 rounded-3xl p-6 shadow-2xl">
                
                {/* Header Section */}
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-black text-white tracking-tight">
                        {isSignUp ? "Create Local Profile" : "Access Financial Vault"}
                    </h2>
                    <p className="text-sm text-slate-400 mt-1">
                        {isSignUp ? "Securely save tracking data on device" : "Sign in to view your leak scores"}
                    </p>
                </div>

                {/* Error/Success Alerts */}
                {error && (
                    <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-2 text-red-400 text-xs font-semibold">
                        <ShieldAlert className="w-4 h-4 shrink-0" />
                        <span>{error}</span>
                    </div>
                )}
                {successMsg && (
                    <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center gap-2 text-emerald-400 text-xs font-semibold">
                        <CheckCircle className="w-4 h-4 shrink-0" />
                        <span>{successMsg}</span>
                    </div>
                )}

                {/* Main Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {isSignUp && (
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <input 
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g. John Doe"
                                    className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500 transition-all"
                                />
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Username / ID</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                            <input 
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Enter safe username"
                                className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500 transition-all"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Vault Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                            <input 
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500 transition-all"
                            />
                        </div>
                    </div>

                    <button 
                        type="submit"
                        className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-indigo-600/20 active:scale-[0.98]"
                    >
                        {isSignUp ? "Sign Up & Unlock" : "Sign In & Unlock"}
                    </button>
                </form>

                {/* Auth Mode Toggle Link */}
                <div className="text-center mt-6 pt-4 border-t border-slate-700/50">
                    <button 
                        type="button"
                        onClick={() => {
                            setIsSignUp(!isSignUp);
                            setError('');
                            setSuccessMsg('');
                        }}
                        className="text-xs font-bold text-indigo-400 hover:text-indigo-300"
                    >
                        {isSignUp ? "Already have a vault profile? Sign In" : "Need a profile entry? Sign Up"}
                    </button>
                </div>

            </div>
        </div>
    );
}