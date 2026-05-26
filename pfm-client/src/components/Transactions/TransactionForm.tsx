import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

export interface TransactionInput {
  description: string;
  amount: number;
  transactionDate: string;
  transactionType: 'INCOME' | 'EXPENSE' | 'TRANSFER';
  accountId: string;
}

interface AccountOption {
  id: string;
  name: string;
}

interface TransactionFormProps {
  accounts: AccountOption[];
  onSubmit?: (data: TransactionInput) => void;
  onCancel?: () => void;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({ accounts, onSubmit, onCancel }) => {
  const today = new Date().toISOString().split('T')[0];
  const { register, handleSubmit, formState: { errors } } = useForm<TransactionInput>({
    defaultValues: {
      description: '',
      amount: 0,
      transactionDate: today,
      transactionType: 'EXPENSE',
      accountId: accounts[0]?.id ?? '',
    },
  });
  const [isLoading, setIsLoading] = useState(false);

  const onFormSubmit = async (data: TransactionInput) => {
    setIsLoading(true);
    try {
      await onSubmit?.(data);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="text-xl font-semibold mb-4">Add New Transaction</h3>
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="transactionType" className="block text-sm font-medium mb-2">Type</label>
            <select
              {...register('transactionType', { required: 'Type is required' })}
              id="transactionType"
              className="w-full px-4 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="EXPENSE">Expense</option>
              <option value="INCOME">Income</option>
              <option value="TRANSFER">Transfer</option>
            </select>
            {errors.transactionType && (
              <p className="text-destructive text-sm mt-1">{errors.transactionType.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="transactionDate" className="block text-sm font-medium mb-2">Date</label>
            <input
              {...register('transactionDate', { required: 'Date is required' })}
              type="date"
              id="transactionDate"
              className="w-full px-4 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
            {errors.transactionDate && (
              <p className="text-destructive text-sm mt-1">{errors.transactionDate.message}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-2">Description</label>
          <input
            {...register('description', { required: 'Description is required' })}
            type="text"
            id="description"
            className="w-full px-4 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="Enter transaction description"
          />
          {errors.description && (
            <p className="text-destructive text-sm mt-1">{errors.description.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium mb-2">Amount</label>
            <input
              {...register('amount', {
                required: 'Amount is required',
                valueAsNumber: true,
                min: { value: 0.01, message: 'Amount must be greater than 0' }
              })}
              type="number"
              step="0.01"
              id="amount"
              className="w-full px-4 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="0.00"
            />
            {errors.amount && (
              <p className="text-destructive text-sm mt-1">{errors.amount.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="accountId" className="block text-sm font-medium mb-2">Account</label>
            <select
              {...register('accountId', { required: 'Account is required' })}
              id="accountId"
              className="w-full px-4 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              disabled={accounts.length === 0}
            >
              {accounts.length === 0 ? (
                <option value="">No accounts available</option>
              ) : (
                accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)
              )}
            </select>
            {errors.accountId && (
              <p className="text-destructive text-sm mt-1">{errors.accountId.message}</p>
            )}
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={isLoading || accounts.length === 0}
            className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
          >
            {isLoading ? 'Saving...' : 'Save Transaction'}
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
