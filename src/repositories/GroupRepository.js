import {GroupModel} from "../models/GroupModel.js";

class GroupRepository {
  async getGroups() {
    const groups = await GroupModel.find({}, {
      name: true,
      members: true
    });
    return groups;
  }

  async getGroupById(id) {
    return await GroupModel.findById(id)
  }

  async createGroup(payload) {
    return await GroupModel.create(payload);
  }

  async updateGroup(id, payload) {
    const newGroup = await GroupModel.findOneAndUpdate(
      {
        _id: id
      },
      payload
    );

    return newGroup;
  }

  async deleteGroup(id) {
    return await GroupModel.deleteOne(id);
  }
}

export default new GroupRepository();