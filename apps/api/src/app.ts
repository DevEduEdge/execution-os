import cors from "cors";
import express from "express";
import morgan from "morgan";
import { env } from "./config/env.js";
import { requireAuth } from "./middleware/auth.js";
import { errorHandler, notFound } from "./middleware/error.js";
import { authRouter } from "./routes/auth.js";
import { decisionRouter } from "./routes/decisions.js";
import { expenseRouter } from "./routes/expenses.js";
import { habitRouter } from "./routes/habits.js";
import { realityRouter } from "./routes/reality.js";
import { seedRouter } from "./routes/seed.js";
import { taskRouter } from "./routes/tasks.js";

const app = express();

app.use(
  cors({
    origin: env.clientOrigin,
    credentials: true
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(morgan(env.nodeEnv === "production" ? "combined" : "dev"));

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "execution-os-api" });
});

app.use("/api/auth", requireAuth, authRouter);
app.use("/api/tasks", requireAuth, taskRouter);
app.use("/api/expenses", requireAuth, expenseRouter);
app.use("/api/habits", requireAuth, habitRouter);
app.use("/api/decisions", requireAuth, decisionRouter);
app.use("/api/reality", requireAuth, realityRouter);
app.use("/api/seed", requireAuth, seedRouter);

app.use(notFound);
app.use(errorHandler);

export default app;
