import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { currentUser } from "../utils/currentUser.js";
import { toUserProfile } from "../utils/mappers.js";
import { ensureStarterData } from "../services/starterData.js";

export const authRouter = Router();

authRouter.post(
  "/session",
  asyncHandler(async (_req, res) => {
    const user = currentUser(res);
    await ensureStarterData(user);
    res.json({ data: toUserProfile(user) });
  })
);
