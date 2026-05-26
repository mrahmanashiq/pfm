export interface Budget {
  id: string;
  name: string;
  amount: number;
  spent: number;
  budgetPeriod: string;
  startDate: string;
  endDate: string;
  color?: string;
  alertPercentage?: number;
  description?: string;
  categoryName?: string;
}

export type BudgetInput = Omit<Budget, 'id' | 'spent'>;
