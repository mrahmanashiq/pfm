import React, { useState } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Dashboard } from '../Dashboard/Dashboard';
import { AccountList } from '../Accounts/AccountList';
import { TransactionList } from '../Transactions/TransactionList';

interface MainLayoutProps {
  onLogout: () => void;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'accounts':
        return <AccountList />;
      case 'transactions':
        return <TransactionList />;
      default:
        return (
          <div className="text-center text-muted-foreground py-12">
            This section is coming soon.
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onLogout={onLogout} />
      <div className="flex">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <main className="flex-1 p-6">
          {renderActiveTab()}
        </main>
      </div>
    </div>
  );
};
