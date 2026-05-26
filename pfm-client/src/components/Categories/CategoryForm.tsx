import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

interface Category {
  id?: string;
  name: string;
  type: string;
  description?: string;
  color?: string;
  icon?: string;
}

interface CategoryFormProps {
  category?: Category | null;
  onSubmit?: (data: Omit<Category, 'id'>) => void;
  onCancel?: () => void;
}

export const CategoryForm: React.FC<CategoryFormProps> = ({ category, onSubmit, onCancel }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<Category>({
    defaultValues: category || {
      name: '',
      type: 'EXPENSE',
      description: '',
      color: '#6366f1',
      icon: '',
    },
  });
  const [isLoading, setIsLoading] = useState(false);

  const onFormSubmit = async (data: Category) => {
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
        {category ? 'Edit Category' : 'Add New Category'}
      </h3>
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-2">
            Category Name
          </label>
          <input
            {...register('name', { required: 'Category name is required' })}
            type="text"
            id="name"
            className="w-full px-4 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="e.g. Groceries"
          />
          {errors.name && (
            <p className="text-destructive text-sm mt-1">{errors.name.message}</p>
          )}
        </div>
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
              <option value="INCOME">Income</option>
              <option value="EXPENSE">Expense</option>
              <option value="TRANSFER">Transfer</option>
            </select>
            {errors.type && (
              <p className="text-destructive text-sm mt-1">{errors.type.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="color" className="block text-sm font-medium mb-2">
              Color
            </label>
            <input
              {...register('color')}
              type="color"
              id="color"
              className="w-full h-10 px-1 py-1 border border-input rounded-md bg-background"
            />
          </div>
        </div>
        <div>
          <label htmlFor="icon" className="block text-sm font-medium mb-2">
            Icon (emoji)
          </label>
          <input
            {...register('icon')}
            type="text"
            id="icon"
            maxLength={4}
            className="w-full px-4 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="🛒"
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-2">
            Description
          </label>
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
            {isLoading ? 'Saving...' : category ? 'Update Category' : 'Create Category'}
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
