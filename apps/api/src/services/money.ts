import type { MoneySummaryDto } from "@execution-os/shared";
import type { UserDocument } from "../models/index.js";
import { Expense } from "../models/index.js";
import { dayOfMonth, daysInCurrentMonth, endOfToday, startOfMonth, startOfToday } from "../utils/date.js";
import { toExpenseDto } from "../utils/mappers.js";

export async function getMoneySummary(user: UserDocument): Promise<MoneySummaryDto> {
  const [dailyExpenses, monthlyExpenses, recentExpenses] = await Promise.all([
    Expense.find({
      userId: user._id,
      spentAt: { $gte: startOfToday(), $lte: endOfToday() }
    }),
    Expense.find({
      userId: user._id,
      spentAt: { $gte: startOfMonth() }
    }),
    Expense.find({ userId: user._id }).sort({ spentAt: -1 }).limit(5)
  ]);

  const dailySpending = dailyExpenses
    .filter((entry) => entry.kind === "expense")
    .reduce((sum, expense) => sum + expense.amount, 0);
  const dailyIncome = dailyExpenses
    .filter((entry) => entry.kind === "income")
    .reduce((sum, expense) => sum + expense.amount, 0);
  const monthlySpending = monthlyExpenses
    .filter((entry) => entry.kind === "expense")
    .reduce((sum, expense) => sum + expense.amount, 0);
  const monthlyIncome = monthlyExpenses
    .filter((entry) => entry.kind === "income")
    .reduce((sum, expense) => sum + expense.amount, 0);
  const monthlyNet = monthlyIncome - monthlySpending;
  const dailyBudget = user.monthlyBudget / daysInCurrentMonth();
  const monthlyBurnRate = (monthlySpending / Math.max(1, dayOfMonth())) * daysInCurrentMonth();
  const warning = monthlyBurnRate > user.monthlyBudget || dailySpending > dailyBudget;
  const warningMessage = warning
    ? "Spending pace is above budget. Stop non-essential spending today."
    : null;

  // "Money saved" should reflect real cash surplus, not just untouched budget.
  user.totalSaved = Math.max(0, Math.round(monthlyNet));
  await user.save();

  return {
    dailySpending,
    dailyIncome,
    monthlySpending,
    monthlyIncome,
    monthlyNet,
    monthlyBurnRate,
    monthlyBudget: user.monthlyBudget,
    dailyBudget,
    warning,
    warningMessage,
    recentExpenses: recentExpenses.map(toExpenseDto)
  };
}
