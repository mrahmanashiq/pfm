import React from 'react';

interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: string;
  type: 'income' | 'expense';
}

interface TransactionListProps {
  transactions?: Transaction[];
}

export const TransactionList: React.FC<TransactionListProps> = ({ 
  transactions = [] 
}) => {
  // Mock data for now
  const mockTransactions: Transaction[] = [
    {
      id: '1',
      description: 'Grocery Store',
      amount: 125.50,
      date: '2024-01-15',
      category: 'Food',
      type: 'expense',
    },
    {
      id: '2',
      description: 'Salary Deposit',
      amount: 4500.00,
      date: '2024-01-14',
      category: 'Salary',
      type: 'income',
    },
    {
      id: '3',
      description: 'Electric Bill',
      amount: 85.30,
      date: '2024-01-13',
      category: 'Utilities',
      type: 'expense',
    },
  ];

  const displayTransactions = transactions.length > 0 ? transactions : mockTransactions;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Transactions</h2>
        <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
          + Add Transaction
        </button>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-secondary">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {displayTransactions.map((transaction) => (
              <tr key={transaction.id} className="hover:bg-secondary/50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                  {new Date(transaction.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                  {transaction.description}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                  {transaction.category}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-semibold ${
                  transaction.type === 'income' ? 'text-green-600' : 'text-destructive'
                }`}>
                  {transaction.type === 'income' ? '+' : '-'}
                  ${Math.abs(transaction.amount).toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                  <button className="text-primary hover:underline mr-3">Edit</button>
                  <button className="text-destructive hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

