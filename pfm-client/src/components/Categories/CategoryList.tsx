import React, { useState } from 'react';
import { CategoryCard } from './CategoryCard';
import { CategoryForm } from './CategoryForm';

interface Category {
  id: string;
  name: string;
  type: string;
  description?: string;
  color?: string;
  icon?: string;
}

export const CategoryList: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [categories, setCategories] = useState<Category[]>([
    { id: '1', name: 'Groceries', type: 'EXPENSE', color: '#10b981', icon: '🛒', description: 'Food and household supplies' },
    { id: '2', name: 'Salary', type: 'INCOME', color: '#3b82f6', icon: '💼', description: 'Monthly paycheck' },
    { id: '3', name: 'Utilities', type: 'EXPENSE', color: '#f59e0b', icon: '💡', description: 'Electricity, water, internet' },
  ]);

  const handleAdd = () => {
    setEditingCategory(null);
    setShowForm(true);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setShowForm(true);
  };

  const handleDelete = (categoryId: string) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      setCategories(categories.filter(c => c.id !== categoryId));
    }
  };

  const handleSubmit = (data: Omit<Category, 'id'>) => {
    if (editingCategory) {
      setCategories(categories.map(c =>
        c.id === editingCategory.id ? { ...data, id: editingCategory.id } : c
      ));
    } else {
      setCategories([...categories, { ...data, id: Date.now().toString() }]);
    }
    setShowForm(false);
    setEditingCategory(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Categories</h2>
          <p className="text-muted-foreground mt-1">
            {categories.length} {categories.length === 1 ? 'category' : 'categories'}
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          + Add Category
        </button>
      </div>

      {showForm && (
        <CategoryForm
          category={editingCategory}
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingCategory(null);
          }}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => (
          <CategoryCard
            key={category.id}
            category={category}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
};
