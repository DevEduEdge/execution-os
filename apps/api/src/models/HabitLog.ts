import mongoose, { Schema, model, type HydratedDocument, type Model, type Types } from "mongoose";

export interface HabitLogAttrs {
  userId: Types.ObjectId;
  habitId: Types.ObjectId;
  date: string;
  done: boolean;
}

const habitLogSchema = new Schema<HabitLogAttrs>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    habitId: { type: Schema.Types.ObjectId, ref: "Habit", required: true, index: true },
    date: { type: String, required: true },
    done: { type: Boolean, default: false }
  },
  { timestamps: true }
);

habitLogSchema.index({ userId: 1, habitId: 1, date: 1 }, { unique: true });

export type HabitLogDocument = HydratedDocument<HabitLogAttrs> & { _id: Types.ObjectId };
export const HabitLog =
  (mongoose.models.HabitLog as Model<HabitLogAttrs>) || model<HabitLogAttrs>("HabitLog", habitLogSchema);
