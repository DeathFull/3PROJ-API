import {ExpenseModel} from "../models/ExpenseModel.js";

class ExpenseRepository {
  async getExpenses() {
    return await ExpenseModel.find({}, {
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
    return await ExpenseModel.findById(id);
  }

  async getExpensesByUser(idUser) {
    return await ExpenseModel.find({idUser: idUser}).sort({date: -1});
  }

  async getExpensesByGroup(idGroup) {
    // const sortOptions = [[sortBy, Number(order)]];
    return await ExpenseModel.find({idGroup: idGroup});
  }

  async getExpensesByCategory(category) {
    return await ExpenseModel.find({category: category}).sort({date: -1});
  }

  async createExpense(payload) {
    return await ExpenseModel.create(payload);
  }

  async updateExpense(id, payload) {
    return await ExpenseModel.findOneAndUpdate({_id: id}, payload);
  }

  async deleteExpense(id) {
    return await ExpenseModel.deleteOne(id);
  }
}

export default new ExpenseRepository();