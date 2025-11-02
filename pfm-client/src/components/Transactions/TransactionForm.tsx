import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

interface TransactionFormData {
  description: string;
  amount: number;
  date: string;
  category: string;
  type: 'income' | 'expense';
  accountId?: string;
}

interface TransactionFormProps {
  onSubmit?: (data: TransactionFormData) => void;
  onCancel?: () => void;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({ onSubmit, onCancel }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<TransactionFormData>();
  const [isLoading, setIsLoading] = useState(false);

  const onFormSubmit = async (data: TransactionFormData) => {
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
            <label htmlFor="type" className="block text-sm font-medium mb-2">
              Type
            </label>
            <select
              {...register('type', { required: 'Type is required' })}
              id="type"
              className="w-full px-4 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
            {errors.type && (
              <p className="text-destructive text-sm mt-1">{errors.type.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="date" className="block text-sm font-medium mb-2">
              Date
            </label>
            <input
              {...register('date', { required: 'Date is required' })}
              type="date"
              id="date"
              className="w-full px-4 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              defaultValue={new Date().toISOString().split('T')[0]}
            />
            {errors.date && (
              <p className="text-destructive text-sm mt-1">{errors.date.message}</p>
            )}
          </div>
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-2">
            Description
          </label>
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
            <label htmlFor="amount" className="block text-sm font-medium mb-2">
              Amount
            </label>
            <input
              {...register('amount', {
                required: 'Amount is required',
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
            <label htmlFor="category" className="block text-sm font-medium mb-2">
              Category
            </label>
            <input
              {...register('category', { required: 'Category is required' })}
              type="text"
              id="category"
              className="w-full px-4 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="e.g. Food, Transport"
            />
            {errors.category && (
              <p className="text-destructive text-sm mt-1">{errors.category.message}</p>
            )}
          </div>
        </div>
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={isLoading}
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

