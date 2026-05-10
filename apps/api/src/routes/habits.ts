import { Router } from "express";
import { z } from "zod";
import { HABIT_LIMIT } from "@execution-os/shared";
import { Habit, HabitLog } from "../models/index.js";
import { AppError } from "../middleware/error.js";
import { getHabitSummary } from "../services/habits.js";
import { refreshGrowthScore } from "../services/growthScore.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { currentUser } from "../utils/currentUser.js";
import { dateKey } from "../utils/date.js";

export const habitRouter = Router();

habitRouter.get(
  "/week",
  asyncHandler(async (_req, res) => {
    const user = currentUser(res);
    const summary = await getHabitSummary(user);
    res.json({ data: summary });
  })
);

habitRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    const input = z.object({ name: z.string().trim().min(2).max(40) }).parse(req.body);
    const user = currentUser(res);
    const activeCount = await Habit.countDocuments({ userId: user._id, isActive: true });

    if (activeCount >= HABIT_LIMIT) {
      throw new AppError("Habit limit reached. Keep only five habits.", 409);
    }

    await Habit.create({
      userId: user._id,
      name: input.name,
      isActive: true
    });

    res.status(201).json({ data: await getHabitSummary(user) });
  })
);

habitRouter.post(
  "/:id/log",
  asyncHandler(async (req, res) => {
    const params = z.object({ id: z.string() }).parse(req.params);
    const input = z.object({ done: z.boolean() }).parse(req.body);
    const user = currentUser(res);
    const habit = await Habit.findOne({ _id: params.id, userId: user._id, isActive: true });

    if (!habit) throw new AppError("Habit not found.", 404);

    await HabitLog.findOneAndUpdate(
      { userId: user._id, habitId: habit._id, date: dateKey() },
      { $set: { done: input.done } },
      { upsert: true, new: true }
    );

    if (input.done) {
      user.points += 3;
      await refreshGrowthScore(user);
    }

    res.json({ data: await getHabitSummary(user) });
  })
);

habitRouter.put(
  "/:id",
  asyncHandler(async (req, res) => {
    const params = z.object({ id: z.string() }).parse(req.params);
    const input = z.object({ name: z.string().trim().min(2).max(40) }).parse(req.body);
    const user = currentUser(res);
    const habit = await Habit.findOne({ _id: params.id, userId: user._id, isActive: true });

    if (!habit) throw new AppError("Habit not found.", 404);

    habit.name = input.name;
    await habit.save();

    res.json({ data: await getHabitSummary(user) });
  })
);

habitRouter.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const params = z.object({ id: z.string() }).parse(req.params);
    const user = currentUser(res);
    const habit = await Habit.findOne({ _id: params.id, userId: user._id, isActive: true });

    if (!habit) throw new AppError("Habit not found.", 404);

    habit.isActive = false;
    await habit.save();
    await HabitLog.deleteMany({ userId: user._id, habitId: habit._id });

    res.json({ data: await getHabitSummary(user) });
  })
);
