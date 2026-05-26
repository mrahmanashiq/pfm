import React, { useCallback, useEffect, useState } from 'react';
import { GoalCard } from './GoalCard';
import { GoalForm } from './GoalForm';
import { Goal, GoalInput } from './types';
import { goalAPI } from '../../services/api';

export const GoalList: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Goal | null>(null);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const normalize = (raw: any): Goal => ({
    id: String(raw.id),
    name: raw.name,
    targetAmount: Number(raw.targetAmount ?? 0),
    currentAmount: Number(raw.currentAmount ?? 0),
    goalType: raw.goalType,
    status: raw.status,
    targetDate: raw.targetDate,
    color: raw.color,
    icon: raw.icon,
    description: raw.description,
  });

  const loadGoals = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await goalAPI.getAll();
      setGoals(Array.isArray(data) ? data.map(normalize) : []);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load goals');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadGoals();
  }, [loadGoals]);

  const handleAdd = () => {
    setEditing(null);
    setShowForm(true);
  };

  const handleEdit = (goal: Goal) => {
    setEditing(goal);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this goal?')) return;
    try {
      await goalAPI.delete(id);
      setGoals(prev => prev.filter(g => g.id !== id));
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to delete goal');
    }
  };

  const handleSubmit = async (data: GoalInput) => {
    try {
      if (editing) {
        const updated = await goalAPI.update(editing.id, data);
        const normalized = normalize(updated);
        setGoals(prev => prev.map(g => g.id === editing.id ? normalized : g));
      } else {
        const created = await goalAPI.create(data);
        setGoals(prev => [...prev, normalize(created)]);
      }
      setShowForm(false);
      setEditing(null);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to save goal');
    }
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

      {error && (
        <div className="p-3 bg-destructive/10 border border-destructive text-destructive rounded-md text-sm">
          {error}
        </div>
      )}

      {showForm && (
        <GoalForm
          goal={editing}
          onSubmit={handleSubmit}
          onCancel={() => { setShowForm(false); setEditing(null); }}
        />
      )}

      {loading ? (
        <p className="text-muted-foreground">Loading goals...</p>
      ) : goals.length === 0 ? (
        <p className="text-muted-foreground">No goals yet. Click "Add Goal" to create one.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {goals.map(g => (
            <GoalCard key={g.id} goal={g} onEdit={handleEdit} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
};
