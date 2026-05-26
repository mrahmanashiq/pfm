import React, { useCallback, useEffect, useState } from 'react';
import { CategoryCard } from './CategoryCard';
import { CategoryForm } from './CategoryForm';
import { categoryAPI } from '../../services/api';

export interface Category {
  id: string;
  name: string;
  categoryType: string;
  description?: string;
  color?: string;
  icon?: string;
}

export type CategoryInput = Omit<Category, 'id'>;

export const CategoryList: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const normalize = (raw: any): Category => ({
    id: String(raw.id),
    name: raw.name,
    categoryType: raw.categoryType,
    description: raw.description,
    color: raw.color,
    icon: raw.icon,
  });

  const loadCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await categoryAPI.getAll();
      setCategories(Array.isArray(data) ? data.map(normalize) : []);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const handleAdd = () => {
    setEditingCategory(null);
    setShowForm(true);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setShowForm(true);
  };

  const handleDelete = async (categoryId: string) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    try {
      await categoryAPI.delete(categoryId);
      setCategories(prev => prev.filter(c => c.id !== categoryId));
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to delete category');
    }
  };

  const handleSubmit = async (data: CategoryInput) => {
    try {
      if (editingCategory) {
        const updated = await categoryAPI.update(editingCategory.id, data);
        const normalized = normalize(updated);
        setCategories(prev => prev.map(c => c.id === editingCategory.id ? normalized : c));
      } else {
        const created = await categoryAPI.create(data);
        setCategories(prev => [...prev, normalize(created)]);
      }
      setShowForm(false);
      setEditingCategory(null);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to save category');
    }
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

      {error && (
        <div className="p-3 bg-destructive/10 border border-destructive text-destructive rounded-md text-sm">
          {error}
        </div>
      )}

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

      {loading ? (
        <p className="text-muted-foreground">Loading categories...</p>
      ) : categories.length === 0 ? (
        <p className="text-muted-foreground">No categories yet. Click "Add Category" to create one.</p>
      ) : (
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
      )}
    </div>
  );
};
