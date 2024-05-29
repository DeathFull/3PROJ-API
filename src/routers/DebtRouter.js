import express from "express";
import debtRepository from "../repositories/DebtRepository.js";
import {loginMiddleware} from "../middlewares/loginMiddleware.js";


const debtRouter = express.Router();


debtRouter.get("/", loginMiddleware, async (req, res) => {
  const debts = await debtRepository.getDebts();
  return res.status(200).json(debts);
});

debtRouter.get("/:idGroup", loginMiddleware, async (req, res) => {
  const {idGroup} = req.params;
  const debts = await debtRepository.getDebtsByGroup(idGroup);
  if (!debts) {
    return res.status(404).send("Refunds not found");
  }
  return res.status(200).json(debts);
});

debtRouter.post("/", async (req, res) => {
  try {
    const debt = await debtRepository.createDebt(req.body);
    return res.status(201).json(debt);
  } catch (e) {
    return res.status(400).send(e);
  }
});

debtRouter.put("/:idGroup", loginMiddleware, async (req, res) => {
  const {idGroup} = req.params;
  const receiverId = req.user;
  const {refunderId} = req.body;
  const debts = await debtRepository.updateDebt(idGroup, refunderId, receiverId, req.body);
  if (!debts) {
    return res.status(404).send("Debts not found");
  }
  // await debtRepository.debtBalancing(idGroup);
  return res.status(200).json(debts);
});

debtRouter.put("/balance/:idGroup", loginMiddleware, async (req, res) => {
  const {idGroup} = req.params;
  await debtRepository.debtBalancing(idGroup);
  return res.status(200).send("Balancing done");
});

export default debtRouter;