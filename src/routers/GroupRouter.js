import express from "express";
import groupRepository from "../repositories/GroupRepository.js";

const groupRouter = express.Router();

groupRouter.get("/", async (req, res) => {
  const groups = await groupRepository.getGroups();
  res.json(groups);
});

groupRouter.get("/:id", async (req, res) => {
  const {id} = req.params;
  const group = await groupRepository.getGroupById(id);
  if (!group) {
    return res.status(404).send("Group not found");
  }
  res.json(group);
});

groupRouter.get("/:idUser", async (req, res) => {
  const {idUser} = req.params;
  const groups = await groupRepository.getGroupsByUser(idUser);
  if (!groups) {
    return res.status(404).send("Groups not found");
  }
  res.json(groups);
});

groupRouter.post("/", async (req, res) => {
  const group = await groupRepository.createGroup(req.body);
  res.status(201).json(group);
});

groupRouter.put("/:id", async (req, res) => {
  const {id} = req.params;
  const groupToUpdate = await groupRepository.getGroupById(id);
  if (!groupToUpdate) {
    return res.status(404).send("Group not found");
  }
  await groupRepository.updateGroup(id, req.body);
  res.status(200).send("Group updated");
});

groupRouter.put("/:id/addUser", async (req, res) => {
  const {id} = req.params;
  const {idUser} = req.body;
  const groupToUpdate = await groupRepository.getGroupById(id);
  if (!groupToUpdate) {
    return res.status(404).send("Group not found");
  }
  await groupRepository.addUserToGroup(id, idUser);
  res.status(200).send("User added to group");
});

groupRouter.put("/:id/removeUser", async (req, res) => {
  const {id} = req.params;
  const {idUser} = req.body;
  const groupToUpdate = await groupRepository.getGroupById(id);
  if (!groupToUpdate) {
    return res.status(404).send("Group not found");
  }
  await groupRepository.removeUserFromGroup(id, idUser);
  res.status(200).send("User removed from group");
});


groupRouter.delete("/:id", async (req, res) => {
  const {id} = req.params;
  await groupRepository.deleteGroup(id);
  res.status(204).send("Group deleted");
});

export default groupRouter;
