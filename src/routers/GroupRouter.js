import express from "express";
import groupRepository from "../repositories/GroupRepository.js";
import userRepository from "../repositories/UserRepository.js";
import {loginMiddleware} from "../middlewares/loginMiddleware.js";

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
    return res.status(403).send("You are not allowed to see this group's users");
  }
});

groupRouter.post("/", loginMiddleware, async (req, res) => {
  try {
    if (req.body.members.includes(req.user) === false) {
      return res.status(403).send("You are not allowed to create a group without yourself");
    }
    const group = await groupRepository.createGroup(req.body);
    return res.status(201).json(group);
  } catch (e) {
    return res.status(400).send(e);
  }
});

groupRouter.put("/:id", loginMiddleware, async (req, res) => {
  try {
    const {id} = req.params;
    const groupToUpdate = await groupRepository.getGroupById(id);
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
    const groupToUpdate = await groupRepository.getGroupById(id);
    if (groupToUpdate.members.includes(req.user) === false) {
      return res.status(403).send("You are not allowed to add a user to this group");
    }
    if (!groupToUpdate) {
      return res.status(404).send("Group not found");
    }
    if (groupToUpdate.members.includes(idUser) === true) {
      return res.status(400).send("User is already in the group");
    }
    await groupRepository.addUserToGroup(id, idUser);
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

export default groupRouter;
