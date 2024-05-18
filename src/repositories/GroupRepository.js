import {GroupModel} from "../models/GroupModel.js";
import {RefundModel} from "../models/RefundModel.js";

class GroupRepository {
  async getGroups() {
    return GroupModel.find({}, {
      name: true,
      members: true,
      description: true
    });
  }

  async getGroupById(id) {
    return GroupModel.findById(id);
  }

  async getGroupsByUser(idUser) {
    return GroupModel.find({
      members: {
        $in: [idUser]
      }
    }).populate("members");
  }

  async createGroup(payload) {
    return GroupModel.create(payload);
  }

  async updateGroup(id, payload) {
    return GroupModel.findOneAndUpdate(
      {
        _id: id
      },
      payload
    );
  }

  async addUserToGroup(id, idUser) {
    return GroupModel.findOneAndUpdate(
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
  }


  async removeUserFromGroup(id, idUser) {
    const userWithRefundNotPaid = await RefundModel.find({refunder: idUser, isRefunded: false});
    if (userWithRefundNotPaid.length > 0) {
      return "User still has refund to pay";
    }
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