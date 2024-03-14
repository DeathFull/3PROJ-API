import express from "express";
import expenseRepository from "../repositories/ExpenseRepository.js";

const expenseRouter = express.Router();

expenseRouter.get("/", async (req, res) => {
  const expenses = await expenseRepository.getExpenses();
  res.json(expenses);
});

expenseRouter.get("/:id", async (req, res) => {
  const {id} = req.params;
  const expense = await expenseRepository.getExpenseById(id);
  if (!expense) {
    res.status(404).send("Expense not found");
  }
  res.json(expense);
});

expenseRouter.get("/:idUser", async (req, res) => {
  const {idUser} = req.params;
  const {sortBy, orderBy} = req.query;
  const expenses = await expenseRepository.getExpensesByUser(idUser,sortBy,orderBy);
  if (!expenses) {
    res.status(404).send("Expenses not found");
  }
  res.json(expenses);
});

expenseRouter.get("/:idGroup", async (req, res) => {
  const {idGroup} = req.params;
  const expenses = await expenseRepository.getExpensesByGroup(idGroup);
  if (!expenses) {
    res.status(404).send("Expenses not found");
  }
  res.json(expenses);
});

expenseRouter.get("/:category", async (req, res) => {
  const {category} = req.params;
  const expenses = await expenseRepository.getExpensesByCategory(category);
  if (!expenses) {
    res.status(404).send("Expenses not found");
  }
  res.json(expenses);
});

expenseRouter.post("/", async (req, res) => {
  const expense = await expenseRepository.createExpense(req.body);
  res.status(201).json(expense);
});

expenseRouter.put("/:id", async (req, res) => {
  const {id} = req.params;
  const expenseToUpdate = await expenseRepository.getExpenseById(id);
  if (!expenseToUpdate) {
    res.status(404).send("Expense not found");
  }
  await expenseRepository.updateExpense(id, req.body);
  res.status(200).send("Expense updated");
});

expenseRouter.delete("/:id", async (req, res) => {
  const {id} = req.params;
  await expenseRepository.deleteExpense(id);
  res.status(204).send("Expense deleted");
});

export default expenseRouter;

