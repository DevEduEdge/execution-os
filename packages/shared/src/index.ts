export const TASK_CATEGORIES = ["Money", "Career Growth", "Health"] as const;
export type TaskCategory = (typeof TASK_CATEGORIES)[number];

export const HABIT_LIMIT = 5;

export type TaskStatus = "pending" | "in_progress" | "completed" | "skipped";

export type NavSection = "dashboard" | "today" | "money" | "growth";
export type GrowthView = "habits" | "decision" | "reality";

export interface UserProfile {
  id: string;
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  monthlyBudget: number;
  points: number;
  currentStreak: number;
  longestStreak: number;
  daysWasted: number;
  tasksCompleted: number;
  totalSaved: number;
  growthScore: number;
}

export interface TaskDto {
  id: string;
  title: string;
  category: TaskCategory;
  impact: number;
  effort: number;
  points: number;
  status: TaskStatus;
  dueDate: string;
  priorityRank: number;
  completedAt?: string;
  skippedAt?: string;
}

export interface ExpenseDto {
  id: string;
  amount: number;
  note: string;
  category: string;
  kind: "expense" | "income";
  spentAt: string;
}

export interface MoneySummaryDto {
  dailySpending: number;
  dailyIncome: number;
  monthlySpending: number;
  monthlyIncome: number;
  monthlyNet: number;
  monthlyBurnRate: number;
  monthlyBudget: number;
  dailyBudget: number;
  warning: boolean;
  warningMessage: string | null;
  recentExpenses: ExpenseDto[];
}

export interface HabitDto {
  id: string;
  name: string;
  doneToday: boolean;
  weeklyDoneCount: number;
}

export interface HabitSummaryDto {
  habits: HabitDto[];
  weekStart: string;
  completionRate: number;
  remainingSlots: number;
}

export interface DecisionDto {
  id: string;
  input: string;
  decision: string;
  actionStep: string;
  createdAt: string;
}

export interface RealityDashboardDto {
  daysWasted: number;
  tasksCompleted: number;
  moneySaved: number;
  growthScore: number;
  points: number;
  currentStreak: number;
  longestStreak: number;
  weeklyHabitCompletionRate: number;
}

export interface ApiEnvelope<T> {
  data: T;
}
