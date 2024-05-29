import {DebtModel} from "../models/DebtModel.js";


class DebtRepository {

  async getDebts() {
    return DebtModel.find();
  }

  async getDebtsByGroup(idGroup) {
    return DebtModel.find({idGroup: idGroup}).populate("idGroup").populate("refunderId").populate("receiverId");
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
    const roundedAmount = Math.round(payload.amount * 100) / 100;
    console.log("roundedAmount", roundedAmount)
    return DebtModel.findOneAndUpdate({
        idGroup: idGroup,
        refunderId: receiverId,
        receiverId: refunderId
      },
      {$inc: {amount: roundedAmount}},
      {new: true, upsert: true})
  }

  async debtBalancing(idGroup) {
    const debts = await DebtModel.find({idGroup: idGroup});
    const debtMap = new Map();
    const debtsToSave = new Set();

    debts.forEach(debt => {
      const key = `${debt.receiverId.toString()}-${debt.refunderId.toString()}`;
      if (!debtMap.has(key)) {
        debtMap.set(key, []);
      }
      debtMap.get(key).push(debt);
    });

    debts.forEach(debt => {
      const keys = [
        `${debt.refunderId.toString()}-${debt.receiverId.toString()}`,
        `${debt.receiverId.toString()}-${debt.refunderId.toString()}`
      ];

      const matchingDebts = keys.flatMap(key => debtMap.get(key) || []);
      console.log("matchingDebts", matchingDebts)

      if (matchingDebts.length > 0) {
        const v = Math.min(debt.amount, ...matchingDebts.map(d => d.amount));
        debt.amount -= v;
        matchingDebts.forEach(matchingDebt => {
          matchingDebt.amount -= v;
          debtsToSave.add(matchingDebt);
        });
        debtsToSave.add(debt);
      }
    });

    await Promise.all(Array.from(debtsToSave).map(debt => debt.save()));
  }

  async debtBalancing2(idGroup) {
    const debts = await DebtModel.find({idGroup: idGroup}).exec();

    debts.forEach(debt1 => {
      const matchingDebt = debts.filter(debt2 => debt2.receiverId.equals(debt1.refunderId) && debt2.refunderId.equals(debt1.receiverId));

      if (matchingDebt.length > 0) {
        const v = Math.min(debt1.amount, matchingDebt[0].amount);
        debt1.amount -= v;
        matchingDebt[0].amount -= v;
      }
      console.log("debt1", debt1);
      console.log("matchingDebt", matchingDebt);
    });

    // Sauvegarder les modifications
    for (let i = 0; i < debts.length; i++) {
      await debts[i].save();
    }
  }
}


export default new DebtRepository();
