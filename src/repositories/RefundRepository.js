import {RefundModel} from "../models/RefundModel.js";

class RefundRepository {
  async getRefunds() {
    return await RefundModel.find({}, {refunderId: true, percentage: true, isRefunded: true});
  }

  async getRefundById(id) {
    return await RefundModel.findById(id);
  }

  getRefundsByUser(idUser) {
    return RefundModel.find({refunderId: idUser}).sort({percentage: -1});
  }

  async createRefund(payload) {
    return await RefundModel.create(payload);
  }

  async updateRefund(id, payload) {
    return await RefundModel.findOneAndUpdate({_id: id}, payload);
  }

  async

  async deleteRefund(id) {
    return await RefundModel.deleteOne(id);
  }
}

export default new RefundRepository();