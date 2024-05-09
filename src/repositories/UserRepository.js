import { UserModel } from "../models/UserModel.js";
import groupRepository from "./GroupRepository.js";

class UserRepository {
  async getUsers() {
    const users = await UserModel.find(
      {},
      {
        firstname: true,
        lastname: true,
        email: true,
      },
    );
    return users;
  }

  async getUserById(id) {
    return await UserModel.findById(id);
  }

  async getUsersByGroup(idGroup) {
    const group = await groupRepository.getGroupById(idGroup);
    const users = [];
    for (const member of group.members) {
      const user = await UserModel.findById(member);
      users.push(user);
    }
    return users;
  }


  async findOrCreateGoogle(newUser) {
    let user = await UserModel.findOne({ googleId: newUser.googleId });
    const {firstname, lastname, email, googleId} = newUser;
    if (!user) {
      user = new UserModel({firstname, lastname, email, googleId});
      await user.save();
    }

    return user;
  }

  async findOrCreateFacebook(newUser) {
    let user = UserModel.findOne({ facebookId: newUser.facebookId });
    const {firstname, lastname, facebookId} = newUser;
    if (!user) {
      user = new UserModel({firstname, lastname, facebookId});
      user.save();
    }

    return user;
  }

  async updateUser(id, payload) {
    const newUser = await UserModel.findOneAndUpdate(
      {
        _id: id,
      },
      payload,
    );

    return newUser;
  }

  async deleteUser(id) {
    await UserModel.deleteOne({ _id: id });
  }

  async createUser(payload) {
    const newUser = new UserModel(payload);
    await newUser.save();
    return newUser;
  }
}

export default new UserRepository();
