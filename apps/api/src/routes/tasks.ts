import { Router } from "express";
import { z } from "zod";
import { Task } from "../models/index.js";
import { AppError } from "../middleware/error.js";
import { completeTask, reverseTaskImpactBeforeDelete, skipTask, undoCompletedTask } from "../services/progress.js";
import { getTopTasksForToday } from "../services/taskPrioritizer.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { currentUser } from "../utils/currentUser.js";
import { toTaskDto } from "../utils/mappers.js";

export const taskRouter = Router();

const createTaskSchema = z.object({
  title: z.string().trim().min(3).max(90),
  category: z.enum(["Money", "Career Growth", "Health"]),
  impact: z.number().int().min(1).max(5).default(4),
  effort: z.number().int().min(1).max(5).default(2)
});

taskRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    const input = createTaskSchema.parse(req.body);
    const user = currentUser(res);
    const dueDate = new Date();

    const task = await Task.create({
      userId: user._id,
      title: input.title,
      category: input.category,
      impact: input.impact,
      effort: input.effort,
      points: Math.max(8, input.impact * 5 - input.effort * 2),
      status: "pending",
      dueDate
    });

    res.status(201).json({ data: toTaskDto(task, 1) });
  })
);

taskRouter.get(
  "/today",
  asyncHandler(async (_req, res) => {
    const user = currentUser(res);
    const rankedTasks = await getTopTasksForToday(user);
    res.json({
      data: rankedTasks.map(({ task, priorityRank }) => toTaskDto(task, priorityRank))
    });
  })
);

taskRouter.get(
  "/history",
  asyncHandler(async (_req, res) => {
    const user = currentUser(res);
    const tasks = await Task.find({
      userId: user._id,
      status: { $in: ["completed", "skipped"] }
    })
      .sort({ completedAt: -1, skippedAt: -1, updatedAt: -1 })
      .limit(30);

    res.json({
      data: tasks.map((task, index) => toTaskDto(task, index + 1))
    });
  })
);

taskRouter.post(
  "/:id/focus",
  asyncHandler(async (req, res) => {
    const { id } = z.object({ id: z.string() }).parse(req.params);
    const user = currentUser(res);
    const task = await Task.findOne({ _id: id, userId: user._id });

    if (!task) throw new AppError("Task not found.", 404);
    if (task.status === "pending") {
      task.status = "in_progress";
      await task.save();
    }

    res.json({ data: toTaskDto(task, 1) });
  })
);

taskRouter.post(
  "/:id/complete",
  asyncHandler(async (req, res) => {
    const { id } = z.object({ id: z.string() }).parse(req.params);
    const user = currentUser(res);
    const task = await Task.findOne({ _id: id, userId: user._id });

    if (!task) throw new AppError("Task not found.", 404);
    await completeTask(user, task);

    res.json({ data: toTaskDto(task, 1) });
  })
);

taskRouter.post(
  "/:id/skip",
  asyncHandler(async (req, res) => {
    const { id } = z.object({ id: z.string() }).parse(req.params);
    const user = currentUser(res);
    const task = await Task.findOne({ _id: id, userId: user._id });

    if (!task) throw new AppError("Task not found.", 404);
    await skipTask(user, task);

    res.json({ data: toTaskDto(task, 1) });
  })
);

taskRouter.post(
  "/:id/undo",
  asyncHandler(async (req, res) => {
    const { id } = z.object({ id: z.string() }).parse(req.params);
    const user = currentUser(res);
    const task = await Task.findOne({ _id: id, userId: user._id });

    if (!task) throw new AppError("Task not found.", 404);
    await undoCompletedTask(user, task);

    res.json({ data: toTaskDto(task, 1) });
  })
);

taskRouter.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const { id } = z.object({ id: z.string() }).parse(req.params);
    const user = currentUser(res);
    const task = await Task.findOne({ _id: id, userId: user._id });

    if (!task) throw new AppError("Task not found.", 404);
    await reverseTaskImpactBeforeDelete(user, task);
    await task.deleteOne();

    res.json({ data: { ok: true } });
  })
);
