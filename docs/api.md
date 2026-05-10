# API Routes

All protected routes require:

```text
Authorization: Bearer <firebase_id_token>
```

For local development only, `DEMO_AUTH=true` allows requests without a token.

## Health

- `GET /health`

## Auth

- `POST /api/auth/session`
  - Creates or updates the current user.
  - Seeds starter tasks, habits, and sample money data for first use.

## Tasks

- `POST /api/tasks`
  - Body: `{ "title": "Cut one spending leak", "category": "Money", "impact": 4, "effort": 2 }`
  - Creates a task for today.
- `GET /api/tasks/today`
  - Returns exactly three daily tasks when available.
- `GET /api/tasks/history`
  - Returns recent completed and skipped tasks with timestamps.
- `POST /api/tasks/:id/focus`
  - Marks a task as in progress.
- `POST /api/tasks/:id/complete`
  - Completes a task, adds points, updates streak.
- `POST /api/tasks/:id/skip`
  - Skips a task, subtracts points, increments wasted-day pressure.
- `POST /api/tasks/:id/undo`
  - Moves a completed task back to pending and reverses its points/task count.
- `DELETE /api/tasks/:id`
  - Deletes a task and reverses completed/skipped score impact when needed.

## Expenses

- `GET /api/expenses/summary`
  - Returns daily spending, monthly spending, burn rate, budget, warning, and recent expenses.
- `POST /api/expenses`
  - Body: `{ "amount": 12.5, "note": "Lunch", "category": "Food", "kind": "expense" }`
- `PUT /api/expenses/:id`
  - Edits amount, note, category, or kind.
- `DELETE /api/expenses/:id`
  - Deletes a money entry.

## Habits

- `GET /api/habits/week`
  - Returns up to five habits and weekly summary.
- `POST /api/habits`
  - Body: `{ "name": "Walk 20 minutes" }`
- `POST /api/habits/:id/log`
  - Body: `{ "done": true }`

## Decisions

- `POST /api/decisions`
  - Body: `{ "input": "I am confused about..." }`
  - Returns one decision and one action step.

## Reality

- `GET /api/reality`

## Seed

- `POST /api/seed/reset`
  - Enabled only outside production or when `ALLOW_SEED=true`.
