import express from "express";
import balanceRepository from "../repositories/BalanceRepository.js";

const balanceRouter = express.Router();

balanceRouter.get("/", async (req, res) => {
  const balances = await balanceRepository.getBalances();
  return res.status(200).json(balances);
})

balanceRouter.get("/:id", async (req, res) => {
  const {id} = req.params;
  const balance = await balanceRepository.getBalanceById(id)
  if (!balance) {
    return res.status(404).send("Balance not found");
  }
  return res.status(200).json(balance);
})


balanceRouter.get("/:idUser", async (req, res) => {
  const {idUser} = req.params;
  const balances = await balanceRepository.getBalancesByUser(idUser);
  if (!balances) {
    return res.status(404).send("Balances not found");
  }
  return res.status(200).json(balances);
})

balanceRouter.post("/", async (req, res) => {
  try {
    const balance = await balanceRepository.createBalance(req.body);
    return res.status(201).json(balance);
  } catch (e) {
    return res.status(400).send(e);
  }
})

balanceRouter.put("/:id", async (req, res) => {
  try {
    const {id} = req.params;
    const balanceToUpdate = await balanceRepository.getBalanceById(id);
    if (!balanceToUpdate) {
      return res.status(404).send("Balance not found");
    }
    await balanceRepository.updateBalance(id, req.body)
    return res.status(200).send("Balance updated")
  } catch (e) {
    return res.status(400).send(e);
  }
})

balanceRouter.delete("/:id", async (req, res) => {
  const {id} = req.params;
  await balanceRepository.deleteBalance(id);
  return res.status(204).send("Balance deleted")
})

export default balanceRouter;