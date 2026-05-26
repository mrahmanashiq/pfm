import React from 'react';
import { Account } from './AccountList';

interface AccountCardProps {
  account: Account;
  onEdit?: (account: Account) => void;
  onDelete?: (accountId: string) => void;
}

export const AccountCard: React.FC<AccountCardProps> = ({ account, onEdit, onDelete }) => {
  return (
    <div className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">{account.name}</h3>
          <p className="text-sm text-muted-foreground">{account.accountType}</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-foreground">
            {account.currency} {Math.abs(account.balance).toFixed(2)}
          </p>
        </div>
      </div>
      <div className="flex gap-2 mt-4">
        {onEdit && (
          <button
            onClick={() => onEdit(account)}
            className="flex-1 px-3 py-2 text-sm bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80"
          >
            Edit
          </button>
        )}
        {onDelete && (
          <button
            onClick={() => onDelete(account.id)}
            className="flex-1 px-3 py-2 text-sm bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/80"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};
