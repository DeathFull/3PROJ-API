import express from "express";
import expenseRepository from "../repositories/ExpenseRepository.js";
import balanceRepository from "../repositories/BalanceRepository.js";
import {loginMiddleware} from "../middlewares/loginMiddleware.js";
import groupRepository from "../repositories/GroupRepository.js";
import {z} from "zod";
import debtRepository from "../repositories/DebtRepository.js";

const expenseRouter = express.Router();

const ExpenseSchema = z.object({
  idGroup: z.string(),
  name: z.string(),
  description: z.string(),
  amount: z.number(),
  date: z.string(),
  justification: z.string(),
  category: z.string(),
});

expenseRouter.get("/", loginMiddleware, async (req, res) => {
  const expenses = await expenseRepository.getExpenses();
  return res.status(200).json(expenses);
});

expenseRouter.get("/user", loginMiddleware, async (req, res) => {
  const {sortBy, orderBy} = req.query;
  const expenses = await expenseRepository.getExpensesByUser(req.user, sortBy, orderBy);
  if (!expenses) {
    return res.status(404).send("Expenses not found");
  }
  return res.status(200).json(expenses);
});

expenseRouter.get("/:id", loginMiddleware, async (req, res) => {
  const {id} = req.params;

  const expense = await expenseRepository.getExpenseById(id);
  if (!expense) {
    return res.status(404).send("Expense not found");
  }
  return res.status(200).json(expense);
});

expenseRouter.get("/group/:idGroup", loginMiddleware, async (req, res) => {
  const {idGroup} = req.params;
  if (!(await groupRepository.getGroupById(idGroup)).members.some(member => member._id.toString() === req.user)){
    return res.status(403).send("You are not allowed to see this balance");
  }
  const expenses = await expenseRepository.getExpensesByGroup(idGroup);
  if (!expenses) {
    return res.status(404).send("Expenses not found");
  }
  return res.status(200).json(expenses);
});

expenseRouter.get("/category/:category", loginMiddleware, async (req, res) => {
  const {category} = req.params;
  const expenses = await expenseRepository.getExpensesByCategory(category);
  if (!expenses) {
    return res.status(404).send("Expenses not found");
  }
  return res.status(200).json(expenses);
});

expenseRouter.post("/", loginMiddleware, async (req, res) => {
  try {
    const expenseData = {idUser: req.user, ...ExpenseSchema.parse(req.body)}
    const expense = await expenseRepository.createExpense(expenseData);
    if (expense) {
      await balanceRepository.updateBalanceByUserAndGroup(expense.idUser, expense.idGroup, expense.amount);
    }
    await debtRepository.debtBalancing2(expense.idGroup);
    return res.status(201).json(expense);
  } catch (e) {
    return res.status(400).send(e);
  }
});

expenseRouter.put("/:id", loginMiddleware, async (req, res) => {
  try {
    const {id} = req.params;
    const expenseToUpdate = await expenseRepository.getExpenseById(id);
    if (!expenseToUpdate) {
      return res.status(404).send("Expense not found");
    }
    const expenseData = {idUser: req.user, ...ExpenseSchema.parse(req.body)}
    await expenseRepository.updateExpense(id, expenseData);
    return res.status(200).send("Expense updated");
  } catch (e) {
    return res.status(400).send(e);
  }
});

expenseRouter.delete("/:idGroup", loginMiddleware, async (req, res) => {
  const {idGroup} = req.params;
  const expense = await expenseRepository.deleteExpense(idGroup, req.user);
  if (expense) {
    await balanceRepository.updateBalanceByUserAndGroup(expense.idUser, expense.idGroup, -expense.amount);
  }
  return res.status(200).send("Expense deleted");
});

export default expenseRouter;

