import {ExpenseModel} from "../models/ExpenseModel.js";

class ExpenseRepository {
  async getExpenses() {
    return ExpenseModel.find({}, {
      idGroup: true,
      idUser: true,
      name: true,
      description: true,
      amount: true,
      date: true,
      justification: true,
      category: true,
      refunder: true,
    });
  }

  async getExpenseById(id) {
    return ExpenseModel.findById(id);
  }

  async getExpensesByUser(idUser) {
    return ExpenseModel.find({idUser: idUser}).sort({date: -1});
  }

  async getExpensesByGroup(idGroup) {
    return ExpenseModel.find({idGroup: idGroup}).populate("idUser").populate("idGroup");
  }

  async getExpensesByCategory(category) {
    return ExpenseModel.find({category: category}).sort({date: -1});
  }

  async createExpense(payload) {
    return ExpenseModel.create(payload);
  }

  async updateExpense(id, payload) {
    return ExpenseModel.findOneAndUpdate({_id: id}, payload);
  }

  async deleteExpense(idGroup, idUser) {
    return ExpenseModel.findOneAndDelete({idGroup: idGroup, idUser: idUser});
  }
}

export default new ExpenseRepository();