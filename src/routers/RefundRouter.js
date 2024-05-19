import express from "express";
import refundRepository from "../repositories/RefundRepository.js";
import { loginMiddleware } from "../middlewares/loginMiddleware.js";

const refundRouter = express.Router();

refundRouter.get("/", loginMiddleware, async (req, res) => {
  const refunds = await refundRepository.getRefunds();
  return res.status(200).json(refunds);
});

refundRouter.get("/:id", loginMiddleware, async (req, res) => {
  const { id } = req.params;
  const refund = await refundRepository.getRefundById(id);
  if (!refund) {
    return res.status(404).send("Refund not found");
  }
  if (refund.refunderId !== req.user) {
    return res.status(403).send("You are not allowed to see this refund");
  }
  return res.status(200).json(refund);
});

refundRouter.get("/refunder/:idUser", loginMiddleware, async (req, res) => {
  const refunds = await refundRepository.getRefundsByRefunder(req.user);
  if (!refunds) {
    return res.status(404).send("Refunds not found");
  }
  return res.satus(200).json(refunds);
});

refundRouter.get("/payer/:idUser", loginMiddleware, async (req, res) => {
  const refunds = await refundRepository.getRefundsByPayer(req.user);
  if (!refunds) {
    return res.status(404).send("Refunds not found");
  }
  return res.status(200).json(refunds);
});

refundRouter.get("/group/:idGroup", loginMiddleware, async (req, res) => {
  const { idGroup } = req.params;
  const refunds = await refundRepository.getRefundsByGroup(idGroup);
  if (!refunds) {
    return res.status(404).send("Refunds not found");
  }
  return res.status(200).json(refunds);
});

refundRouter.post("/", loginMiddleware, async (req, res) => {
  try {
    const refund = await refundRepository.createRefund(req.body);
    return res.status(201).json(refund);
  } catch (e) {
    return res.status(400).send(e);
  }
});

refundRouter.delete("/:id", loginMiddleware, async (req, res) => {
  const { id } = req.params;
  if ((await refundRepository.getRefundById(id)).refunderId !== req.user) {
    return res.status(403).send("You are not allowed to delete this refund");
  }
  await refundRepository.deleteRefund(id);
  return res.status(204).send("Refund deleted");
});

export default refundRouter;
