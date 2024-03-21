import mongoose, { Types } from "mongoose";

const expenseSchema = new mongoose.Schema({
  idGroup: { type: Types.ObjectId, require: true, ref: "Group" },
  idUser: { type: Types.ObjectId, require: true, ref: "User" },
  name: { type: String, require: true },
  description: { type: String, require: true },
  amount: { type: Number, require: true },
  date: { type: Date, require: true },
  justification: { type: Buffer, require: true },
  category: { type: String, require: true },
  refunder: { type: Types.ObjectId, require: true, ref: "Refund" },
});

export const ExpenseModel = mongoose.model("Expense", expenseSchema);
