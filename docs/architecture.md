# Execution OS Architecture

## Product Principle

Execution OS is built for users who need fewer choices and clearer action. The app avoids clutter by limiting primary navigation to three choices: Today, Money, and Growth.

## Runtime Architecture

```text
Next.js Web App
  |
  | Firebase Google sign-in
  | Bearer Firebase ID token
  v
Express API
  |
  | Firebase Admin token verification
  | Mongoose models
  v
MongoDB
```

## App Modules

- Daily Command Center: returns the top three auto-prioritized tasks.
- Anti-Procrastination: task skip penalties, points, streaks, progress.
- Money Control: expense capture and monthly burn-rate warning.
- Habit Builder: maximum five active habits, binary daily tracking.
- Decision Engine: returns one decision and one action step.
- Reality Dashboard: honest scoreboard for wasted days, completed tasks, savings, and growth.

## Deployment Shape

- `apps/web` deploys to Vercel as a Next.js project.
- `apps/api` deploys to Vercel as a serverless Express API.
- MongoDB Atlas stores production data.
- Firebase handles Google authentication.
