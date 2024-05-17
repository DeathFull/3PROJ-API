import express from "express";
import balanceRepository from "../repositories/BalanceRepository.js";
import {loginMiddleware} from "../middlewares/loginMiddleware.js";
import groupRepository from "../repositories/GroupRepository.js";
import {z} from "zod";

const balanceRouter = express.Router();

const BalanceSchema = z.object({
  idGroup: z.string(),
  balance: z.number(),
})

balanceRouter.get("/", loginMiddleware, async (req, res) => {
  const balances = await balanceRepository.getBalances();
  return res.status(200).json(balances);
})

balanceRouter.get("/:id", loginMiddleware, async (req, res) => {
  const {id} = req.params;
  const balance = await balanceRepository.getBalanceById(id)
  if (!balance) {
    return res.status(404).send("Balance not found");
  }
  if (balance.idUser !== req.user) {
    return res.status(403).send("You are not allowed to see this balance");
  }
  return res.status(200).json(balance);
})


balanceRouter.get("/user", loginMiddleware, async (req, res) => {
  const balances = await balanceRepository.getBalancesByUser(req.user);
  if (!balances) {
    return res.status(404).send("Balances not found");
  }
  return res.status(200).json(balances);
})

balanceRouter.get("/group/:idGroup", loginMiddleware, async (req, res) => {
  const {idGroup} = req.params;
  if ((await groupRepository.getGroupById(idGroup)).members.includes(req.user) === false){
    return res.status(403).send("You are not allowed to see this balance");
  }
  const balances = await balanceRepository.getBalancesByGroup(idGroup);
  if (!balances) {
    return res.status(404).send("Balances not found");
  }
  return res.status(200).json(balances);
})

balanceRouter.post("/", loginMiddleware, async (req, res) => {
  try {
    if (req.body.idUser !== req.user) {
      return res.status(403).send("You are not allowed to create a balance for another user");
    }
    const balanceData = {idUser: req.user, ...BalanceSchema.parse(req.body)}
    const balance = await balanceRepository.createBalance(balanceData);
    return res.status(201).json(balance);
  } catch (e) {
    return res.status(400).send(e);
  }
})

balanceRouter.put("/:id", loginMiddleware, async (req, res) => {
  try {
    const {id} = req.params;
    const balanceToUpdate = await balanceRepository.getBalanceById(id);
    if (!balanceToUpdate) {
      return res.status(404).send("Balance not found");
    }
    const balanceData = {idUser: req.user, ...BalanceSchema.parse(req.body)}
    await balanceRepository.updateBalance(id, balanceData)
    return res.status(200).send("Balance updated")
  } catch (e) {
    return res.status(400).send(e);
  }
})

balanceRouter.delete("/:idGroup", loginMiddleware, async (req, res) => {
  const {idGroup} = req.params;
  await balanceRepository.deleteBalance(idGroup, req.user);
  return res.status(200).send("Balance deleted")
})

export default balanceRouter;