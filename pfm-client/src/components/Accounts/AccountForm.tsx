import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Account, AccountInput } from './AccountList';

interface AccountFormProps {
  account?: Account | null;
  onSubmit?: (data: AccountInput) => void;
  onCancel?: () => void;
}

export const AccountForm: React.FC<AccountFormProps> = ({ account, onSubmit, onCancel }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<AccountInput>({
    defaultValues: account || {
      name: '',
      accountType: 'CHECKING',
      balance: 0,
      currency: 'USD',
    },
  });
  const [isLoading, setIsLoading] = useState(false);

  const onFormSubmit = async (data: AccountInput) => {
    setIsLoading(true);
    try {
      await onSubmit?.(data);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="text-xl font-semibold mb-4">
        {account ? 'Edit Account' : 'Add New Account'}
      </h3>
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-2">
            Account Name
          </label>
          <input
            {...register('name', { required: 'Account name is required' })}
            type="text"
            id="name"
            className="w-full px-4 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="e.g. My Checking Account"
          />
          {errors.name && (
            <p className="text-destructive text-sm mt-1">{errors.name.message}</p>
          )}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="accountType" className="block text-sm font-medium mb-2">
              Account Type
            </label>
            <select
              {...register('accountType', { required: 'Account type is required' })}
              id="accountType"
              className="w-full px-4 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="CHECKING">Checking</option>
              <option value="SAVINGS">Savings</option>
              <option value="CREDIT_CARD">Credit Card</option>
              <option value="CASH">Cash</option>
              <option value="INVESTMENT">Investment</option>
              <option value="LOAN">Loan</option>
              <option value="MORTGAGE">Mortgage</option>
              <option value="CRYPTO">Crypto</option>
            </select>
            {errors.accountType && (
              <p className="text-destructive text-sm mt-1">{errors.accountType.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="currency" className="block text-sm font-medium mb-2">
              Currency
            </label>
            <select
              {...register('currency', { required: 'Currency is required' })}
              id="currency"
              className="w-full px-4 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
              <option value="JPY">JPY</option>
              <option value="AUD">AUD</option>
            </select>
            {errors.currency && (
              <p className="text-destructive text-sm mt-1">{errors.currency.message}</p>
            )}
          </div>
        </div>
        <div>
          <label htmlFor="balance" className="block text-sm font-medium mb-2">
            {account ? 'Balance' : 'Initial Balance'}
          </label>
          <input
            {...register('balance', {
              required: 'Balance is required',
              valueAsNumber: true,
            })}
            type="number"
            step="0.01"
            id="balance"
            className="w-full px-4 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="0.00"
          />
          {errors.balance && (
            <p className="text-destructive text-sm mt-1">{errors.balance.message}</p>
          )}
        </div>
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
          >
            {isLoading ? 'Saving...' : account ? 'Update Account' : 'Create Account'}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
