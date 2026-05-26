export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  goalType: string;
  status: string;
  targetDate?: string;
  color?: string;
  icon?: string;
  description?: string;
}

export type GoalInput = Omit<Goal, 'id'>;
