import mongoose, { Types } from "mongoose";

const BalanceSchema = new mongoose.Schema({
  idUser: { type: Types.ObjectId, require: true, ref: "User" },
  idGroup: {
    type: Types.ObjectId,
    require: true,
    ref: "Group",
  },
  balance: { type: Number, require: true },
});

export const BalanceModel = mongoose.model("Balance", BalanceSchema);
