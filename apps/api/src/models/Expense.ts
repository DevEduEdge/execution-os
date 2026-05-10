import mongoose, { Schema, model, type HydratedDocument, type Model, type Types } from "mongoose";

export interface ExpenseAttrs {
  userId: Types.ObjectId;
  amount: number;
  note: string;
  category: string;
  kind: "expense" | "income";
  spentAt: Date;
}

const expenseSchema = new Schema<ExpenseAttrs>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    amount: { type: Number, min: 0.01, required: true },
    note: { type: String, trim: true, default: "" },
    category: { type: String, trim: true, default: "General" },
    kind: { type: String, enum: ["expense", "income"], default: "expense", index: true },
    spentAt: { type: Date, default: Date.now, index: true }
  },
  { timestamps: true }
);

expenseSchema.index({ userId: 1, spentAt: -1 });

export type ExpenseDocument = HydratedDocument<ExpenseAttrs> & { _id: Types.ObjectId };
export const Expense = (mongoose.models.Expense as Model<ExpenseAttrs>) || model<ExpenseAttrs>("Expense", expenseSchema);
