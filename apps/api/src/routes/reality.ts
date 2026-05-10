import { Router } from "express";
import { getHabitSummary } from "../services/habits.js";
import { getMoneySummary } from "../services/money.js";
import { refreshGrowthScore } from "../services/growthScore.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { currentUser } from "../utils/currentUser.js";
import { toRealityDto } from "../utils/mappers.js";

export const realityRouter = Router();

realityRouter.get(
  "/",
  asyncHandler(async (_req, res) => {
    const user = currentUser(res);
    const [habitSummary] = await Promise.all([getHabitSummary(user), getMoneySummary(user)]);
    await refreshGrowthScore(user);
    res.json({ data: toRealityDto(user, habitSummary.completionRate) });
  })
);
