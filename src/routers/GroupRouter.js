import express from "express";
import groupRepository from "../repositories/GroupRepository.js";
import userRepository from "../repositories/UserRepository.js";
import {loginMiddleware} from "../middlewares/loginMiddleware.js";
import {ExpenseModel} from "../models/ExpenseModel.js";
import PDFDocument from "pdfkit";
import {RefundModel} from "../models/RefundModel.js";
import {Parser} from "json2csv";
import debtRepository from "../repositories/DebtRepository.js";

const groupRouter = express.Router();

groupRouter.get("/", loginMiddleware, async (req, res) => {
  const groups = await groupRepository.getGroups();
  return res.status(200).json(groups);
});

groupRouter.get("/:id", loginMiddleware, async (req, res) => {
  const {id} = req.params;
  const group = await groupRepository.getGroupById(id);
  if (!group) {
    return res.status(404).send("Group not found");
  }
  return res.status(200).json(group);
});

groupRouter.get("/:id/users", loginMiddleware, async (req, res) => {
  const {id} = req.params;
  const group = await groupRepository.getGroupById(id);
  if (group.includes(req.user) === true) {
    const users = await userRepository.getUsersByGroup(id, group);
    return res.status(200).json(users);
  } else {
    return res
      .status(403)
      .send("You are not allowed to see this group's users");
  }
});

groupRouter.post("/", loginMiddleware, async (req, res) => {
  try {
    if (req.body.members.includes(req.user) === false) {
      return res
        .status(403)
        .send("You are not allowed to create a group without yourself");
    }
    const group = await groupRepository.createGroup(req.body);
    for (const member of req.body.members) {
      for (const member2 of req.body.members) {
        if (member !== member2) {
          await debtRepository.updateDebt(group._id, member, member2, {amount: 0})
        }
      }
    }
    return res.status(201).json(group);
  } catch (e) {
    return res.status(400).send(e);
  }
});

groupRouter.put("/:id", loginMiddleware, async (req, res) => {
  try {
    const {id} = req.params;
    const groupToUpdate = await groupRepository.getGroupByIdWithoutPopulate(id);
    if (groupToUpdate.members.includes(req.user) === false) {
      return res.status(403).send("You are not allowed to update this group");
    }
    if (!groupToUpdate) {
      return res.status(404).send("Group not found");
    }
    await groupRepository.updateGroup(id, req.body);
    return res.status(200).send("Group updated");
  } catch (e) {
    return res.status(400).send(e);
  }
});

groupRouter.put("/:id/addUser", loginMiddleware, async (req, res) => {
  try {
    const {id} = req.params;
    const {idUser} = req.body;
    const groupToUpdate = await groupRepository.getGroupByIdWithoutPopulate(id);
    if (groupToUpdate.members.includes(req.user) === false) {
      return res
        .status(403)
        .send("You are not allowed to add a user to this group");
    }
    if (!groupToUpdate) {
      return res.status(404).send("Group not found");
    }
    if (groupToUpdate.members.includes(idUser) === true) {
      return res.status(400).send("User is already in the group");
    }
    await groupRepository.addUserToGroup(id, idUser);
    for (const member of groupToUpdate.members) {
      if (member !== idUser) {
        await debtRepository.updateDebt(groupToUpdate._id, member, idUser, {amount: 0})
        await debtRepository.updateDebt(groupToUpdate._id, idUser, member, {amount: 0})
      }
    }
    return res.status(200).send("User added to group");
  } catch (e) {
    return res.status(400).send(e);
  }
});

groupRouter.put("/:id/removeUser", loginMiddleware, async (req, res) => {
  try {
    const {id} = req.params;
    const groupToUpdate = await groupRepository.getGroupById(id);
    if (!groupToUpdate) {
      return res.status(404).send("Group not found");
    }
    await groupRepository.removeUserFromGroup(id, req.user);
    return res.status(200).send("User removed from group");
  } catch (e) {
    return res.status(400).send(e);
  }
});

groupRouter.get("/export/:groupId", async (req, res) => {
  const {groupId} = req.params;
  const {format} = req.query; // format can be 'pdf' or 'csv'

  try {
    const expenses = await ExpenseModel.find({idGroup: groupId})
      .populate("idUser")
      .exec();

    const refunds = await RefundModel.find({idGroup: groupId})
      .populate("refunderId")
      .populate("payerId")
      .exec();

    if (format === "pdf") {
      const doc = new PDFDocument();
      let buffers = [];
      doc.on("data", buffers.push.bind(buffers));
      doc.on("end", () => {
        let pdfData = Buffer.concat(buffers);
        res.contentType("application/pdf");
        res.send(pdfData);
      });

      doc.fontSize(25).text("Récapitulatif des dépenses et remboursements", {
        align: "center",
      });

      doc.fontSize(20).text("Dépenses :");
      for (let expense of expenses) {
        if (expense.idUser) {
          doc
            .fontSize(12)
            .text(
              `${expense.name} - ${expense.amount}€ par ${expense.idUser.firstname} ${expense.idUser.lastname}`,
            );
        } else {
          doc
            .fontSize(12)
            .text(
              `${expense.name} - ${expense.amount}€ par Utilisateur inconnu`,
            );
        }
      }

      doc.addPage().fontSize(20).text("Remboursements :");
      for (let refund of refunds) {
        if (refund.refunderId) {
          doc
            .fontSize(12)
            .text(
              `${refund.refunderId.firstname} ${refund.refunderId.lastname} a remboursé ${refund.amount}€ à ${refund.payerId.firstname} ${refund.payerId.lastname}`,
            );
        } else {
          doc.fontSize(12).text(`Remboursement par Utilisateur inconnu`);
        }
      }

      doc.end();
    }

    if (format === "csv") {
      const expensesData = expenses.map((expense) => ({
        name: expense.name,
        amount: expense.amount,
        user: expense.idUser
          ? `${expense.idUser.firstname} ${expense.idUser.lastname}`
          : "Utilisateur inconnu",
      }));

      const refundsData = refunds.map((refund) => ({
        receiver: refund.payerId,
        refunder: refund.refunderId
          ? `${refund.refunderId.firstname} ${refund.refunderId.lastname}`
          : "Utilisateur inconnu",
        amount: refund.amount,
      }));

      const parser = new Parser();
      const csvExpenses =
        expensesData.length > 0 ? parser.parse(expensesData) : "";
      const csvRefunds =
        refundsData.length > 0 ? parser.parse(refundsData) : "";

      res.header("Content-Type", "text/csv");
      res.attachment("recapitulatif.csv");
      res.send(csvExpenses + "\n\n" + csvRefunds);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Erreur lors de la génération du récapitulatif");
  }
});

export default groupRouter;
