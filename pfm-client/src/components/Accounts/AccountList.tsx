import React, { useCallback, useEffect, useState } from 'react';
import { AccountCard } from './AccountCard';
import { AccountForm } from './AccountForm';
import { accountAPI } from '../../services/api';

export interface Account {
  id: string;
  name: string;
  accountType: string;
  balance: number;
  currency: string;
}

export type AccountInput = Omit<Account, 'id'>;

export const AccountList: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const normalize = (raw: any): Account => ({
    id: String(raw.id),
    name: raw.name,
    accountType: raw.accountType,
    balance: Number(raw.balance ?? 0),
    currency: raw.currency || 'USD',
  });

  const loadAccounts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await accountAPI.getAll();
      setAccounts(Array.isArray(data) ? data.map(normalize) : []);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load accounts');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAccounts();
  }, [loadAccounts]);

  const handleAddAccount = () => {
    setEditingAccount(null);
    setShowForm(true);
  };

  const handleEditAccount = (account: Account) => {
    setEditingAccount(account);
    setShowForm(true);
  };

  const handleDeleteAccount = async (accountId: string) => {
    if (!window.confirm('Are you sure you want to delete this account?')) return;
    try {
      await accountAPI.delete(accountId);
      setAccounts(prev => prev.filter(acc => acc.id !== accountId));
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to delete account');
    }
  };

  const handleSubmit = async (accountData: AccountInput) => {
    try {
      if (editingAccount) {
        const updated = await accountAPI.update(editingAccount.id, accountData);
        const normalized = normalize(updated);
        setAccounts(prev => prev.map(acc => acc.id === editingAccount.id ? normalized : acc));
      } else {
        const created = await accountAPI.create({ ...accountData, initialBalance: accountData.balance });
        setAccounts(prev => [...prev, normalize(created)]);
      }
      setShowForm(false);
      setEditingAccount(null);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to save account');
    }
  };

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Accounts</h2>
          <p className="text-muted-foreground mt-1">
            Total Balance: <span className="font-semibold text-foreground">${totalBalance.toFixed(2)}</span>
          </p>
        </div>
        <button
          onClick={handleAddAccount}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          + Add Account
        </button>
      </div>

      {error && (
        <div className="p-3 bg-destructive/10 border border-destructive text-destructive rounded-md text-sm">
          {error}
        </div>
      )}

      {showForm && (
        <AccountForm
          account={editingAccount}
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingAccount(null);
          }}
        />
      )}

      {loading ? (
        <p className="text-muted-foreground">Loading accounts...</p>
      ) : accounts.length === 0 ? (
        <p className="text-muted-foreground">No accounts yet. Click "Add Account" to create one.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {accounts.map((account) => (
            <AccountCard
              key={account.id}
              account={account}
              onEdit={handleEditAccount}
              onDelete={handleDeleteAccount}
            />
          ))}
        </div>
      )}
    </div>
  );
};
