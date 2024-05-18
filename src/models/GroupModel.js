import mongoose, {Types} from "mongoose";

const GroupSchema = new mongoose.Schema({
  name: {type: String, required: true},
  members: [{type: Types.ObjectId, required: true, ref: 'User'}],
  description: {type: String},
});

export const GroupModel = mongoose.model("Group", GroupSchema);
