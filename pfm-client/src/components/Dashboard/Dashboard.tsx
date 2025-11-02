import React from 'react';
import { SummaryCard } from './SummaryCard';

export const Dashboard: React.FC = () => {
  // Mock data - will be replaced with API calls
  const summaryData = [
    {
      title: 'Total Balance',
      value: '$12,345.67',
      icon: '💰',
      trend: { value: 5.2, isPositive: true },
    },
    {
      title: 'Monthly Income',
      value: '$4,500.00',
      icon: '📈',
      trend: { value: 2.1, isPositive: true },
    },
    {
      title: 'Monthly Expenses',
      value: '$3,200.00',
      icon: '📉',
      trend: { value: -3.5, isPositive: false },
    },
    {
      title: 'Savings Rate',
      value: '28.9%',
      icon: '🎯',
      trend: { value: 1.2, isPositive: true },
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Dashboard</h2>
        <p className="text-muted-foreground">Overview of your financial status</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryData.map((data, index) => (
          <SummaryCard
            key={index}
            title={data.title}
            value={data.value}
            icon={data.icon}
            trend={data.trend}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Recent Transactions</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-md">
              <div>
                <p className="font-medium">Grocery Store</p>
                <p className="text-sm text-muted-foreground">Today</p>
              </div>
              <p className="text-destructive font-semibold">-$125.50</p>
            </div>
            <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-md">
              <div>
                <p className="font-medium">Salary Deposit</p>
                <p className="text-sm text-muted-foreground">Yesterday</p>
              </div>
              <p className="text-green-600 font-semibold">+$4,500.00</p>
            </div>
            <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-md">
              <div>
                <p className="font-medium">Electric Bill</p>
                <p className="text-sm text-muted-foreground">2 days ago</p>
              </div>
              <p className="text-destructive font-semibold">-$85.30</p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Top Categories</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">Food & Dining</span>
                  <span className="text-sm text-muted-foreground">$450</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: '35%' }}></div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">Transportation</span>
                  <span className="text-sm text-muted-foreground">$320</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: '25%' }}></div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">Utilities</span>
                  <span className="text-sm text-muted-foreground">$280</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: '22%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

