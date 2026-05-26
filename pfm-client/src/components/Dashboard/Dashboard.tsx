import React, { useEffect, useState } from 'react';
import { SummaryCard } from './SummaryCard';
import { accountAPI, transactionAPI } from '../../services/api';

interface AccountSummary {
  id: string;
  name: string;
  balance: number;
  includeInTotal?: boolean;
}

interface TransactionSummary {
  id: string;
  description: string;
  amount: number;
  transactionDate: string;
  transactionType: string;
}

const monthBounds = (date: Date): { start: Date; end: Date } => {
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 1);
  return { start, end };
};

export const Dashboard: React.FC = () => {
  const [accounts, setAccounts] = useState<AccountSummary[]>([]);
  const [transactions, setTransactions] = useState<TransactionSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const [acct, tx] = await Promise.all([
          accountAPI.getAll(),
          transactionAPI.getAll(),
        ]);
        setAccounts(Array.isArray(acct)
          ? acct.map((a: any) => ({
              id: String(a.id),
              name: a.name,
              balance: Number(a.balance ?? 0),
              includeInTotal: a.includeInTotal !== false,
            }))
          : []);
        setTransactions(Array.isArray(tx)
          ? tx.map((t: any) => ({
              id: String(t.id),
              description: t.description || '',
              amount: Number(t.amount ?? 0),
              transactionDate: t.transactionDate,
              transactionType: t.transactionType,
            }))
          : []);
      } catch (err: any) {
        setError(err?.response?.data?.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const totalBalance = accounts
    .filter(a => a.includeInTotal !== false)
    .reduce((sum, a) => sum + a.balance, 0);

  const { start, end } = monthBounds(new Date());
  const inMonth = transactions.filter(t => {
    if (!t.transactionDate) return false;
    const d = new Date(t.transactionDate);
    return d >= start && d < end;
  });
  const monthlyIncome = inMonth
    .filter(t => t.transactionType === 'INCOME')
    .reduce((s, t) => s + t.amount, 0);
  const monthlyExpenses = inMonth
    .filter(t => t.transactionType === 'EXPENSE')
    .reduce((s, t) => s + t.amount, 0);
  const savingsRate = monthlyIncome > 0
    ? ((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100
    : 0;

  const summaryData = [
    { title: 'Total Balance', value: `$${totalBalance.toFixed(2)}`, icon: '💰' },
    { title: 'Monthly Income', value: `$${monthlyIncome.toFixed(2)}`, icon: '📈' },
    { title: 'Monthly Expenses', value: `$${monthlyExpenses.toFixed(2)}`, icon: '📉' },
    { title: 'Savings Rate', value: `${savingsRate.toFixed(1)}%`, icon: '🎯' },
  ];

  const recent = transactions.slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Dashboard</h2>
        <p className="text-muted-foreground">Overview of your financial status</p>
      </div>

      {error && (
        <div className="p-3 bg-destructive/10 border border-destructive text-destructive rounded-md text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryData.map((data, index) => (
          <SummaryCard
            key={index}
            title={data.title}
            value={loading ? '—' : data.value}
            icon={data.icon}
          />
        ))}
      </div>

      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Recent Transactions</h3>
        {loading ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : recent.length === 0 ? (
          <p className="text-muted-foreground">No transactions yet.</p>
        ) : (
          <div className="space-y-3">
            {recent.map(t => {
              const isIncome = t.transactionType === 'INCOME';
              return (
                <div key={t.id} className="flex items-center justify-between p-3 bg-secondary/50 rounded-md">
                  <div>
                    <p className="font-medium">{t.description || 'Transaction'}</p>
                    <p className="text-sm text-muted-foreground">
                      {t.transactionDate ? new Date(t.transactionDate).toLocaleDateString() : ''}
                    </p>
                  </div>
                  <p className={`${isIncome ? 'text-green-600' : 'text-destructive'} font-semibold`}>
                    {isIncome ? '+' : '-'}${Math.abs(t.amount).toFixed(2)}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
