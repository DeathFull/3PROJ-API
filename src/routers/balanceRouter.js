import express from "express";
import balanceRepository from "../repositories/balanceRepository.js";

const balanceRouter = express.Router();

balanceRouter.get("/", async (req, res) => {
  const balances = await balanceRepository.getBalances();
  res.json(balances);
})

balanceRouter.get("/:id", async (req, res) => {
  const {id} = req.params;
  const balance = await balanceRepository.getBalanceById(id)
  if (!balance) {
    res.status(404).send("Balance not found");
  }
  res.json(balance);
})

balanceRouter.post("/", async (req, res) => {
  const balance = await balanceRepository.createBalance(req.body);
  res.status(201).json(balance);
})

balanceRouter.put("/:id", async (req, res) => {
  const {id, payload} = req.params;
  const balanceToUpdate = await balanceRepository.getBalanceById(id);
  if (!balanceToUpdate) {
    return res.status(404).send("Balance not found");
  }
  await balanceRepository.updateBalance(id, req.body)
  res.status(200).send("Balance updated")
})

balanceRouter.delete("/:id", async (req, res) => {
  const {id} = req.params;
  await balanceRepository.deleteBalance(id);
  res.status(204).send("Balance deleted")
})

export default balanceRouter;