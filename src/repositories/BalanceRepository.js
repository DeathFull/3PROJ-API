import {BalanceModel} from "../models/BalanceModel.js";

class BalanceRepository {
  async getBalances() {
    return await BalanceModel.find({}, {idUser: true, idGroup: true, balance: true}).sort({idUser: 1});
  }

  async getBalanceById(id) {
    return await BalanceModel.findById(id);
  }

  async getBalancesByUser(idUser) {
    return await BalanceModel.find({idUser: idUser});
  }

  async getBalancesByGroup(idGroup) {
    return await BalanceModel.find({idGroup: idGroup});
  }

  async getBalanceByUserAndGroup(idUser, idGroup) {
    return await BalanceModel.findOne({idUser: idUser, idGroup: idGroup});
  }

  async createBalance(payload) {
    return await BalanceModel.create(payload);
  }

  async updateBalance(id, payload) {
    return await BalanceModel.findOneAndUpdate({_id: id}, payload);
  }

  async updateBalanceByUserAndGroup(idUser, idGroup, amount) {
    return await BalanceModel.findOneAndUpdate({
        idUser: idUser,
        idGroup: idGroup
      },
      {$inc: {balance: amount}},
      {new: true, upsert: true});
  }

  async deleteBalance(idGroup, idUser) {
    return await BalanceModel.findOneAndDelete({idGroup: idGroup, idUser: idUser});
  }
}

export default new BalanceRepository();