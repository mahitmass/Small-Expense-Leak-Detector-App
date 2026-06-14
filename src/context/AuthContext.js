/* src/context/AuthContext.js */
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [hasPin, setHasPin] = useState(false);

  useEffect(() => {
    const savedPin = localStorage.getItem('device_mpin');
    if (savedPin) {
      setHasPin(true);
    }
    setLoading(false);
  }, []);

  // 🔥 UPDATED: Now saves your actual name!
  const createPin = (pin, name) => {
    const finalName = name.trim() || 'Boss'; // Fallback just in case
    localStorage.setItem('device_mpin', pin);
    localStorage.setItem('device_owner_name', finalName);
    setHasPin(true);
    setCurrentUser({ name: finalName }); 
  };

  // 🔥 UPDATED: Retrieves your name instead of hardcoding 'Owner'
  const unlockWithPin = (pin) => {
    const savedPin = localStorage.getItem('device_mpin');
    const savedName = localStorage.getItem('device_owner_name') || 'Boss';
    
    if (savedPin === pin) {
      setCurrentUser({ name: savedName }); 
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setCurrentUser(null); 
  };

  return (
    <AuthContext.Provider value={{ 
      currentUser, 
      loading, 
      hasPin, 
      createPin, 
      unlockWithPin, 
      handleLogout 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
//yo