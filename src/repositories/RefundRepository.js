import {RefundModel} from "../models/RefundModel.js";

class RefundRepository {
  async getRefunds() {
    return RefundModel.find({}, {refunderId: true, percentage: true, isRefunded: true});
  }

  async getRefundById(id) {
    return RefundModel.findById(id);
  }

  getRefundsByUser(idUser) {
    return RefundModel.find({refunderId: idUser}).populate("refunderId");
  }

  async createRefund(payload) {
    return RefundModel.create(payload);
  }

  async updateRefund(id, payload) {
    return RefundModel.findOneAndUpdate({_id: id}, payload);
  }

  async deleteRefund(id) {
    return RefundModel.deleteOne(id);
  }
}

export default new RefundRepository();