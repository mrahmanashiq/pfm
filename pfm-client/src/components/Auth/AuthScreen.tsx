import React, { useState } from 'react';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import { authAPI } from '../../services/api';

interface AuthScreenProps {
  onSuccess: (token: string) => void;
}

type Mode = 'login' | 'register';

export const AuthScreen: React.FC<AuthScreenProps> = ({ onSuccess }) => {
  const [mode, setMode] = useState<Mode>('login');
  const [error, setError] = useState<string | null>(null);

  const extractToken = (data: any): string | null => {
    return data?.accessToken || data?.token || null;
  };

  const errorMessage = (err: any): string => {
    return err?.response?.data?.message
      || err?.response?.data?.error
      || err?.message
      || 'Authentication failed';
  };

  const handleLogin = async (data: { email: string; password: string }) => {
    setError(null);
    try {
      const response = await authAPI.login(data.email, data.password);
      const token = extractToken(response);
      if (!token) {
        throw new Error('No token returned from server');
      }
      onSuccess(token);
    } catch (err) {
      setError(errorMessage(err));
    }
  };

  const handleRegister = async (data: { firstName: string; lastName: string; email: string; password: string }) => {
    setError(null);
    try {
      const response = await authAPI.register(data);
      const token = extractToken(response);
      if (!token) {
        throw new Error('No token returned from server');
      }
      onSuccess(token);
    } catch (err) {
      setError(errorMessage(err));
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {error && (
        <div className="max-w-md mx-auto mt-6 p-3 bg-destructive/10 border border-destructive text-destructive rounded-md text-sm text-center">
          {error}
        </div>
      )}
      {mode === 'login' ? (
        <LoginForm onSubmit={handleLogin} onSwitchToRegister={() => { setError(null); setMode('register'); }} />
      ) : (
        <RegisterForm onSubmit={handleRegister} onSwitchToLogin={() => { setError(null); setMode('login'); }} />
      )}
    </div>
  );
};
