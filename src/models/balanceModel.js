import mongoose, {Mongoose} from "mongoose";

const BalanceSchema = new mongoose.Schema({
  idUser: {type: Mongoose.Schema.Types.ObjectId, require: true, ref: "User"},
  idGroup: {type: Mongoose.SChema.Type.ObjectId, require: true, ref: "Group"},
  balance: {type: Number, require: true}
});

export const BalanceModel = mongoose.model("Balance", BalanceSchema)