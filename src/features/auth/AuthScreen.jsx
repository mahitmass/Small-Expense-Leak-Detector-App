/* src/features/auth/AuthScreen.jsx */
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Lock, User, ShieldAlert, CheckCircle } from 'lucide-react';

export default function AuthScreen() {
    const { handleSignIn, handleSignUp } = useAuth();
    const [isSignUp, setIsSignUp] = useState(false);
    
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    
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
        <div className="min-h-screen bg-[#0a0a0a] flex flex-col justify-center items-center p-4">
            <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-sm p-8 shadow-[0_0_20px_rgba(79,70,229,0.05)]">
                
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-black text-white tracking-tight">
                        {isSignUp ? "Create Local Profile" : "Access Financial Vault"}
                    </h2>
                    <p className="text-xs text-zinc-400 mt-2 uppercase tracking-widest font-semibold">
                        {isSignUp ? "Securely save tracking data on device" : "Sign in to view your leak scores"}
                    </p>
                </div>

                {error && (
                    <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-sm flex items-center gap-2 text-red-400 text-xs font-semibold">
                        <ShieldAlert className="w-4 h-4 shrink-0" />
                        <span>{error}</span>
                    </div>
                )}
                {successMsg && (
                    <div className="mb-6 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-sm flex items-center gap-2 text-emerald-400 text-xs font-semibold">
                        <CheckCircle className="w-4 h-4 shrink-0" />
                        <span>{successMsg}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    {isSignUp && (
                        <div>
                            <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                                <input 
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g. John Doe"
                                    className="w-full pl-10 pr-4 py-3 bg-[#0a0a0a] border border-zinc-800 rounded-sm text-white text-sm focus:outline-none focus:border-indigo-500/50 transition-all"
                                />
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">Username / ID</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                            <input 
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Enter safe username"
                                className="w-full pl-10 pr-4 py-3 bg-[#0a0a0a] border border-zinc-800 rounded-sm text-white text-sm focus:outline-none focus:border-indigo-500/50 transition-all"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">Vault Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                            <input 
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full pl-10 pr-4 py-3 bg-[#0a0a0a] border border-zinc-800 rounded-sm text-white text-sm focus:outline-none focus:border-indigo-500/50 transition-all"
                            />
                        </div>
                    </div>

                    <button 
                        type="submit"
                        className="w-full mt-2 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-sm text-sm transition-all shadow-lg shadow-indigo-600/10 active:scale-[0.98] uppercase tracking-wider"
                    >
                        {isSignUp ? "Sign Up & Unlock" : "Sign In & Unlock"}
                    </button>
                </form>

                <div className="text-center mt-8 pt-6 border-t border-zinc-800">
                    <button 
                        type="button"
                        onClick={() => {
                            setIsSignUp(!isSignUp);
                            setError('');
                            setSuccessMsg('');
                        }}
                        className="text-xs font-bold text-zinc-400 hover:text-white transition-colors"
                    >
                        {isSignUp ? "Already have a vault profile? Sign In" : "Need a profile entry? Sign Up"}
                    </button>
                </div>
            </div>
        </div>
    );
}