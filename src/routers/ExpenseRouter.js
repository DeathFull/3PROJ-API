import express from "express";
import expenseRepository from "../repositories/ExpenseRepository.js";

const expenseRouter = express.Router();

expenseRouter.get("/", async (req, res) => {
  const expenses = await expenseRepository.getExpenses();
  return res.status(200).json(expenses);
});

expenseRouter.get("/:id", async (req, res) => {
  const {id} = req.params;
  const expense = await expenseRepository.getExpenseById(id);
  if (!expense) {
    return res.status(404).send("Expense not found");
  }
  return res.status(200).json(expense);
});

expenseRouter.get("/user/:idUser", async (req, res) => {
  const {idUser} = req.params;
  const {sortBy, orderBy} = req.query;
  const expenses = await expenseRepository.getExpensesByUser(idUser, sortBy, orderBy);
  if (!expenses) {
    return res.status(404).send("Expenses not found");
  }
  return res.status(200).json(expenses);
});

expenseRouter.get("/group/:idGroup", async (req, res) => {
  const {idGroup} = req.params;
  const expenses = await expenseRepository.getExpensesByGroup(idGroup);
  if (!expenses) {
    return res.status(404).send("Expenses not found");
  }
  return res.status(200).json(expenses);
});

expenseRouter.get("/category/:category", async (req, res) => {
  const {category} = req.params;
  const expenses = await expenseRepository.getExpensesByCategory(category);
  if (!expenses) {
    return res.status(404).send("Expenses not found");
  }
  return res.status(200).json(expenses);
});

expenseRouter.post("/", async (req, res) => {
  try {
    const expense = await expenseRepository.createExpense(req.body);
    return res.status(201).json(expense);
  } catch (e) {
    return res.status(400).send(e);
  }
});

expenseRouter.put("/:id", async (req, res) => {
  try {
    const {id} = req.params;
    const expenseToUpdate = await expenseRepository.getExpenseById(id);
    if (!expenseToUpdate) {
      return res.status(404).send("Expense not found");
    }
    await expenseRepository.updateExpense(id, req.body);
    return res.status(200).send("Expense updated");
  } catch (e) {
    return res.status(400).send(e);
  }
});

expenseRouter.delete("/:id", async (req, res) => {
  const {id} = req.params;
  await expenseRepository.deleteExpense(id);
  return res.status(204).send("Expense deleted");
});

export default expenseRouter;

