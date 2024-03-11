import mongoose, {Types} from "mongoose";

const refundSchema = new mongoose.Schema({
  refunderId: {type: Types.ObjectId, ref: "User", required: true},
  percentage: {type: Number, required: true},
  isRefunded: {type: Boolean, default: false},
});

export const RefundModel = mongoose.model("Refund", refundSchema);