import mongoose, { Types } from "mongoose";

const refundSchema = new mongoose.Schema({
  payerId: { type: Types.ObjectId, ref: "User", required: true },
  refunderId: { type: Types.ObjectId, ref: "User", required: true },
  idGroup: { type: Types.ObjectId, ref: "Group", required: true },
  amount: { type: Number, required: true },
  isRefunded: { type: Boolean, default: false },
});

export const RefundModel = mongoose.model("Refund", refundSchema);
