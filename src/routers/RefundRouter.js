import express from "express";
import refundRepository from "../repositories/RefundRepository.js";

const refundRouter = express.Router();

refundRouter.get("/", async (req, res) => {
  const refunds = await refundRepository.getRefunds();
  res.json(refunds);
});

refundRouter.get("/:id", async (req, res) => {
  const {id} = req.params;
  const refund = await refundRepository.getRefundById(id);
  if (!refund) {
    res.status(404).send("Refund not found");
  }
  res.json(refund);
});

refundRouter.get("/:idUser", async (req, res) => {
  const {idUser} = req.params;
  const refunds = await refundRepository.getRefundsByUser(idUser);
  if (!refunds) {
    res.status(404).send("Refunds not found");
  }
  res.json(refunds);
});

refundRouter.post("/", async (req, res) => {
  try {
    const refund = await refundRepository.createRefund(req.body);
    res.status(201).json(refund);
  } catch (e) {
    return res.status(400).send(e);
  }
});

refundRouter.put("/:id", async (req, res) => {
  try {
    const {id} = req.params;
    const refundToUpdate = await refundRepository.getRefundById(id);
    if (!refundToUpdate) {
      res.status(404).send("Refund not found");
    }
    await refundRepository.updateRefund(id, req.body);
    res.status(200).send("Refund updated");
  } catch (e) {
    return res.status(400).send(e);
  }
});

refundRouter.delete("/:id", async (req, res) => {
  const {id} = req.params;
  await refundRepository.deleteRefund(id);
  res.status(204).send("Refund deleted");
});

export default refundRouter;