import {UserModel} from "../models/UserModel.js";
import groupRepository from "./GroupRepository.js";


class UserRepository {
  async getUsers() {
    const users = await UserModel.find(
      {},
      {
        firstname: true,
        lastname: true,
        email: true,
      }
    );
    return users
  }

  async getUserById(id) {
    return await UserModel.findById(id);
  }

  async getUsersByGroup(idGroup){
    const group =await  groupRepository.getGroupById(idGroup);
    const users = [];
    for (const member of group.members){
      const user = await UserModel.findById(member);
      users.push(user);
    }
    return users;
  }

  async updateUser(id, payload) {
    const newUser = await UserModel.findOneAndUpdate(
      {
        _id: id,
      },
      payload
    );

    return newUser
  }

  async deleteUser(id) {
    await UserModel.deleteOne({_id: id});
  }
}

export default new UserRepository();
