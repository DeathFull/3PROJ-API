import {DebtModel} from "../models/DebtModel.js";


class DebtRepository {

  async getDebts() {
    return DebtModel.find();
  }

  async getDebtsByGroup(idGroup) {
    return DebtModel.find({idGroup: idGroup}).populate("idGroup");
  }

  async getDebtByRefunder(refunderId) {
    return DebtModel.find({refunderId: refunderId})
  }

  async getDebtByReceiver(receiverId) {
    return DebtModel.find({receiverId: receiverId})
  }

  async createDebt(payload) {
    return DebtModel.create(payload);
  }

  async updateDebt(idGroup, refunderId, receiverId, payload) {
    return DebtModel.findOneAndUpdate({
        idGroup: idGroup,
        refunderId: refunderId,
        receiverId: receiverId
      },
      {$inc: {amount: payload.amount}},
      {new: true, upsert: true})
  }

  async debtBalancing(idGroup) {
    const debts = await DebtModel.find({idGroup: idGroup});
    for (let i = 0; i < debts.length; i++) {
      const debt1 = debts[i];

      const matchingDebt = debts.filter(debt2 => debt2.receiverId.equals(debt1.refunderId) && debt2.refunderId.equals(debt1.receiverId));
      if (matchingDebt.length > 0) {
        const v = Math.min(debt1.amount, matchingDebt[0].amount);
        debt1.amount -= v;
        matchingDebt[0].amount -= v;
        await debt1.save();
        await matchingDebt[0].save();
      }
    }
  }
}


export default new DebtRepository();