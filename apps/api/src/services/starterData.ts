import type { UserDocument } from "../models/index.js";
import { Expense, Habit, HabitLog, Task } from "../models/index.js";
import { addDays, dateKey } from "../utils/date.js";

export async function ensureStarterData(user: UserDocument) {
  const [taskCount, habitCount, expenseCount] = await Promise.all([
    Task.countDocuments({ userId: user._id }),
    Habit.countDocuments({ userId: user._id }),
    Expense.countDocuments({ userId: user._id })
  ]);

  // Seed only once. Existing users with any persisted data are marked as seeded.
  if (user.hasSeeded) return;

  if (taskCount > 0 || habitCount > 0 || expenseCount > 0) {
    user.hasSeeded = true;
    await user.save();
    return;
  }

  const now = new Date();

  await Task.insertMany([
    {
      userId: user._id,
      title: "Review yesterday's spending and cut one leak",
      category: "Money",
      impact: 5,
      effort: 2,
      points: 18,
      dueDate: now
    },
    {
      userId: user._id,
      title: "Complete one visible Assistant GM skill action",
      category: "Career Growth",
      impact: 5,
      effort: 3,
      points: 20,
      dueDate: now
    },
    {
      userId: user._id,
      title: "Do 20 minutes of movement",
      category: "Health",
      impact: 4,
      effort: 2,
      points: 14,
      dueDate: now
    },
    {
      userId: user._id,
      title: "Update savings target",
      category: "Money",
      impact: 4,
      effort: 2,
      points: 12,
      dueDate: addDays(now, 1)
    },
    {
      userId: user._id,
      title: "Ask for one leadership feedback point",
      category: "Career Growth",
      impact: 4,
      effort: 2,
      points: 16,
      dueDate: addDays(now, 1)
    }
  ]);

  const habits = await Habit.insertMany([
    { userId: user._id, name: "Wake before 7" },
    { userId: user._id, name: "No impulse spending" },
    { userId: user._id, name: "Read 10 pages" }
  ]);

  await HabitLog.create({
    userId: user._id,
    habitId: habits[1]._id,
    date: dateKey(),
    done: true
  });

  await Expense.insertMany([
    {
      userId: user._id,
      amount: 12,
      note: "Lunch",
      category: "Food",
      kind: "expense",
      spentAt: now
    },
    {
      userId: user._id,
      amount: 7,
      note: "Transport",
      category: "Bills",
      kind: "expense",
      spentAt: addDays(now, -1)
    },
    {
      userId: user._id,
      amount: 25,
      note: "Course notes",
      category: "Growth",
      kind: "expense",
      spentAt: addDays(now, -2)
    },
    {
      userId: user._id,
      amount: 300,
      note: "Salary advance",
      category: "Salary",
      kind: "income",
      spentAt: addDays(now, -2)
    }
  ]);

  user.hasSeeded = true;
  await user.save();
}

export async function resetStarterData(user: UserDocument) {
  await Promise.all([
    Task.deleteMany({ userId: user._id }),
    Expense.deleteMany({ userId: user._id }),
    Habit.deleteMany({ userId: user._id }),
    HabitLog.deleteMany({ userId: user._id })
  ]);

  user.points = 0;
  user.currentStreak = 0;
  user.longestStreak = 0;
  user.daysWasted = 0;
  user.tasksCompleted = 0;
  user.totalSaved = 0;
  user.growthScore = 0;
  user.lastActiveDate = undefined;
  user.hasSeeded = false;
  await user.save();

  await ensureStarterData(user);
}
