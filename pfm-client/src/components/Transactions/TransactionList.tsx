import React, { useCallback, useEffect, useState } from 'react';
import { TransactionForm, TransactionInput } from './TransactionForm';
import { accountAPI, transactionAPI } from '../../services/api';

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  transactionDate: string;
  transactionType: string;
  accountId: string;
  accountName?: string;
  categoryName?: string;
}

interface AccountSummary {
  id: string;
  name: string;
}

export const TransactionList: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [accounts, setAccounts] = useState<AccountSummary[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const normalize = (raw: any): Transaction => ({
    id: String(raw.id),
    description: raw.description || '',
    amount: Number(raw.amount ?? 0),
    transactionDate: raw.transactionDate,
    transactionType: raw.transactionType,
    accountId: raw.accountId != null ? String(raw.accountId) : '',
    accountName: raw.account?.name,
    categoryName: raw.category?.name,
  });

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [txData, acctData] = await Promise.all([
        transactionAPI.getAll(),
        accountAPI.getAll(),
      ]);
      setTransactions(Array.isArray(txData) ? txData.map(normalize) : []);
      setAccounts(Array.isArray(acctData)
        ? acctData.map((a: any) => ({ id: String(a.id), name: a.name }))
        : []);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load transactions');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCreate = async (data: TransactionInput) => {
    try {
      const payload = {
        description: data.description,
        amount: data.amount,
        transactionDate: data.transactionDate,
        transactionType: data.transactionType,
        accountId: Number(data.accountId),
      };
      const created = await transactionAPI.create(payload);
      setTransactions(prev => [normalize(created), ...prev]);
      setShowForm(false);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to save transaction');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this transaction?')) return;
    try {
      await transactionAPI.delete(id);
      setTransactions(prev => prev.filter(t => t.id !== id));
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to delete transaction');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Transactions</h2>
        <button
          onClick={() => setShowForm(s => !s)}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          {showForm ? 'Cancel' : '+ Add Transaction'}
        </button>
      </div>

      {error && (
        <div className="p-3 bg-destructive/10 border border-destructive text-destructive rounded-md text-sm">
          {error}
        </div>
      )}

      {showForm && (
        <TransactionForm
          accounts={accounts}
          onSubmit={handleCreate}
          onCancel={() => setShowForm(false)}
        />
      )}

      {loading ? (
        <p className="text-muted-foreground">Loading transactions...</p>
      ) : transactions.length === 0 ? (
        <p className="text-muted-foreground">No transactions yet.</p>
      ) : (
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-secondary">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Account</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {transactions.map((transaction) => {
                const isIncome = transaction.transactionType === 'INCOME';
                return (
                  <tr key={transaction.id} className="hover:bg-secondary/50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                      {transaction.transactionDate ? new Date(transaction.transactionDate).toLocaleDateString() : ''}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                      {transaction.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      {transaction.accountName || '—'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      {transaction.categoryName || '—'}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-semibold ${
                      isIncome ? 'text-green-600' : 'text-destructive'
                    }`}>
                      {isIncome ? '+' : '-'}${Math.abs(transaction.amount).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                      <button
                        onClick={() => handleDelete(transaction.id)}
                        className="text-destructive hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
