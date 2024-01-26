import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";
import {string} from "zod";

const GroupSchema = new mongoose.Schema({
  name: {type: String, required: true},
  members: {type: Array, required: true}
});

export const GroupModel = mongoose.model("Group", GroupSchema);