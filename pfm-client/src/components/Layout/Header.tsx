import React from 'react';

interface HeaderProps {
  title?: string;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ title = 'PFM - Personal Finance Manager', onLogout }) => {
  return (
    <header className="bg-card border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary">{title}</h1>
          <div className="flex items-center gap-4">
            <button className="px-4 py-2 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80">
              Profile
            </button>
            <button
              onClick={onLogout}
              className="px-4 py-2 rounded-md bg-destructive text-destructive-foreground hover:bg-destructive/80"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

