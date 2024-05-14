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
      },
    );
    return users;
  }

  async getUserById(id) {
    return await UserModel.findById(id);
  }

  async getUserByEmail(email) {
    return UserModel.findOne({email: email});
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
    const {firstname, lastname, googleId, email, avatar} = newUser;
    let user = await UserModel.findOne({
      $or: [
        {email: email},
        {googleId: googleId}
      ]
    });

    if (!user) {
      user = new UserModel({firstname, lastname, email, googleId, avatar});
    } else if (user.email === email && !user.googleId) {
      user.googleId = googleId;
    }
    await user.save();

    return user;
  }

  async findOrCreateFacebook(newUser) {
    const {firstname, lastname, facebookId, email} = newUser;
    let user = await UserModel.findOne({
      $or: [
        {email: email},
        {facebookId: facebookId}
      ]
    });

    if (!user) {
      user = new UserModel({firstname, lastname, email, facebookId});
    } else if (user.email === email && !user.facebookId) {
      user.facebookId = facebookId;
    }
    await user.save();

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
    await UserModel.deleteOne({_id: id});
  }

  async createUser(payload) {
    const newUser = new UserModel(payload);
    await newUser.save();
    return newUser;
  }
}

export default new UserRepository();
