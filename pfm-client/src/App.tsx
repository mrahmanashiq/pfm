import React from 'react';
import { MainLayout } from './components/Layout/MainLayout';

function App() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-foreground">Welcome to PFM</h2>
        <p className="text-muted-foreground">Your personal finance management dashboard</p>
      </div>
    </MainLayout>
  );
}

export default App;
