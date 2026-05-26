import React from 'react';
import { Budget } from './types';

interface BudgetCardProps {
  budget: Budget;
  onEdit?: (budget: Budget) => void;
  onDelete?: (budgetId: string) => void;
}

export const BudgetCard: React.FC<BudgetCardProps> = ({ budget, onEdit, onDelete }) => {
  const remaining = budget.amount - budget.spent;
  const percent = budget.amount > 0 ? Math.min(100, (budget.spent / budget.amount) * 100) : 0;
  const over = budget.spent > budget.amount;
  const barColor = over ? 'bg-destructive' : percent >= 80 ? 'bg-amber-500' : 'bg-primary';

  return (
    <div className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-lg font-semibold text-foreground">{budget.name}</h3>
          <p className="text-sm text-muted-foreground">
            {budget.period}{budget.categoryName ? ` • ${budget.categoryName}` : ''}
          </p>
        </div>
        {budget.color && (
          <span
            className="inline-block w-4 h-4 rounded-full border border-border"
            style={{ backgroundColor: budget.color }}
            aria-label="Budget color"
          />
        )}
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Spent</span>
          <span className="font-medium">${budget.spent.toFixed(2)} / ${budget.amount.toFixed(2)}</span>
        </div>
        <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
          <div
            className={`h-2 rounded-full transition-all ${barColor}`}
            style={{ width: `${percent}%` }}
          />
        </div>
        <p className={`text-sm font-medium ${over ? 'text-destructive' : 'text-foreground'}`}>
          {over ? `Over by $${Math.abs(remaining).toFixed(2)}` : `$${remaining.toFixed(2)} remaining`}
        </p>
      </div>

      <div className="flex gap-2">
        {onEdit && (
          <button
            onClick={() => onEdit(budget)}
            className="flex-1 px-3 py-2 text-sm bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80"
          >
            Edit
          </button>
        )}
        {onDelete && (
          <button
            onClick={() => onDelete(budget.id)}
            className="flex-1 px-3 py-2 text-sm bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/80"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};
