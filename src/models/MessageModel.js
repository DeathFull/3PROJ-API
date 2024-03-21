import mongoose, {Types} from "mongoose";

const messageSchema = new mongoose.Schema({
  senderId: {type: Types.ObjectId, ref: "User", required: true},
  receiverId: {type: Types.ObjectId, ref: "User", required: true},
  groupId: {type: Types.ObjectId, ref: "Group", required: true},
  message: {type: String, required: true},
});

export const MessageModel = mongoose.model("Message", messageSchema);