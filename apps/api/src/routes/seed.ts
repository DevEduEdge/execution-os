import { Router } from "express";
import { env } from "../config/env.js";
import { AppError } from "../middleware/error.js";
import { resetStarterData } from "../services/starterData.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { currentUser } from "../utils/currentUser.js";

export const seedRouter = Router();

seedRouter.post(
  "/reset",
  asyncHandler(async (_req, res) => {
    if (env.nodeEnv === "production" && !env.allowSeed) {
      throw new AppError("Seed reset is disabled in production.", 403);
    }

    const user = currentUser(res);
    await resetStarterData(user);

    res.json({ data: { ok: true } });
  })
);
