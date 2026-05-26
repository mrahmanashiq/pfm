import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Goal, GoalInput } from './types';

interface GoalFormProps {
  goal?: Goal | null;
  onSubmit?: (data: GoalInput) => void;
  onCancel?: () => void;
}

export const GoalForm: React.FC<GoalFormProps> = ({ goal, onSubmit, onCancel }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<GoalInput>({
    defaultValues: goal || {
      name: '',
      targetAmount: 0,
      currentAmount: 0,
      goalType: 'SAVINGS',
      status: 'ACTIVE',
      targetDate: '',
      color: '#6366f1',
      icon: '',
      description: '',
    },
  });
  const [isLoading, setIsLoading] = useState(false);

  const onFormSubmit = async (data: GoalInput) => {
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
        {goal ? 'Edit Goal' : 'Add New Goal'}
      </h3>
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-2">Name</label>
          <input
            {...register('name', { required: 'Goal name is required' })}
            type="text"
            id="name"
            className="w-full px-4 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="e.g. Emergency Fund"
          />
          {errors.name && <p className="text-destructive text-sm mt-1">{errors.name.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="targetAmount" className="block text-sm font-medium mb-2">Target Amount</label>
            <input
              {...register('targetAmount', { required: 'Target is required', valueAsNumber: true, min: 0 })}
              type="number"
              step="0.01"
              id="targetAmount"
              className="w-full px-4 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="0.00"
            />
            {errors.targetAmount && <p className="text-destructive text-sm mt-1">{errors.targetAmount.message}</p>}
          </div>
          <div>
            <label htmlFor="currentAmount" className="block text-sm font-medium mb-2">Current Amount</label>
            <input
              {...register('currentAmount', { valueAsNumber: true, min: 0 })}
              type="number"
              step="0.01"
              id="currentAmount"
              className="w-full px-4 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="0.00"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="goalType" className="block text-sm font-medium mb-2">Type</label>
            <select
              {...register('goalType', { required: true })}
              id="goalType"
              className="w-full px-4 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="SAVINGS">Savings</option>
              <option value="INVESTMENT">Investment</option>
              <option value="DEBT_PAYOFF">Debt Payoff</option>
              <option value="EMERGENCY_FUND">Emergency Fund</option>
              <option value="VACATION">Vacation</option>
              <option value="HOME">Home</option>
              <option value="CAR">Car</option>
              <option value="EDUCATION">Education</option>
              <option value="RETIREMENT">Retirement</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
          <div>
            <label htmlFor="status" className="block text-sm font-medium mb-2">Status</label>
            <select
              {...register('status', { required: true })}
              id="status"
              className="w-full px-4 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="ACTIVE">Active</option>
              <option value="PAUSED">Paused</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="targetDate" className="block text-sm font-medium mb-2">Target Date</label>
            <input
              {...register('targetDate')}
              type="date"
              id="targetDate"
              className="w-full px-4 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label htmlFor="color" className="block text-sm font-medium mb-2">Color</label>
            <input
              {...register('color')}
              type="color"
              id="color"
              className="w-full h-10 px-1 py-1 border border-input rounded-md bg-background"
            />
          </div>
        </div>

        <div>
          <label htmlFor="icon" className="block text-sm font-medium mb-2">Icon (emoji)</label>
          <input
            {...register('icon')}
            type="text"
            id="icon"
            maxLength={4}
            className="w-full px-4 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="🎯"
          />
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
            {isLoading ? 'Saving...' : goal ? 'Update Goal' : 'Create Goal'}
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
