import {RefundModel} from "../models/RefundModel.js";

class RefundRepository {
  async getRefunds() {
    return RefundModel.find();
  }

  async getRefundById(id) {
    return RefundModel.findById(id);
  }

  async getRefundsByRefunder(idUser) {
    return RefundModel.find({refunderId: idUser}).populate("refunderId");
  }

  async getRefundsByPayer(idUser) {
    return RefundModel.find({payerId: idUser}).populate("payerId");
  }

  async getRefundsByGroup(idGroup) {
    return RefundModel.find({idGroup}).populate("idGroup");
  }

  async getRefundByGroupPayerRefunder(idGroup, idPayer, idRefunder) {
    return RefundModel.findOne({idGroup: idGroup, payerId: idPayer, refunderId: idRefunder});
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