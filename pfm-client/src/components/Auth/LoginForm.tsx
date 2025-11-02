import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

interface LoginFormData {
  email: string;
  password: string;
}

interface LoginFormProps {
  onSubmit?: (data: LoginFormData) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSubmit }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>();
  const [isLoading, setIsLoading] = useState(false);

  const onFormSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      await onSubmit?.(data);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20">
      <div className="bg-card border border-border rounded-lg p-8 shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email
            </label>
            <input
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
              type="email"
              id="email"
              className="w-full px-4 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="text-destructive text-sm mt-1">{errors.email.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2">
              Password
            </label>
            <input
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters'
                }
              })}
              type="password"
              id="password"
              className="w-full px-4 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Enter your password"
            />
            {errors.password && (
              <p className="text-destructive text-sm mt-1">{errors.password.message}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          Don't have an account?{' '}
          <button className="text-primary hover:underline">Sign up</button>
        </p>
      </div>
    </div>
  );
};

