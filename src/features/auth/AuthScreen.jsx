/* src/features/auth/AuthScreen.jsx */
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Lock, User, ShieldAlert, CheckCircle, Zap, Fingerprint, Scan } from 'lucide-react';

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
        <div className="min-h-screen bg-[#0a0a0a] flex justify-center items-center p-4 md:p-8">
            <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
                
                {/* LEFT COLUMN: BRAND STORY (Hidden on mobile) */}
                <div className="hidden md:flex flex-col justify-center">
                    <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(99,102,241,0.3)]">
                        <Zap className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-5xl font-black text-white tracking-tight mb-4">Leak Detector</h1>
                    <p className="text-zinc-400 text-lg mb-10 leading-relaxed max-w-md">
                        Stop invisible spending. Track, detect, and eliminate financial leaks before they drain your savings.
                    </p>
                    
                    <div className="space-y-4">
                        {[
                            "Real-time leak scoring",
                            "Subscription auto-detection",
                            "Night vs day spending patterns",
                            "100% local — no cloud storage"
                        ].map((feature, idx) => (
                            <div key={idx} className="flex items-center gap-3 text-sm font-semibold text-zinc-300">
                                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                {feature}
                            </div>
                        ))}
                    </div>
                </div>

                {/* RIGHT COLUMN: AUTH CARD */}
                <div className="w-full max-w-md mx-auto bg-zinc-900 border border-zinc-800 rounded-sm p-8 shadow-[0_0_20px_rgba(79,70,229,0.05)] relative z-10">
                    
                    {/* MOBILE LOGO (Visible only on mobile) */}
                    <div className="md:hidden flex flex-col items-center mb-8">
                        <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(99,102,241,0.3)]">
                            <Zap className="w-6 h-6 text-white" />
                        </div>
                        <h2 className="text-2xl font-black text-white tracking-tight">Leak Detector</h2>
                        <p className="text-[10px] text-zinc-500 font-bold tracking-widest uppercase mt-1">Smart Financial Management</p>
                    </div>

                    {/* INLINE TABS */}
                    <div className="flex bg-[#0a0a0a] p-1 rounded-sm border border-zinc-800 mb-8">
                        <button 
                            type="button"
                            onClick={() => { setIsSignUp(false); setError(''); setSuccessMsg(''); }}
                            className={`flex-1 py-2.5 text-[10px] font-bold uppercase tracking-widest rounded-sm transition-all ${!isSignUp ? 'bg-indigo-600 text-white shadow-md' : 'text-zinc-500 hover:text-white'}`}
                        >
                            Sign In
                        </button>
                        <button 
                            type="button"
                            onClick={() => { setIsSignUp(true); setError(''); setSuccessMsg(''); }}
                            className={`flex-1 py-2.5 text-[10px] font-bold uppercase tracking-widest rounded-sm transition-all ${isSignUp ? 'bg-indigo-600 text-white shadow-md' : 'text-zinc-500 hover:text-white'}`}
                        >
                            Sign Up
                        </button>
                    </div>

                    <div className="text-center mb-6">
                        <h2 className="text-xl font-bold text-white tracking-tight">
                            {isSignUp ? "Create Local Profile" : "Access Financial Vault"}
                        </h2>
                        <p className="text-[10px] text-zinc-500 mt-1 uppercase tracking-widest font-semibold">
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

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {isSignUp && (
                            <div>
                                <label className="block text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                                    <input 
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="e.g. John Doe"
                                        className="w-full pl-10 pr-4 py-3 bg-[#0a0a0a] border border-zinc-800 rounded-sm text-white text-xs font-semibold focus:outline-none focus:border-indigo-500/50 transition-all"
                                    />
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="block text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">Username / ID</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                                <input 
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Enter safe username"
                                    className="w-full pl-10 pr-4 py-3 bg-[#0a0a0a] border border-zinc-800 rounded-sm text-white text-xs font-semibold focus:outline-none focus:border-indigo-500/50 transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">Vault Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                                <input 
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full pl-10 pr-4 py-3 bg-[#0a0a0a] border border-zinc-800 rounded-sm text-white text-xs font-semibold focus:outline-none focus:border-indigo-500/50 transition-all"
                                />
                            </div>
                        </div>

                        <button 
                            type="submit"
                            className="w-full mt-2 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-sm text-[11px] transition-all shadow-lg shadow-indigo-600/10 active:scale-[0.98] uppercase tracking-wider"
                        >
                            {isSignUp ? "Sign Up & Unlock" : "Sign In & Unlock"}
                        </button>
                    </form>

                    {/* BIOMETRIC ROW */}
                    {!isSignUp && (
                        <div className="mt-6 pt-6 border-t border-zinc-800 flex justify-center gap-4">
                            <button type="button" className="w-12 h-12 bg-[#0a0a0a] border border-zinc-800 rounded-lg flex items-center justify-center text-zinc-500 hover:text-indigo-400 hover:border-indigo-500/30 transition-colors">
                                <Fingerprint className="w-6 h-6" />
                            </button>
                            <button type="button" className="w-12 h-12 bg-[#0a0a0a] border border-zinc-800 rounded-lg flex items-center justify-center text-zinc-500 hover:text-indigo-400 hover:border-indigo-500/30 transition-colors">
                                <Scan className="w-6 h-6" />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}