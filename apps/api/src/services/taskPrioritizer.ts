import type { TaskCategory } from "../contracts.js";
import type { TaskDocument, UserDocument } from "../models/index.js";
import { Task } from "../models/index.js";
import { endOfToday } from "../utils/date.js";

const categoryWeight: Record<TaskCategory, number> = {
  Money: 3,
  "Career Growth": 2,
  Health: 1
};

function priorityScore(task: TaskDocument) {
  const duePressure = Math.max(0, 6 - Math.ceil((task.dueDate.getTime() - Date.now()) / 86400000));
  return task.impact * 4 - task.effort + categoryWeight[task.category] + duePressure;
}

export async function getTopTasksForToday(user: UserDocument) {
  const tasks = await Task.find({
    userId: user._id,
    status: { $in: ["pending", "in_progress"] },
    dueDate: { $lte: endOfToday() }
  }).sort({ dueDate: 1 });

  return tasks
    .sort((a, b) => priorityScore(b) - priorityScore(a))
    .slice(0, 3)
    .map((task, index) => ({ task, priorityRank: index + 1 }));
}
