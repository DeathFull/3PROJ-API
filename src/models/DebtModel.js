import mongoose, { Types } from "mongoose";

const debtSchema = new mongoose.Schema({
  receiverId: { type: Types.ObjectId, ref: "User", required: true },
  refunderId: { type: Types.ObjectId, ref: "User", required: true },
  idGroup: { type: Types.ObjectId, ref: "Group", required: true },
  amount: { type: Number, required: true },
});

export const DebtModel = mongoose.model("Debt", debtSchema);