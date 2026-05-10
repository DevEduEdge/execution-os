import type { HabitSummaryDto } from "@execution-os/shared";
import type { UserDocument } from "../models/index.js";
import { Habit, HabitLog } from "../models/index.js";
import { dateKey, weekStart } from "../utils/date.js";
import { toHabitDto } from "../utils/mappers.js";

export async function getHabitSummary(user: UserDocument): Promise<HabitSummaryDto> {
  const habits = await Habit.find({ userId: user._id, isActive: true }).sort({ createdAt: 1 });
  const start = weekStart();
  const weekKeys = Array.from({ length: 7 }, (_, index) => {
    const day = new Date(start);
    day.setDate(start.getDate() + index);
    return dateKey(day);
  });

  const logs = await HabitLog.find({
    userId: user._id,
    date: { $in: weekKeys }
  });

  const todayKey = dateKey();
  const habitDtos = habits.map((habit) => {
    const habitLogs = logs.filter((log) => log.habitId.equals(habit._id));
    return toHabitDto(
      habit,
      habitLogs.some((log) => log.date === todayKey && log.done),
      habitLogs.filter((log) => log.done).length
    );
  });

  const possible = Math.max(1, habits.length * 7);
  const done = logs.filter((log) => log.done).length;

  return {
    habits: habitDtos,
    weekStart: start.toISOString(),
    completionRate: Math.round((done / possible) * 100),
    remainingSlots: Math.max(0, 5 - habits.length)
  };
}
