import React from 'react';

interface SidebarProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab = 'dashboard', onTabChange }) => {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'transactions', label: 'Transactions', icon: '💳' },
    { id: 'accounts', label: 'Accounts', icon: '🏦' },
    { id: 'categories', label: 'Categories', icon: '📁' },
    { id: 'budgets', label: 'Budgets', icon: '💰' },
    { id: 'goals', label: 'Goals', icon: '🎯' },
  ];

  return (
    <aside className="w-64 bg-card border-r border-border h-screen sticky top-0">
      <nav className="p-4">
        <ul className="space-y-2">
          {tabs.map((tab) => (
            <li key={tab.id}>
              <button
                onClick={() => onTabChange?.(tab.id)}
                className={`w-full text-left px-4 py-3 rounded-md transition-colors flex items-center gap-3 ${
                  activeTab === tab.id
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:bg-secondary'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

