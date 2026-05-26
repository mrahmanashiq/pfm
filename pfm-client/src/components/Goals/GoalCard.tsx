import React from 'react';
import { Goal } from './types';

interface GoalCardProps {
  goal: Goal;
  onEdit?: (goal: Goal) => void;
  onDelete?: (goalId: string) => void;
}

export const GoalCard: React.FC<GoalCardProps> = ({ goal, onEdit, onDelete }) => {
  const percent = goal.targetAmount > 0
    ? Math.min(100, (goal.currentAmount / goal.targetAmount) * 100)
    : 0;
  const achieved = goal.currentAmount >= goal.targetAmount && goal.targetAmount > 0;

  return (
    <div className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          {goal.icon && <span className="text-2xl" aria-hidden="true">{goal.icon}</span>}
          <div>
            <h3 className="text-lg font-semibold text-foreground">{goal.name}</h3>
            <p className="text-sm text-muted-foreground">
              {goal.goalType} • {goal.status}
            </p>
          </div>
        </div>
        {goal.color && (
          <span
            className="inline-block w-4 h-4 rounded-full border border-border"
            style={{ backgroundColor: goal.color }}
            aria-label="Goal color"
          />
        )}
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Progress</span>
          <span className="font-medium">
            ${goal.currentAmount.toFixed(2)} / ${goal.targetAmount.toFixed(2)}
          </span>
        </div>
        <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
          <div
            className={`h-2 rounded-full transition-all ${achieved ? 'bg-emerald-500' : 'bg-primary'}`}
            style={{ width: `${percent}%` }}
          />
        </div>
        <div className="flex justify-between text-sm">
          <span className={achieved ? 'text-emerald-600 font-medium' : 'text-muted-foreground'}>
            {achieved ? 'Achieved' : `${percent.toFixed(0)}%`}
          </span>
          {goal.targetDate && (
            <span className="text-muted-foreground">
              Target: {new Date(goal.targetDate).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>

      <div className="flex gap-2">
        {onEdit && (
          <button
            onClick={() => onEdit(goal)}
            className="flex-1 px-3 py-2 text-sm bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80"
          >
            Edit
          </button>
        )}
        {onDelete && (
          <button
            onClick={() => onDelete(goal.id)}
            className="flex-1 px-3 py-2 text-sm bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/80"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};
