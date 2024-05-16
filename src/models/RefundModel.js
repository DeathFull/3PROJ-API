import mongoose, { Types } from "mongoose";

const refundSchema = new mongoose.Schema({
  refunderId: { type: Types.ObjectId, ref: "User", required: true },
  percentage: { type: Number, required: true },
  isRefunded: { type: Boolean, default: false },
  expenseId: { type: Types.ObjectId, require: true, ref: "Expense" },
});

export const RefundModel = mongoose.model("Refund", refundSchema);
