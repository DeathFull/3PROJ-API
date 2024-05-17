import express from "express";
import refundRepository from "../repositories/RefundRepository.js";

const refundRouter = express.Router();

refundRouter.get("/", async (req, res) => {
  const refunds = await refundRepository.getRefunds();
  return res.satus(200).json(refunds);
});

refundRouter.get("/:id", async (req, res) => {
  const { id } = req.params;
  const refund = await refundRepository.getRefundById(id);
  if (!refund) {
    return res.status(404).send("Refund not found");
  }
  return res.status(200).json(refund);
});

refundRouter.get("/:idUser", async (req, res) => {
  const { idUser } = req.params;
  const refunds = await refundRepository.getRefundsByUser(idUser);
  if (!refunds) {
    return res.status(404).send("Refunds not found");
  }
  return res.satus(200).json(refunds);
});

refundRouter.post("/", async (req, res) => {
  try {
    const refund = await refundRepository.createRefund(req.body);
    return res.status(201).json(refund);
  } catch (e) {
    return res.status(400).send(e);
  }
});

refundRouter.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const refundToUpdate = await refundRepository.getRefundById(id);
    if (!refundToUpdate) {
      return res.status(404).send("Refund not found");
    }
    await refundRepository.updateRefund(id, req.body);
    return res.status(200).send("Refund updated");
  } catch (e) {
    return res.status(400).send(e);
  }
});

refundRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;
  await refundRepository.deleteRefund(id);
  return res.status(204).send("Refund deleted");
});

export default refundRouter;
