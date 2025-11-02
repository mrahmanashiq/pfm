import React, { useState } from 'react';
import { AccountCard } from './AccountCard';
import { AccountForm } from './AccountForm';

interface Account {
  id: string;
  name: string;
  type: string;
  balance: number;
  currency: string;
}

export const AccountList: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);

  // Mock data
  const [accounts, setAccounts] = useState<Account[]>([
    {
      id: '1',
      name: 'Checking Account',
      type: 'CHECKING',
      balance: 5234.56,
      currency: '$',
    },
    {
      id: '2',
      name: 'Savings Account',
      type: 'SAVINGS',
      balance: 12000.00,
      currency: '$',
    },
    {
      id: '3',
      name: 'Credit Card',
      type: 'CREDIT_CARD',
      balance: -850.30,
      currency: '$',
    },
  ]);

  const handleAddAccount = () => {
    setEditingAccount(null);
    setShowForm(true);
  };

  const handleEditAccount = (account: Account) => {
    setEditingAccount(account);
    setShowForm(true);
  };

  const handleDeleteAccount = (accountId: string) => {
    if (window.confirm('Are you sure you want to delete this account?')) {
      setAccounts(accounts.filter(acc => acc.id !== accountId));
    }
  };

  const handleSubmit = (accountData: Omit<Account, 'id'>) => {
    if (editingAccount) {
      setAccounts(accounts.map(acc => 
        acc.id === editingAccount.id 
          ? { ...accountData, id: editingAccount.id }
          : acc
      ));
    } else {
      setAccounts([...accounts, { ...accountData, id: Date.now().toString() }]);
    }
    setShowForm(false);
    setEditingAccount(null);
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
    </div>
  );
};

