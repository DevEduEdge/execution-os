import type { TaskDocument, UserDocument } from "../models/index.js";
import { DailyStat, Task } from "../models/index.js";
import { dateKey, isSameDay, isYesterday } from "../utils/date.js";
import { refreshGrowthScore } from "./growthScore.js";

export async function completeTask(user: UserDocument, task: TaskDocument) {
  if (task.status === "completed") return;

  task.status = "completed";
  task.completedAt = new Date();
  await task.save();

  user.points += task.points;
  user.tasksCompleted += 1;

  if (!isSameDay(user.lastActiveDate)) {
    user.currentStreak = isYesterday(user.lastActiveDate) ? user.currentStreak + 1 : 1;
    user.longestStreak = Math.max(user.longestStreak, user.currentStreak);
    user.lastActiveDate = new Date();
  }

  await DailyStat.updateOne(
    { userId: user._id, date: dateKey() },
    {
      $inc: {
        pointsDelta: task.points,
        tasksCompleted: 1
      }
    },
    { upsert: true }
  );

  await refreshGrowthScore(user);
}

export async function skipTask(user: UserDocument, task: TaskDocument) {
  if (task.status === "completed" || task.status === "skipped") return;

  const penalty = Math.max(5, Math.round(task.points * 0.7));

  task.status = "skipped";
  task.skippedAt = new Date();
  await task.save();

  user.points = Math.max(0, user.points - penalty);
  user.daysWasted += 1;
  user.currentStreak = 0;

  await DailyStat.updateOne(
    { userId: user._id, date: dateKey() },
    {
      $inc: {
        pointsDelta: -penalty,
        tasksSkipped: 1
      }
    },
    { upsert: true }
  );

  await refreshGrowthScore(user);
}

export async function undoCompletedTask(user: UserDocument, task: TaskDocument) {
  if (task.status !== "completed") return;

  task.status = "pending";
  task.completedAt = undefined;
  await task.save();

  user.points = Math.max(0, user.points - task.points);
  user.tasksCompleted = Math.max(0, user.tasksCompleted - 1);

  await DailyStat.updateOne(
    { userId: user._id, date: dateKey() },
    {
      $inc: {
        pointsDelta: -task.points,
        tasksCompleted: -1
      }
    },
    { upsert: true }
  );

  const completedToday = await Task.exists({
    userId: user._id,
    status: "completed",
    completedAt: {
      $gte: new Date(new Date().setHours(0, 0, 0, 0)),
      $lte: new Date(new Date().setHours(23, 59, 59, 999))
    }
  });

  if (!completedToday && isSameDay(user.lastActiveDate)) {
    user.lastActiveDate = undefined;
    user.currentStreak = Math.max(0, user.currentStreak - 1);
  }

  await refreshGrowthScore(user);
}

export async function reverseTaskImpactBeforeDelete(user: UserDocument, task: TaskDocument) {
  if (task.status === "completed") {
    user.points = Math.max(0, user.points - task.points);
    user.tasksCompleted = Math.max(0, user.tasksCompleted - 1);
  }

  if (task.status === "skipped") {
    const penalty = Math.max(5, Math.round(task.points * 0.7));
    user.points += penalty;
    user.daysWasted = Math.max(0, user.daysWasted - 1);
  }

  await refreshGrowthScore(user);
}
