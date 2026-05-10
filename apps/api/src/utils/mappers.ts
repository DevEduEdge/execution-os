import type {
  DecisionDto,
  ExpenseDto,
  HabitDto,
  RealityDashboardDto,
  TaskDto,
  UserProfile
} from "@execution-os/shared";
import type {
  DecisionDocument,
  ExpenseDocument,
  HabitDocument,
  TaskDocument,
  UserDocument
} from "../models/index.js";

export function toUserProfile(user: UserDocument): UserProfile {
  return {
    id: user._id.toString(),
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    monthlyBudget: user.monthlyBudget,
    points: user.points,
    currentStreak: user.currentStreak,
    longestStreak: user.longestStreak,
    daysWasted: user.daysWasted,
    tasksCompleted: user.tasksCompleted,
    totalSaved: user.totalSaved,
    growthScore: user.growthScore
  };
}

export function toTaskDto(task: TaskDocument, priorityRank: number): TaskDto {
  return {
    id: task._id.toString(),
    title: task.title,
    category: task.category,
    impact: task.impact,
    effort: task.effort,
    points: task.points,
    status: task.status,
    dueDate: task.dueDate.toISOString(),
    priorityRank,
    completedAt: task.completedAt?.toISOString(),
    skippedAt: task.skippedAt?.toISOString()
  };
}

export function toExpenseDto(expense: ExpenseDocument): ExpenseDto {
  return {
    id: expense._id.toString(),
    amount: expense.amount,
    note: expense.note,
    category: expense.category,
    kind: expense.kind,
    spentAt: expense.spentAt.toISOString()
  };
}

export function toHabitDto(
  habit: HabitDocument,
  doneToday: boolean,
  weeklyDoneCount: number
): HabitDto {
  return {
    id: habit._id.toString(),
    name: habit.name,
    doneToday,
    weeklyDoneCount
  };
}

export function toDecisionDto(decision: DecisionDocument): DecisionDto {
  const createdAt = decision.get("createdAt") as Date;
  return {
    id: decision._id.toString(),
    input: decision.input,
    decision: decision.decision,
    actionStep: decision.actionStep,
    createdAt: createdAt.toISOString()
  };
}

export function toRealityDto(
  user: UserDocument,
  weeklyHabitCompletionRate: number
): RealityDashboardDto {
  return {
    daysWasted: user.daysWasted,
    tasksCompleted: user.tasksCompleted,
    moneySaved: user.totalSaved,
    growthScore: user.growthScore,
    points: user.points,
    currentStreak: user.currentStreak,
    longestStreak: user.longestStreak,
    weeklyHabitCompletionRate
  };
}
