import { TASK_CATEGORIES, type TaskCategory, type TaskStatus } from "../contracts.js";
import mongoose, { Schema, model, type HydratedDocument, type Model, type Types } from "mongoose";

export interface TaskAttrs {
  userId: Types.ObjectId;
  title: string;
  category: TaskCategory;
  impact: number;
  effort: number;
  points: number;
  status: TaskStatus;
  dueDate: Date;
  completedAt?: Date;
  skippedAt?: Date;
}

const taskSchema = new Schema<TaskAttrs>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true, trim: true },
    category: { type: String, enum: TASK_CATEGORIES, required: true },
    impact: { type: Number, min: 1, max: 5, required: true },
    effort: { type: Number, min: 1, max: 5, required: true },
    points: { type: Number, default: 10 },
    status: {
      type: String,
      enum: ["pending", "in_progress", "completed", "skipped"],
      default: "pending",
      index: true
    },
    dueDate: { type: Date, required: true, index: true },
    completedAt: { type: Date },
    skippedAt: { type: Date }
  },
  { timestamps: true }
);

taskSchema.index({ userId: 1, status: 1, dueDate: 1 });

export type TaskDocument = HydratedDocument<TaskAttrs> & { _id: Types.ObjectId };
export const Task = (mongoose.models.Task as Model<TaskAttrs>) || model<TaskAttrs>("Task", taskSchema);
