# Database Schema

## users

- `uid`: Firebase user id, unique
- `email`
- `displayName`
- `photoURL`
- `monthlyBudget`
- `points`
- `currentStreak`
- `longestStreak`
- `daysWasted`
- `tasksCompleted`
- `totalSaved`
- `growthScore`
- `lastActiveDate`

## tasks

- `userId`
- `title`
- `category`: Money, Career Growth, Health
- `impact`: 1-5
- `effort`: 1-5
- `points`
- `status`: pending, in_progress, completed, skipped
- `dueDate`
- `completedAt`
- `skippedAt`

## expenses

- `userId`
- `amount`
- `note`
- `category`
- `spentAt`

## habits

- `userId`
- `name`
- `isActive`

## habitLogs

- `userId`
- `habitId`
- `date`
- `done`

Unique index: one log per habit per day.

## decisions

- `userId`
- `input`
- `decision`
- `actionStep`

## dailyStats

- `userId`
- `date`
- `pointsDelta`
- `tasksCompleted`
- `tasksSkipped`
- `habitsDone`
- `moneySpent`
