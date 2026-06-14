/* src/features/auth/AuthScreen.jsx */
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Lock, Zap, ShieldCheck, Activity, CreditCard, User, Fingerprint } from 'lucide-react';
import { NativeBiometric } from '@capgo/capacitor-native-biometric';
import IntroScreen from './IntroScreen';

export default function AuthScreen() {
    const { hasPin, createPin, unlockWithPin } = useAuth();
    const [showIntro, setShowIntro] = useState(false);
    
    useEffect(() => {
        const seen = localStorage.getItem('has_seen_intro');
        if (!seen) setShowIntro(true);
    }, []);

    const [name, setName] = useState('');
    const [pin, setPin] = useState('');
    const [confirmPin, setConfirmPin] = useState('');
    const [step, setStep] = useState(hasPin ? 'login' : 'create'); 
    const [error, setError] = useState('');

    const finishIntro = () => {
        localStorage.setItem('has_seen_intro', 'true');
        setShowIntro(false);
    };

    // 🔥 UPDATED BIOMETRIC HARDWARE ENGINE
    const handleBiometricUnlock = async () => {
        try {
            const available = await NativeBiometric.isAvailable();
            if (!available.isAvailable) {
                setError('Biometrics not set up on this device.');
                return;
            }
            
            // The Capgo plugin throws an error if the fingerprint is wrong/canceled.
            // If this line finishes successfully, the fingerprint was a match!
            await NativeBiometric.verifyIdentity({
                reason: "Scan fingerprint to access your Vault",
                title: "Vault VPIN Bypass"
            });

            // If we reach this line, the fingerprint matched! Unlock instantly.
            const savedPin = localStorage.getItem('device_mpin');
            if (savedPin) {
                unlockWithPin(savedPin);
            }
        } catch (err) {
            console.error(err);
            setError('Biometric scan failed or canceled.');
        }
    };

    if (showIntro) return <IntroScreen onComplete={finishIntro} />;

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (step === 'create') {
            if (pin.length < 4) return setError('VPIN must be at least 4 digits.');
            if (!name.trim()) return setError('Please enter your name.');
            setStep('confirm');
        } else if (step === 'confirm') {
            if (pin === confirmPin) {
                createPin(pin, name); 
            } else {
                setError('VPINs do not match. Try again.');
                setPin(''); setConfirmPin(''); setStep('create');
            }
        } else if (step === 'login') {
            if (!unlockWithPin(pin)) {
                setError('Incorrect VPIN.');
                setPin('');
            }
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background elements omitted for brevity, keep your floating UI code here! */}
            <ShieldCheck className="absolute -right-20 -top-20 w-96 h-96 text-indigo-500/5 pointer-events-none" />

            <div className="w-full max-w-md flex flex-col items-center relative z-10">
                
                <div className="mb-10 text-center">
                    <div className="w-12 h-12 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                        {step === 'login' ? <Lock className="w-6 h-6 text-indigo-400" /> : <Zap className="w-6 h-6 text-indigo-400" />}
                    </div>
                    <h2 className="text-2xl font-black text-white tracking-tight mb-2">
                        {step === 'login' ? 'Vault Locked' : step === 'confirm' ? 'Confirm VPIN' : 'Secure Your Vault'}
                    </h2>
                    <p className="text-[10px] text-zinc-500 font-bold tracking-widest uppercase">
                        {step === 'login' ? 'Enter local VPIN to access data' : 'Create a master VPIN for this device'}
                    </p>
                </div>

                <div className="w-full bg-zinc-900/80 backdrop-blur-md border border-zinc-800 rounded-sm p-8 shadow-2xl mb-8">
                    {error && <div className="bg-red-500/10 text-red-400 text-[10px] font-bold uppercase p-3 rounded-sm mb-6 text-center">{error}</div>}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {step === 'create' && (
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-sm py-4 pl-12 pr-4 text-sm font-bold text-white focus:border-indigo-500/50 uppercase tracking-widest" placeholder="Your Name" />
                            </div>
                        )}

                        <div>
                            <input type="password" inputMode="numeric" maxLength={6} value={step === 'confirm' ? confirmPin : pin} onChange={(e) => step === 'confirm' ? setConfirmPin(e.target.value) : setPin(e.target.value)} className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-sm p-4 text-center text-3xl font-black tracking-[1em] text-white" placeholder="••••" autoFocus={step !== 'create'} />
                        </div>

                        <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-sm uppercase tracking-widest text-xs">
                            {step === 'login' ? 'Unlock Vault' : step === 'confirm' ? 'Confirm VPIN' : 'Continue'}
                        </button>
                    </form>

                    {/* 🔥 THE BIOMETRIC TRIGGER */}
                    {step === 'login' && (
                        <div className="mt-6 pt-6 border-t border-zinc-800 flex justify-center">
                            <button onClick={handleBiometricUnlock} type="button" className="flex items-center gap-2 px-6 py-3 bg-[#0a0a0a] border border-zinc-800 rounded-lg text-zinc-400 hover:text-indigo-400 hover:border-indigo-500/30 transition-colors">
                                <Fingerprint className="w-5 h-5" />
                                <span className="text-[10px] font-bold uppercase tracking-widest">Biometric Unlock</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}