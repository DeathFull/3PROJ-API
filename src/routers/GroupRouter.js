import express from "express";
import groupRepository from "../repositories/GroupRepository.js";
import userRepository from "../repositories/UserRepository.js";
import {loginMiddleware} from "../middlewares/loginMiddleware.js";

const groupRouter = express.Router();

groupRouter.get("/", async (req, res) => {
  const groups = await groupRepository.getGroups();
  res.json(groups);
});

groupRouter.get("/:id", async (req, res) => {
  const { id } = req.params;
  const group = await groupRepository.getGroupById(id);
  if (!group) {
    return res.status(404).send("Group not found");
  }
  res.json(group);
});

groupRouter.get("/:id/users", async (req, res) => {
  const { id } = req.params;
  const users = await userRepository.getUsersByGroup(id);
  res.json(users);
});

groupRouter.post("/", async (req, res) => {
  try {
    const group = await groupRepository.createGroup(req.body);
    res.status(201).json(group);
  } catch (e) {
    return res.status(400).send(e);
  }
});

groupRouter.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const groupToUpdate = await groupRepository.getGroupById(id);
    if (!groupToUpdate) {
      return res.status(404).send("Group not found");
    }
    await groupRepository.updateGroup(id, req.body);
    res.status(200).send("Group updated");
  } catch (e) {
    return res.status(400).send(e);
  }
});

groupRouter.put("/:id/addUser", async (req, res) => {
  try {
    const { id } = req.params;
    const { idUser } = req.body;
    const groupToUpdate = await groupRepository.getGroupById(id);
    if (!groupToUpdate) {
      return res.status(404).send("Group not found");
    }
    await groupRepository.addUserToGroup(id, idUser);
    res.status(200).send("User added to group");
  } catch (e) {
    return res.status(400).send(e);
  }
});

groupRouter.put("/:id/removeUser", loginMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const groupToUpdate = await groupRepository.getGroupById(id);
    if (!groupToUpdate) {
      return res.status(404).send("Group not found");
    }
    await groupRepository.removeUserFromGroup(id, req.user);
    res.status(200).send("User removed from group");
  } catch (e) {
    return res.status(400).send(e);
  }
});

export default groupRouter;
