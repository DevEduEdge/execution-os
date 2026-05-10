import mongoose, { Schema, model, type HydratedDocument, type Model, type Types } from "mongoose";

export interface HabitAttrs {
  userId: Types.ObjectId;
  name: string;
  isActive: boolean;
}

const habitSchema = new Schema<HabitAttrs>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    name: { type: String, required: true, trim: true },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

habitSchema.index({ userId: 1, isActive: 1 });

export type HabitDocument = HydratedDocument<HabitAttrs> & { _id: Types.ObjectId };
export const Habit = (mongoose.models.Habit as Model<HabitAttrs>) || model<HabitAttrs>("Habit", habitSchema);
