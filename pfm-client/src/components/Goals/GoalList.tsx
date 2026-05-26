import React, { useState } from 'react';
import { GoalCard } from './GoalCard';
import { GoalForm } from './GoalForm';
import { Goal, GoalInput } from './types';

export const GoalList: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Goal | null>(null);

  const [goals, setGoals] = useState<Goal[]>([
    { id: '1', name: 'Emergency Fund', targetAmount: 10000, currentAmount: 6500, goalType: 'EMERGENCY_FUND', status: 'ACTIVE', targetDate: '2026-12-31', color: '#10b981', icon: '🛟' },
    { id: '2', name: 'Tokyo Vacation', targetAmount: 4500, currentAmount: 1200, goalType: 'VACATION', status: 'ACTIVE', targetDate: '2027-04-01', color: '#f59e0b', icon: '✈️' },
    { id: '3', name: 'New Laptop', targetAmount: 2200, currentAmount: 2200, goalType: 'OTHER', status: 'COMPLETED', color: '#3b82f6', icon: '💻' },
  ]);

  const handleAdd = () => {
    setEditing(null);
    setShowForm(true);
  };

  const handleEdit = (goal: Goal) => {
    setEditing(goal);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this goal?')) {
      setGoals(goals.filter(g => g.id !== id));
    }
  };

  const handleSubmit = (data: GoalInput) => {
    if (editing) {
      setGoals(goals.map(g => g.id === editing.id ? { ...data, id: editing.id } : g));
    } else {
      setGoals([...goals, { ...data, id: Date.now().toString() }]);
    }
    setShowForm(false);
    setEditing(null);
  };

  const active = goals.filter(g => g.status === 'ACTIVE').length;
  const completed = goals.filter(g => g.status === 'COMPLETED').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Goals</h2>
          <p className="text-muted-foreground mt-1">
            {active} active • {completed} completed
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          + Add Goal
        </button>
      </div>

      {showForm && (
        <GoalForm
          goal={editing}
          onSubmit={handleSubmit}
          onCancel={() => { setShowForm(false); setEditing(null); }}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {goals.map(g => (
          <GoalCard key={g.id} goal={g} onEdit={handleEdit} onDelete={handleDelete} />
        ))}
      </div>
    </div>
  );
};
