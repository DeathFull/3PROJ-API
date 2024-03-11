import {BalanceModel} from "../models/BalanceModel.js";

class BalanceRepository {
  async getBalances() {
    return await BalanceModel.find({}, {idUser: true, idGroup: true, balance: true});
  }

  async getBalanceById(id) {
    return await BalanceModel.findById(id);
  }

  getBalancesByUser(idUser) {
    return BalanceModel.find({idUser: idUser});
  }

  async createBalance(payload) {
    return await BalanceModel.create(payload);
  }

  async updateBalance(id, payload) {
    return await BalanceModel.findOneAndUpdate({_id: id}, payload);
  }

  async deleteBalance(id){
    return await BalanceModel.deleteOne(id);
  }
}

export default new BalanceRepository();