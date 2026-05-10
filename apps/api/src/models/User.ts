import mongoose, { Schema, model, type HydratedDocument, type Model, type Types } from "mongoose";

export interface UserAttrs {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  monthlyBudget: number;
  points: number;
  currentStreak: number;
  longestStreak: number;
  daysWasted: number;
  tasksCompleted: number;
  totalSaved: number;
  growthScore: number;
  lastActiveDate?: Date;
  hasSeeded: boolean;
}

const userSchema = new Schema<UserAttrs>(
  {
    uid: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true },
    displayName: { type: String, required: true },
    photoURL: { type: String },
    monthlyBudget: { type: Number, default: 1200 },
    points: { type: Number, default: 0 },
    currentStreak: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
    daysWasted: { type: Number, default: 0 },
    tasksCompleted: { type: Number, default: 0 },
    totalSaved: { type: Number, default: 0 },
    growthScore: { type: Number, default: 0 },
    lastActiveDate: { type: Date },
    hasSeeded: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export type UserDocument = HydratedDocument<UserAttrs> & { _id: Types.ObjectId };
export const User = (mongoose.models.User as Model<UserAttrs>) || model<UserAttrs>("User", userSchema);
