import mongoose, { Schema, model, type HydratedDocument, type Model, type Types } from "mongoose";

export interface DecisionAttrs {
  userId: Types.ObjectId;
  input: string;
  decision: string;
  actionStep: string;
}

const decisionSchema = new Schema<DecisionAttrs>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    input: { type: String, required: true, trim: true },
    decision: { type: String, required: true },
    actionStep: { type: String, required: true }
  },
  { timestamps: true }
);

decisionSchema.index({ userId: 1, createdAt: -1 });

export type DecisionDocument = HydratedDocument<DecisionAttrs> & { _id: Types.ObjectId };
export const Decision = (mongoose.models.Decision as Model<DecisionAttrs>) || model<DecisionAttrs>("Decision", decisionSchema);
