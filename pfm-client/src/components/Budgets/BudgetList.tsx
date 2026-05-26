import React, { useCallback, useEffect, useState } from 'react';
import { BudgetCard } from './BudgetCard';
import { BudgetForm } from './BudgetForm';
import { Budget, BudgetInput } from './types';
import { budgetAPI } from '../../services/api';

export const BudgetList: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Budget | null>(null);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const normalize = (raw: any): Budget => ({
    id: String(raw.id),
    name: raw.name,
    amount: Number(raw.amount ?? 0),
    spent: Number(raw.spent ?? 0),
    budgetPeriod: raw.budgetPeriod,
    startDate: raw.startDate,
    endDate: raw.endDate,
    color: raw.color,
    alertPercentage: raw.alertPercentage,
    description: raw.description,
    categoryName: raw.category?.name,
  });

  const loadBudgets = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await budgetAPI.getAll();
      setBudgets(Array.isArray(data) ? data.map(normalize) : []);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load budgets');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBudgets();
  }, [loadBudgets]);

  const handleAdd = () => {
    setEditing(null);
    setShowForm(true);
  };

  const handleEdit = (budget: Budget) => {
    setEditing(budget);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this budget?')) return;
    try {
      await budgetAPI.delete(id);
      setBudgets(prev => prev.filter(b => b.id !== id));
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to delete budget');
    }
  };

  const handleSubmit = async (data: BudgetInput) => {
    try {
      if (editing) {
        const updated = await budgetAPI.update(editing.id, { ...data, spent: editing.spent });
        const normalized = normalize(updated);
        setBudgets(prev => prev.map(b => b.id === editing.id ? normalized : b));
      } else {
        const created = await budgetAPI.create(data);
        setBudgets(prev => [...prev, normalize(created)]);
      }
      setShowForm(false);
      setEditing(null);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to save budget');
    }
  };

  const totalBudget = budgets.reduce((s, b) => s + b.amount, 0);
  const totalSpent = budgets.reduce((s, b) => s + b.spent, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Budgets</h2>
          <p className="text-muted-foreground mt-1">
            ${totalSpent.toFixed(2)} of ${totalBudget.toFixed(2)} spent
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          + Add Budget
        </button>
      </div>

      {error && (
        <div className="p-3 bg-destructive/10 border border-destructive text-destructive rounded-md text-sm">
          {error}
        </div>
      )}

      {showForm && (
        <BudgetForm
          budget={editing}
          onSubmit={handleSubmit}
          onCancel={() => { setShowForm(false); setEditing(null); }}
        />
      )}

      {loading ? (
        <p className="text-muted-foreground">Loading budgets...</p>
      ) : budgets.length === 0 ? (
        <p className="text-muted-foreground">No budgets yet. Click "Add Budget" to create one.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {budgets.map(b => (
            <BudgetCard key={b.id} budget={b} onEdit={handleEdit} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
};
