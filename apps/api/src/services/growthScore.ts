import type { UserDocument } from "../models/index.js";

export function calculateGrowthScore(user: UserDocument) {
  const raw =
    user.points +
    user.tasksCompleted * 8 +
    user.currentStreak * 12 +
    Math.round(user.totalSaved / 10) -
    user.daysWasted * 6;

  return Math.max(0, raw);
}

export async function refreshGrowthScore(user: UserDocument) {
  user.growthScore = calculateGrowthScore(user);
  await user.save();
  return user.growthScore;
}
