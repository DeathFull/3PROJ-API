import {MessageModel} from "../models/MessageModel.js";

class MessageRepository{
  async getMessages() {
    return await MessageModel.find({}, {
      senderId: true,
      receiverId: true,
      groupId: true,
      message: true,
    });
  }

  async getMessageById(id) {
    return await MessageModel.findById(id);
  }

  async createMessage(payload) {
    return await MessageModel.create(payload);
  }

  async updateMessage(id, payload) {
    return await MessageModel.findOneAndUpdate({_id: id}, payload);
  }

  async deleteMessage(id) {
    return await MessageModel.deleteOne(id);
  }
}

export default new MessageRepository();