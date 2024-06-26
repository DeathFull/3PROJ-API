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
    return RefundModel.find({idGroup}).populate("idGroup").populate("payerId").populate("refunderId");
  }

  async getRefundByGroupPayerRefunder(idGroup, idPayer, idRefunder) {
    return RefundModel.findOne({idGroup: idGroup, payerId: idPayer, refunderId: idRefunder});
  }

  async createRefund(payload) {
    return RefundModel.create(payload);
  }

  async updateRefund(idGroup, idPayer, idRefunder, payload) {
    const roundedAmount = Math.round(payload.amount * 100) / 100;
    return RefundModel.findOneAndUpdate({
        payerId: idPayer,
        idGroup: idGroup,
        refunderId: idRefunder
      },
      {$inc: {amount: roundedAmount}},
      {new: true, upsert: true}).populate("payerId").populate("refunderId").populate("idGroup").exec();
  }

  async deleteRefund(id) {
    return RefundModel.deleteOne(id);
  }
}

export default new RefundRepository();