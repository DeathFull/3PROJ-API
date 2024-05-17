import {BalanceModel} from "../models/BalanceModel.js";

class BalanceRepository {
  async getBalances() {
    return BalanceModel.find({}, {idUser: true, idGroup: true, balance: true}).sort({idUser: 1});
  }

  async getBalanceById(id) {
    return BalanceModel.findById(id);
  }

  async getBalancesByUser(idUser) {
    return BalanceModel.find({idUser: idUser});
  }

  async getBalancesByGroup(idGroup) {
    return BalanceModel.find({idGroup: idGroup}).populate("idUser");
  }

  async getBalanceByUserAndGroup(idUser, idGroup) {
    return BalanceModel.findOne({idUser: idUser, idGroup: idGroup});
  }

  async createBalance(payload) {
    return BalanceModel.create(payload);
  }

  async updateBalance(id, payload) {
    return BalanceModel.findOneAndUpdate({_id: id}, payload);
  }

  async updateBalanceByUserAndGroup(idUser, idGroup, amount) {
    return BalanceModel.findOneAndUpdate({
        idUser: idUser,
        idGroup: idGroup
      },
      {$inc: {balance: amount}},
      {new: true, upsert: true});
  }

  async deleteBalance(idGroup, idUser) {
    return BalanceModel.findOneAndDelete({idGroup: idGroup, idUser: idUser});
  }
}

export default new BalanceRepository();