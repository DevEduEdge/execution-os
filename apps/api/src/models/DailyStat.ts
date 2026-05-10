import mongoose, { Schema, model, type HydratedDocument, type Model, type Types } from "mongoose";

export interface DailyStatAttrs {
  userId: Types.ObjectId;
  date: string;
  pointsDelta: number;
  tasksCompleted: number;
  tasksSkipped: number;
  habitsDone: number;
  moneySpent: number;
}

const dailyStatSchema = new Schema<DailyStatAttrs>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    date: { type: String, required: true },
    pointsDelta: { type: Number, default: 0 },
    tasksCompleted: { type: Number, default: 0 },
    tasksSkipped: { type: Number, default: 0 },
    habitsDone: { type: Number, default: 0 },
    moneySpent: { type: Number, default: 0 }
  },
  { timestamps: true }
);

dailyStatSchema.index({ userId: 1, date: 1 }, { unique: true });

export type DailyStatDocument = HydratedDocument<DailyStatAttrs> & { _id: Types.ObjectId };
export const DailyStat =
  (mongoose.models.DailyStat as Model<DailyStatAttrs>) || model<DailyStatAttrs>("DailyStat", dailyStatSchema);
