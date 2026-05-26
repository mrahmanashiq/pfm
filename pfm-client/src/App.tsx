import React, { useState } from 'react';
import { MainLayout } from './components/Layout/MainLayout';
import { AuthScreen } from './components/Auth/AuthScreen';

function App() {
  const [authToken, setAuthToken] = useState<string | null>(() => localStorage.getItem('authToken'));

  const handleAuthSuccess = (token: string) => {
    localStorage.setItem('authToken', token);
    setAuthToken(token);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setAuthToken(null);
  };

  if (!authToken) {
    return <AuthScreen onSuccess={handleAuthSuccess} />;
  }

  return <MainLayout onLogout={handleLogout} />;
}

export default App;
