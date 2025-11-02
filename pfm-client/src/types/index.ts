export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface Account {
  id: string;
  name: string;
  type: 'CHECKING' | 'SAVINGS' | 'CREDIT_CARD' | 'INVESTMENT';
  balance: number;
  currency: string;
  userId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: string;
  type: 'income' | 'expense';
  accountId: string;
  userId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense';
  userId: string;
}

export interface Budget {
  id: string;
  name: string;
  categoryId: string;
  amount: number;
  period: 'WEEKLY' | 'MONTHLY' | 'YEARLY';
  startDate: string;
  endDate?: string;
  userId: string;
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  userId: string;
}

