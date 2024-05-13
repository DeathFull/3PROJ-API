import mongoose from "mongoose";

const GroupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  members: { type: Array, required: true },
  description: { type: String },
});

export const GroupModel = mongoose.model("Group", GroupSchema);
