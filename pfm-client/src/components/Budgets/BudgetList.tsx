import React, { useState } from 'react';
import { BudgetCard } from './BudgetCard';
import { BudgetForm } from './BudgetForm';
import { Budget, BudgetInput } from './types';

export const BudgetList: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Budget | null>(null);

  const [budgets, setBudgets] = useState<Budget[]>([
    { id: '1', name: 'Monthly Groceries', amount: 600, spent: 420.5, period: 'MONTHLY', startDate: '2026-05-01', endDate: '2026-05-31', color: '#10b981', categoryName: 'Groceries' },
    { id: '2', name: 'Dining Out', amount: 200, spent: 215.0, period: 'MONTHLY', startDate: '2026-05-01', endDate: '2026-05-31', color: '#f59e0b', categoryName: 'Restaurants' },
    { id: '3', name: 'Annual Travel', amount: 3000, spent: 800, period: 'YEARLY', startDate: '2026-01-01', endDate: '2026-12-31', color: '#3b82f6', categoryName: 'Travel' },
  ]);

  const handleAdd = () => {
    setEditing(null);
    setShowForm(true);
  };

  const handleEdit = (budget: Budget) => {
    setEditing(budget);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this budget?')) {
      setBudgets(budgets.filter(b => b.id !== id));
    }
  };

  const handleSubmit = (data: BudgetInput) => {
    if (editing) {
      setBudgets(budgets.map(b => b.id === editing.id ? { ...data, id: editing.id, spent: editing.spent } : b));
    } else {
      setBudgets([...budgets, { ...data, id: Date.now().toString(), spent: 0 }]);
    }
    setShowForm(false);
    setEditing(null);
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

      {showForm && (
        <BudgetForm
          budget={editing}
          onSubmit={handleSubmit}
          onCancel={() => { setShowForm(false); setEditing(null); }}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {budgets.map(b => (
          <BudgetCard key={b.id} budget={b} onEdit={handleEdit} onDelete={handleDelete} />
        ))}
      </div>
    </div>
  );
};
