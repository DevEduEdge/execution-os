import { Router } from "express";
import { z } from "zod";
import { DailyStat, Expense } from "../models/index.js";
import { AppError } from "../middleware/error.js";
import { getMoneySummary } from "../services/money.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { currentUser } from "../utils/currentUser.js";
import { dateKey } from "../utils/date.js";
import { toExpenseDto } from "../utils/mappers.js";

export const expenseRouter = Router();

const createExpenseSchema = z.object({
  amount: z.number().positive().max(100000),
  note: z.string().trim().max(80).default(""),
  category: z.string().trim().min(2).max(30).default("Food"),
  kind: z.enum(["expense", "income"]).default("expense")
});

const updateExpenseSchema = createExpenseSchema.partial();

expenseRouter.get(
  "/summary",
  asyncHandler(async (_req, res) => {
    const user = currentUser(res);
    const summary = await getMoneySummary(user);
    res.json({ data: summary });
  })
);

expenseRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    const input = createExpenseSchema.parse(req.body);
    const user = currentUser(res);
    const expense = await Expense.create({
      userId: user._id,
      amount: input.amount,
      note: input.note,
      category: input.category,
      kind: input.kind,
      spentAt: new Date()
    });

    await DailyStat.updateOne(
      { userId: user._id, date: dateKey() },
      { $inc: { moneySpent: input.kind === "expense" ? input.amount : 0 } },
      { upsert: true }
    );

    res.status(201).json({ data: toExpenseDto(expense) });
  })
);

expenseRouter.put(
  "/:id",
  asyncHandler(async (req, res) => {
    const { id } = z.object({ id: z.string() }).parse(req.params);
    const input = updateExpenseSchema.parse(req.body);
    const user = currentUser(res);
    const expense = await Expense.findOne({ _id: id, userId: user._id });

    if (!expense) throw new AppError("Money entry not found.", 404);

    if (input.amount !== undefined) expense.amount = input.amount;
    if (input.note !== undefined) expense.note = input.note;
    if (input.category !== undefined) expense.category = input.category;
    if (input.kind !== undefined) expense.kind = input.kind;

    await expense.save();
    res.json({ data: toExpenseDto(expense) });
  })
);

expenseRouter.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const { id } = z.object({ id: z.string() }).parse(req.params);
    const user = currentUser(res);
    const expense = await Expense.findOne({ _id: id, userId: user._id });

    if (!expense) throw new AppError("Money entry not found.", 404);

    await expense.deleteOne();
    res.json({ data: { ok: true } });
  })
);
