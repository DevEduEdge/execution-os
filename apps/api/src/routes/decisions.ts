import { Router } from "express";
import { z } from "zod";
import { Decision } from "../models/index.js";
import { AppError } from "../middleware/error.js";
import { decide } from "../services/decisionEngine.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { currentUser } from "../utils/currentUser.js";
import { toDecisionDto } from "../utils/mappers.js";

export const decisionRouter = Router();

decisionRouter.get(
  "/history",
  asyncHandler(async (_req, res) => {
    const user = currentUser(res);
    const decisions = await Decision.find({ userId: user._id }).sort({ createdAt: -1 }).limit(20);

    res.json({ data: decisions.map(toDecisionDto) });
  })
);

decisionRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    const input = z.object({ input: z.string().trim().min(5).max(800) }).parse(req.body);
    const user = currentUser(res);
    const result = decide(input.input);
    const decision = await Decision.create({
      userId: user._id,
      input: input.input,
      decision: result.decision,
      actionStep: result.actionStep
    });

    res.status(201).json({ data: toDecisionDto(decision) });
  })
);

decisionRouter.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const { id } = z.object({ id: z.string() }).parse(req.params);
    const user = currentUser(res);
    const decision = await Decision.findOne({ _id: id, userId: user._id });

    if (!decision) throw new AppError("Decision not found.", 404);

    await decision.deleteOne();
    res.json({ data: { ok: true } });
  })
);
