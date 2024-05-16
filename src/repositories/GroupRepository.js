import {GroupModel} from "../models/GroupModel.js";

class GroupRepository {
  async getGroups() {
    const groups = await GroupModel.find({}, {
      name: true,
      members: true,
      description: true
    });
    return groups;
  }

  async getGroupById(id) {
    return await GroupModel.findById(id)
  }

  async getGroupsByUser(idUser) {
    const groups = await GroupModel.find({
      members: {
        $in: [idUser]
      }
    });
    return groups;
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

  async addUserToGroup(id, idUser) {
    const groupWithNewMember = await GroupModel.findOneAndUpdate(
      {
        _id: id
      },
      {
        $push: {
          members: idUser
        }
      },
      {
        new: true
      }
    );
    return groupWithNewMember;
  }


  async removeUserFromGroup(id, idUser) {
    const groupWithoutMember = await GroupModel.findOneAndUpdate(
      {
        _id: id
      },
      {
        $pull: {
          members: idUser

        }
      },
      {
        new: true
      }
    );
    if (groupWithoutMember.members.length === 0) {
      await GroupModel.deleteOne({
        _id: id
      });
    }
    return groupWithoutMember;
  }

}

export default new GroupRepository();