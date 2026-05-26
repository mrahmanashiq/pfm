import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Budget, BudgetInput } from './types';

interface BudgetFormProps {
  budget?: Budget | null;
  onSubmit?: (data: BudgetInput) => void;
  onCancel?: () => void;
}

export const BudgetForm: React.FC<BudgetFormProps> = ({ budget, onSubmit, onCancel }) => {
  const today = new Date().toISOString().split('T')[0];
  const { register, handleSubmit, formState: { errors } } = useForm<BudgetInput>({
    defaultValues: budget || {
      name: '',
      amount: 0,
      period: 'MONTHLY',
      startDate: today,
      endDate: today,
      color: '#6366f1',
      alertPercentage: 80,
      description: '',
    },
  });
  const [isLoading, setIsLoading] = useState(false);

  const onFormSubmit = async (data: BudgetInput) => {
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
        {budget ? 'Edit Budget' : 'Add New Budget'}
      </h3>
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-2">Name</label>
          <input
            {...register('name', { required: 'Budget name is required' })}
            type="text"
            id="name"
            className="w-full px-4 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="e.g. Monthly Groceries"
          />
          {errors.name && <p className="text-destructive text-sm mt-1">{errors.name.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium mb-2">Amount</label>
            <input
              {...register('amount', { required: 'Amount is required', valueAsNumber: true, min: 0 })}
              type="number"
              step="0.01"
              id="amount"
              className="w-full px-4 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="0.00"
            />
            {errors.amount && <p className="text-destructive text-sm mt-1">{errors.amount.message}</p>}
          </div>
          <div>
            <label htmlFor="period" className="block text-sm font-medium mb-2">Period</label>
            <select
              {...register('period', { required: true })}
              id="period"
              className="w-full px-4 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="WEEKLY">Weekly</option>
              <option value="MONTHLY">Monthly</option>
              <option value="QUARTERLY">Quarterly</option>
              <option value="YEARLY">Yearly</option>
              <option value="CUSTOM">Custom</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium mb-2">Start Date</label>
            <input
              {...register('startDate', { required: 'Start date is required' })}
              type="date"
              id="startDate"
              className="w-full px-4 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
            {errors.startDate && <p className="text-destructive text-sm mt-1">{errors.startDate.message}</p>}
          </div>
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium mb-2">End Date</label>
            <input
              {...register('endDate', { required: 'End date is required' })}
              type="date"
              id="endDate"
              className="w-full px-4 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
            {errors.endDate && <p className="text-destructive text-sm mt-1">{errors.endDate.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="color" className="block text-sm font-medium mb-2">Color</label>
            <input
              {...register('color')}
              type="color"
              id="color"
              className="w-full h-10 px-1 py-1 border border-input rounded-md bg-background"
            />
          </div>
          <div>
            <label htmlFor="alertPercentage" className="block text-sm font-medium mb-2">Alert at %</label>
            <input
              {...register('alertPercentage', { valueAsNumber: true, min: 1, max: 100 })}
              type="number"
              id="alertPercentage"
              className="w-full px-4 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="80"
            />
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-2">Description</label>
          <textarea
            {...register('description')}
            id="description"
            rows={2}
            className="w-full px-4 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="Optional"
          />
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
          >
            {isLoading ? 'Saving...' : budget ? 'Update Budget' : 'Create Budget'}
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
